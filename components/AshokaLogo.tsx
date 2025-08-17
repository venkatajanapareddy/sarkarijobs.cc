export default function AshokaLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle - subtle fill */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        fill="currentColor"
        className="text-blue-50 dark:text-blue-950/30"
      />
      
      {/* Outer Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        stroke="currentColor" 
        strokeWidth="3"
        fill="white"
        className="text-blue-600 dark:text-blue-400 dark:fill-gray-900"
      />
      
      {/* Ashoka Chakra Spokes - 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 - 90) * Math.PI / 180; // Start from top
        const x1 = 50 + 12 * Math.cos(angle);
        const y1 = 50 + 12 * Math.sin(angle);
        const x2 = 50 + 38 * Math.cos(angle);
        const y2 = 50 + 38 * Math.sin(angle);
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-blue-600 dark:text-blue-400"
            strokeLinecap="round"
          />
        );
      })}
      
      {/* Center Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="12" 
        fill="currentColor"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* SJ Text in center */}
      <text
        x="50"
        y="56"
        textAnchor="middle"
        className="fill-white dark:fill-gray-900 font-bold"
        fontSize="16"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        SJ
      </text>
    </svg>
  );
}