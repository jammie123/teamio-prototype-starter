import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  sampleEvaluationCriteria,
  sampleGroupedEvaluationCriteria,
} from '../EvaluationCriteriaModal/fixtures'
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
    expect(rowButtons[0]).toHaveAccessibleName('Hotovo')
    expect(rowButtons[1]).toHaveAccessibleName('Zrušit')
    expect(rowButtons.at(-1)).toHaveAccessibleName('Smazat kritérium')
    expect(within(row).queryByRole('button', { name: 'Uložit' })).not.toBeInTheDocument()
    expect(within(row).getByText('Úprava kritéria')).toBeInTheDocument()
    expect(row).toHaveClass('tm-bg-cover-light')
    expect(screen.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
  })

  it('disables the footer save with a hint and blocks a second edit while a row is being edited', async () => {
    const user = userEvent.setup()
    const dialog = await openModal()

    // No edit: save is active and sits next to cancel.
    expect(footerButton(dialog, 'Uložit')).toBeEnabled()
    expect(footerButton(dialog, 'Zrušit')).toBeEnabled()
    for (const pencil of within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })) {
      expect(pencil).toBeEnabled()
    }
    await user.hover(screen.getByTestId('evaluation-save-tooltip-trigger'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])

    expect(footerButton(dialog, 'Uložit')).toBeDisabled()
    // The hint is a tooltip on the disabled save button, not inline text.
    expect(within(dialog).queryByText('Nejdřív dokončete úpravu kritéria.')).not.toBeInTheDocument()
    await user.hover(screen.getByTestId('evaluation-save-tooltip-trigger'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Nejdřív dokončete úpravu kritéria.')
    // The footer "Zrušit" is hidden; the only "Zrušit" left lives inside the editor row.
    expect(() => footerButton(dialog, 'Zrušit')).toThrow()
    const otherPencils = within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })
    expect(otherPencils).toHaveLength(1)
    expect(otherPencils[0]).toBeDisabled()
    expect(within(dialog).getByRole('button', { name: 'Přidat kritérium' })).toBeDisabled()

    await user.click(otherPencils[0])
    expect(within(dialog).getAllByRole('textbox')).toHaveLength(1)

    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Hotovo' }))

    expect(footerButton(dialog, 'Uložit')).toBeEnabled()
    expect(footerButton(dialog, 'Zrušit')).toBeEnabled()
    await user.hover(screen.getByTestId('evaluation-save-tooltip-trigger'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Přidat kritérium' })).toBeEnabled()
    for (const pencil of within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })) {
      expect(pencil).toBeEnabled()
    }
  })

  it('keeps an empty criterion from being saved', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const dialog = await openModal({ onSave })

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await user.clear(textarea)

    expect(within(editorRow(dialog)).getByRole('button', { name: 'Hotovo' })).toBeDisabled()
    expect(footerButton(dialog, 'Uložit')).toBeDisabled()
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
    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Hotovo' }))

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
    expect(within(editorRow(dialog)).getByRole('button', { name: 'Hotovo' })).toBeDisabled()
    expect(within(dialog).getAllByRole('button', { name: 'Smazat kritérium' })).toHaveLength(2)

    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Zrušit' }))
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
    expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Přidat kritérium' }))
    await user.type(within(dialog).getByRole('textbox', { name: 'Kritérium' }), 'Řidičský průkaz skupiny B')
    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Hotovo' }))

    expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()
    expect(within(dialog).getByText('Řidičský průkaz skupiny B')).toBeInTheDocument()
    expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(3)
  })

  it('moves a finished edit into the draft with "Hotovo" and persists it with the footer save', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const dialog = await openModal({ onSave })

    await user.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await user.clear(textarea)
    await user.type(textarea, 'Praxe v oboru')
    const priority = within(dialog).getAllByRole('group', { name: 'Priorita' })[1]
    await user.click(within(priority).getByRole('button', { name: 'Vysoká' }))
    await user.click(within(editorRow(dialog)).getByRole('button', { name: 'Hotovo' }))
    await user.click(footerButton(dialog, 'Uložit'))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onSave).toHaveBeenCalledWith([
      sampleEvaluationCriteria[0],
      { ...sampleEvaluationCriteria[1], text: 'Praxe v oboru', priority: 'high' },
    ])
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

  it('shows a generating-from-JD state with a loading primary action', async () => {
    const dialog = await openModal({ defaultCriteria: [], isGenerating: true })

    const generating = within(dialog).getByTestId('evaluation-criteria-generating')
    expect(within(generating).getByText('Navrhuji kritéria z inzerátu')).toBeInTheDocument()
    const loadingButton = within(generating).getByRole('button', { name: 'Generujeme kritéria…' })
    expect(loadingButton).toBeDisabled()
    expect(loadingButton).toHaveAttribute('aria-busy', 'true')
    expect(within(dialog).queryByTestId('evaluation-criteria-empty')).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Uložit' })).not.toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Zrušit' })).not.toBeInTheDocument()
  })

  it('shows the "no JD" generation error under the empty-state buttons', async () => {
    const dialog = await openModal({ defaultCriteria: [], generationError: 'noJobDescription' })

    const empty = within(dialog).getByTestId('evaluation-criteria-empty')
    const error = within(empty).getByTestId('evaluation-criteria-empty-error')
    expect(within(error).getByRole('alert')).toHaveTextContent(
      'Zatím nemáme dost informací k vytvoření kritérií',
    )
    expect(within(error).getByRole('alert')).toHaveTextContent(
      'K nastavení kvalitních kritérií hodnocení potřebujeme víc informací o pozici a náboru. Doplňte je a kritéria vygenerujeme nebo vytvořte kritéria ručně.',
    )
    // Under the buttons, and the buttons stay usable.
    const addButton = within(empty).getByRole('button', { name: 'Přidat kritérium ručně' })
    expect(addButton.compareDocumentPosition(error) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(empty).getByRole('button', { name: 'Vygenerovat z pozice' })).toBeEnabled()
  })

  it('shows no generation error by default', async () => {
    const dialog = await openModal({ defaultCriteria: [] })

    expect(within(dialog).queryByTestId('evaluation-criteria-empty-error')).not.toBeInTheDocument()
  })

  describe('readOnly', () => {
    it('groups criteria by priority, high first, with counts and no checks or editing controls', async () => {
      const dialog = await openModal({
        readOnly: true,
        defaultCriteria: sampleGroupedEvaluationCriteria,
      })

      const groups = within(dialog).getAllByTestId('evaluation-criteria-group')
      expect(groups).toHaveLength(2)
      expect(within(groups[0]).getByText('Vysoká priorita')).toBeInTheDocument()
      expect(within(groups[0]).getByText('5 kritérií')).toBeInTheDocument()
      expect(within(groups[1]).getByText('Nižší priorita')).toBeInTheDocument()
      expect(within(groups[1]).getByText('5 kritérií')).toBeInTheDocument()

      expect(within(dialog).queryByRole('checkbox')).not.toBeInTheDocument()
      expect(within(dialog).queryByRole('table')).not.toBeInTheDocument()
      expect(within(dialog).queryByRole('group', { name: 'Priorita' })).not.toBeInTheDocument()
      expect(within(dialog).queryByRole('button', { name: 'Upravit kritérium' })).not.toBeInTheDocument()
      expect(within(dialog).queryByRole('button', { name: 'Uložit' })).not.toBeInTheDocument()
    })

    it('calls onEvaluate and closes from the primary action', async () => {
      const user = userEvent.setup()
      const onEvaluate = vi.fn()
      const onOpenChange = vi.fn()
      const dialog = await openModal({ readOnly: true, onEvaluate, onOpenChange })

      await user.click(within(dialog).getByRole('button', { name: 'Ohodnotit kandidáty' }))

      expect(onEvaluate).toHaveBeenCalledTimes(1)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('switches to the editor and calls onEdit from the secondary action', async () => {
      const user = userEvent.setup()
      const onEdit = vi.fn()
      const dialog = await openModal({ readOnly: true, onEdit })

      await user.click(within(dialog).getByRole('button', { name: 'Editovat kritéria' }))

      expect(onEdit).toHaveBeenCalledTimes(1)
      expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
      expect(within(dialog).getByRole('button', { name: 'Uložit' })).toBeInTheDocument()
      expect(within(dialog).queryByRole('button', { name: 'Ohodnotit kandidáty' })).not.toBeInTheDocument()
    })

    it('falls back to the empty state when there are no criteria', async () => {
      const dialog = await openModal({ readOnly: true, defaultCriteria: [] })

      expect(within(dialog).getByTestId('evaluation-criteria-empty')).toBeInTheDocument()
      expect(within(dialog).queryByRole('button', { name: 'Ohodnotit kandidáty' })).not.toBeInTheDocument()
    })
  })
})
