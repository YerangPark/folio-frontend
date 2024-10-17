'use client'

import React from 'react'
import Image from '@/components/atoms/Image'
import { Box, Text } from '@chakra-ui/react'
import BlurryImage from '../molecules/BlurryImage'

const PortfolioMainImageText: React.FC<{ image: string; text: string }> = ({ image, text }) => {
  return (
    <Box position="relative" textAlign="center" width="100%">
      <Box height={[300, 500, 700]} position="relative">
        <BlurryImage src={image || '/images/notebook.jpg'} alt="Banner" overlayOpacity={0.5} height={[300, 500, 700]} />
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" width="100%">
          <Text fontSize={['3xl', '5xl', '7xl']} color="brand.text1" fontWeight="bold">
            {text}
          </Text>
        </Box>
      </Box>
      <Box>
        <Image src="/images/scrollIcon.png" height="40px" width="80px" alt="scroll" mt={10} mx="auto" />
      </Box>
    </Box>
  )
}

export default PortfolioMainImageText
