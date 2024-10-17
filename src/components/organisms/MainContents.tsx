'use client'

import React, { useEffect, useRef } from 'react'
import Image from '@/components/atoms/Image'
import { Heading } from '@/components/atoms/Text'
import { Box, Text } from '@chakra-ui/react'
import RoundButton from '../molecules/RoundButton'

const MainContents: React.FC<{ openSignupModal: () => void }> = ({ openSignupModal }) => {
  const sections = useRef<(HTMLDivElement | null)[]>([]) // null을 허용하는 배열

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
          }
        })
      },
      { threshold: 0.1 },
    )

    sections.current.forEach((section) => {
      if (section) observer.observe(section) // null 체크
    })

    return () => {
      sections.current.forEach((section) => {
        if (section) observer.unobserve(section) // null 체크
      })
    }
  }, [])

  return (
    <Box position="relative" textAlign="center" width="100%" mt={200} mb={200} flex="1">
      {[
        {
          heading1: '필요한 정보를 담은 간결한',
          heading2: '포트폴리오를 만들 수 있어요.',
          image: '/images/example1.png',
        },
        {
          heading1: '진행한 프로젝트 경험을',
          heading2: '카드 형식으로 보여줄 수 있어요',
          image: '/images/example2.png',
        },
        {
          heading1: '간단한 입력만으로',
          heading2: '제출용 포트폴리오를 제작해보세요.',
          image: '/images/example3.png',
        },
      ].map((content, index) => (
        <Box
          key={content.heading1}
          textAlign="center"
          className="fade-in"
          ref={(el) => {
            sections.current[index] = el // 값 할당 시 null 허용
          }}
          mt={index === 0 ? 0 : 150}
        >
          <Heading content={content.heading1} fontSize={['2xl', '3xl', '4xl']} color="brand.text1" />
          <Heading content={content.heading2} fontSize={['2xl', '3xl', '4xl']} color="brand.text1" />
          <Image src={content.image} alt={`example image ${index + 1}`} width="70%" mx="auto" />
        </Box>
      ))}

      <Box textAlign="center" mt={200}>
        <Text fontSize={['3xl', '5xl', '6xl']} color="brand.text1" fontWeight="bold" mb={[15, 17, 20]}>
          <Text as="span" color="brand.primary1">
            나만의 포트폴리오
          </Text>
          를 <br />
          제작해보세요.
        </Text>
        <RoundButton
          label="포트폴리오 만들기"
          color="brand.primary1"
          px={[8, 16, 24]}
          py={[4, 6, 8]}
          fontWeight="bold"
          fontSize={['xl', '2xl', '3xl']}
          onClick={openSignupModal}
        />
      </Box>
    </Box>
  )
}

export default MainContents
