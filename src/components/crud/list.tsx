import { Center, Group, Pagination, Stack, TextInput, Text, Card, Box, Button, Title } from '@mantine/core'
import { Plus, Search } from 'lucide-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface ListProps {
  children: ReactNode
  title: string
  isPlaceholderData?: boolean
  pagination?: {
    page: number
    lastPage: number
    onPageChange: (page: number) => void
  }
  searchValue?: string
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCreateHandler?: () => void
}

export const List = (props: ListProps) => {
  const { title, children, isPlaceholderData, pagination, searchValue, onChangeHandler, onCreateHandler } = props
  const { page, onPageChange, lastPage } = pagination ?? {}
  const navigate = useNavigate()
  const defaultHandleClick = () => navigate(`create`)
  const createHandler = typeof onCreateHandler === 'function' ? onCreateHandler : defaultHandleClick
  const icon = <Plus size={16} />

  return (
    <Stack h='100vh' gap='0'>
      <Box
        px='md'
        py='sm'
        bg='white'
        style={{
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Stack gap='xs'>
          <Group justify='space-between'>
            <Group>
              <Title order={3}>{title}</Title>
            </Group>
            <Button leftSection={icon} variant='filled' justify='space-between' onClick={createHandler}>
              Thêm {title.toLowerCase()}
            </Button>
          </Group>
        </Stack>
      </Box>
      <Box px='md' py='sm' bg='white'>
        <Group justify='space-between'>
          <Group>
            <TextInput
              variant='default'
              size='xs'
              w={{ base: '15vw' }}
              placeholder='Tìm kiếm'
              leftSection={<Search size={16} />}
              value={searchValue}
              onChange={onChangeHandler}
            />
          </Group>
        </Group>
      </Box>
      <Card px='md' py='0' h='100%' mah='100%'>
        <Card
          p='0'
          withBorder
          h='100%'
          style={{
            grow: 1,
            overflow: 'auto'
          }}
        >
          {children}
        </Card>
      </Card>
      <Group px='md' py='sm' justify='space-between'>
        <Text size='sm' c='dimmed'>
          Hiện <b>10</b> trong tổng số <b>100</b>
        </Text>
        {page && onPageChange && lastPage ? (
          <Center>
            <Pagination.Root
              size='sm'
              total={10}
              style={{
                display: 'flex',
                alignContent: 'center'
              }}
            >
              <Group gap='sm'>
                <Pagination.Previous
                  disabled={isPlaceholderData || page === 1}
                  onClick={() => onPageChange(page - 1)}
                />
                <Text size='sm'>
                  {page} / {lastPage}
                </Text>
                <Pagination.Next
                  disabled={isPlaceholderData || page === lastPage}
                  onClick={() => onPageChange(page + 1)}
                />
              </Group>
            </Pagination.Root>
          </Center>
        ) : (
          <></>
        )}
      </Group>
    </Stack>
  )
}
