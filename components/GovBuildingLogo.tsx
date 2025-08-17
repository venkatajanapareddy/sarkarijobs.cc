export default function GovBuildingLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        fill="currentColor"
        className="text-blue-50 dark:text-blue-950/30"
      />
      
      {/* Base Platform */}
      <rect
        x="15"
        y="75"
        width="70"
        height="5"
        fill="currentColor"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Steps */}
      <rect
        x="20"
        y="72"
        width="60"
        height="3"
        fill="currentColor"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Main Building Body */}
      <rect
        x="25"
        y="45"
        width="50"
        height="27"
        fill="currentColor"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Pillars */}
      {[30, 40, 50, 60, 70].map((x, i) => (
        <rect
          key={i}
          x={x - 2}
          y="50"
          width="4"
          height="22"
          fill="currentColor"
          className="text-blue-500 dark:text-blue-500"
        />
      ))}
      
      {/* Dome */}
      <path
        d="M 30 45 Q 50 25, 70 45"
        fill="currentColor"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Dome Top Circle */}
      <circle
        cx="50"
        cy="30"
        r="3"
        fill="currentColor"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Flag Pole */}
      <rect
        x="49"
        y="20"
        width="2"
        height="10"
        fill="currentColor"
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Indian Flag (Tricolor) */}
      <rect x="51" y="20" width="12" height="2" fill="#FF9933" /> {/* Saffron */}
      <rect x="51" y="22" width="12" height="2" fill="white" />   {/* White */}
      <rect x="51" y="24" width="12" height="2" fill="#138808" /> {/* Green */}
      
      {/* Windows/Doors */}
      <rect
        x="45"
        y="55"
        width="10"
        height="12"
        fill="white"
        className="dark:fill-gray-900"
      />
      
      {/* Side Windows */}
      <rect
        x="33"
        y="57"
        width="6"
        height="6"
        fill="white"
        className="dark:fill-gray-900"
      />
      <rect
        x="61"
        y="57"
        width="6"
        height="6"
        fill="white"
        className="dark:fill-gray-900"
      />
    </svg>
  );
}