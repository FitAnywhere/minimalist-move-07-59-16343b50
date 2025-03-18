
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener for resize
    window.addEventListener("resize", handleResize)
    
    // Also use matchMedia for better browser compatibility
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    if (mql.addEventListener) {
      mql.addEventListener("change", handleResize)
    } else {
      // Fallback for older browsers
      mql.addListener(handleResize)
    }
    
    // Initial check
    handleResize()
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleResize)
      } else {
        // Fallback for older browsers
        mql.removeListener(handleResize)
      }
    }
  }, [])

  return !!isMobile
}
