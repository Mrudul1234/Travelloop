export function JaliDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ height: 10 }}>
      <svg
        width="100%"
        height="10"
        viewBox="0 0 800 10"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="jali" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            {/* Diamond lattice */}
            <path d="M 10 0 L 20 5 L 10 10 L 0 5 Z" fill="none" stroke="#724E43" strokeWidth="0.6" strokeOpacity="0.3" />
            <circle cx="10" cy="5" r="1.2" fill="#724E43" fillOpacity="0.25" />
            <circle cx="0" cy="5" r="1" fill="#724E43" fillOpacity="0.2" />
            <circle cx="20" cy="5" r="1" fill="#724E43" fillOpacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="10" fill="url(#jali)" />
      </svg>
    </div>
  )
}
