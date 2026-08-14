import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormGroup } from '../FormGroup'
import { FormLabel } from './FormLabel'

describe('FormLabel', () => {
  it('binds htmlFor from FormGroup context', () => {
    render(
      <FormGroup>
        <FormLabel>Jméno</FormLabel>
      </FormGroup>,
    )
    const label = screen.getByText('Jméno')
    expect(label.tagName).toBe('LABEL')
    expect(label).toHaveAttribute('for')
    expect(label.getAttribute('for')).toBeTruthy()
  })

  it('shows required marker from context', () => {
    render(
      <FormGroup isRequired>
        <FormLabel>Povinné</FormLabel>
      </FormGroup>,
    )
    expect(screen.getByText('Povinné')).toHaveClass('after:tm-content-["*"]')
  })

  it('supports non-label element without htmlFor', () => {
    render(
      <FormGroup>
        <FormLabel as="p">Skupina</FormLabel>
      </FormGroup>,
    )
    const label = screen.getByText('Skupina')
    expect(label.tagName).toBe('P')
    expect(label).not.toHaveAttribute('for')
  })
})
