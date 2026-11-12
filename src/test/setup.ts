import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// jsdom's canvas has no 2d context; lottie-web probes one at import time.
HTMLCanvasElement.prototype.getContext = function getContext() {
  return {
    fillStyle: '',
    fillRect() {},
    clearRect() {},
    getImageData() {
      return { data: new Uint8ClampedArray(4) }
    },
    putImageData() {},
    createImageData() {
      return { data: new Uint8ClampedArray(4) }
    },
    setTransform() {},
    drawImage() {},
    save() {},
    fillText() {},
    restore() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    stroke() {},
    translate() {},
    scale() {},
    rotate() {},
    arc() {},
    fill() {},
    measureText() {
      return { width: 0 }
    },
    transform() {},
    rect() {},
    clip() {},
  } as unknown as CanvasRenderingContext2D
} as unknown as HTMLCanvasElement['getContext']

if (!window.matchMedia) {
  window.matchMedia = function matchMedia(query: string): MediaQueryList {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    }
  }
}

// jsdom has no ResizeObserver; Radix Popper (tooltip arrow) measures with it.
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverStub implements ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }

  globalThis.ResizeObserver = ResizeObserverStub
}

afterEach(() => {
  cleanup()
})
