'use client'

import React from 'react'
import { DashboardProps } from '@/types/data'
import { Box, Image, Text, VStack, IconButton } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { FaPencilAlt, FaTrash, FaUpload } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

const DashboardContent: React.FC<DashboardProps> = ({ data, onHover, openDeletePortfolioModal, handleExport }) => {
  const router = useRouter()

  return (
    <Box display="flex" flexWrap="wrap" gap={4} mt="4">
      {data &&
        data.map((portfolio) => (
          <Box
            key={portfolio.id}
            overflow="hidden"
            width="300px"
            flex="1 1 300px"
            mt="4"
            position="relative"
            onDoubleClick={() => {
              router.push(`/portfolio/${portfolio.id}`)
            }}
          >
            <Box
              borderRadius="lg"
              overflow="hidden"
              width="100%"
              height="200px"
              position="relative"
              _hover={{ borderColor: 'brand.primary1', borderWidth: '4px' }}
              className="group"
            >
              {portfolio.image ? (
                <Image
                  src={portfolio.image}
                  borderRadius="lg"
                  alt={portfolio.file_name}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src="/images/notebook.jpg"
                  alt={portfolio.file_name}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              )}

              <Box
                position="absolute"
                top="10px"
                left="10px"
                display="flex"
                gap={2}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.3s"
              >
                <IconButton
                  icon={<FaPencilAlt />}
                  aria-label="수정"
                  size="sm"
                  colorScheme="blue"
                  variant="solid"
                  _hover={{ bg: 'blue.600' }}
                  onClick={() => {
                    router.push(`/portfolio/edit/${portfolio.id}`)
                  }}
                />
                <IconButton
                  icon={<FaUpload />}
                  aria-label="내보내기"
                  size="sm"
                  colorScheme="blue"
                  variant="solid"
                  _hover={{ bg: 'blue.600' }}
                  onClick={() => {
                    handleExport(portfolio.id)
                  }}
                />
              </Box>

              <Box
                position="absolute"
                top="10px"
                right="10px"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.3s"
              >
                <IconButton
                  icon={<FaTrash />}
                  aria-label="삭제"
                  size="sm"
                  colorScheme="red"
                  variant="solid"
                  _hover={{ bg: 'red.600' }}
                  onClick={() => {
                    openDeletePortfolioModal()
                  }}
                  onMouseEnter={() => {
                    onHover({ id: portfolio.id, file_name: portfolio.file_name })
                  }}
                />
              </Box>
            </Box>

            <VStack pt={2} align="start">
              <Text fontWeight="bold" fontSize="xl">
                {portfolio.file_name}
              </Text>
              <Text color="gray.500">
                {formatDistanceToNow(new Date(portfolio.updated_at), { addSuffix: true, locale: ko })}
              </Text>
            </VStack>
          </Box>
        ))}
    </Box>
  )
}

export default DashboardContent
