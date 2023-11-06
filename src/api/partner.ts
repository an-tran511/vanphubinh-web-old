import { GetResponse, IPartner } from '@utils/intefaces'
import { client } from './client'

export const getPartners = async ({ page, searchValue }: { page?: number; searchValue?: string }) => {
  const response = await client.url('/partners').query({ page: page, searchValue: searchValue }).get()
  return response as GetResponse<IPartner>
}

export const createPartner = async (partner: IPartner) => {
  const response = await client.url('/partners').post(partner)
  return response
}
