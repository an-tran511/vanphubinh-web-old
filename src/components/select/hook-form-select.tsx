import { type FieldValues, type UseControllerProps, useController } from 'react-hook-form'

import { CreatableSelect as $CreatableSelect, type CreatableSelectProps as $CreatableSelectProps } from './index'

export type CreatableSelectProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<$CreatableSelectProps, 'value' | 'defaultValue'>

export function HookFormSelect<T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  onChange,
  ...props
}: CreatableSelectProps<T>) {
  const {
    field: { value, onChange: fieldOnChange, ...field },
    fieldState
  } = useController<T>({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister
  })
  return (
    <$CreatableSelect
      value={value}
      onChange={(e) => {
        fieldOnChange(e)
        onChange?.(e)
      }}
      defaultValue={defaultValue}
      error={fieldState.error?.message}
      {...field}
      {...props}
    />
  )
}
