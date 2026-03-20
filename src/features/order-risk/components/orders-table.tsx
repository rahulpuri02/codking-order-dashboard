import { useMemo, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { riskLevelOptions, orderStatusOptions } from '../data/data'
import { type Order } from '../data/schema'
import { ordersColumns as columns } from './orders-columns'

interface OrdersTableProps {
  data: Order[]
  onRowClick?: (order: Order) => void
}

export function OrdersTable({ data, onRowClick }: OrdersTableProps) {
  const search = useSearch({ from: '/_authenticated/order-risk/' })
  const navigate = useNavigate({ from: '/order-risk' })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
  } = useTableUrlState({
    search,
    navigate,
    globalFilter: { key: 'filter' },
    columnFilters: [
      { columnId: 'city', searchKey: 'city', type: 'array' },
      { columnId: 'order_status', searchKey: 'order_status', type: 'array' },
      { columnId: 'risk_level', searchKey: 'risk_level', type: 'array' },
    ],
  })

  const cityOptions = useMemo(() => {
    const cities = [...new Set(data.map((o) => o.city))].sort()
    return cities.map((city) => ({ value: city, label: city }))
  }, [data])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: onGlobalFilterChange,
    onPaginationChange: onPaginationChange,
    globalFilterFn: (row, _columnId, filterValue) => {
      const s = String(filterValue).toLowerCase()
      const orderId = String(row.getValue('order_id')).toLowerCase()
      const customer = String(row.getValue('customer')).toLowerCase()
      const phone = String(row.getValue('phone')).toLowerCase()
      return orderId.includes(s) || customer.includes(s) || phone.includes(s)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search by order ID, customer or phone...'
        filters={[
          {
            columnId: 'city',
            title: 'City',
            options: cityOptions,
          },
          {
            columnId: 'order_status',
            title: 'Order Status',
            options: orderStatusOptions,
          },
          {
            columnId: 'risk_level',
            title: 'Risk Level',
            options: riskLevelOptions,
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table className='min-w-2xl'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(onRowClick && 'cursor-pointer')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-48 text-center'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-lg font-medium'>No orders found</span>
                    <span className='text-sm text-muted-foreground'>
                      Try adjusting your search or filter criteria.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
