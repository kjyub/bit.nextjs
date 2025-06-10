import TypeUtils from "@/utils/TypeUtils";

interface Props {
  ratio: number;
  title: string;
  color: string;
  size: number;
  isMaxLimit?: boolean;
}
export default function Guage({ ratio, title, color, size = 120, isMaxLimit = true }: Props) {
  const clampedRatio = Math.min(Math.max(ratio, 0), 1);
  const percentage = (clampedRatio * 100).toFixed(0);

  const strokeWidth = size / 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc is 3/4 of a circle (270 degrees)
  const arcLength = (270 / 360) * circumference;
  const gapLength = circumference - arcLength;

  // The progress part of the arc
  const progressArcLength = clampedRatio * arcLength;

  // Rotate circle by 135 degrees to position the gap at the bottom
  const rotationStyle = {
    transform: 'rotate(135deg)',
    transformOrigin: '50% 50%',
  };

  return (
    <div className="relative inline-flex items-center justify-center translate-y-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${title}: ${percentage}%`}
      >
        <title>{`${title}: ${percentage}%`}</title>
        {/* Background Arc */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeLinecap="round"
          style={rotationStyle}
        />
        {/* Foreground/Progress Arc */}
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progressArcLength} ${circumference - progressArcLength}`}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={rotationStyle}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center gap-1">
        <span
          className="font-bold text-gray-800 dark:text-white"
          style={{ fontSize: `${size / 5}px`, lineHeight: `${size / 5}px` }}
        >{`${isMaxLimit ? percentage : TypeUtils.round(ratio * 100)}%`}</span>
        <span
          className="font-medium text-gray-500 dark:text-gray-400"
          style={{ fontSize: `${size / 8}px`, lineHeight: `${size / 8}px` }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}
