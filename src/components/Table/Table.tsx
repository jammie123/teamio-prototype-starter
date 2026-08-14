import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'

export interface TableProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLTableElement>, 'color'> {}

export interface TableSectionProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLTableSectionElement>, 'color'> {}

export interface TableRowProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLTableRowElement>, 'color'> {}

export interface TableHeaderProps
  extends StyleProps,
    ChildrenProps,
    Omit<ThHTMLAttributes<HTMLTableCellElement>, 'color'> {}

export interface TableCellProps
  extends StyleProps,
    ChildrenProps,
    Omit<TdHTMLAttributes<HTMLTableCellElement>, 'color'> {}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, children, ...rest },
  ref,
) {
  return (
    <div className={cn('tm-w-full', 'tm-overflow-x-auto')}>
      <table
        ref={ref}
        className={cn(
          'tm-w-full',
          'tm-border-collapse',
          'tm-text-left',
          'tm-text-base',
          'tm-font-poppins',
          'tm-text-primary-default',
          className,
        )}
        {...rest}
      >
        {children}
      </table>
    </div>
  )
})

Table.displayName = 'Table'

export const TableHead = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  function TableHead({ className, children, ...rest }, ref) {
    return (
      <thead ref={ref} className={cn('tm-bg-cover-light', className)} {...rest}>
        {children}
      </thead>
    )
  },
)

TableHead.displayName = 'TableHead'

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  function TableBody({ className, children, ...rest }, ref) {
    return (
      <tbody ref={ref} className={cn(className)} {...rest}>
        {children}
      </tbody>
    )
  },
)

TableBody.displayName = 'TableBody'

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, children, ...rest },
  ref,
) {
  return (
    <tr ref={ref} className={cn(className)} {...rest}>
      {children}
    </tr>
  )
})

TableRow.displayName = 'TableRow'

export const TableHeader = forwardRef<HTMLTableCellElement, TableHeaderProps>(
  function TableHeader({ className, children, scope = 'col', ...rest }, ref) {
    return (
      <th
        ref={ref}
        scope={scope}
        className={cn(
          'tm-px-3',
          'tm-py-2',
          'tm-font-semibold',
          'tm-border-b',
          'tm-border-secondary',
          'tm-whitespace-nowrap',
          className,
        )}
        {...rest}
      >
        {children}
      </th>
    )
  },
)

TableHeader.displayName = 'TableHeader'

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, children, ...rest },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn(
        'tm-px-3',
        'tm-py-2',
        'tm-border-b',
        'tm-border-secondary',
        className,
      )}
      {...rest}
    >
      {children}
    </td>
  )
})

TableCell.displayName = 'TableCell'
