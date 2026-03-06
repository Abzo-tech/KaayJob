export function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="#000080" />

      {/* Gradient overlay */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFF4EA', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.7 }} />
        </linearGradient>
      </defs>

      {/* K - Stylized */}
      <path
        d="M 12 8 L 12 32 M 26 8 L 12 20 L 26 32"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Decorative element */}
      <circle cx="28" cy="10" r="2" fill="#FFF4EA" opacity="0.8" />
      <circle cx="32" cy="15" r="1.5" fill="#FFF4EA" opacity="0.6" />
    </svg>
  );
}
