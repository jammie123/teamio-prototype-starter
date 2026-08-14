import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

const meta = {
  title: 'Components/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  ['Anna Nováková', 'Frontend vývojář', 'Nový', 'Praha'],
  ['Petr Svoboda', 'Produktový manažer', 'Pohovor', 'Brno'],
  ['Eva Dvořáková', 'Recruiter', 'Nabídka', 'Ostrava'],
  ['Tomáš Horák', 'QA specialista', 'Zamítnuto', 'Plzeň'],
]

export const Default: Story = {
  render: () => (
    <Table aria-label="Uchazeči">
      <TableHead>
        <TableRow>
          <TableHeader>Jméno</TableHeader>
          <TableHeader>Pozice</TableHeader>
          <TableHeader>Stav</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.slice(0, 2).map(([name, role, status]) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>{role}</TableCell>
            <TableCell>{status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const ResponsiveOverflow: Story = {
  render: () => (
    <div className="tm-max-w-xs tm-border tm-border-secondary tm-rounded tm-p-2">
      <Table aria-label="Široká tabulka uchazečů">
        <TableHead>
          <TableRow>
            <TableHeader>Jméno</TableHeader>
            <TableHeader>Pozice</TableHeader>
            <TableHeader>Stav</TableHeader>
            <TableHeader>Lokalita</TableHeader>
            <TableHeader>Poznámka</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([name, role, status, city]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>{role}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>{city}</TableCell>
              <TableCell>Poslední kontakt tento týden</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}
