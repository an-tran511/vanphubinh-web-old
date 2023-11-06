import { GetResponse, ISalesOrder } from '@/utils/intefaces'
import { client } from './client'

export const getSalesOrders = async ({ page, searchValue }: { page?: number; searchValue?: string }) => {
  const response = await client.url('/sales-orders').query({ page: page, searchValue: searchValue }).get()
  return response as GetResponse<ISalesOrder>
}
