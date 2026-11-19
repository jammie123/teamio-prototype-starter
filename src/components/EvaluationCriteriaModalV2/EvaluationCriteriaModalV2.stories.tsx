import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Modal, ModalBody, ModalClose, ModalContent } from '../Modal'
import { Table, TableBody } from '../Table'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import {
  sampleEvaluationCriteria,
  sampleGroupedEvaluationCriteria,
} from '../EvaluationCriteriaModal/fixtures'
import { CriteriaModalFooter } from './CriteriaModalFooter'
import { CriteriaModalHeader } from './CriteriaModalHeader'
import { CriteriaTableHead } from './CriteriaTableHead'
import { CriterionEditorRow } from './CriterionEditorRow'
import { CriterionRow } from './CriterionRow'
import { EvaluationCriteriaModalV2 } from './EvaluationCriteriaModalV2'

const meta = {
  id: 'ai-evaluation-evaluationcriteriamodal-v2',
  title: 'AI Evaluation/EvaluationCriteriaModal/V2',
  component: EvaluationCriteriaModalV2,
  // Docs stránka je v EvaluationCriteriaModalV2.mdx (autodocs by vytvořil duplicitní stránku).
  tags: ['!autodocs'],
  args: {
    defaultCriteria: sampleEvaluationCriteria,
    onSave: fn(),
  },
  parameters: {
    layout: 'padded',
    docs: {
      // Modal se renderuje v portálu přes celou stránku, proto každá ukázka běží v iframe.
      story: { inline: false, iframeHeight: 640 },
    },
  },
} satisfies Meta<typeof EvaluationCriteriaModalV2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Kritéria hodnocení</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Kritéria hodnocení' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Kritéria hodnocení kandidátů')
  },
}

/**
 * Jak se modal skládá. Statická ukázka bez stavu - přesně ty bloky, ze kterých
 * `EvaluationCriteriaModalV2` renderuje editor: hlavička, tabulka (hlavička + řádek ve čtení +
 * řádek v editaci), tlačítko „Přidat kritérium“ a patička. V záložce Show code je celé JSX.
 */
export const Composition: Story = {
  parameters: {
    controls: { disable: true },
    docs: { story: { inline: false, iframeHeight: 720 } },
  },
  render: () => (
    <Modal open>
      <ModalContent size="wide">
        <CriteriaModalHeader />
        <ModalClose aria-label={EVALUATION_CRITERIA_COPY.close} />
        <ModalBody className="tm-flex tm-flex-col tm-items-start tm-gap-2 tm-py-2">
          <div className="tm-w-full">
            <Table>
              <CriteriaTableHead />
              <TableBody>
                <CriterionRow criterion={sampleEvaluationCriteria[0]} isEditDisabled />
                <CriterionEditorRow
                  text={sampleEvaluationCriteria[1].text}
                  priority={sampleEvaluationCriteria[1].priority}
                />
              </TableBody>
            </Table>
          </div>
          <Button variant="tertiary" isDisabled>
            <Icon name="plus" />
            {EVALUATION_CRITERIA_COPY.add}
          </Button>
        </ModalBody>
        <CriteriaModalFooter isEditing />
      </ModalContent>
    </Modal>
  ),
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Kritéria hodnocení kandidátů',
    })
    await expect(within(dialog).getAllByTestId('evaluation-criterion-row')).toHaveLength(2)
    await expect(within(dialog).getByRole('button', { name: 'Uložit' })).toBeDisabled()
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const Empty: Story = {
  args: {
    defaultOpen: true,
    defaultCriteria: [],
  },
}

export const GeneratingCriteriaFromJd: Story = {
  name: 'generating criteria from JD',
  args: {
    defaultOpen: true,
    defaultCriteria: [],
    isGenerating: true,
  },
}

export const GeneratingFailedNoJd: Story = {
  name: 'generating failed - no JD',
  args: {
    defaultOpen: true,
    defaultCriteria: [],
    generationError: 'noJobDescription',
  },
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Kritéria hodnocení kandidátů',
    })
    const alert = within(dialog).getByRole('alert')
    await expect(alert).toHaveTextContent('Zatím nemáme dost informací k vytvoření kritérií')
    await expect(alert).toHaveTextContent('K nastavení kvalitních kritérií hodnocení')
  },
}

export const ReadOnly: Story = {
  args: {
    defaultOpen: true,
    readOnly: true,
    defaultCriteria: sampleGroupedEvaluationCriteria,
    onEvaluate: fn(),
    onEdit: fn(),
  },
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Kritéria hodnocení kandidátů',
    })
    await expect(within(dialog).getByText('Vysoká priorita')).toBeInTheDocument()
    await expect(within(dialog).getByText('Nižší priorita')).toBeInTheDocument()
    await expect(within(dialog).queryByRole('checkbox')).not.toBeInTheDocument()
  },
}

export const ReadOnlyEditSwitch: Story = {
  args: {
    ...ReadOnly.args,
  },
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Kritéria hodnocení kandidátů',
    })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Editovat kritéria' }))
    await expect(await within(dialog).findByRole('button', { name: 'Uložit' })).toBeInTheDocument()
  },
}

export const InlineEdit: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    await userEvent.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await expect(textarea).toHaveValue(sampleEvaluationCriteria[1].text)
    await expect(within(dialog).getByText('Úprava kritéria')).toBeInTheDocument()
    await expect(within(dialog).getByRole('button', { name: 'Hotovo' })).toBeInTheDocument()
    await userEvent.hover(within(dialog).getByTestId('evaluation-save-tooltip-trigger'))
    await expect(await body.findByRole('tooltip')).toHaveTextContent(
      'Nejdřív dokončete úpravu kritéria.',
    )
    await expect(body.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
  },
}

export const EeoViolation: Story = {
  args: {
    defaultOpen: true,
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Kritéria hodnocení kandidátů' })
    await userEvent.click(within(dialog).getAllByRole('button', { name: 'Upravit kritérium' })[1])
    const textarea = within(dialog).getByRole('textbox', { name: 'Kritérium' })
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Hledáme muže do týmu')
    const row = within(dialog).getAllByTestId('evaluation-criterion-row')[1]
    await userEvent.click(within(row).getByRole('button', { name: 'Hotovo' }))
    await expect(await within(dialog).findByRole('alert')).toHaveTextContent('nelze uložit')
    await expect(body.queryByRole('dialog', { name: 'Detail kritéria' })).not.toBeInTheDocument()
  },
}
