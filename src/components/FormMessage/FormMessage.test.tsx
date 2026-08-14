import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormGroup } from '../FormGroup'
import { FormMessage } from './FormMessage'

describe('FormMessage', () => {
  it('exposes a stable id and helper status semantics by default', () => {
    render(
      <FormGroup>
        <FormMessage>Nápověda</FormMessage>
      </FormGroup>,
    )
    const message = screen.getByText('Nápověda')
    expect(message.id).toMatch(/./)
    expect(message).toHaveAttribute('role', 'status')
    expect(message).toHaveClass('tm-text-secondary-default')
  })

  it('uses alert semantics and danger color for error state', () => {
    render(
      <FormGroup validationState="error">
        <FormMessage>Chyba</FormMessage>
      </FormGroup>,
    )
    const message = screen.getByRole('alert')
    expect(message).toHaveTextContent('Chyba')
    expect(message).toHaveClass('tm-text-emotion-danger-active')
  })

  it('supports local validationState override', () => {
    render(
      <FormGroup validationState="default">
        <FormMessage validationState="success">OK</FormMessage>
      </FormGroup>,
    )
    expect(screen.getByText('OK')).toHaveClass('tm-text-emotion-success-active')
  })
})
