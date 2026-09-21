import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

describe('App', () => {
  it('renders the starter heading and primitive smoke gallery', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Teamio Prototype Starter' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Button link' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'primary link' })).toBeInTheDocument()
  })

  it('renders the feedback and form smoke gallery', () => {
    render(<App />)
    expect(screen.getByRole('status', { name: 'Načítání' })).toBeInTheDocument()
    expect(screen.getByText('Informativní zpráva')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Zadejte platný e-mail.')
    expect(screen.getByRole('checkbox', { name: 'Souhlasím' })).toBeChecked()
    expect(screen.getByRole('combobox', { name: 'Město' })).toHaveValue('praha')
  })

  it('renders the data display and overlay smoke gallery', () => {
    render(<App />)
    expect(screen.getByText('Aktivní')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Uchazeči' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Ukázkové záložky' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tooltip' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open Modal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open Drawer' })).toBeInTheDocument()
  })
})
