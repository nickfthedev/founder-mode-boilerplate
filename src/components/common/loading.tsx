import React from "react";
import { cn } from "~/lib/utils";

type LoaderSize = "small" | "medium" | "large";

interface JumpingDotsLoaderProps {
  size?: LoaderSize;
  className?: string;
}

export function JumpingDotsLoader({
  size = "medium",
  className,
}: JumpingDotsLoaderProps) {
  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3",
  };

  const containerClasses = {
    small: "space-x-1",
    medium: "space-x-2",
    large: "space-x-3",
  };

  const jumpKeyframes = `
    @keyframes jump {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-1rem); }
    }
  `;

  const dotStyle = (delay: number) => ({
    animation: `jump 1s infinite ${delay}ms`,
  });

  return (
    <>
      <style>{jumpKeyframes}</style>
      <div className={cn("flex", containerClasses[size], className)}>
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(sizeClasses[size], "my-4 rounded-full bg-primary")}
            style={dotStyle(index * 75)}
          ></div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </>
  );
}

type SpinnerSize = "small" | "medium" | "large";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function LoadingSpinner({
  size = "medium",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  const borderSizeClasses = {
    small: "border-2",
    medium: "border-4",
    large: "border-6",
  };

  return (
    <div className={cn("", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0 rounded-full border-gray-200",
            borderSizeClasses[size],
          )}
        ></div>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0 animate-spin rounded-full border-primary border-t-transparent",
            borderSizeClasses[size],
          )}
        ></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
