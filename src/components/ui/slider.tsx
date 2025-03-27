
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  orientation?: "horizontal" | "vertical"
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      "relative flex touch-none select-none",
      orientation === "horizontal" 
        ? "w-full items-center" 
        : "h-full flex-col items-center justify-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={cn(
      "relative overflow-hidden rounded-full bg-gray-200",
      orientation === "horizontal" 
        ? "h-2 w-full grow" 
        : "w-2 h-full grow"
    )}>
      <SliderPrimitive.Range className={cn(
        "absolute bg-yellow",
        orientation === "horizontal" 
          ? "h-full" 
          : "w-full bottom-0"
      )} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-yellow bg-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 transition-transform" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
