import cx from 'clsx'
import { useMemo } from 'react'

import {
  Combobox,
  type ComboboxData,
  type ComboboxItem,
  ComboboxParsedItem,
  Factory,
  InputBase,
  SelectProps,
  defaultOptionsFilter,
  factory,
  getOptionsLockup,
  getParsedComboboxData,
  isOptionsGroup,
  useCombobox,
  useProps,
  Input
} from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'

import classes from './Combobox.module.css'
import { validateOptions } from './validate-options'

export interface CreatableSelectProps extends SelectProps {
  creatable?: boolean
  onCreate?(query: string): ComboboxItem | string | null | undefined | void
  data: ComboboxData
  isLoadingOptions?: boolean
}

function isValueChecked(value: string | string[] | undefined | null, optionValue: string) {
  return Array.isArray(value) ? value.includes(optionValue) : value === optionValue
}

export type SelectFactory = Factory<{
  props: CreatableSelectProps
  ref: HTMLInputElement
}>

const defaultProps: Partial<SelectProps> = {
  searchable: false,
  withCheckIcon: true,
  allowDeselect: true,
  checkIconPosition: 'left'
}

export const CreatableSelect = factory<SelectFactory>((_props, ref) => {
  const props = useProps('CreatableSelect', defaultProps, _props)
  const {
    creatable = false,
    searchValue,
    defaultSearchValue,
    value,
    defaultValue,
    data,
    searchable = true,
    allowDeselect,
    placeholder,
    rightSection,
    leftSection,
    label,
    rightSectionPointerEvents,
    size,
    error,
    variant,
    filter,
    onChange,
    onSearchChange,
    onCreate
  } = props
  validateOptions(data)

  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: null,
    onChange
  })
  const parsedData = useMemo(() => getParsedComboboxData(data), [data])

  const optionsLockup = useMemo(() => getOptionsLockup(parsedData), [parsedData])
  const selectedOption = _value ? optionsLockup[_value] : undefined
  const [search, setSearch] = useUncontrolled({
    value: searchValue,
    defaultValue: defaultSearchValue,
    finalValue: selectedOption ? selectedOption.label : '',
    onChange: onSearchChange
  })

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      combobox.focusTarget()
      setSearch('')
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput()
    }
  })
  const exactOptionMatch = parsedData?.some((item) => {
    if (!isOptionsGroup(item)) {
      return item.label === search
    }
  })

  const shouldFilter = typeof search === 'string'

  const filteredData = shouldFilter
    ? (filter || defaultOptionsFilter)({
        options: parsedData,
        search: search,
        limit: Infinity
      })
    : parsedData

  const options = filteredData.map((item: ComboboxParsedItem) => {
    if (!isOptionsGroup(item)) {
      return (
        <Combobox.Option
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          data-checked={isValueChecked(_value, item.value) || undefined}
          aria-selected={isValueChecked(_value, item.value)}
          className={cx({ [classes.optionsDropdownOption]: '' })}
        >
          {item.label}
        </Combobox.Option>
      )
    }
  })

  const getLabel = () => {
    if (selectedOption) {
      return selectedOption.label
    }
    return <Input.Placeholder>{placeholder}</Input.Placeholder>
  }

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      onOptionSubmit={(val) => {
        const nextValue = allowDeselect
          ? optionsLockup[val].value === _value
            ? null
            : optionsLockup[val].value
          : optionsLockup[val].value
        if (creatable && val === '$create') {
          if (typeof onCreate === 'function') {
            const createdItem = onCreate(search)
            if (typeof createdItem !== 'undefined' && createdItem !== null) {
              if (typeof createdItem === 'string') {
                setValue(createdItem)
              } else {
                setValue(createdItem.value)
              }
            }
          }
        } else {
          setValue(nextValue)
        }
        combobox.closeDropdown()
      }}
    >
      <Combobox.Target targetType={'button'}>
        <InputBase
          multiline
          component='button'
          type='button'
          pointer
          variant={variant}
          size={size}
          label={label}
          leftSection={leftSection}
          onClick={() => combobox.openDropdown()}
          placeholder={placeholder}
          error={error}
          rightSection={rightSection}
          rightSectionPointerEvents={rightSectionPointerEvents}
        >
          {getLabel()}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        {searchable ? (
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder='Tìm kiếm...'
            ref={ref}
          />
        ) : null}
        <Combobox.Options mah={300} style={{ overflowY: 'auto' }}>
          {options}
          {creatable && !exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value='$create'>+ Tạo {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
})
