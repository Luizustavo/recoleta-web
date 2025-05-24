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
  ({ className, type, startIcon, endIcon, buttonIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const ButtonIcon = buttonIcon;
    const { error } = useFormField();

    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2 px-2">
            <StartIcon size={18} className={cn("text-muted-foreground", !!error && 'text-destructive') } />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background py-2 px-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50",
            !!error && "border-destructive placeholder:text-destructive",
            startIcon ? "pl-10" : "",
            endIcon ? "pr-8" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <EndIcon className="text-muted-foreground" size={18} />
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
