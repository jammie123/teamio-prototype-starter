import { useCallback, useEffect, useRef, useState } from 'react'

export interface ScrollEdges {
  /** Content is hidden past the start (left) edge, i.e. the container is scrolled right. */
  start: boolean
  /** Content is hidden past the end (right) edge, i.e. there is more to scroll to. */
  end: boolean
}

export interface ScrollState extends ScrollEdges {
  /** True while the container is being scrolled, until `SCROLL_IDLE_MS` after the last scroll event. */
  isScrolling: boolean
}

const THRESHOLD = 1
const SCROLL_IDLE_MS = 200

function measure(element: HTMLElement): ScrollEdges {
  const { scrollLeft, clientWidth, scrollWidth } = element
  return {
    start: scrollLeft > THRESHOLD,
    end: scrollLeft + clientWidth < scrollWidth - THRESHOLD,
  }
}

/**
 * Tracks the horizontally scrollable parent of the returned `ref`: whether content is hidden
 * beyond its start or end edge, and whether it is currently being scrolled.
 * Updates on scroll and whenever the container or its content is resized.
 */
export function useScrollEdges<T extends HTMLElement>() {
  const targetRef = useRef<T | null>(null)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [state, setState] = useState<ScrollState>({ start: false, end: false, isScrolling: false })

  const ref = useCallback((node: T | null) => {
    targetRef.current = node
    setElement(node?.parentElement ?? null)
  }, [])

  useEffect(() => {
    if (!element) return undefined

    let idleTimer: ReturnType<typeof setTimeout> | undefined

    const update = (isScrollEvent: boolean) => {
      const edges = measure(element)
      setState((current) => {
        const isScrolling = isScrollEvent ? true : current.isScrolling
        return current.start === edges.start &&
          current.end === edges.end &&
          current.isScrolling === isScrolling
          ? current
          : { ...edges, isScrolling }
      })
    }

    const onScroll = () => {
      update(true)
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        setState((current) => (current.isScrolling ? { ...current, isScrolling: false } : current))
      }, SCROLL_IDLE_MS)
    }
    const onResize = () => update(false)

    update(false)
    element.addEventListener('scroll', onScroll, { passive: true })

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(onResize)
      observer.observe(element)
      if (targetRef.current) observer.observe(targetRef.current)
    } else {
      window.addEventListener('resize', onResize)
    }

    return () => {
      clearTimeout(idleTimer)
      element.removeEventListener('scroll', onScroll)
      observer?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [element])

  return { ref, state }
}
