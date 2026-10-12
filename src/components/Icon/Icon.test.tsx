import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders a known lucide icon by name', () => {
    render(<Icon name="plus" title="Add" />)
    const wrapper = screen.getByTestId('icon')
    expect(wrapper).toHaveAttribute('data-icon-name', 'plus')
    expect(wrapper.querySelector('svg')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Add' })).toBeInTheDocument()
  })

  it('uses a deterministic fallback for unknown names', () => {
    const { getByTestId } = render(<Icon name="not-a-real-icon" />)
    const wrapper = getByTestId('icon')
    expect(wrapper).toHaveAttribute('data-icon-name', 'not-a-real-icon')
    expect(wrapper).toHaveAttribute('data-icon-fallback', 'true')
    expect(wrapper.querySelector('svg')).toBeTruthy()
  })

  it('forwards ref and className', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Icon ref={ref} name="check" className="tm-text-xl" />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveClass('tm-text-xl')
  })

  it('applies current-color stroke class on the Lucide SVG', () => {
    render(<Icon name="plus" />)
    const svg = screen.getByTestId('icon').querySelector('svg')
    expect(svg).toHaveClass('tm-stroke-current')
  })

  it('forwards a custom stroke width to the Lucide SVG', () => {
    render(<Icon name="chevron-down" strokeWidth={2.75} />)
    const svg = screen.getByTestId('icon').querySelector('svg')
    expect(svg).toHaveAttribute('stroke-width', '2.75')
  })

  it('renders the custom filled opal icon without falling back', () => {
    render(<Icon name="opal" title="Opalcování" />)
    const wrapper = screen.getByTestId('icon')
    expect(wrapper).toHaveAttribute('data-icon-name', 'opal')
    expect(wrapper).not.toHaveAttribute('data-icon-fallback')
    const svg = wrapper.querySelector('svg')
    expect(svg).toHaveClass('tm-fill-current')
    expect(svg).not.toHaveClass('tm-stroke-current')
    expect(screen.getByRole('img', { name: 'Opalcování' })).toBeInTheDocument()
  })

  it.each(['single-man-time', 'candidate-move'])('renders the custom filled %s icon', (name) => {
    render(<Icon name={name} title={name} />)
    const wrapper = screen.getByTestId('icon')
    expect(wrapper).toHaveAttribute('data-icon-name', name)
    expect(wrapper).not.toHaveAttribute('data-icon-fallback')
    expect(wrapper.querySelector('svg')).toHaveClass('tm-fill-current')
  })

  it.each(['ban', 'circle-check', 'message-square', 'sliders-horizontal'])(
    'resolves %s as a known lucide icon',
    (name) => {
      render(<Icon name={name} />)
      const wrapper = screen.getByTestId('icon')
      expect(wrapper).toHaveAttribute('data-icon-name', name)
      expect(wrapper).not.toHaveAttribute('data-icon-fallback')
    },
  )

  it('resolves maximize as a known lucide icon', () => {
    render(<Icon name="maximize" title="Na celou obrazovku" />)
    const wrapper = screen.getByTestId('icon')
    expect(wrapper).toHaveAttribute('data-icon-name', 'maximize')
    expect(wrapper).not.toHaveAttribute('data-icon-fallback')
    expect(screen.getByRole('img', { name: 'Na celou obrazovku' })).toBeInTheDocument()
  })
})
