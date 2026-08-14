import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FormGroup } from '../FormGroup'
import { FormLabel } from '../FormLabel'
import { FormMessage } from '../FormMessage'
import { Radio } from './Radio'

describe('Radio', () => {
  it('preserves native radio group keyboard/click selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <div>
        <Radio name="size" value="s" onChange={onChange}>
          S
        </Radio>
        <Radio name="size" value="m" onChange={onChange}>
          M
        </Radio>
      </div>,
    )
    const medium = screen.getByRole('radio', { name: 'M' })
    await user.click(medium)
    expect(onChange).toHaveBeenCalled()
    expect(medium).toBeChecked()
  })

  it('shows error border and aria-invalid for error state', () => {
    render(
      <Radio validationState="error" name="x" value="1">
        Chyba
      </Radio>,
    )
    const radio = screen.getByRole('radio', { name: 'Chyba' })
    expect(radio).toHaveAttribute('aria-invalid', 'true')
    expect(radio).toHaveClass('!tm-border-emotion-danger-active', 'tm-rounded-full')
  })

  it('forwards ref and supports disabled', () => {
    const ref = createRef<HTMLInputElement>()
    render(
      <Radio ref={ref} disabled name="x" value="1">
        Disabled
      </Radio>,
    )
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('resolves label, message, validation and required wiring from FormGroup', () => {
    render(
      <FormGroup validationState="error" isRequired>
        <FormLabel as="p">Preferovaný kontakt</FormLabel>
        <Radio name="kontakt" value="email">
          E-mail
        </Radio>
        <FormMessage>Vyberte jednu možnost.</FormMessage>
      </FormGroup>,
    )

    const radio = screen.getByRole('radio', { name: 'E-mail' })
    const label = screen.getByText('E-mail')
    const message = screen.getByText('Vyberte jednu možnost.')

    expect(radio.id).toBeTruthy()
    expect(label).toHaveAttribute('for', radio.id)
    expect(radio).toHaveAttribute('aria-describedby', message.id)
    expect(radio).toHaveAttribute('aria-invalid', 'true')
    expect(radio).toBeRequired()
  })

  it('keeps its own id instead of adopting the FormGroup control id', () => {
    render(
      <FormGroup id="kontakt-skupina">
        <FormLabel as="p">Preferovaný kontakt</FormLabel>
        <Radio name="kontakt" value="email">
          E-mail
        </Radio>
      </FormGroup>,
    )

    const radio = screen.getByRole('radio', { name: 'E-mail' })
    expect(radio.id).toBeTruthy()
    expect(radio.id).not.toBe('kontakt-skupina')
  })

  it('inherits disabled from FormGroup and honours an explicit id override', () => {
    render(
      <FormGroup isDisabled>
        <FormLabel htmlFor="kontakt-email">E-mail</FormLabel>
        <Radio id="kontakt-email" name="kontakt" value="email" />
      </FormGroup>,
    )

    const radio = screen.getByRole('radio', { name: 'E-mail' })
    expect(radio).toHaveAttribute('id', 'kontakt-email')
    expect(radio).toBeDisabled()
  })

  it('prefers an explicit aria-describedby over the FormGroup message', () => {
    render(
      <FormGroup>
        <FormLabel as="p">Vlastní popis</FormLabel>
        <Radio aria-describedby="vlastni-popis" name="kontakt" value="sms">
          SMS
        </Radio>
        <FormMessage>Zpráva skupiny.</FormMessage>
        <span id="vlastni-popis">Vlastní nápověda.</span>
      </FormGroup>,
    )

    expect(screen.getByRole('radio', { name: 'SMS' })).toHaveAttribute(
      'aria-describedby',
      'vlastni-popis',
    )
  })
})
