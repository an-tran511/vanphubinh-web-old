import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getPartners } from '@api/partner'
import { useSearchParams, useLocation } from 'react-router-dom'
import { List } from '@components/crud/list'
import { DataTable } from '@components/table'
import { removeLeadingTrailingSlashes } from '@utils/remove-leading-trailing-slash'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Drawer } from '@mantine/core'
import { PartnerCreate } from './create'
import { useDisclosure } from '@mantine/hooks'

export const PartnerList = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const resource = removeLeadingTrailingSlashes(location.pathname)
  const pageParam = Number(searchParams.get('page') ?? '1')
  const searchValueParam = searchParams.get('searchValue') ?? ''
  const [opened, { open, close }] = useDisclosure(false)

  const handleSetPage = (page: number) => {
    setSearchParams({ ['searchValue']: searchValue, ['page']: page.toString() }, { replace: true })
  }

  const onSearch = useDebouncedCallback((value: string) => {
    setSearchParams({ ['searchValue']: value, ['page']: '1' }, { replace: true })
  }, 500)

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: [resource, 'list', pageParam, searchValueParam],
    queryFn: () => getPartners({ page: pageParam, searchValue: searchValueParam }),
    placeholderData: keepPreviousData
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên'
    },
    {
      accessorKey: 'phone',
      header: 'Số điện thoại'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'address',
      header: 'Địa chỉ'
    }
  ]
  const partners = data?.data ?? []
  const meta = data?.meta

  return (
    <List
      title='Đối tác'
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
      onCreateHandler={open}
    >
      <DataTable data={partners} columns={columns} isLoading={isLoading} />
      <Drawer position='right' opened={opened} onClose={close} title='Tạo đối tác'>
        <PartnerCreate onClose={close} />
      </Drawer>
    </List>
  )
}
