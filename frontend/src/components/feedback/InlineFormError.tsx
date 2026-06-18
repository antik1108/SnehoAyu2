import React from 'react';

interface InlineFormErrorProps {
  message: string;
}

export const InlineFormError: React.FC<InlineFormErrorProps> = ({ message }) => {
  return (
    <div
      role="alert"
      className="flex w-full items-start gap-2.5 rounded-xl border border-error/20 bg-error/5 p-3.5 text-xs text-error font-medium leading-normal"
    >
      <svg
        className="h-4.5 w-4.5 shrink-0 text-error"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};
