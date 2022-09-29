export interface OnlyStringAttributes {
    readonly [key: string]: string
  }
  
  export interface FormField {
    readonly label: string
    readonly validators: ReadonlyArray<(value: string) => string | undefined>
    readonly required: boolean
    readonly helpText?: string
  }
  export interface FieldState<Data extends OnlyStringAttributes>
    extends Omit<FormField, 'validators'> {
    readonly key: keyof Data
    readonly currentValue: string | undefined
    readonly errorText: string | undefined
    readonly onChange: (text: string) => void
  }
  
  interface FormStateReturn<Data extends OnlyStringAttributes> {
    readonly formState: Record<keyof Data, FieldState<Data>>
    readonly isPristine: boolean
    readonly containsErrors: boolean
  }
  
  function runValidators(
    value: string | undefined,
    validators: ReadonlyArray<(value: string) => string | undefined>,
    required: boolean
  ): string | undefined {
    // if not required, AND the value is undefined or empty
    if (!required && (value == null || value === '')) {
      return
    }
  
    // catch undefined and empty strings
    // (if an empty/undefined strig makes it here, it MUST be required)
    if (!value) {
      return 'Input is required'
    }
  
    // traverse the array of validators, fail the test if any of them fail.
    const errorText = validators
      .map((validator) => validator(value))
      .filter(Boolean)
      .join(', ')
  
    return errorText ? errorText : undefined
  }
  
  export function getFormState<Data extends OnlyStringAttributes>(
    labels: Record<keyof Data, FormField>,
    localState: Data,
    serverState: Data,
    onUpdate: (newValue: string, key: keyof Data) => void
  ): FormStateReturn<Data> {
    const keysAndFieldStates = Object.entries(labels)
      .map(
        ([key, { label, required, validators, helpText }]): FieldState<Data> => {
          const currentValue = localState[key as keyof Data]
          return {
            currentValue,
            key,
            errorText: runValidators(currentValue, validators, required),
            label,
            onChange: (value: string): void => onUpdate(value, key),
            required,
            helpText
          }
        }
      )
      .map((value) => [value.key, value])
  
    const formState: Record<keyof Data, FieldState<Data>> = Object.fromEntries(
      keysAndFieldStates
    )
  
    const containsErrors = Object.values(formState).some(({ errorText }) =>
      Boolean(errorText)
    )
  
    const isPristine = Object.entries(localState).every(
      ([key, value]) => serverState[key] === value
    )
  
    return { formState, containsErrors, isPristine }
  }