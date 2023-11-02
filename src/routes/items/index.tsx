import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getItems } from '@api/item'
import { useSearchParams, useLocation } from 'react-router-dom'
import { List } from '@components/crud/list'
import { DataTable } from '@components/table'
import { removeLeadingTrailingSlashes } from '@utils/remove-leading-trailing-slash'
import { useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'

export const ItemList = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [value] = useState('')
  const [debouncedValue] = useDebouncedValue(value, 200)

  const resource = removeLeadingTrailingSlashes(location.pathname)
  const [page, setPage] = useState(Number.parseInt(searchParams.get('page') ?? '1'))

  const handleSetPage = (page: number) => {
    setPage(page)
    setSearchParams({ ['page']: page.toString() })
  }
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [resource, 'list', page, debouncedValue],
    queryFn: () => getItems({ page }),
    placeholderData: keepPreviousData
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên'
    },
    {
      accessorKey: 'uom.name',
      header: 'Đơn vị chính'
    },
    {
      accessorKey: 'secondaryUom.name',
      header: 'Đơn vị phụ'
    },
    {
      accessorKey: 'purchaseUom.name',
      header: 'Đơn vị mua hàng'
    }
  ]
  const items = data?.data ?? []

  return (
    <List
      title='Sản phẩm'
      isPlaceholderData={isPlaceholderData}
      pagination={{
        page: data?.meta?.currentPage ?? 0,
        lastPage: data?.meta?.lastPage ?? 0,
        onPageChange: handleSetPage
      }}
    >
      <DataTable data={items} columns={columns} isLoading={isLoading} />
    </List>
  )
}
