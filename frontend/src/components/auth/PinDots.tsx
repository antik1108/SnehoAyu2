import React from 'react';

interface PinDotsProps {
  length?: number;
  filledCount: number;
  label: string;
  hasError?: boolean;
}

export const PinDots: React.FC<PinDotsProps> = ({
  length = 4,
  filledCount,
  label,
  hasError = false,
}) => {
  const dots = Array.from({ length });

  return (
    <div className="flex flex-col items-center gap-3 w-full" aria-live="polite">
      {/* Hidden screen-reader status */}
      <span className="sr-only">
        {label}
      </span>

      <div
        className={`flex justify-center gap-4 py-2 ${hasError ? 'animate-shake' : ''}`}
        aria-hidden="true"
      >
        {dots.map((_, index) => {
          const isFilled = index < filledCount;
          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                isFilled
                  ? hasError
                    ? 'bg-error border-error scale-110'
                    : 'bg-primary border-primary scale-110'
                  : hasError
                  ? 'bg-surface border-error'
                  : 'bg-surface border-border'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
