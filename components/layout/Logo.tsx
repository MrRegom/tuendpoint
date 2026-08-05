interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  withMark?: boolean;
}

export function Logo({ className, variant = 'dark', withMark = true }: LogoProps) {
  const textColor = variant === 'dark' ? '#0A2540' : '#FFFFFF';
  const subTextColor = variant === 'dark' ? '#4B5563' : '#E5E7EB';
  const markColor = variant === 'dark' ? '#0A2540' : '#FFFFFF';
  const dotColor = '#0EA5E9'; // A nice light blue for the dot

  return (
    <span className={`inline-flex items-center gap-2 ${className || ''}`}>
      {withMark && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 12l4 4 10-10"
            stroke={markColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="6" r="2.5" fill={dotColor} />
        </svg>
      )}
      <span className="flex flex-col justify-center">
        <span
          className="text-lg font-bold tracking-tight leading-none"
          style={{ color: textColor }}
        >
          tuEndpoint<span className="text-[#0EA5E9] font-black">.</span>
        </span>
        <span
          className="text-[0.45rem] font-bold tracking-widest leading-none mt-0.5"
          style={{ color: subTextColor }}
        >
          TECHNOLOGY CONSULTING
        </span>
      </span>
    </span>
  );
}
