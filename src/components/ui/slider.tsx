
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    orientation?: "horizontal" | "vertical"
  }
>(({ className, orientation = "horizontal", ...props }, ref) => {
  const isVertical = orientation === "vertical"
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex touch-none select-none items-center",
        isVertical 
          ? "h-24 w-1.5 flex-col justify-center" // Reduced height from h-32 to h-24
          : "w-full h-2 flex-row",
        className
      )}
      orientation={orientation}
      {...props}
    >
      <SliderPrimitive.Track className={cn(
        "relative overflow-hidden rounded-full bg-white", // Changed from bg-gray-200 to bg-white
        isVertical ? "h-full w-1.5" : "h-2 w-full grow" // Decreased width from w-2 to w-1.5
      )}>
        <SliderPrimitive.Range className={cn(
          "absolute bg-yellow",
          isVertical ? "w-full" : "h-full"
        )} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-yellow bg-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 transition-transform" />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
