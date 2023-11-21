import { IWarehouse } from '@utils/intefaces'
import { client } from './client'

export const getWarehouses = async () => {
  const response = await client.url('/warehouses').get()
  return response as IWarehouse[]
}
