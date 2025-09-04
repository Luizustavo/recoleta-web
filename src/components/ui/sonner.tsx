"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/90",
          success: "group-[.toaster]:bg-background group-[.toaster]:text-primary-green group-[.toaster]:border-primary-green/30 group-[.toaster]:shadow-lg [&>svg]:text-primary-green",
          error: "group-[.toaster]:bg-background group-[.toaster]:text-destructive group-[.toaster]:border-destructive/30 group-[.toaster]:shadow-lg [&>svg]:text-destructive",
          info: "group-[.toaster]:bg-background group-[.toaster]:text-secondary-blue group-[.toaster]:border-secondary-blue/30 group-[.toaster]:shadow-lg [&>svg]:text-secondary-blue",
          warning: "group-[.toaster]:bg-background group-[.toaster]:text-tertiary-orange group-[.toaster]:border-tertiary-orange/30 group-[.toaster]:shadow-lg [&>svg]:text-tertiary-orange",
        },
        style: {
          marginTop: '1rem',
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
