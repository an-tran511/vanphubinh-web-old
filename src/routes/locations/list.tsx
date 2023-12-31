import { useQuery } from '@tanstack/react-query'
import { getLocations } from '@api/location'
import { useLocation } from 'react-router-dom'
import { List } from '@components/crud/list'
import { DataTable } from '@components/table'
import { removeLeadingTrailingSlashes } from '@utils/remove-leading-trailing-slash'
import { useDisclosure } from '@mantine/hooks'
import { ActionIcon, Drawer, Group } from '@mantine/core'
import { NewLocationForm } from './components/new-location-form'
import { AsyncBoundary } from '@suspensive/react'
import { EyeIcon, Pen, Trash } from 'lucide-react'

export const LocationList = () => {
  const location = useLocation()
  const resource = removeLeadingTrailingSlashes(location.pathname)
  const [opened, { open, close }] = useDisclosure(false)

  const { data: locations, isLoading } = useQuery({
    queryKey: [resource, 'list'],
    queryFn: () => getLocations()
  })

  const columns = [
    {
      accessorKey: 'fullPathName',
      header: 'Tên'
    },
    {
      accessorKey: 'locationType',
      header: 'Loại địa điểm'
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

  return (
    <List title='Địa điểm kho' onCreateHandler={open}>
      <DataTable data={locations ?? []} columns={columns} isLoading={isLoading} />
      <Drawer opened={opened} onClose={close} title='Thêm địa điểm kho' position='right'>
        <AsyncBoundary rejectedFallback={<div>Không thể tải mẫu đơn tạo địa điểm</div>}>
          <NewLocationForm />
        </AsyncBoundary>
      </Drawer>
    </List>
  )
}
