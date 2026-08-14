import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '../Checkbox'
import { FormLabel } from '../FormLabel'
import { FormMessage } from '../FormMessage'
import { Input } from '../Input'
import { Radio } from '../Radio'
import { FormGroup } from './FormGroup'

describe('FormGroup', () => {
  it('links label, control, and message deterministically', () => {
    render(
      <FormGroup validationState="error" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input />
        <FormMessage>Neplatný e-mail</FormMessage>
      </FormGroup>,
    )

    const input = screen.getByRole('textbox')
    const label = screen.getByText('E-mail')
    const message = screen.getByText('Neplatný e-mail')

    expect(label).toHaveAttribute('for', input.id)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', message.id)
    expect(input).toBeRequired()
    expect(message.id).toBeTruthy()
  })

  it('dims a disabled field with a single opacity layer', () => {
    const { container } = render(
      <FormGroup isDisabled>
        <FormLabel>Zakázané pole</FormLabel>
        <Input />
      </FormGroup>,
    )

    const group = container.firstChild as HTMLElement
    const input = screen.getByRole('textbox')
    const label = screen.getByText('Zakázané pole')

    expect(group).not.toHaveClass('tm-opacity-50')
    expect(input).toHaveClass('tm-opacity-50')
    expect(group.querySelectorAll('.tm-opacity-50')).toHaveLength(1)

    expect(input).toBeDisabled()
    expect(label).toHaveAttribute('for', input.id)
  })

  it('dims a disabled checkbox with a single opacity layer', () => {
    const { container } = render(
      <FormGroup isDisabled>
        <FormLabel as="p">Zakázaný souhlas</FormLabel>
        <Checkbox>Souhlasím</Checkbox>
      </FormGroup>,
    )

    const group = container.firstChild as HTMLElement
    expect(group).not.toHaveClass('tm-opacity-50')
    expect(group.querySelectorAll('.tm-opacity-50')).toHaveLength(1)
    expect(screen.getByRole('checkbox', { name: 'Souhlasím' })).toBeDisabled()
  })

  it('gives every radio in one group a unique id and shared message wiring', () => {
    render(
      <FormGroup validationState="error" isRequired>
        <FormLabel as="p">Preferovaný kontakt</FormLabel>
        <Radio name="kontakt" value="email">
          E-mail
        </Radio>
        <Radio name="kontakt" value="telefon">
          Telefon
        </Radio>
        <FormMessage>Vyberte jednu možnost.</FormMessage>
      </FormGroup>,
    )

    const email = screen.getByRole('radio', { name: 'E-mail' })
    const phone = screen.getByRole('radio', { name: 'Telefon' })
    const message = screen.getByText('Vyberte jednu možnost.')

    expect(email.id).toBeTruthy()
    expect(phone.id).toBeTruthy()
    expect(email.id).not.toBe(phone.id)
    expect(screen.getByText('E-mail')).toHaveAttribute('for', email.id)
    expect(screen.getByText('Telefon')).toHaveAttribute('for', phone.id)

    for (const radio of [email, phone]) {
      expect(radio).toHaveAttribute('aria-describedby', message.id)
      expect(radio).toHaveAttribute('aria-invalid', 'true')
      expect(radio).toBeRequired()
    }
  })

  it('gives every checkbox in one group a unique id and shared message wiring', () => {
    render(
      <FormGroup validationState="error" isRequired>
        <FormLabel as="p">Souhlasy</FormLabel>
        <Checkbox name="souhlas" value="podminky">
          Podmínky
        </Checkbox>
        <Checkbox name="souhlas" value="novinky">
          Novinky
        </Checkbox>
        <FormMessage>Potvrďte oba souhlasy.</FormMessage>
      </FormGroup>,
    )

    const terms = screen.getByRole('checkbox', { name: 'Podmínky' })
    const news = screen.getByRole('checkbox', { name: 'Novinky' })
    const message = screen.getByText('Potvrďte oba souhlasy.')

    expect(terms.id).toBeTruthy()
    expect(news.id).toBeTruthy()
    expect(terms.id).not.toBe(news.id)
    expect(screen.getByText('Podmínky')).toHaveAttribute('for', terms.id)
    expect(screen.getByText('Novinky')).toHaveAttribute('for', news.id)

    for (const checkbox of [terms, news]) {
      expect(checkbox).toHaveAttribute('aria-describedby', message.id)
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      expect(checkbox).toBeRequired()
    }
  })

  it('disables every checkbox in one group without reusing the group control id', () => {
    render(
      <FormGroup isDisabled>
        <FormLabel as="p">Souhlasy</FormLabel>
        <Checkbox>Podmínky</Checkbox>
        <Checkbox>Novinky</Checkbox>
      </FormGroup>,
    )

    const [terms, news] = screen.getAllByRole('checkbox')
    expect(terms.id).not.toBe(news.id)
    expect(terms).toBeDisabled()
    expect(news).toBeDisabled()
  })

  it('keeps an explicit id on a radio while still inheriting group state', () => {
    render(
      <FormGroup isRequired validationState="error">
        <FormLabel as="p">Preferovaný kontakt</FormLabel>
        <Radio id="kontakt-email" name="kontakt" value="email">
          E-mail
        </Radio>
        <Radio name="kontakt" value="telefon">
          Telefon
        </Radio>
        <FormMessage>Vyberte jednu možnost.</FormMessage>
      </FormGroup>,
    )

    const email = screen.getByRole('radio', { name: 'E-mail' })
    const message = screen.getByText('Vyberte jednu možnost.')

    expect(email).toHaveAttribute('id', 'kontakt-email')
    expect(email).toHaveAttribute('aria-describedby', message.id)
    expect(email).toBeRequired()
    expect(screen.getByRole('radio', { name: 'Telefon' }).id).not.toBe('kontakt-email')
  })
})
