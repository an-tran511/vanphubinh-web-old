import { HookFormSelect } from '@components/select/hook-form-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ICategory, IItemInput, IPartner, IUom } from '@utils/intefaces'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Checkbox, NumberInput, TextInput } from 'react-hook-form-mantine'
import { z } from 'zod'
import { getUoms } from '@api/uom'
import { getCategories } from '@api/category'
import { Group, Stack, Image, Text, Card, Grid, ActionIcon, Collapse, Flex } from '@mantine/core'
import { getPartners } from '@api/partner'
import { useDebounce } from 'use-debounce'
import { Create } from '@components/crud/create'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useDisclosure } from '@mantine/hooks'
import classes from '@components/crud/Create.module.css'

const schema = z.object({
  name: z.string().min(3),
  uomId: z.number(),
  categoryId: z.number(),
  hasPrinting: z.boolean().optional(),
  customerId: z.number().optional(),
  isStockable: z.boolean(),
  cylinder: z.object({
    setCount: z.number().optional(),
    width: z.number().optional(),
    perimeter: z.number().optional(),
    sharedCylinders: z.object({
      colors: z.string().optional(),
      cylinderSetId: z.number().optional()
    })
  })
})

export const ItemCreate = () => {
  const { control } = useForm<IItemInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      uomId: undefined,
      secondaryUomId: undefined,
      purchaseUomId: undefined,
      categoryId: undefined,
      hasPrinting: false,
      isStockable: true,
      customerId: undefined,
      cylinder: {
        setCount: 1,
        width: undefined,
        perimeter: undefined,
        sharedCylinders: {
          colors: undefined,
          cylinderSetId: undefined
        }
      }
    }
  })
  const hasPrinting = useWatch({ control, name: 'hasPrinting' })

  const [opened, { toggle }] = useDisclosure(true)

  //Uom state
  const { data: uoms } = useQuery({
    queryKey: ['uoms', 'list'],
    queryFn: () => {
      const data = getUoms()
      return data
    },
    placeholderData: keepPreviousData
  })

  const uomOptions = useMemo(() => {
    return uoms
      ? uoms.map((item: IUom) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [uoms])

  //Category state
  const { data: categories } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => {
      const data = getCategories()
      return data
    },
    placeholderData: keepPreviousData
  })

  const categoryOptions = useMemo(() => {
    return categories
      ? categories.map((item: ICategory) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [categories])

  //Categoriy state
  const [partnerSearchValue, setPartnerSearchValue] = useState('')
  const [debouncePartnerSearchValue] = useDebounce(partnerSearchValue, 1000)

  const { data: partners } = useQuery({
    queryKey: ['partners', 'list', debouncePartnerSearchValue],
    queryFn: () => getPartners({ page: 1, searchValue: debouncePartnerSearchValue }),
    placeholderData: keepPreviousData,
    select: (data) => data?.data
  })
  const onSearchPartner = (value: string) => {
    setPartnerSearchValue(value)
  }

  const partnerOptions = useMemo(() => {
    return partners
      ? partners.map((item: IPartner) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [partners])

  return (
    <Create title='Hàng hoá'>
      <Grid h='100%'>
        <Grid.Col span={8}>
          <Stack>
            <Card padding='md' radius='sm' shadow='lg' withBorder>
              <Card.Section withBorder={opened} inheritPadding py='xs'>
                <Group justify='space-between'>
                  <Text fw='500'>Thông tin chung</Text>
                  <ActionIcon variant='default' radius='xl' size='xs' onClick={toggle}>
                    {opened ? <ChevronUp width='70%' height='70%' /> : <ChevronDown width='70%' height='70%' />}
                  </ActionIcon>
                </Group>
              </Card.Section>
              <Collapse in={opened}>
                <Card.Section inheritPadding pt='xs'>
                  <Stack gap='xs'>
                    <TextInput
                      classNames={{ label: classes.label }}
                      label='Tên hàng hoá'
                      required
                      name='name'
                      control={control}
                      placeholder='Nhãn nước suối'
                    />
                    <Flex gap='lg'>
                      <Checkbox label='Hàng có lưu kho' name='hasPrinting' control={control} />
                      <Checkbox label='Hàng có in ấn' name='hasPrinting' control={control} />
                    </Flex>
                    <Group grow align='flex-start'>
                      <HookFormSelect
                        label='Đơn vị chính'
                        required
                        name='uomId'
                        data={uomOptions}
                        control={control}
                        searchable
                        classNames={{ label: classes.label }}
                      />
                      <HookFormSelect
                        label='Đơn vị phụ'
                        name='secondaryUomId'
                        data={uomOptions}
                        control={control}
                        disabled
                        searchable
                        classNames={{ label: classes.label }}
                      />
                      <HookFormSelect
                        label='Đơn vị mua hàng'
                        name='purchaseUomId'
                        data={uomOptions}
                        disabled
                        control={control}
                        searchable
                        classNames={{ label: classes.label }}
                      />
                    </Group>
                    <Group grow>
                      <HookFormSelect
                        label='Nhóm hàng hoá'
                        name='categoryId'
                        data={categoryOptions}
                        control={control}
                        searchable
                        classNames={{ label: classes.label }}
                        required
                      />
                      <HookFormSelect
                        name='customerId'
                        control={control}
                        label='Khách hàng'
                        placeholder='Chọn khách hàng'
                        data={partnerOptions}
                        searchValue={partnerSearchValue}
                        searchable
                        creatable
                        onSearchChange={onSearchPartner}
                        classNames={{ label: classes.label }}
                      />
                    </Group>
                  </Stack>
                </Card.Section>
              </Collapse>
            </Card>

            {hasPrinting ? (
              <Card padding='md' radius='sm' shadow='lg' withBorder>
                <Card.Section withBorder={opened} inheritPadding py='xs'>
                  <Group justify='space-between'>
                    <Text fw='500'>Trục</Text>
                    <ActionIcon variant='default' radius='xl' size='xs' onClick={toggle}>
                      {opened ? <ChevronUp width='70%' height='70%' /> : <ChevronDown width='70%' height='70%' />}
                    </ActionIcon>
                  </Group>
                </Card.Section>
                <Card.Section withBorder={opened} inheritPadding py='md'>
                  <Stack>
                    <Group grow>
                      <NumberInput label='Số màu sắc' name='cylinder.setCount' control={control} required />
                      <TextInput label='Vị trí' name='cylinder.locationId' control={control} />
                    </Group>
                    <Group grow>
                      <NumberInput label='Chiều dài' name='cylinder.width' control={control} />
                      <NumberInput label='Chu vi' name='cylinder.perimeter' control={control} />
                    </Group>
                    <Group grow>
                      <TextInput label='Bộ dùng chung' name='cylinder.sharedCylinders.colors' control={control} />
                      <TextInput label='Cây dùng chung' name='cylinder.sharedCylinders.colors' control={control} />
                    </Group>
                  </Stack>
                </Card.Section>
              </Card>
            ) : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow='lg' padding='md' radius='sm' withBorder>
            <Card.Section withBorder inheritPadding py='sm'>
              <Text fw='500'>Hình ảnh hàng hoá</Text>
            </Card.Section>
            <Card.Section withBorder inheritPadding pt='xs' py='md'>
              <Stack>
                {/* <TagsInput
                  label={<Text size='sm'>Tag</Text>}
                  placeholder='Enter tag'
                  defaultValue={['React']}
                  clearable
                /> */}
                <div>
                  <Text size='sm'>Hình ảnh</Text>
                  <Image
                    radius='md'
                    src={null}
                    h='200px'
                    w='100%'
                    fallbackSrc='https://placehold.co/600x400?text=Placeholder'
                  />
                </div>
              </Stack>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </Create>
  )
}
