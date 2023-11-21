import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ILocation, ILocationInput, IWarehouse } from '@utils/intefaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { ELocationType } from '@/utils/enums'
import { TextInput } from 'react-hook-form-mantine'
import { HookFormSelect } from '@components/select/hook-form-select'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getWarehouses } from '@/api/warehouse'
import { useMemo } from 'react'
import { getLocations } from '@/api/location'
import { Button, Stack } from '@mantine/core'

const schema = z.object({
  name: z.string().min(3),
  warehouseId: z.number(),
  parentId: z.number().optional(),
  locationType: z.enum([
    ELocationType.ASSET_ALLOCATION,
    ELocationType.CUSTOMER,
    ELocationType.TRANSIT,
    ELocationType.INTERNAL,
    ELocationType.INVENTORY_LOSS,
    ELocationType.PRODUCTION,
    ELocationType.VENDOR,
    ELocationType.VIEW
  ])
})
export const NewLocationForm = () => {
  const { control } = useForm<ILocationInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      warehouseId: undefined,
      parentId: undefined,
      locationType: undefined
    }
  })
  //Uom state
  const { data: warehouses } = useQuery({
    queryKey: ['uoms', 'list'],
    queryFn: () => {
      const data = getWarehouses()
      return data
    },
    placeholderData: keepPreviousData
  })

  const warehouseOptions = useMemo(() => {
    return warehouses
      ? warehouses.map((item: IWarehouse) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [warehouses])

  //Uom state
  const { data: locations } = useQuery({
    queryKey: ['uoms', 'list'],
    queryFn: () => {
      const data = getLocations()
      return data
    },
    placeholderData: keepPreviousData
  })

  const locationOptions = useMemo(() => {
    return locations
      ? locations.map((item: ILocation) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [locations])
  return (
    <Stack gap='xs'>
      <TextInput control={control} name='name' label='Tên địa điểm kho' />
      <HookFormSelect control={control} name='warehouseId' label='Kho' data={warehouseOptions} />
      <HookFormSelect control={control} name='parentId' label='Địa điểm cha' data={locationOptions} />
      <HookFormSelect
        control={control}
        name='locationType'
        label='Loại địa điểm'
        data={[
          { label: 'Địa điểm khách hàng', value: ELocationType.CUSTOMER },
          {
            label: 'Địa điểm nhà cung ứng',
            value: ELocationType.VENDOR
          },
          {
            label: 'Địa điểm sản xuất',
            value: ELocationType.PRODUCTION
          },
          {
            label: 'Địa điểm chuyển kho',
            value: ELocationType.TRANSIT
          },
          {
            label: 'Địa điểm cấp phát tài sản',
            value: ELocationType.ASSET_ALLOCATION
          },
          {
            label: 'Địa điểm tổng hợp',
            value: ELocationType.VIEW
          },
          {
            label: 'Địa điểm tồn kho',
            value: ELocationType.INTERNAL
          },
          {
            label: 'Địa điểm hao hụt',
            value: ELocationType.INVENTORY_LOSS
          }
        ]}
      />
      <Button>Thêm</Button>
    </Stack>
  )
}
