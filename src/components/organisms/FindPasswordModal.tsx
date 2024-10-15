import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  keyframes,
} from '@chakra-ui/react'
import { useState, ChangeEvent } from 'react'
import Button from '../molecules/DefaultButton'

interface FindPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  openLoginModal: () => void
}

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

const shake = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`

const FindPasswordModal: React.FC<FindPasswordModalProps> = ({ isOpen, onClose, openLoginModal }) => {
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('') // 아이디 상태 추가
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const [shakeKey, setShakeKey] = useState<number>(0)

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value) // 아이디 입력 처리
  }

  const handleSubmit = async () => {
    try {
      // 서버에 아이디와 이메일 전송 요청
      const response = await fetch(`${apiUrl}/api/user/find-pw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }), // 아이디와 이메일 전송
        mode: 'cors',
      })

      if (response.ok) {
        setIsSuccess(true)
        setResultMessage('임시 비밀번호가 이메일로 전송되었습니다.')
        setShakeKey((prev) => prev + 1)
      } else {
        setIsSuccess(false)
        setResultMessage('일치하는 정보가 없습니다.')
        setShakeKey((prev) => prev + 1)
      }
    } catch (error) {
      setIsSuccess(false)
      setResultMessage('일치하는 정보가 없습니다.')
      setShakeKey((prev) => prev + 1)
    }
  }

  const handleClose = () => {
    setEmail('')
    setUsername('') // 아이디도 초기화
    setResultMessage(null)
    setIsSuccess(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>비밀번호 찾기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>아이디</FormLabel>
              <Input
                type="text"
                placeholder="아이디 입력"
                value={username}
                onChange={handleChangeUsername} // 아이디 입력 처리
              />
            </FormControl>

            <FormControl>
              <FormLabel>이메일 주소</FormLabel>
              <Input type="email" placeholder="이메일 입력" value={email} onChange={handleChangeEmail} />
            </FormControl>

            <Button width="100%" onClick={handleSubmit} label="비밀번호 찾기" />
            {resultMessage && (
              <Alert status={isSuccess ? 'success' : 'error'} animation={`${shake} 0.5s`} key={shakeKey}>
                <AlertIcon />
                <AlertTitle>{resultMessage}</AlertTitle>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            theme="gray"
            width="100%"
            onClick={() => {
              handleClose()
              openLoginModal()
            }}
            label="로그인 하러 가기"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FindPasswordModal
