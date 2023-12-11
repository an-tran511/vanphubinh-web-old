import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getItems } from '@api/item'
import { useSearchParams, useLocation } from 'react-router-dom'
import { List } from '@components/crud/list'
import { DataTable } from '@components/table'
import { removeLeadingTrailingSlashes } from '@utils/remove-leading-trailing-slash'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { ActionIcon, Group } from '@mantine/core'
import { EyeIcon, Pen, Trash } from 'lucide-react'

export const ItemList = () => {
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
    queryFn: () => getItems({ page: pageParam, searchValue: searchValueParam }),
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
    },
    {
      accessorKey: '',
      header: 'Hành động',
      cell: () => (
        <Group gap='xs'>
          <ActionIcon variant='light' size='sm'>
            <EyeIcon width='70%' height='70%' strokeWidth={1.5} />
          </ActionIcon>
          <ActionIcon variant='light' color='gray' size='sm'>
            <Pen width='70%' height='70%' strokeWidth={1.5} />
          </ActionIcon>
          <ActionIcon variant='light' color='red' size='sm'>
            <Trash width='70%' height='70%' strokeWidth={1.5} />
          </ActionIcon>
        </Group>
      )
    }
  ]
  const items = data?.data ?? []
  const meta = data?.meta

  return (
    <List
      title='Hàng hoá'
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
      <DataTable data={items} columns={columns} isLoading={isLoading} />
    </List>
  )
}
