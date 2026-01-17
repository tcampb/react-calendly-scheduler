import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import type { CalendlyError } from "react-calendly-components";

interface CalendlyErrorDisplayProps extends React.ComponentProps<"div"> {
  error: CalendlyError;
  onRetry?: () => void;
}

function CalendlyErrorDisplay({
  error,
  onRetry,
  className,
  ...props
}: CalendlyErrorDisplayProps) {
  console.log(error);
  return (
    <div
      data-slot="calendly-error"
      className={cn(
        "rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive",
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold leading-none">{error.title}</h4>
          <p className="text-sm opacity-90">{error.message}</p>

          {error.details && error.details.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm">
              {error.details.map((detail, index) => (
                <li
                  key={`${detail.parameter}-${index}`}
                  className="flex flex-col rounded bg-destructive/10 p-2"
                >
                  <span className="font-medium">{detail.parameter}</span>
                  <span className="opacity-80">{detail.message}</span>
                  <code className="mt-1 text-xs opacity-60">
                    Code: {detail.code}
                  </code>
                </li>
              ))}
            </ul>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { CalendlyErrorDisplay };
