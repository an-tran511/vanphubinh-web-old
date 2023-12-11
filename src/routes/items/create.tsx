import { HookFormSelect } from '@components/select/hook-form-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ICategory, IItemInput, IPartner, IUom } from '@utils/intefaces'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Checkbox, NumberInput, TextInput, Textarea } from 'react-hook-form-mantine'
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
  customerReference: z.string(),
  colorsCount: z.number().optional(),
  cylinder: z.object({
    count: z.number().optional(),
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
      customerReference: undefined,
      colorsCount: undefined,
      cylinder: {
        count: 1,
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
      <Grid h='100%' grow gutter='xl'>
        <Grid.Col span={8}>
          <Stack gap='xl'>
            <Card padding='md' radius='sm' shadow='lg' withBorder>
              <Card.Section withBorder={opened} inheritPadding py='xs'>
                <Group gap='xl' justify='space-between'>
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
                      <Checkbox
                        label='Hàng có lưu kho'
                        name='isStockable'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                      <Checkbox
                        label='Hàng có in ấn'
                        name='hasPrinting'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                    </Flex>
                    <Group gap='xl' grow align='flex-start'>
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
                    <Group gap='xl' grow>
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
                      <TextInput
                        classNames={{ label: classes.label }}
                        label='Mã sp của KH'
                        name='customerReference'
                        control={control}
                      />
                    </Group>
                  </Stack>
                </Card.Section>
              </Collapse>
            </Card>

            <Card padding='md' radius='sm' shadow='lg' withBorder>
              <Card.Section withBorder={opened} inheritPadding py='xs'>
                <Group gap='xl' justify='space-between'>
                  <Text fw='500'>Thông số sản phẩm</Text>
                  <ActionIcon variant='default' radius='xl' size='xs' onClick={toggle}>
                    {opened ? <ChevronUp width='70%' height='70%' /> : <ChevronDown width='70%' height='70%' />}
                  </ActionIcon>
                </Group>
              </Card.Section>
              <Collapse in={opened}>
                <Card.Section inheritPadding pt='xs'>
                  <Stack gap='xs'>
                    <Group gap='xl' grow>
                      <HookFormSelect
                        label='Độ dày'
                        name='colorsCount'
                        data={['20', '25', '30', '35', '40', '45']}
                        defaultValue={'35'}
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                      <TextInput
                        label='Chất liệu'
                        name='colorsCount'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                      <NumberInput
                        label='Số màu'
                        name='colorsCount'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                    </Group>
                    <Group gap='xl' grow>
                      <NumberInput
                        label='Chiều dài'
                        name='colorsCount'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                      <TextInput
                        label='Chiều rộng'
                        name='colorsCount'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                      <NumberInput
                        label='KT Dán'
                        name='colorsCount'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                    </Group>
                    <Textarea label='Thông tin khác' name='cylinder.count' control={control} />
                  </Stack>
                </Card.Section>
              </Collapse>
            </Card>

            {hasPrinting ? (
              <Card padding='md' radius='sm' shadow='lg' withBorder>
                <Card.Section withBorder={opened} inheritPadding py='xs'>
                  <Group gap='xl' justify='space-between'>
                    <Text fw='500'>Trục</Text>
                    <ActionIcon variant='default' radius='xl' size='xs' onClick={toggle}>
                      {opened ? <ChevronUp width='70%' height='70%' /> : <ChevronDown width='70%' height='70%' />}
                    </ActionIcon>
                  </Group>
                </Card.Section>
                <Card.Section withBorder={opened} inheritPadding py='md'>
                  <Stack gap='xs'>
                    <Group gap='xl' grow>
                      <NumberInput
                        label='Số cây trục trong bộ'
                        name='cylinder.count'
                        control={control}
                        required
                        classNames={{ label: classes.label }}
                      />
                      <TextInput
                        label='Vị trí'
                        name='cylinder.locationId'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                    </Group>
                    <Group gap='xl' grow>
                      <NumberInput
                        label='Dài trục'
                        name='cylinder.width'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                      <NumberInput
                        label='Chu vi'
                        name='cylinder.perimeter'
                        control={control}
                        classNames={{ label: classes.label }}
                      />
                    </Group>
                  </Stack>
                </Card.Section>
              </Card>
            ) : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span={4} h='100%'>
          <Stack gap='xs'>
            <Card padding='md' radius='sm' shadow='lg' withBorder>
              <Card.Section withBorder={opened} inheritPadding py='xs'>
                <Group gap='xl' justify='space-between'>
                  <Text fw='500'>Hình ảnh</Text>
                  <ActionIcon variant='default' radius='xl' size='xs' onClick={toggle}>
                    {opened ? <ChevronUp width='70%' height='70%' /> : <ChevronDown width='70%' height='70%' />}
                  </ActionIcon>
                </Group>
              </Card.Section>
              <Collapse in={opened}>
                <Card.Section inheritPadding pt='xs'>
                  <Stack gap='xs'>
                    <Image
                      radius='md'
                      src={null}
                      h='200px'
                      w='100%'
                      fallbackSrc='https://placehold.co/600x400?text=Placeholder'
                    />
                  </Stack>
                </Card.Section>
              </Collapse>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Create>
  )
}
