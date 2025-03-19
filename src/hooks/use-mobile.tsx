
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Immediately set initial values
    setWindowWidth(window.innerWidth)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width < MOBILE_BREAKPOINT)
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

  // Add console log to debug mobile detection
  React.useEffect(() => {
    console.log(`Window width: ${windowWidth}, Is Mobile: ${isMobile}`)
  }, [windowWidth, isMobile])

  return isMobile
}
