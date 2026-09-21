import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobModalChooseAds } from './JobModalChooseAds'
import type { JobModalAdvertisement } from './types'

const advertisements: JobModalAdvertisement[] = [
  { id: 'ad-1', title: 'Hlavní inzerát', createdAt: '12. 3. 2026' },
  { id: 'ad-2', title: 'Inzerát pro brigádníky', createdAt: '20. 4. 2026' },
]

describe('JobModalChooseAds', () => {
  it('keeps Pokračovat disabled until an advertisement is selected', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <JobModalChooseAds defaultOpen advertisements={advertisements} onConfirm={onConfirm} />,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Vyberte inzerát')
    expect(within(dialog).getByRole('radio', { name: 'Hlavní inzerát' })).not.toBeChecked()
    expect(within(dialog).getByRole('radio', { name: 'Inzerát pro brigádníky' })).not.toBeChecked()

    const confirm = within(dialog).getByRole('button', { name: 'Pokračovat' })
    expect(confirm).toBeDisabled()

    await user.click(within(dialog).getByRole('radio', { name: 'Hlavní inzerát' }))
    expect(within(dialog).getByRole('button', { name: 'Pokračovat' })).toBeEnabled()

    await user.click(within(dialog).getByRole('button', { name: 'Pokračovat' }))
    expect(onConfirm).toHaveBeenCalledWith('ad-1')
  })

  it('selects a single advertisement from a card click', async () => {
    const user = userEvent.setup()

    render(<JobModalChooseAds defaultOpen advertisements={advertisements} />)

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByText('Inzerát pro brigádníky'))

    expect(within(dialog).getByRole('radio', { name: 'Hlavní inzerát' })).not.toBeChecked()
    expect(within(dialog).getByRole('radio', { name: 'Inzerát pro brigádníky' })).toBeChecked()
  })
})
