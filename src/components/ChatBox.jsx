import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Fade,
  Collapse
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const ChatContainer = styled(Box)(({ isOpen, isCompact }) => ({
  position: 'fixed',
  left: isOpen ? '20px' : '-400px',
  bottom: '20px',
  width: '380px',
  height: '500px',
  zIndex: 1000,
  transition: 'left 0.3s ease-in-out',
  '@media (max-width: 768px)': {
    width: '320px',
    left: isOpen ? '10px' : '-320px',
  }
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '16px 20px',
  borderRadius: '16px 16px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
  }
}));

const ChatBody = styled(Paper)(({ theme }) => ({
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '0 0 16px 16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));

const MessageBubble = styled(Box)(({ isUser, theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  '& .message-content': {
    maxWidth: '280px',
    padding: '12px 16px',
    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    backgroundColor: isUser ? '#667eea' : '#f5f5f5',
    color: isUser ? 'white' : '#333',
    fontSize: '14px',
    lineHeight: 1.4,
    wordWrap: 'break-word',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  left: '20px',
  bottom: '20px',
  width: '60px',
  height: '60px',
  backgroundColor: '#667eea',
  color: 'white',
  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
  '&:hover': {
    backgroundColor: '#5a6fd8',
    transform: 'scale(1.05)',
  },
  '@media (max-width: 768px)': {
    left: '10px',
    width: '50px',
    height: '50px',
  }
}));

const ChatBox = ({ cityName, countryCode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialAnalysis, setHasInitialAnalysis] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasInitialAnalysis && cityName && countryCode) {
      generateInitialAnalysis();
    }
  }, [isOpen, cityName, countryCode, hasInitialAnalysis]);

  const generateInitialAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chatgpt-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: cityName,
          country: countryCode,
          limit: 30
        }),
      });

      const data = await response.json();
      
      if (data.success && data.analysis) {
        setMessages([
          {
            id: 1,
            type: 'assistant',
            content: `🤖 **Business Environment Analysis for ${cityName}**\n\n${data.analysis}\n\n💡 You can ask me specific questions about the business environment, market opportunities, or any other business-related topics!`,
            timestamp: new Date()
          }
        ]);
        setHasInitialAnalysis(true);
      } else {
        setMessages([
          {
            id: 1,
            type: 'assistant',
            content: `Hello! I'm your business analyst assistant for ${cityName}. I can help you understand the local business environment, market opportunities, and provide insights based on the data we have. What would you like to know?`,
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error generating initial analysis:', error);
      setMessages([
        {
          id: 1,
          type: 'assistant',
          content: `Hello! I'm your business analyst assistant for ${cityName}. I can help you understand the local business environment, market opportunities, and provide insights based on the data we have. What would you like to know?`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: cityName,
          country: countryCode,
          message: inputMessage
        }),
      });

      const data = await response.json();
      
      if (data.success && data.response) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {!isOpen && (
        <ToggleButton onClick={() => setIsOpen(true)}>
          <ChatIcon />
        </ToggleButton>
      )}

      <ChatContainer isOpen={isOpen} isCompact={false}>
        <ChatHeader onClick={() => setIsOpen(false)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Business Analyst
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </ChatHeader>

        <ChatBody>
          <MessagesContainer>
            {messages.map((message) => (
              <MessageBubble key={message.id} isUser={message.type === 'user'}>
                {message.type === 'assistant' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Box>
                  <Box className="message-content">
                    <Typography 
                      component="div" 
                      sx={{ 
                        whiteSpace: 'pre-line',
                        '& strong': { fontWeight: 600 }
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary', 
                      ml: message.type === 'user' ? 0 : 4,
                      mt: 0.5,
                      display: 'block'
                    }}
                  >
                    {formatTimestamp(message.timestamp)}
                  </Typography>
                </Box>
                {message.type === 'user' && (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#4ECDC4' }}>
                    <BusinessIcon />
                  </Avatar>
                )}
              </MessageBubble>
            ))}
            
            {isLoading && (
              <MessageBubble isUser={false}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                  <SmartToyIcon />
                </Avatar>
                <Box>
                  <Box className="message-content">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography>Analyzing...</Typography>
                    </Box>
                  </Box>
                </Box>
              </MessageBubble>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about the business environment..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px',
                  backgroundColor: 'rgba(245, 245, 245, 0.8)',
                }
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                bgcolor: '#667eea',
                color: 'white',
                '&:hover': { bgcolor: '#5a6fd8' },
                '&:disabled': { bgcolor: '#ccc' }
              }}
            >
              <SendIcon />
            </IconButton>
          </InputContainer>
        </ChatBody>
      </ChatContainer>
    </>
  );
};

export default ChatBox; 