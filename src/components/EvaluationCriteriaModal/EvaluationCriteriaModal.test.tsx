import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EvaluationCriteriaModal } from './EvaluationCriteriaModal'
import { sampleEvaluationCriteria } from './fixtures'

async function openModal(props: Partial<Parameters<typeof EvaluationCriteriaModal>[0]> = {}) {
  render(
    <EvaluationCriteriaModal defaultOpen defaultCriteria={sampleEvaluationCriteria} {...props} />,
  )
  return screen.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
}

describe('EvaluationCriteriaModal', () => {
  it('renders title, perex and a criteria table', async () => {
    const dialog = await openModal()

    expect(within(dialog).getByText(/Nastavte, na čem vám u této pozice záleží nejvíc/)).toBeInTheDocument()
    expect(within(dialog).getByRole('columnheader', { name: 'Název kritéria' })).toBeInTheDocument()
    expect(within(dialog).getByRole('columnheader', { name: 'Priorita' })).toBeInTheDocument()
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
    expect(within(dialog).getAllByRole('button', { name: 'Smazat kritérium' })).toHaveLength(2)
  })

  it('switches priority with the two buttons without opening the detail', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    const groups = within(dialog).getAllByRole('group', { name: 'Priorita' })
    const lowerButton = within(groups[0]).getByRole('button', { name: 'Nižší' })
    const highButton = within(groups[0]).getByRole('button', { name: 'Vysoká' })
    expect(highButton).toHaveAttribute('aria-pressed', 'true')
    expect(lowerButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(lowerButton)

    expect(lowerButton).toHaveAttribute('aria-pressed', 'true')
    expect(highButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
  })

  it('adds a new criterion through the detail and discards it when cancelled', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getByRole('button', { name: 'Přidat kritérium' }))
    let detail = await screen.findByRole('dialog', { name: 'Nové kritérium' })
    expect(within(detail).getByRole('button', { name: 'Uložit' })).toBeDisabled()
    await user.click(within(detail).getByRole('button', { name: 'Zrušit' }))
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)

    await user.click(within(dialog).getByRole('button', { name: 'Přidat kritérium' }))
    detail = await screen.findByRole('dialog', { name: 'Nové kritérium' })
    await user.type(within(detail).getByRole('textbox'), 'Řidičský průkaz skupiny B')
    await user.click(within(detail).getByRole('button', { name: 'Uložit' }))

    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(3)
    expect(within(dialog).getByText('Řidičský průkaz skupiny B')).toBeInTheDocument()
  })

  it('opens the detail from the edit icon button', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])

    const detail = await screen.findByRole('dialog', { name: 'Detail kritéria' })
    expect(within(detail).getByRole('textbox')).toHaveValue(sampleEvaluationCriteria[1].text)
  })

  it('deletes a criterion from the detail, but not while adding a new one', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getByRole('button', { name: 'Přidat kritérium' }))
    let detail = await screen.findByRole('dialog', { name: 'Nové kritérium' })
    expect(within(detail).queryByRole('button', { name: 'Smazat' })).not.toBeInTheDocument()
    await user.click(within(detail).getByRole('button', { name: 'Zrušit' }))

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    detail = await screen.findByRole('dialog', { name: 'Detail kritéria' })
    await user.click(within(detail).getByRole('button', { name: 'Smazat' }))

    expect(screen.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(1)
    expect(within(dialog).queryByText(sampleEvaluationCriteria[1].text)).not.toBeInTheDocument()
  })

  it('deletes a criterion without opening the detail', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getAllByRole('button', { name: 'Smazat kritérium' })[0])

    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(1)
    expect(screen.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
  })

  it('opens the detail on row click and saves an edited criterion', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const dialog = await openModal({ onSave })

    await user.click(within(dialog).getByText('Znalost angličtiny na komunikativní úrovni.'))

    const detail = await screen.findByRole('dialog', { name: 'Detail kritéria' })
    const textarea = within(detail).getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'Praxe v oboru')
    await user.click(within(detail).getByRole('button', { name: 'Vysoká' }))
    await user.click(within(detail).getByRole('button', { name: 'Uložit' }))

    expect(screen.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
    expect(within(dialog).getByText('Praxe v oboru')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Uložit' }))
    expect(onSave).toHaveBeenCalledWith([
      sampleEvaluationCriteria[0],
      { ...sampleEvaluationCriteria[1], text: 'Praxe v oboru', priority: 'high' },
    ])
  })

  it('blocks saving a criterion that violates EEO rules and shows an alert with a help link', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getByText('Znalost angličtiny na komunikativní úrovni.'))

    const detail = await screen.findByRole('dialog', { name: 'Detail kritéria' })
    const textarea = within(detail).getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, 'Hledáme muže')
    await user.click(within(detail).getByRole('button', { name: 'Uložit' }))

    expect(screen.getByRole('dialog', { name: 'Detail kritéria' })).toBeInTheDocument()
    expect(within(detail).getByRole('alert')).toHaveTextContent('nelze uložit')
    expect(within(detail).getByRole('link', { name: 'Zjistit víc' })).toHaveAttribute('href')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')

    await user.type(textarea, ' a ženu')
    expect(within(detail).queryByRole('alert')).not.toBeInTheDocument()
  })

  it('discards draft changes when cancelled', async () => {
    const user = userEvent.setup()
    render(
      <EvaluationCriteriaModal
        defaultOpen
        defaultCriteria={sampleEvaluationCriteria}
        trigger={<button type="button">Otevřít kritéria</button>}
      />,
    )
    const dialog = await screen.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })

    await user.click(within(dialog).getAllByRole('button', { name: 'Smazat kritérium' })[0])
    await user.click(within(dialog).getByRole('button', { name: 'Zrušit' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Otevřít kritéria' }))
    const reopened = await screen.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    expect(within(reopened).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
  })

  it('shows an empty state that can generate criteria or add one manually', async () => {
    const user = userEvent.setup()
    const dialog = await openModal({ defaultCriteria: [] })

    const empty = within(dialog).getByTestId('evaluation-criteria-empty')
    expect(
      within(empty).getByText('Zatím nemáte vytvořená kritéria pro hodnocení kandidátů'),
    ).toBeInTheDocument()
    expect(within(empty).getByText(/Kritéria určují, podle čeho se budou kandidáti hodnotit/)).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Přidat kritérium' })).not.toBeInTheDocument()
    // No footer in the pristine empty state, but the help link is present.
    expect(within(dialog).queryByRole('button', { name: 'Uložit' })).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Zrušit' })).not.toBeInTheDocument()
    expect(within(empty).getByRole('link', { name: 'nápovědě' })).toBeInTheDocument()

    await user.click(within(empty).getByRole('button', { name: 'Přidat kritérium ručně' }))
    const detail = await screen.findByRole('dialog', { name: 'Nové kritérium' })
    await user.click(within(detail).getByRole('button', { name: 'Zrušit' }))

    await user.click(within(empty).getByRole('button', { name: 'Vygenerovat z pozice' }))
    expect(within(dialog).queryByTestId('evaluation-criteria-empty')).not.toBeInTheDocument()
    expect(within(dialog).getAllByTestId('evaluation-criterion-row').length).toBeGreaterThan(0)
  })

  it('offers generating from the position in the footer once criteria exist', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()
    const rows = () => within(dialog).getAllByTestId('evaluation-criterion-row')
    const before = rows().length

    await user.click(within(dialog).getByRole('button', { name: 'Vygenerovat z pozice' }))
    // Generated sample criteria duplicate the existing ones, so nothing is added twice.
    expect(rows()).toHaveLength(before)
  })
})
