import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FormGroup } from '../FormGroup'
import { FormLabel } from '../FormLabel'
import { FormMessage } from '../FormMessage'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('preserves native checkbox semantics and label association', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Checkbox onChange={onChange} value="yes">
        Souhlasím
      </Checkbox>,
    )
    const checkbox = screen.getByRole('checkbox', { name: 'Souhlasím' })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(onChange).toHaveBeenCalled()
  })

  it('supports controlled checked, disabled, and error visuals', () => {
    const { rerender } = render(<Checkbox checked onChange={() => undefined}>On</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(screen.getByRole('checkbox')).toHaveClass('checked:tm-bg-checkbox-checked')

    rerender(
      <Checkbox checked={false} disabled validationState="error" onChange={() => undefined}>
        Off
      </Checkbox>,
    )
    const checkbox = screen.getByRole('checkbox', { name: 'Off' })
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toHaveClass('!tm-border-emotion-danger-active')
  })

  it('forwards ref and supports indeterminate', () => {
    const ref = createRef<HTMLInputElement>()
    render(
      <Checkbox ref={ref} indeterminate>
        Mixed
      </Checkbox>,
    )
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.indeterminate).toBe(true)
  })

  it('resolves label, message, validation and required wiring from FormGroup', () => {
    render(
      <FormGroup validationState="error" isRequired>
        <FormLabel as="p">Souhlas se zpracováním</FormLabel>
        <Checkbox>Souhlasím</Checkbox>
        <FormMessage>Musíte souhlasit.</FormMessage>
      </FormGroup>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Souhlasím' })
    const label = screen.getByText('Souhlasím')
    const message = screen.getByText('Musíte souhlasit.')

    expect(checkbox.id).toBeTruthy()
    expect(label).toHaveAttribute('for', checkbox.id)
    expect(checkbox).toHaveAttribute('aria-describedby', message.id)
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toBeRequired()
  })

  it('keeps its own id instead of adopting the FormGroup control id', () => {
    render(
      <FormGroup id="souhlas-skupina">
        <FormLabel as="p">Souhlasy</FormLabel>
        <Checkbox>Souhlasím</Checkbox>
      </FormGroup>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Souhlasím' })
    expect(checkbox.id).toBeTruthy()
    expect(checkbox.id).not.toBe('souhlas-skupina')
  })

  it('inherits disabled from FormGroup and honours an explicit id override', () => {
    render(
      <FormGroup isDisabled>
        <FormLabel htmlFor="souhlas">Souhlas</FormLabel>
        <Checkbox id="souhlas" />
      </FormGroup>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Souhlas' })
    expect(checkbox).toHaveAttribute('id', 'souhlas')
    expect(checkbox).toBeDisabled()
  })

  it('prefers an explicit aria-describedby over the FormGroup message', () => {
    render(
      <FormGroup>
        <FormLabel as="p">Vlastní popis</FormLabel>
        <Checkbox aria-describedby="vlastni-popis">Souhlasím</Checkbox>
        <FormMessage>Zpráva skupiny.</FormMessage>
        <span id="vlastni-popis">Vlastní nápověda.</span>
      </FormGroup>,
    )

    expect(screen.getByRole('checkbox', { name: 'Souhlasím' })).toHaveAttribute(
      'aria-describedby',
      'vlastni-popis',
    )
  })
})
