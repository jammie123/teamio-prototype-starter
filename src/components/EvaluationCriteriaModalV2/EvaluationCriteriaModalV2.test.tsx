import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { sampleEvaluationCriteria } from '../EvaluationCriteriaModal/fixtures'
import { EvaluationCriteriaModalV2 } from './EvaluationCriteriaModalV2'

async function openModal(props: Partial<Parameters<typeof EvaluationCriteriaModalV2>[0]> = {}) {
  render(
    <EvaluationCriteriaModalV2 defaultOpen defaultCriteria={sampleEvaluationCriteria} {...props} />,
  )
  return screen.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
}

function editorRow(dialog: HTMLElement) {
  const row = within(dialog)
    .getAllByTestId('evaluation-criterion-row')
    .find((item) => within(item).queryByRole('textbox'))
  if (!row) throw new Error('editor row not found')
  return row
}

function footerButton(dialog: HTMLElement, name: string) {
  const button = within(dialog)
    .getAllByRole('button', { name })
    .find((item) => !item.closest('[data-testid="evaluation-criterion-row"]'))
  if (!button) throw new Error(`footer button ${name} not found`)
  return button
}

describe('EvaluationCriteriaModalV2', () => {
  it('renders the criteria table without opening a detail dialog from a row click', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
    await user.click(within(dialog).getByText('Znalost angličtiny na komunikativní úrovni.'))

    expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
  })

  it('edits a criterion in the row and does not open a second dialog', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])

    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    const row = editorRow(dialog)
    const rowButtons = within(row).getAllByRole('button')
    expect(textarea).toHaveValue(sampleEvaluationCriteria[1].text)
    expect(textarea).toHaveFocus()
    expect(textarea.closest('td')).toHaveAttribute('colspan', '3')
    expect(rowButtons[0]).toHaveAccessibleName('Uložit')
    expect(rowButtons[1]).toHaveAccessibleName('Zrušit')
    expect(rowButtons.at(-1)).toHaveAccessibleName('Smazat kritérium')
    expect(screen.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
  })

  it('keeps an empty criterion from being saved', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const dialog = await openModal({ onSave })

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await user.clear(textarea)

    expect(within(editorRow(dialog)).getByRole('button', { name: 'Uložit' })).toBeDisabled()
    await user.click(footerButton(dialog, 'Uložit'))

    expect(onSave).not.toHaveBeenCalled()
    expect(dialog).toBeInTheDocument()
    expect(textarea).toHaveValue('')
  })

  it('blocks an EEO violation in the row and clears the alert while typing', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const dialog = await openModal({ onSave })

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await user.clear(textarea)
    await user.type(textarea, 'Hledáme muže')
    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Uložit' }))

    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(within(dialog).getByRole('alert')).toHaveTextContent('nelze uložit')
    expect(within(dialog).getByRole('link', { name: 'Zjistit víc' })).toHaveAttribute('href')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveValue('Hledáme muže')

    await user.click(footerButton(dialog, 'Uložit'))
    expect(onSave).not.toHaveBeenCalled()
    expect(dialog).toBeInTheDocument()

    await user.type(textarea, ' a ženu')
    expect(within(dialog).queryByRole('alert')).not.toBeInTheDocument()
  })

  it('adds a criterion inline and discards it when the row edit is cancelled', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getByRole('button', { name: 'Přidat kritérium' }))
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(3)
    expect(screen.queryByRole('dialog', { name: 'Nové kritérium' })).not.toBeInTheDocument()
    expect(within(editorRow(dialog)).getByRole('button', { name: 'Uložit' })).toBeDisabled()
    expect(within(dialog).getAllByRole('button', { name: 'Smazat kritérium' })).toHaveLength(2)

    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Zrušit' }))
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
    expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Přidat kritérium' }))
    await user.type(within(dialog).getByRole('textbox', { name: 'Kritérium' }), 'Řidičský průkaz skupiny B')
    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Uložit' }))

    expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()
    expect(within(dialog).getByText('Řidičský průkaz skupiny B')).toBeInTheDocument()
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(3)
  })

  it('commits a valid open edit when the list is saved', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const dialog = await openModal({ onSave })

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await user.clear(textarea)
    await user.type(textarea, 'Praxe v oboru')
    const priority = within(dialog).getAllByRole('group', { name: 'Priorita' })[1]
    await user.click(within(priority).getByRole('button', { name: 'Vysoká' }))
    await user.click(footerButton(dialog, 'Uložit'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onSave).toHaveBeenCalledWith([
      sampleEvaluationCriteria[0],
      { ...sampleEvaluationCriteria[1], text: 'Praxe v oboru', priority: 'high' },
    ])
  })

  it('does not switch rows while an edit is unsaved, and shows an EEO error when that text is invalid', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await user.type(textarea, ' navíc')
    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[0])

    expect(textarea).toHaveValue(`${sampleEvaluationCriteria[1].text} navíc`)
    expect(within(dialog).getByText(sampleEvaluationCriteria[0].text)).toBeInTheDocument()

    await user.clear(textarea)
    await user.type(textarea, 'Hledáme muže')
    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[0])

    expect(textarea).toHaveValue('Hledáme muže')
    expect(within(dialog).getByRole('alert')).toHaveTextContent('nelze uložit')
  })

  it('switches from an untouched editor to another row', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getByRole('button', { name: 'Přidat kritérium' }))
    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[0])

    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
    expect(within(dialog).getByRole('textbox', { name: 'Kritérium' })).toHaveValue(
      sampleEvaluationCriteria[0].text,
    )
  })

  it('restores the original text and priority when the row edit is cancelled', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()
    const priority = () => within(dialog).getAllByRole('group', { name: 'Priorita' })[1]

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await user.clear(textarea)
    await user.type(textarea, 'Dočasný text')
    await user.click(within(priority()).getByRole('button', { name: 'Vysoká' }))
    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Zrušit' }))

    expect(within(dialog).getByText(sampleEvaluationCriteria[1].text)).toBeInTheDocument()
    expect(within(priority()).getByRole('button', { name: 'Vysoká' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(within(priority()).getByRole('button', { name: 'Nižší' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('cancels the open row edit on Escape and leaves the dialog open', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    await user.keyboard('{Escape}')

    expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText(sampleEvaluationCriteria[1].text)).toBeInTheDocument()
  })

  it('deletes a criterion from the row, including while it is being edited', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    await user.click(within(dialog).getAllByRole('button', { name: 'Smazat kritérium' })[1])

    expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(1)
    expect(within(dialog).queryByText(sampleEvaluationCriteria[1].text)).not.toBeInTheDocument()
  })

  it('discards draft changes when the dialog is cancelled', async () => {
    const user = userEvent.setup()
    render(
      <EvaluationCriteriaModalV2
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

  it('shows an empty state that can generate criteria or add one inline', async () => {
    const user = userEvent.setup()
    const dialog = await openModal({ defaultCriteria: [] })

    const empty = within(dialog).getByTestId('evaluation-criteria-empty')
    expect(within(dialog).queryByRole('button', { name: 'Uložit' })).not.toBeInTheDocument()

    await user.click(within(empty).getByRole('button', { name: 'Přidat kritérium ručně' }))
    expect(within(dialog).queryByTestId('evaluation-criteria-empty')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Nové kritérium' })).not.toBeInTheDocument()
    expect(within(dialog).getByRole('textbox', { name: 'Kritérium' })).toHaveValue('')

    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Zrušit' }))
    expect(within(dialog).getByTestId('evaluation-criteria-empty')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Uložit' })).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Vygenerovat z pozice' }))
    expect(within(dialog).queryByTestId('evaluation-criteria-empty')).not.toBeInTheDocument()
    expect(within(dialog).getAllByTestId('evaluation-criterion-row').length).toBeGreaterThan(0)
  })

  it('does not add duplicate criteria when generating from the position', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()
    const before = within(dialog).getAllByTestId('evaluation-criterion-row').length

    await user.click(within(dialog).getByRole('button', { name: 'Vygenerovat z pozice' }))

    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(before)
  })
})
