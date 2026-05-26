export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-pattern pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg viewBox="0 0 1200 600" className="h-full w-full" preserveAspectRatio="none">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ellipse
              key={i}
              cx="600"
              cy="300"
              rx={100 + i * 80}
              ry={60 + i * 50}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-brand-400"
            />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-track-gold/30 bg-track-gold/10 px-4 py-1.5 text-sm text-track-gold">
            <span className="h-2 w-2 rounded-full bg-track-gold animate-pulse" />
            Diamond League Athlete Archive
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            钻石联赛运动员
            <span className="block gradient-text mt-2">科普图鉴</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto">
            世界田联钻石联赛是田径运动最高水平的年度系列赛。
            本站为中文读者提供运动员科普、项目介绍、数据对比和新手指南，
            帮助你更好地了解和欣赏田径运动。
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { label: '速度', color: 'text-track-sprint border-track-sprint/30 bg-track-sprint/10' },
              { label: '力量', color: 'text-track-throw border-track-throw/30 bg-track-throw/10' },
              { label: '耐力', color: 'text-track-distance border-track-distance/30 bg-track-distance/10' },
              { label: '技术', color: 'text-track-jump border-track-jump/30 bg-track-jump/10' },
            ].map((item) => (
              <span
                key={item.label}
                className={`rounded-full border px-5 py-2 text-sm font-semibold ${item.color}`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
