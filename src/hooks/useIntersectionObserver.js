import { useEffect, useRef } from 'react'

/**
 * A generic hook that uses the native IntersectionObserver API to detect
 * when a target element enters the viewport.
 * 
 * @param {React.RefObject} ref - A React ref attached to the sentinel DOM element to observe.
 * @param {Function} callback - Function to call when the sentinel enters the viewport. 
 * Note: Callback is stored in a ref to prevent observer re-attachments during re-renders.
 */
export function useIntersectionObserver(ref, callback) {
  const savedCallback = useRef(callback)

  // Update the ref whenever the callback changes (without restarting the observer)
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            savedCallback.current()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref])
}
