
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener for resize
    window.addEventListener("resize", handleResize)
    
    // Also use matchMedia for better browser compatibility
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    if (mql.addEventListener) {
      mql.addEventListener("change", handleMediaChange)
    } else {
      // Fallback for older browsers
      mql.addListener(handleResize)
    }
    
    // Initial check
    handleResize()
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleMediaChange)
      } else {
        // Fallback for older browsers
        mql.removeListener(handleResize)
      }
    }
  }, [])

  return isMobile
}
