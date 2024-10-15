'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import DashboardNavBar from '../organisms/DashboardNavBar'
import { Heading } from '../atoms/Text'
import EmptyDashboardContents from '../organisms/EmptyDashboardContents'
import DashboardContent from '../organisms/DashboardContent'
import DeletePortfolioModal from '../organisms/DeletePortfolioModal'
import FadeNotification from '../organisms/FadeNotification'
import Button from '../atoms/Button'

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

const DashboardPage: React.FC = () => {
  const router = useRouter()
  const [portfolios, setPortfolios] = useState([])
  const [isDeletePortfolioModalOpen, setDeletePortfolioModalOpen] = useState(false)
  const openDeletePortfolioModal = () => setDeletePortfolioModalOpen(true)

  const [selectedPortfolio, setSelectedPortfolio] = useState({ id: 0, file_name: '' })
  const [notificationMessage, setNotificationMessage] = useState<string>('')
  const [showNotification, setShowNotification] = useState(false)
  const [username, setUsername] = useState('')

  const getUserInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        mode: 'cors',
      })

      const res = await response.json()
      if (res.success) {
        setUsername(res.data.username)
      } else if (response.status === 400 && res.error.code === 'USER_NOT_FOUND') {
        console.error('유저를 찾을 수 없습니다.')
      } else {
        console.error('유저 정보 조회에 실패했습니다.')
      }
    } catch (error) {
      console.error('에러가 발생했습니다.')
    }
  }

  const fetchPortfolioList = async () => {
    const token = localStorage.getItem('token')

    if (token) {
      fetch(`${apiUrl}/api/portfolios/brief`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
      })
        .then((response) => {
          if (response.status === 401) {
            console.error('토큰이 만료되었습니다.')
            localStorage.removeItem('token')
            router.push('/')
            return null
          }
          if (response.ok) {
            return response.json()
          }
          throw new Error('잘못된 응답')
        })
        .then((data) => {
          if (data && data.success) {
            const fetchedPortfolios = data.data.map((portfolio: any) => {
              return {
                ...portfolio,
                image: portfolio.image != null ? `${apiUrl}/uploads/${portfolio.image}` : portfolio.image,
              }
            })
            setPortfolios(fetchedPortfolios)
          } else {
            console.error('잘못된 데이터', data)
          }
        })
        .catch((error) => {
          console.error('포트폴리오 조회 실패:', error)
          router.push('/')
        })
    } else {
      console.log('토큰이 없습니다')
      router.push('/')
    }
  }

  const closeDeletePortfolioModal = () => {
    setDeletePortfolioModalOpen(false)
    fetchPortfolioList()
  }

  useEffect(() => {
    fetchPortfolioList()
    getUserInfo()
  }, [])

  return (
    <div>
      <DashboardNavBar />
      <hr />
      <Box mx="10" mt="5">
        <Box display="flex" justifyContent="space-between">
          <Heading content="대시보드" fontSize="2xl" color="brand.text1" />
          <Button
            leftIcon={<FaPlus />}
            aria-label="새로 만들기"
            size="sm"
            color="white"
            bg="brand.primary1"
            _hover={{ bg: 'brand.background3', color: 'brand.text3' }}
            onClick={() => {
              router.push('/portfolio/create')
            }}
          >
            새로 만들기
          </Button>
        </Box>
        {portfolios.length > 0 ? (
          <DashboardContent
            data={portfolios}
            onHover={setSelectedPortfolio}
            openDeletePortfolioModal={openDeletePortfolioModal}
            handleExport={(portfolioId) => {
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://yrpark.duckdns.org'
              const publicUrl = `${baseUrl}/${username}/${portfolioId}`
              navigator.clipboard
                .writeText(publicUrl)
                .then(() => {
                  setNotificationMessage('내보내기 링크가 복사되었습니다.')
                  setShowNotification(true)
                })
                .catch((err) => {
                  console.error('링크 복사 중 오류가 발생했습니다:', err)
                  setNotificationMessage('링크 복사 중 오류가 발생했습니다.')
                  setShowNotification(true)
                })
            }}
          />
        ) : (
          <EmptyDashboardContents />
        )}
      </Box>
      <DeletePortfolioModal
        isOpen={isDeletePortfolioModalOpen}
        onClose={closeDeletePortfolioModal}
        portfolioId={selectedPortfolio.id}
        portfolioFileName={selectedPortfolio.file_name}
        onDeleteComplete={() => {
          setNotificationMessage('포트폴리오가 삭제되었습니다.')
          setShowNotification(true)
        }}
      />
      {showNotification && (
        <FadeNotification
          message={notificationMessage}
          onNotificationClose={() => {
            setShowNotification(false)
          }}
        />
      )}
    </div>
  )
}

export default DashboardPage
