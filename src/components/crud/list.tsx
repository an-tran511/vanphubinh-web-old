import { Button, Group, Pagination, Stack, TextInput, Title } from '@mantine/core'
import { Search } from 'lucide-react'
import { useEffect, ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

interface ListProps {
  children: ReactNode
  title: string
  isPlaceholderData?: boolean
  pagination: {
    page: number
    lastPage: number
    onPageChange: (page: number) => void
  }
}

export const List = (props: ListProps) => {
  const {
    title,
    children,
    isPlaceholderData,
    pagination: { page, onPageChange, lastPage }
  } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const defaultHandleClick = () => navigate(`create`)

  useEffect(() => {
    if (searchParams.get('page') === null) {
      setSearchParams({ ['page']: '1' })
    }
  }, [searchParams, setSearchParams])

  return (
    <Stack h='100%'>
      <Group justify='space-between'>
        <Group>
          <Title order={3}>{title}</Title>
          <Button onClick={defaultHandleClick}>Thêm</Button>
        </Group>
        <TextInput w={{ base: '20vw' }} placeholder='Tìm kiếm' leftSection={<Search size={16} />} />

        <Pagination.Root
          total={10}
          style={{
            display: 'flex',
            alignContent: 'center'
          }}
        >
          <Group>
            <Pagination.Previous disabled={isPlaceholderData || page === 1} onClick={() => onPageChange(page - 1)} />
            {page} / {lastPage}
            <Pagination.Next disabled={isPlaceholderData || page === lastPage} onClick={() => onPageChange(page + 1)} />
          </Group>
        </Pagination.Root>
      </Group>

      {children}
    </Stack>
  )
}
