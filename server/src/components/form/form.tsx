// import { Form, TextInput } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FieldState, OnlyStringAttributes } from './formState'

interface FormSectionProps<Data extends OnlyStringAttributes> {
  readonly heading?: string
  readonly keysToRender: ReadonlyArray<keyof Data>
  readonly data: Record<keyof Data, FieldState<Data>>
}

export function FormSection<Data extends OnlyStringAttributes>({
  heading,
  keysToRender,
  data
}: FormSectionProps<Data>): JSX.Element {
  const [touched, setTouched] = useState<Record<keyof Data, boolean>>(
    Object.fromEntries(keysToRender.map((key) => [key, false])) as Record<
      keyof Data,
      boolean
    >
  )
  const handleTouched = (key: keyof Data): void => {
    const updatedTouchedObj = { ...touched, [key]: true }
    setTouched(updatedTouchedObj)
  }

  return (
    <form heading={heading}>
      {keysToRender
        .map((key) => data[key])
        .map(
          ({
            currentValue,
            label,
            errorText,
            key,
            onChange,
            required,
            helpText
          }) => {
            return (
              <TextInput
                size='col-9'
                value={currentValue}
                label={{ label, size: 'col-3', required }}
                error={touched[key] && Boolean(errorText)}
                errorText={touched[key] ? errorText : undefined}
                helpText={helpText}
                key={String(key)}
                onTextChange={(text: string): void => {
                  handleTouched(key)
                  onChange(text)
                }}
              />
            )
          }
        )}
    </form>
  )
}