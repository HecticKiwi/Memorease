import { cn } from "@/lib/utils";
import colors from "tailwindcss/colors";

function CircleProgress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const radius = 40;
  const circumference = 2 * 3.14 * radius;
  const dash = (value / 100) * circumference;

  return (
    <>
      <div className={cn("className relative h-32 w-32", className)}>
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={colors.orange[300]}
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={colors.green[300]}
            strokeWidth="10"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={circumference / 4}
            strokeLinecap="round"
            className="transition-all"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">
          {Math.round(value)}%
        </div>
      </div>
    </>
  );
}

export default CircleProgress;
