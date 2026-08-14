import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Checkbox } from '../Checkbox'
import { FormLabel } from '../FormLabel'
import { FormMessage } from '../FormMessage'
import { Input } from '../Input'
import { Radio } from '../Radio'
import { FormGroup } from './FormGroup'

const meta = {
  title: 'Components/FormGroup',
  component: FormGroup,
} satisfies Meta<typeof FormGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <FormGroup>
      <FormLabel>E-mail</FormLabel>
      <Input type="email" placeholder="jan@firma.cz" />
      <FormMessage>Použijte pracovní e-mail.</FormMessage>
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('E-mail')
    await userEvent.clear(input)
    await userEvent.type(input, 'jana.novakova@firma.cz')
    await expect(input).toHaveValue('jana.novakova@firma.cz')
  },
}

export const Success: Story = {
  render: () => (
    <FormGroup validationState="success">
      <FormLabel>Telefon</FormLabel>
      <Input type="tel" defaultValue="+420 777 123 456" />
      <FormMessage>Telefon je v pořádku.</FormMessage>
    </FormGroup>
  ),
}

export const Warning: Story = {
  render: () => (
    <FormGroup validationState="warning">
      <FormLabel>LinkedIn</FormLabel>
      <Input defaultValue="linkedin.com/in/ukazka" />
      <FormMessage>Ověřte, že odkaz vede na správný profil.</FormMessage>
    </FormGroup>
  ),
}

export const Error: Story = {
  render: () => (
    <FormGroup validationState="error" isRequired>
      <FormLabel>E-mail</FormLabel>
      <Input type="email" defaultValue="neplatny" />
      <FormMessage>Zadejte platný e-mail.</FormMessage>
    </FormGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <FormGroup isDisabled>
      <FormLabel>Zakázané pole</FormLabel>
      <Input defaultValue="Nelze upravit" />
    </FormGroup>
  ),
}

export const RadioOptions: Story = {
  render: () => (
    <FormGroup validationState="error" isRequired>
      <FormLabel as="p">Preferovaný kontakt</FormLabel>
      <div
        className="tm-flex tm-flex-col tm-gap-2"
        role="radiogroup"
        aria-label="Preferovaný kontakt"
      >
        <Radio name="kontakt" value="email">
          E-mail
        </Radio>
        <Radio name="kontakt" value="telefon">
          Telefon
        </Radio>
      </div>
      <FormMessage>Vyberte jednu možnost.</FormMessage>
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const email = canvas.getByRole('radio', { name: 'E-mail' })
    const phone = canvas.getByRole('radio', { name: 'Telefon' })
    const message = canvas.getByText('Vyberte jednu možnost.')

    await expect(email.id).not.toBe(phone.id)
    // FormMessage registers itself in an effect, so the shared description lands
    // on the controls one render after the first paint.
    await waitFor(() => expect(email).toHaveAttribute('aria-describedby', message.id))
    await expect(phone).toHaveAttribute('aria-describedby', message.id)
    await userEvent.click(phone)
    await expect(phone).toBeChecked()
    await expect(email).not.toBeChecked()
  },
}

export const CheckboxOptions: Story = {
  render: () => (
    <FormGroup isRequired>
      <FormLabel as="p">Souhlasy</FormLabel>
      <div className="tm-flex tm-flex-col tm-gap-2" role="group" aria-label="Souhlasy">
        <Checkbox name="souhlas" value="podminky">
          Souhlasím s podmínkami
        </Checkbox>
        <Checkbox name="souhlas" value="novinky">
          Chci dostávat novinky o pozicích
        </Checkbox>
      </div>
      <FormMessage>Podmínky je nutné potvrdit.</FormMessage>
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const terms = canvas.getByRole('checkbox', { name: 'Souhlasím s podmínkami' })
    const news = canvas.getByRole('checkbox', { name: 'Chci dostávat novinky o pozicích' })

    await expect(terms.id).not.toBe(news.id)
    await userEvent.click(terms)
    await expect(terms).toBeChecked()
    await expect(news).not.toBeChecked()
  },
}

export const InteractiveValidation: Story = {
  render: function InteractiveValidationForm() {
    const [value, setValue] = useState('')
    const invalid = value.length > 0 && !value.includes('@')
    return (
      <FormGroup validationState={invalid ? 'error' : 'default'} isRequired>
        <FormLabel>Pracovní e-mail</FormLabel>
        <Input
          type="email"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="jmeno@firma.cz"
        />
        <FormMessage>
          {invalid ? 'E-mail musí obsahovat zavináč.' : 'Vyplňte firemní e-mail uchazeče.'}
        </FormMessage>
      </FormGroup>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText(/Pracovní e-mail/)
    await userEvent.type(input, 'neplatny')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('E-mail musí obsahovat zavináč.')).toBeVisible()
    await userEvent.clear(input)
    await userEvent.type(input, 'petr.svoboda@firma.cz')
    await expect(input).not.toHaveAttribute('aria-invalid', 'true')
  },
}
