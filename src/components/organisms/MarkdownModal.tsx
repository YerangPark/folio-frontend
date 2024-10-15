import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
// eslint-disable-next-line import/no-extraneous-dependencies
import rehypeRaw from 'rehype-raw'
// eslint-disable-next-line import/no-extraneous-dependencies
import remarkGfm from 'remark-gfm'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'

interface MarkdownModalProps {
  isOpen: boolean
  onClose: () => void
  mdFilePath: string // .md 파일의 경로
}

const fetchMarkdownContent = async (mdFilePath: string): Promise<string> => {
  try {
    const response = await fetch(mdFilePath)
    const content = await response.text()
    return content
  } catch (error) {
    console.error('Markdown 파일을 불러오는 중 오류 발생:', error)
    return ''
  }
}

const MarkdownModal: React.FC<MarkdownModalProps> = ({ isOpen, onClose, mdFilePath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('')

  console.log(`mdFilePath : ${mdFilePath}`)
  // .md 파일 읽어오기
  useEffect(() => {
    if (isOpen && mdFilePath) {
      fetchMarkdownContent(mdFilePath).then((content) => {
        setMarkdownContent(content)
      })
    }
  }, [isOpen, mdFilePath])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Markdown 내용 보기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="markdown">
            <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MarkdownModal
