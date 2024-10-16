import { Flex, FormControl, FormLabel, Input, Box } from '@chakra-ui/react'
import React from 'react'

interface DateRangeInputProps {
  formLabel: string
  startDate: string
  endDate: string
  onStartDateChange?: (arg: string) => void
  onEndDateChange?: (arg: string) => void
  isDisabled?: boolean
}

const InputDateRange: React.FC<DateRangeInputProps> = ({
  formLabel,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isDisabled = false,
}) => {
  return (
    <FormControl mb={4}>
      <Flex align="center">
        <FormLabel mb="0" width={[110, 130, 150]}>
          {formLabel}
        </FormLabel>
        <Input
          type="month" // HTML5의 month 타입을 사용하여 YYYY-MM 형식으로 입력
          value={startDate}
          width="160px"
          mr={2}
          isDisabled={isDisabled}
          onChange={(e) => (onStartDateChange ? onStartDateChange(e.target.value) : undefined)}
        />
        <Box mr={2}>~</Box>
        <Input
          type="month" // HTML5의 month 타입을 사용하여 YYYY-MM 형식으로 입력
          value={endDate}
          width="160px"
          isDisabled={isDisabled}
          onChange={(e) => (onEndDateChange ? onEndDateChange(e.target.value) : undefined)}
        />
      </Flex>
    </FormControl>
  )
}

export default InputDateRange
