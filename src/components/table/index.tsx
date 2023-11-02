import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Center, LoadingOverlay, Table } from '@mantine/core'

import classes from './Table.module.css'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isPlaceholderData?: boolean
}

export const DataTable = <TData, TValue>({ columns, data, isLoading }: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0
      }
    },
    manualPagination: true
  })
  return (
    <>
      <Table.ScrollContainer minWidth={300}>
        <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
        <Table verticalSpacing='sm' style={{}}>
          <Table.Thead className={classes.header}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.Th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Th>
                  )
                })}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody pos='relative'>
            {isLoading ? (
              <></>
            ) : table.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Table.Tr key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr h='50vh'>
                <Table.Td colSpan={columns.length}>
                  <Center>Không có kết quả</Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  )
}
