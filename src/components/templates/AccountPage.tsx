'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react'
import isTokenExpired from '@/utils/TokenExpiredChecker'
import { Heading } from '../atoms/Text'
import DashboardNavBar from '../organisms/DashboardNavBar'
import AccountForm from '../organisms/AccountForm'
import Button from '../atoms/Button'
import FadeNotification from '../organisms/FadeNotification'

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

const AccountPage: React.FC = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showSaveNotification, setShowSaveNotification] = useState(false)

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
        setName(res.data.name)
        setBirthdate(res.data.birthdate)
        setEmail(res.data.email)
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

  // 토큰 유효성 검사
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token')
      router.push('/')
    } else {
      getUserInfo()
    }
    // 유저 정보 GET하는 부분
  }, [])

  const saveUserInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name,
          birthdate,
          email,
          password,
        }),
        mode: 'cors',
      })

      const res = await response.json()
      if (res.success) {
        console.log('수정 성공')
        setShowSaveNotification(true)
      } else if (response.status === 400 && res.error.code === 'USER_NOT_FOUND') {
        console.error('유저를 찾을 수 없습니다.')
      } else {
        console.error('유저 정보 조회에 실패했습니다.')
      }
    } catch (error) {
      console.error('에러가 발생했습니다.')
    }
  }

  return (
    <div>
      <DashboardNavBar />
      <hr />
      <Box mx="10" mt="5">
        <Box display="flex" justifyContent="space-between">
          <Heading content="개인정보 수정" fontSize="2xl" color="brand.text1" />
        </Box>
        <AccountForm
          name={name}
          birthdate={birthdate}
          email={email}
          username={username}
          password={password}
          confirmPassword={confirmPassword}
          setName={setName}
          setBirthdate={setBirthdate}
          setEmail={setEmail}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
        />
        <Button mt="4" bg="brand.primary1" color="white" onClick={saveUserInfo}>
          저장
        </Button>
      </Box>
      {showSaveNotification && (
        <FadeNotification
          message="개인정보가 수정되었습니다."
          onNotificationClose={() => {
            setShowSaveNotification(false)
          }}
        />
      )}
    </div>
  )
}

export default AccountPage
