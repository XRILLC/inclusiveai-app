interface ProgressBarProps {
  progress: number;  // Progress percentage (0-100)
  showText?: boolean;  // Whether to show the "X% to Goal" text
}

export default function ProgressBar({ progress, showText = true }: ProgressBarProps) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {/* Progress bar container */}
      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
        {/* Progress bar fill with gradient */}
        <div 
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
      
      {/* Percentage text */}
      {showText && (
        <div className="text-right text-sm text-gray-400 mt-1">
          {normalizedProgress}% to Goal
        </div>
      )}
    </div>
  );
}
