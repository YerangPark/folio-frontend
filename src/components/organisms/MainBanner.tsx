// src/components/organisms/MainBanner.tsx
'use client'

import React from 'react'
import Image from '@/components/atoms/Image'
import { Heading, Paragraph } from '@/components/atoms/Text'
import DefaultButton from '@/components/molecules/DefaultButton'
import { Box, Text } from '@chakra-ui/react'
import RoundButton from '../molecules/RoundButton'
import BlurryImage from '../molecules/BlurryImage'

const MainBanner: React.FC<{ openSignupModal: () => void }> = ({ openSignupModal }) => {
  return (
    <Box position="relative" textAlign="center" height="700px" width="100%">
      <BlurryImage src="/images/notebook.jpg" alt="Banner" overlayOpacity={0.5} height="700px"/>
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" width="70%">
        <Text fontSize="7xl" color="brand.text1" fontWeight="bold">
          <Text as="span" color="brand.primary1">개발자</Text>만을 위한
        </Text>
        <Text fontSize="7xl" color="brand.text1" fontWeight="bold" mb={10}>
          <Text as="span" color="brand.primary1"> 포트폴리오</Text>를 만들어보세요
        </Text>
        <RoundButton label="시작하기" color="brand.primary1" px={24} py={8} fontWeight="bold" fontSize="3xl" onClick={openSignupModal} />
      </Box>
      <Box>
        <Image src="/images/scrollIcon.png" height="40px" width="80px" alt="scroll" mt={10} mx="auto"/>
      </Box>
    </Box>
  );
};

export default MainBanner