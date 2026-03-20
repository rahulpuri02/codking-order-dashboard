import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  formatCurrency,
  riskLevelOptions,
  orderStatusOptions,
} from '../data/data'
import { type Order } from '../data/schema'

const riskBadgeColors: Record<string, string> = {
  'High Risk':
    'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  'Medium Risk':
    'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
  Safe: 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
}

export const ordersColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'order_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order ID' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('order_id')}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'order_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order Value' />
    ),
    cell: ({ row }) => formatCurrency(row.getValue('order_value')),
  },
  {
    accessorKey: 'risk_score',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Risk Score' />
    ),
    cell: ({ row }) => {
      const score = row.getValue('risk_score') as number
      return <span className='font-mono'>{score}%</span>
    },
  },
  {
    accessorKey: 'risk_level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const level = row.getValue('risk_level') as string
      const option = riskLevelOptions.find((o) => o.value === level)
      return (
        <Badge
          variant='secondary'
          className={cn('gap-1', riskBadgeColors[level])}
        >
          {option?.icon && <option.icon className='size-3' />}
          {level}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'order_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('order_status') as string
      const option = orderStatusOptions.find((o) => o.value === status)
      return <span>{option?.label ?? status}</span>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
]
