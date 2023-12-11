import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { List } from '@components/crud/list'
import { DataTable } from '@components/table'
import { removeLeadingTrailingSlashes } from '@utils/remove-leading-trailing-slash'
import { getCategories } from '@/api/category'
import { EyeIcon, Pen, Trash } from 'lucide-react'
import { ActionIcon, Group } from '@mantine/core'

export const CategoryList = () => {
  const location = useLocation()
  const resource = removeLeadingTrailingSlashes(location.pathname)

  const { data: categories, isLoading } = useQuery({
    queryKey: [resource, 'list'],
    queryFn: () => getCategories()
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên'
    },
    {
      accessorKey: '',
      header: 'Hành động',
      cell: () => (
        <Group gap='xs'>
          {/* <ActionIcon variant='light' size='sm'>
            <EyeIcon width='70%' height='70%' strokeWidth={1.5} />
          </ActionIcon> */}
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

  return (
    <List title='Nhóm hàng hoá'>
      <DataTable data={categories ?? []} columns={columns} isLoading={isLoading} />
    </List>
  )
}
