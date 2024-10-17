import { Flex, Box, Text } from '@chakra-ui/react'
import React from 'react'

interface DateRangeInputProps {
  formLabel: string
  startDate: string
  endDate: string
}

const OutputDateRange: React.FC<DateRangeInputProps> = ({ formLabel, startDate, endDate }) => {
  return (
    <Box mb={4}>
      <Flex align="center" fontSize={['sm', 'md', 'lg']}>
        <Text mb="0" width={[130, 140, 150]} fontWeight="bold" align="left">
          {formLabel}
        </Text>
        <Text fontSize={['sm', 'md', 'lg']}>
          {startDate} ~ {endDate}
        </Text>
      </Flex>
    </Box>
  )
}

export default OutputDateRange
