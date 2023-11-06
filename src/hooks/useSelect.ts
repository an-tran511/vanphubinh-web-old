import { getPartners } from '@/api/partner'
import { IPartner } from '@/utils/intefaces'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce'

export const useSelect = () => {
  const [partnerSearchValue, setPartnerSearchValue] = useState('')
  const [debouncePartnerSearchValue] = useDebounce(partnerSearchValue, 300)
  const { data: partnerData } = useQuery({
    queryKey: ['partners', 'list', debouncePartnerSearchValue],
    queryFn: () => getPartners({ page: 1, searchValue: debouncePartnerSearchValue })
  })
  const onSearchPartner = (value: string) => {
    setPartnerSearchValue(value)
  }

  const partners = partnerData?.data
  const partnerOptions = useMemo(() => {
    return partners
      ? partners.map((item: IPartner) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [partners])

  return {
    options: partnerOptions,
    onSearch: onSearchPartner
  }
}
