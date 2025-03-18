
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Use both matchMedia and resize event for better reliability
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Initial check
    handleResize()
    
    // Modern event listener
    if (mql.addEventListener) {
      mql.addEventListener("change", handleResize)
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize)
    }
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleResize)
      } else {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return isMobile
}
