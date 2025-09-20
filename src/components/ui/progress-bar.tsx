import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  segments?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  className,
  segments = 10 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const filledSegments = Math.floor((percentage / 100) * segments);

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: segments }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "progress-segment flex-1",
            index < filledSegments && "filled"
          )}
        />
      ))}
    </div>
  );
};

export { ProgressBar };