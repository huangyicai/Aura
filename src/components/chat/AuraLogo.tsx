import { cn } from '@/lib/utils';

interface AuraLogoProps {
  className?: string;
}

export function AuraLogo({ className }: AuraLogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        {/* 主渐变：从深紫到明亮的青色 */}
        <radialGradient id="auraGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: '#E0E7FF', stopOpacity: 1 }} />
          <stop offset="30%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4C1D95', stopOpacity: 1 }} />
        </radialGradient>

        {/* 外发光渐变 */}
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: '#C4B5FD', stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: '#7C3AED', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#4C1D95', stopOpacity: 0 }} />
        </radialGradient>

        {/* 波动效果渐变 */}
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F472B6', stopOpacity: 0.6 }} />
          <stop offset="50%" style={{ stopColor: '#A78BFA', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#60A5FA', stopOpacity: 0.2 }} />
        </linearGradient>
      </defs>

      {/* 背景圆形 */}
      <rect width="512" height="512" fill="#0F0A1E" rx="64" ry="64" className="dark:fill-[#0F0A1E] fill-[#F5F5F5]" />

      {/* 外发光层 */}
      <circle cx="256" cy="256" r="180" fill="url(#glowGradient)" opacity="0.5" />

      {/* 波动环 1 (最外层) */}
      <circle cx="256" cy="256" r="160" fill="none" stroke="url(#waveGradient)" strokeWidth="2" opacity="0.4" />

      {/* 波动环 2 */}
      <circle cx="256" cy="256" r="140" fill="none" stroke="url(#waveGradient)" strokeWidth="3" opacity="0.5" />

      {/* 波动环 3 */}
      <circle cx="256" cy="256" r="120" fill="none" stroke="#A78BFA" strokeWidth="2" opacity="0.6" />

      {/* 中心光环主体 */}
      <circle cx="256" cy="256" r="100" fill="url(#auraGradient)" />

      {/* 内部高光 */}
      <ellipse cx="240" cy="230" rx="40" ry="30" fill="#FFFFFF" opacity="0.3" />

      {/* 中心能量点 */}
      <circle cx="256" cy="256" r="30" fill="#FFFFFF" opacity="0.8" />

      {/* 装饰性光点 */}
      <circle cx="256" cy="160" r="4" fill="#E0E7FF" opacity="0.8" />
      <circle cx="330" cy="200" r="3" fill="#C4B5FD" opacity="0.7" />
      <circle cx="330" cy="312" r="3" fill="#A78BFA" opacity="0.6" />
      <circle cx="256" cy="352" r="4" fill="#8B5CF6" opacity="0.7" />
      <circle cx="182" cy="312" r="3" fill="#7C3AED" opacity="0.6" />
      <circle cx="182" cy="200" r="3" fill="#6D28D9" opacity="0.7" />
    </svg>
  );
}
