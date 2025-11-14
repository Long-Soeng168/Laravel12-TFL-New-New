import React from "react"
import { cn } from "@/lib/utils"

const customPulseKeyframes = `
  @keyframes customPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`

function Skeleton({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <style>
        {customPulseKeyframes}
      </style>
      <div
        data-slot="skeleton"
        className={cn("bg-gray-200 dark:bg-gray-200/20 rounded-md", className)}
        style={{ animation: "customPulse 2s ease-in-out infinite", ...style }}
        {...props}
      />
    </>
  )
}

export { Skeleton }
