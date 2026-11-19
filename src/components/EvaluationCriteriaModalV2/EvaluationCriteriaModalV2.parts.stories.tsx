import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Modal, ModalContent, ModalTitle } from '../Modal'
import { Table, TableBody } from '../Table'
import { sampleEvaluationCriteria } from '../EvaluationCriteriaModal/fixtures'
import type { EvaluationCriterionPriority } from '../EvaluationCriteriaModal/types'
import { CriteriaModalFooter } from './CriteriaModalFooter'
import { CriteriaModalHeader } from './CriteriaModalHeader'
import { CriteriaTableHead } from './CriteriaTableHead'
import { CriterionEditorRow } from './CriterionEditorRow'
import { CriterionRow } from './CriterionRow'

/**
 * Stavební bloky `EvaluationCriteriaModalV2`. Každý je samostatná komponenta; modal je jen skládá
 * dohromady a drží stav (draft, otevřený editor). Celek viz story `Composition` u modalu.
 */
const meta = {
  id: 'ai-evaluation-evaluationcriteriamodal-v2-parts',
  title: 'AI Evaluation/EvaluationCriteriaModal/V2 Parts',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** Řádky tabulky patří do `Table` > `TableBody`. */
function TableFrame({ head = false, children }: { head?: boolean; children?: ReactNode }) {
  return (
    <Table>
      {head ? <CriteriaTableHead /> : null}
      <TableBody>{children}</TableBody>
    </Table>
  )
}

/** Footer a hlavička používají `ModalClose` / `ModalTitle`, proto potřebují kontext `Modal`. */
function ModalFrame({ children, withTitle = true }: { children: ReactNode; withTitle?: boolean }) {
  return (
    <Modal open>
      <ModalContent size="wide">
        {withTitle ? (
          <div className="tm-sr-only">
            <ModalTitle>Ukázka</ModalTitle>
          </div>
        ) : null}
        {children}
      </ModalContent>
    </Modal>
  )
}

const modalDocs = { story: { inline: false, iframeHeight: 360 } }

export const Header: Story = {
  name: 'CriteriaModalHeader',
  parameters: { docs: modalDocs },
  render: () => (
    <ModalFrame withTitle={false}>
      <CriteriaModalHeader />
    </ModalFrame>
  ),
}

export const TableHead: Story = {
  name: 'CriteriaTableHead',
  render: () => (
    <Table>
      <CriteriaTableHead />
    </Table>
  ),
}

export const ReadRow: Story = {
  name: 'CriterionRow',
  args: {
    criterion: sampleEvaluationCriteria[0],
    onEdit: fn(),
    onDelete: fn(),
    onPriorityChange: fn(),
  },
  render: (args) => (
    <TableFrame>
      <CriterionRow {...(args as Parameters<typeof CriterionRow>[0])} />
    </TableFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Upravit kritérium' }))
    await expect(args.onEdit).toHaveBeenCalledTimes(1)
  },
}

export const ReadRowEditDisabled: Story = {
  name: 'CriterionRow - editing another row',
  args: { ...ReadRow.args, isEditDisabled: true },
  render: ReadRow.render,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Upravit kritérium' }),
    ).toBeDisabled()
  },
}

function EditorRowDemo({
  initialText,
  initialPriority = 'low',
  isNew = false,
  hasEeoError = false,
}: {
  initialText: string
  initialPriority?: EvaluationCriterionPriority
  isNew?: boolean
  hasEeoError?: boolean
}) {
  const [text, setText] = useState(initialText)
  const [priority, setPriority] = useState<EvaluationCriterionPriority>(initialPriority)
  return (
    <TableFrame>
      <CriterionEditorRow
        text={text}
        priority={priority}
        isNew={isNew}
        hasEeoError={hasEeoError}
        onTextChange={setText}
        onPriorityChange={setPriority}
        onDone={fn()}
        onCancel={fn()}
        onDelete={fn()}
      />
    </TableFrame>
  )
}

export const EditorRow: Story = {
  name: 'CriterionEditorRow',
  render: () => <EditorRowDemo initialText={sampleEvaluationCriteria[1].text} />,
}

export const EditorRowNew: Story = {
  name: 'CriterionEditorRow - new (no delete)',
  render: () => <EditorRowDemo initialText="" isNew />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Hotovo' })).toBeDisabled()
    await expect(canvas.queryByRole('button', { name: 'Smazat kritérium' })).not.toBeInTheDocument()
  },
}

export const EditorRowEeoError: Story = {
  name: 'CriterionEditorRow - EEO error',
  render: () => <EditorRowDemo initialText="Hledáme muže do týmu" hasEeoError />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('nelze uložit')
  },
}

export const Footer: Story = {
  name: 'CriteriaModalFooter',
  parameters: { docs: modalDocs },
  args: { onSave: fn(), onGenerate: fn() },
  render: (args) => (
    <ModalFrame>
      <CriteriaModalFooter {...(args as Parameters<typeof CriteriaModalFooter>[0])} />
    </ModalFrame>
  ),
}

export const FooterWhileEditing: Story = {
  name: 'CriteriaModalFooter - editing a row',
  parameters: { docs: modalDocs },
  args: { isEditing: true },
  render: Footer.render,
}
