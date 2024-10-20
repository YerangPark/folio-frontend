import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'

interface InputTextBoxProps {
  formLabel: string
  placeHolder: string
  value: string
  onChange: (arg: string) => void
  isDisabled?: boolean
  maxLength?: number
}

const InputTextbox: React.FC<InputTextBoxProps> = ({
  formLabel,
  placeHolder,
  value,
  onChange,
  isDisabled = false,
  maxLength = 20,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue.length <= maxLength && onChange) {
      onChange(inputValue)
    }
  }
  return (
    <FormControl mb={4}>
      <Flex align="center">
        <FormLabel mb="0" width={[110, 130, 150]} fontSize="base">
          {formLabel}
        </FormLabel>
        <Input placeholder={placeHolder} value={value} flex="1" isDisabled={isDisabled} onChange={handleChange} />
      </Flex>
    </FormControl>
  )
}

export default InputTextbox
