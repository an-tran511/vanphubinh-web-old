import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Stack } from '@mantine/core'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Checkbox, TextInput, Textarea } from 'react-hook-form-mantine'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPartner } from '@api/partner'
import { IPartner } from '@/utils/intefaces'
import { notifications } from '@mantine/notifications'

const schema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  isCustomer: z.boolean(),
  isSupplier: z.boolean()
})

export const PartnerCreate = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient()
  const { handleSubmit, control } = useForm<IPartner>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      isSupplier: false,
      isCustomer: true
    }
  })

  const { mutateAsync } = useMutation({
    mutationFn: (values: IPartner) => createPartner(values)
  })

  const onSubmit: SubmitHandler<IPartner> = async (values: IPartner) => {
    await mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['partners'] })
      },
      onError: (error) => {
        notifications.show({
          title: error.message,
          message: error.message
        })
      }
    })
  }

  return (
    <Stack>
      <TextInput name='name' control={control} label='Tên' />
      <Group grow>
        <Checkbox name='isCustomer' control={control} label='Khách hàng' />
        <Checkbox name='isSupplier' control={control} label='Nhà cung cấp' />
      </Group>
      <Group grow>
        <TextInput name='email' control={control} label='Email' />
        <TextInput name='phone' control={control} label='Điện thoại' />
      </Group>
      <Textarea name='address' control={control} label='Địa chỉ' />
      <Button type='submit' onClick={handleSubmit(onSubmit)}>
        Tạo
      </Button>
    </Stack>
  )
}
