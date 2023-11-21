import { zodResolver } from '@hookform/resolvers/zod'
import { IItem, IPartner, ISalesOrderInput } from '@utils/intefaces'
import { useMemo, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import {
  Text,
  Stack,
  Table,
  NumberInput as CoreNumberInput,
  Button,
  Grid,
  Title,
  Group,
  Card,
  Flex
} from '@mantine/core'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getPartners } from '@api/partner'
import { HookFormSelect } from '@components/select/hook-form-select'
import { useDebounce } from 'use-debounce'
import { DatePickerInput, NumberInput, Select, Textarea } from 'react-hook-form-mantine'
import { getItems } from '@/api'
import classes from './Create.module.css'
import { Create } from '@/components/crud/create'

const schema = z.object({
  customerId: z.coerce.number(),
  salesOrderLines: z.array(
    z.object({
      itemId: z.number(),
      quantity: z.coerce.number(),
      unitPrice: z.coerce.number(),
      taxRate: z.string(),
      note: z.string().optional(),
      deliveryDate: z.date().optional()
    })
  )
})

export const SalesOrderCreate = () => {
  const { control } = useForm<ISalesOrderInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: 0,
      salesOrderLines: [
        {
          itemId: 0,
          quantity: 1,
          unitPrice: 0,
          taxRate: '0',
          note: '',
          deliveryDate: undefined
        }
      ]
    }
  })
  const { fields, append } = useFieldArray({
    control,
    name: 'salesOrderLines'
  })
  const salesOrderLines = useWatch({ control, name: 'salesOrderLines' })
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)

  const totalBeforeTax = salesOrderLines.reduce(
    (acc: number, line: { quantity: number; unitPrice: number }) => acc + line.quantity * line.unitPrice,
    0
  )
  const taxRate = salesOrderLines.reduce(
    (acc: number, line: { quantity: number; unitPrice: number; taxRate: string }) =>
      acc + line.quantity * line.unitPrice * Number(line.taxRate),
    0
  )
  const grandTotal = totalBeforeTax + taxRate

  //Partner state
  const [partnerSearchValue, setPartnerSearchValue] = useState('')
  const [debouncePartnerSearchValue] = useDebounce(partnerSearchValue, 1000)

  const { data: partners } = useQuery({
    queryKey: ['partners', 'list', debouncePartnerSearchValue],
    queryFn: () => {
      const data = getPartners({ page: 1, searchValue: debouncePartnerSearchValue })
      setIsLoadingOptions(false)
      return data
    },
    placeholderData: keepPreviousData,
    select: (data) => data?.data
  })
  const onSearchPartner = (value: string) => {
    setPartnerSearchValue(value)
    setIsLoadingOptions(true)
  }

  const partnerOptions = useMemo(() => {
    return partners
      ? partners.map((item: IPartner) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [partners])

  //Item state
  const [itemSearchValue, setItemSearchValue] = useState('')
  const [debounceItemSearchValue] = useDebounce(itemSearchValue, 100)
  const { data: itemData } = useQuery({
    queryKey: ['itemData', 'list', debounceItemSearchValue],
    queryFn: () => getItems({ page: 1, searchValue: debounceItemSearchValue }),
    placeholderData: keepPreviousData,
    select: (data) => data?.data
  })
  const onSearchItem = (value: string) => {
    setItemSearchValue(value)
  }
  const itemOptions = useMemo(() => {
    return itemData
      ? itemData?.map((item: IItem) => ({
          label: String(item.name),
          value: String(item.id)
        }))
      : []
  }, [itemData])

  const rows = fields.map((f, i) => (
    <Table.Tr key={f.id}>
      <Table.Td valign='top' pt='md' w='3%'>
        {i + 1}
      </Table.Td>
      <Table.Td valign='top' w='23%'>
        <HookFormSelect
          name={`salesOrderLines.${i}.itemId`}
          control={control}
          placeholder='Chọn sản phẩm'
          data={itemOptions}
          searchable
          creatable
          onSearchChange={onSearchItem}
        />
      </Table.Td>
      <Table.Td w='9%' valign='top'>
        <NumberInput
          rightSection={
            <Text size='sm' c='black'>
              {itemData?.find((item) => item.id === salesOrderLines[i]?.itemId)?.uom.name}
            </Text>
          }
          rightSectionPointerEvents='none'
          control={control}
          name={`salesOrderLines.${i}.quantity`}
          thousandSeparator=','
          defaultValue={1}
          hideControls
        />
      </Table.Td>
      <Table.Td valign='top' w='9%'>
        <NumberInput
          control={control}
          name={`salesOrderLines.${i}.unitPrice`}
          thousandSeparator=','
          defaultValue={0}
          hideControls
        />
      </Table.Td>
      <Table.Td valign='top' w='7%'>
        <Select
          allowDeselect={false}
          control={control}
          name={`salesOrderLines.${i}.taxRate`}
          defaultValue='0'
          data={[
            { value: '0', label: '0%' },
            { value: '0.08', label: '8%' },
            { value: '0.1', label: '10%' }
          ]}
        />
      </Table.Td>
      <Table.Td valign='top' w='9%'>
        <CoreNumberInput
          thousandSeparator=','
          value={
            salesOrderLines[i]?.quantity * salesOrderLines[i]?.unitPrice * (1 + parseFloat(salesOrderLines[i]?.taxRate))
          }
          readOnly
          hideControls
        />
      </Table.Td>
      <Table.Td valign='top' w='10%'>
        <DatePickerInput
          control={control}
          name={`salesOrderLines.${i}.deliveryDate`}
          allowDeselect
          valueFormat='DD/MM/YYYY'
        />
      </Table.Td>
      <Table.Td valign='top'>
        <Textarea control={control} name={`salesOrderLines.${i}.note`} autosize minRows={1} />
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Create title='Đơn bán hàng'>
      <Stack gap='0' justify='space-between'>
        <Stack h='100%'>
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
            isLoadingOptions={isLoadingOptions}
          />
          <Card padding='0' radius='sm' withBorder>
            <Table.ScrollContainer minWidth={700} style={{}}>
              <Table verticalSpacing='xs' stickyHeader>
                <Table.Thead className={classes.header}>
                  <Table.Tr>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        #
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        Sản phẩm
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        Số lượng
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        Đơn giá
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        Thuế
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        Tạm tính
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        Ngày giao hàng
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size='xs' c='dimmed' fw={700} truncate='end'>
                        Ghi chú
                      </Text>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Stack>
      </Stack>
      <Flex>
        <Button
          p={0}
          variant='transparent'
          onClick={() =>
            append({
              itemId: undefined,
              quantity: 1,
              unitPrice: 0,
              taxRate: '0',
              note: '',
              deliveryDate: undefined
            })
          }
        >
          Thêm dòng
        </Button>
      </Flex>

      <Grid justify='flex-end'>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <div className='bg-white rounded-lg'>
            <Title order={4}>Thành tiền</Title>
            <Group justify='space-between'>
              <span>Tổng (chưa VAT)</span>
              <span>{totalBeforeTax}</span>
            </Group>
            <Group justify='space-between'>
              <span>Thuế VAT</span>
              <span>{taxRate}</span>
            </Group>

            <hr />
            <Group justify='space-between'>
              <Text fw={500}>Tổng cộng</Text>
              <span>{grandTotal}</span>
            </Group>
          </div>
        </Grid.Col>
      </Grid>
    </Create>
  )
}
