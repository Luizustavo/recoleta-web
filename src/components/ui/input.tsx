import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useFormField } from "./form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  buttonIcon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      buttonIcon,
      error: errorProp,
      ...props
    },
    ref
  ) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const ButtonIcon = buttonIcon;

    let formFieldError;
    try {
      const formField = useFormField();
      formFieldError = formField?.error;
    } catch {
      formFieldError = null;
    }

    const error = errorProp ?? !!formFieldError;

    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 px-1">
            <StartIcon
              size={20}
              className={cn(
                "text-muted-foreground",
                !!error && "text-destructive"
              )}
            />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-md border bg-background py-3 px-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50",
            !!error && "border-destructive placeholder:text-destructive",
            startIcon ? "pl-12" : "",
            endIcon ? "pr-9" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <EndIcon className="text-muted-foreground" size={20} />
          </div>
        )}
        {ButtonIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
            {ButtonIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
