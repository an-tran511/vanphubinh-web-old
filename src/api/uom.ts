import { IUom } from '@utils/intefaces'
import { client } from './client'

export const getUoms = async () => {
  const response = await client.url('/uoms').get()
  return response as IUom[]
}
