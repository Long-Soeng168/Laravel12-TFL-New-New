import { AlertTriangle, CheckCircle, Info, Loader, XCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {

  return (
      <Sonner
      // className="toaster group toaster-container"
      toastOptions={{
          classNames: {
              toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton:
                  "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton:
                  "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
      }}
      icons={{
          success: <CheckCircle className="size-5 text-green-500" />,
          info: <Info className="size-5 text-blue-500" />,
          warning: <AlertTriangle className="size-5 text-amber-500" />,
          error: <XCircle className="size-5 text-red-500" />,
          loading: <Loader className="size-5 text-gray-500 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
