import { Flex, Box, Text, Link } from '@chakra-ui/react'
import React from 'react'

interface OutputLinkProps {
  link: string
  formLabel: string
}

const OutputLink: React.FC<OutputLinkProps> = ({ link, formLabel }) => {
  return (
    <Box mb={4}>
      <Flex align="center" fontSize={['sm', 'md', 'lg']}>
        <Text mb="0" width={[130, 140, 150]} fontWeight="bold" align="left">
          {formLabel}
        </Text>
        <Link href={link} isExternal>
          <Text fontWeight="bold" color="blue.500">
            바로가기
          </Text>
        </Link>
      </Flex>
    </Box>
  )
}

export default OutputLink
