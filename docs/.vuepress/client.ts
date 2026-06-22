import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app }) {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = `
        .banner-brand__wrapper {
          height: auto !important;
          min-height: auto !important;
          padding: 150px 24px 0 !important;
          display: block !important;
          text-align: left !important;
          position: relative !important;
          overflow: hidden !important;
        }
        .banner-brand__content {
          position: relative !important;
          z-index: 2 !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding: 0 20px 40px !important;
        }
        .banner-brand__content .title {
          font-size: 2.5rem !important;
          margin-bottom: 10px !important;
          margin-top: 0 !important;
        }
        .banner-brand__content .description {
          font-size: 1.1rem !important;
          margin-bottom: 4px !important;
        }
        .banner-brand__content .tagline {
          font-size: 0.95rem !important;
          margin-bottom: 12px !important;
        }
        .banner-brand__content .btn-group {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
          justify-content: flex-start !important;
        }
        .features__container {
          max-width: 1200px !important;
          margin: 0 auto !important;
          padding: 0 20px 16px !important;
          gap: 16px !important;
        }
        .features__item {
          padding: 20px 18px !important;
        }
        .features__item h4 {
          font-size: 1rem !important;
          margin-bottom: 6px !important;
        }
        .features__item p {
          font-size: 0.85rem !important;
          line-height: 1.5 !important;
        }
        .footer-wrapper {
          padding: 24px 20px !important;
          font-size: 0.85rem !important;
        }
        .bg-paths-canvas {
          position: absolute !important;
          top: 0; left: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 1 !important;
          pointer-events: none !important;
        }
      `
      document.head.appendChild(style)

      const initBgPaths = () => {
        const wrapper = document.querySelector('.banner-brand__wrapper')
        if (!wrapper) return setTimeout(initBgPaths, 100)

        if (wrapper.querySelector('.bg-paths-canvas')) return

        const canvas = document.createElement('canvas')
        canvas.className = 'bg-paths-canvas'
        wrapper.insertBefore(canvas, wrapper.firstChild)

        const ctx = canvas.getContext('2d')!
        let w = 0, h = 0

        const resize = () => {
          w = canvas.width = wrapper.clientWidth
          h = canvas.height = wrapper.clientHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const numPaths = 6
        const colors = [
          'rgba(59, 130, 246, 0.35)',
          'rgba(16, 185, 129, 0.30)',
          'rgba(99, 102, 241, 0.33)',
          'rgba(6, 182, 212, 0.28)',
          'rgba(139, 92, 246, 0.26)',
          'rgba(34, 197, 94, 0.24)',
        ]

        const paths: Array<{
          points: { x: number; y: number }[]
          progress: number
          speed: number
          color: string
          width: number
          amplitude: number
          offset: number
        }> = []

        for (let i = 0; i < numPaths; i++) {
          const numPoints = 5 + Math.floor(Math.random() * 6)
          const points: { x: number; y: number }[] = []
          for (let j = 0; j < numPoints; j++) {
            points.push({
              x: (j / (numPoints - 1)) * (w + 200) - 100,
              y: h * (0.2 + Math.random() * 0.6),
            })
          }
          paths.push({
            points,
            progress: Math.random(),
            speed: 0.0003 + Math.random() * 0.0008,
            color: colors[i % colors.length],
            width: 1.5 + Math.random() * 2,
            amplitude: 30 + Math.random() * 60,
            offset: i * 0.15,
          })
        }

        let animId: number
        const animate = () => {
          ctx.clearRect(0, 0, w, h)

          paths.forEach((p) => {
            p.progress += p.speed
            if (p.progress > 2) p.progress -= 1

            ctx.beginPath()
            ctx.strokeStyle = p.color
            ctx.lineWidth = p.width
            ctx.lineCap = 'round'

            const pts = p.points.map((pt, i) => ({
              x: pt.x + Math.sin(p.progress * Math.PI * 2 + i * 1.5 + p.offset * 10) * p.amplitude * 0.5,
              y: pt.y + Math.cos(p.progress * Math.PI * 2 + i * 1.2 + p.offset * 10) * p.amplitude,
            }))

            ctx.moveTo(pts[0].x, pts[0].y)
            for (let i = 0; i < pts.length - 1; i++) {
              const cpX = (pts[i].x + pts[i + 1].x) / 2
              ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpX, (pts[i].y + pts[i + 1].y) / 2)
            }
            ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y)
            ctx.stroke()
          })

          animId = requestAnimationFrame(animate)
        }
        animate()

        const observer = new ResizeObserver(() => {
          resize()
        })
        observer.observe(wrapper)
      }

      initBgPaths()
    }
  }
})
