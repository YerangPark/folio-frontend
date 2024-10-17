import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'

interface InputTextBoxProps {
  formLabel: string
  placeHolder: string
  value: string
  onChange?: (arg: string) => void
  isDisabled?: boolean
}

const InputTextbox: React.FC<InputTextBoxProps> = ({ formLabel, placeHolder, value, onChange, isDisabled = false }) => {
  return (
    <FormControl mb={4}>
      <Flex align="center">
        <FormLabel mb="0" width={[110, 130, 150]} fontSize="base">
          {formLabel}
        </FormLabel>
        <Input
          placeholder={placeHolder}
          value={value}
          flex="1"
          isDisabled={isDisabled}
          onChange={(e) => (onChange ? onChange(e.target.value) : undefined)}
        />
      </Flex>
    </FormControl>
  )
}

export default InputTextbox
