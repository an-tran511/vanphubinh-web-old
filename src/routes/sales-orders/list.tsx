import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getSalesOrders } from '@/api/sales-order'
import { useSearchParams, useLocation } from 'react-router-dom'
import { List } from '@components/crud/list'
import { DataTable } from '@components/table'
import { removeLeadingTrailingSlashes } from '@utils/remove-leading-trailing-slash'
import { useState } from 'react'
import { Badge } from '@mantine/core'
import { ESalesOrderStatus } from '@utils/enums'
import { useDebouncedCallback } from 'use-debounce'

export const SalesOrderList = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const resource = removeLeadingTrailingSlashes(location.pathname)
  const pageParam = Number(searchParams.get('page') ?? '1')
  const searchValueParam = searchParams.get('searchValue') ?? ''

  const handleSetPage = (page: number) => {
    setSearchParams({ ['searchValue']: searchValue, ['page']: page.toString() }, { replace: true })
  }

  const onSearch = useDebouncedCallback((value: string) => {
    setSearchParams({ ['searchValue']: value, ['page']: '1' }, { replace: true })
  }, 500)

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [resource, 'list', pageParam, searchValueParam],
    queryFn: () => getSalesOrders({ page: pageParam, searchValue: searchValueParam }),
    placeholderData: keepPreviousData
  })

  const columns = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Mã đơn'
    },
    {
      id: 'customer',
      accessorKey: 'customer.name',
      header: 'Khách hàng'
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: (row) => {
        const value = row.getValue()
        switch (value) {
          case ESalesOrderStatus.DRAFT:
            return <Badge variant='light'>Bản nháp</Badge>
          case ESalesOrderStatus.CONFIRMED:
            return (
              <Badge color='green' variant='light'>
                Xác nhận
              </Badge>
            )
          default:
            return (
              <Badge color='gray' variant='light'>
                Đã huỷ
              </Badge>
            )
        }
      }
    },
    {
      id: 'actions',
      header: '',
      accessorKey: 'id'
      // cell: ({ getValue }) => (
      //   <Group gap='5'>
      //     <Button>Hello</Button>
      //   </Group>
      // )
    }
  ]
  const salesOrders = data?.data ?? []
  const meta = data?.meta

  return (
    <List
      title='Sản phẩm'
      isPlaceholderData={isPlaceholderData}
      pagination={{
        page: meta?.currentPage ?? 0,
        lastPage: meta?.lastPage ?? 0,
        onPageChange: handleSetPage
      }}
      searchValue={searchValue}
      onChangeHandler={(event) => {
        const { value } = event.currentTarget
        setSearchValue(value)
        onSearch(value)
      }}
    >
      <DataTable data={salesOrders} columns={columns} isLoading={isLoading} />
    </List>
  )
}
