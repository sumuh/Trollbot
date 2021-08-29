import React, { useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet'

import useChat from '../../services/chat'
import ChatMessage from './ChatMessage'
import useTyping from './useTyping'
import NewMessageForm from './MessageForm'
import TypingMessage from './TypingMessage'
import Users from './Users'
import { TITLE } from '../../config'
import AvatarGroup from '@material-ui/lab/AvatarGroup'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

const ChatRoom = (props) => {
  const { roomId } = props.match.params
  const {
    messages,
    users,
    typingUsers,
    sendMessage,
    sendMessageToBot,
    startTypingMessage,
    stopTypingMessage,
  } = useChat(roomId)
  const [newMessage, setNewMessage] = useState('')
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: 'smooth' })
    }
  }, [messages])

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value)
  }

  const handleSendMessage = (event) => {
    event.preventDefault()
    cancelTyping()
    console.log('newMessage, handleSendMessage', newMessage)
    sendMessage(newMessage)
    sendMessageToBot(newMessage)
    setNewMessage('')
  }

  useEffect(() => {
    if (isTyping) startTypingMessage()
    else stopTypingMessage()
  }, [isTyping])

  const uniqueUsers = [...new Set(users)].filter(u => u.name !== undefined)
  const uniqueTyping = [...new Set(typingUsers)].filter(u => u.name !== undefined)

  return (
    <Container>
      <Helmet>
        <title>{`Room: ${roomId} - ${TITLE}`}</title>
      </Helmet>
      <Box mt={10}>
        <Typography variant='h2' paragraph>Room: {roomId}</Typography>
        <Users title='People:' users={uniqueUsers} />
        <List>
          <ul style={{ listStyleType: 'none' }} >
            {messages.map((message, i) => (
              <li key={i}>
                <ListItem>
                  <ChatMessage message={message} />
                </ListItem>
              </li>
            ))}
            <li ref={scrollRef} />
          </ul>
        </List>
      </Box>
      <ul style={{ listStyleType: 'none' }} >
        <Box mb={10}>
          <AvatarGroup max={3}>
            {uniqueTyping.map((u, i) => (
              <li key={i}>
                <TypingMessage user={u} />
              </li>
            ))}
          </AvatarGroup>
        </Box>
      </ul>
      <NewMessageForm
        newMessage={newMessage}
        handleNewMessageChange={handleNewMessageChange}
        handleStartTyping={startTyping}
        handleStopTyping={stopTyping}
        handleSendMessage={handleSendMessage}
      />
    </Container >
  )
}

export default ChatRoom
