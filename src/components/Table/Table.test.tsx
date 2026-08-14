import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

describe('Table', () => {
  it('renders a responsive overflow wrapper around the table', () => {
    const { container } = render(
      <Table aria-label="Uchazeči">
        <TableHead>
          <TableRow>
            <TableHeader>Jméno</TableHeader>
            <TableHeader>Stav</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Anna Nováková</TableCell>
            <TableCell>Nový</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const wrapper = container.firstElementChild
    expect(wrapper).toHaveClass('tm-w-full', 'tm-overflow-x-auto')
    expect(screen.getByRole('table', { name: 'Uchazeči' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Jméno' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Anna Nováková' })).toBeInTheDocument()
  })

  it('applies baseline visual classes to table parts', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Hlava</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Buňka</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByRole('table')).toHaveClass('tm-w-full', 'tm-text-left', 'tm-text-base')
    expect(screen.getByRole('columnheader')).toHaveClass(
      'tm-px-3',
      'tm-py-2',
      'tm-font-semibold',
      'tm-border-b',
      'tm-border-secondary',
    )
    expect(screen.getByRole('cell')).toHaveClass(
      'tm-px-3',
      'tm-py-2',
      'tm-border-b',
      'tm-border-secondary',
    )
  })

  it('marks header cells as column scope by default and allows an override', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Jméno</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableHeader scope="row">Anna Nováková</TableHeader>
            <TableCell>Nový</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByRole('columnheader', { name: 'Jméno' })).toHaveAttribute('scope', 'col')
    expect(screen.getByRole('rowheader', { name: 'Anna Nováková' })).toHaveAttribute('scope', 'row')
  })
})
