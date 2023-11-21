import { useQuery } from '@tanstack/react-query'
import { getWarehouses } from '@api/warehouse'
import { useLocation } from 'react-router-dom'
import { List } from '@components/crud/list'
import { DataTable } from '@components/table'
import { removeLeadingTrailingSlashes } from '@utils/remove-leading-trailing-slash'

export const WarehouseList = () => {
  const location = useLocation()
  const resource = removeLeadingTrailingSlashes(location.pathname)

  const { data: warehouses, isLoading } = useQuery({
    queryKey: [resource, 'list'],
    queryFn: () => getWarehouses()
  })

  const columns = [
    {
      accessorKey: 'name',
      header: 'Tên'
    }
  ]

  return (
    <List title='Kho'>
      <DataTable data={warehouses ?? []} columns={columns} isLoading={isLoading} />
    </List>
  )
}
