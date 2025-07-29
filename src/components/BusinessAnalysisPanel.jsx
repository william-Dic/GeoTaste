import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  IconButton,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InsightsIcon from '@mui/icons-material/Insights';

const PanelHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
}));

const AnalysisContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '24px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const AnalysisSection = styled(Paper)(({ theme }) => ({
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const ChatSection = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  backgroundColor: 'rgba(248, 250, 252, 0.8)',
}));

const MessageBubble = styled(Box)(({ isUser, theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  marginBottom: '12px',
  '& .message-content': {
    maxWidth: '100%',
    padding: '12px 16px',
    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    backgroundColor: isUser ? '#667eea' : '#f5f5f5',
    color: isUser ? 'white' : '#333',
    fontSize: '14px',
    lineHeight: 1.5,
    wordWrap: 'break-word',
  }
}));

const AnalysisAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  marginBottom: '8px',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '8px 0',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  backgroundColor: 'rgba(102, 126, 234, 0.1)',
  borderRadius: '8px',
  marginBottom: '12px',
  border: '1px solid rgba(102, 126, 234, 0.2)',
}));

const BusinessAnalysisPanel = ({ cityName, countryCode, onAnalysisReady }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (cityName && countryCode) {
      console.log(`[BusinessAnalysisPanel] 🚀 Starting analysis for ${cityName}, ${countryCode}`);
      generateAnalysis();
    }
  }, [cityName, countryCode]);

  const generateAnalysis = async () => {
    console.log(`[BusinessAnalysisPanel] 🔄 Generating analysis for ${cityName}, ${countryCode}`);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`[BusinessAnalysisPanel] 📡 Making API request to /api/chatgpt-analysis`);
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

      const result = await response.json();
      
      if (result.success) {
        console.log(`[BusinessAnalysisPanel] ✅ Analysis received successfully`);
        setAnalysis(result.analysis);
        setChatMessages([{
          id: Date.now(),
          type: 'assistant',
          content: `Business environment analysis for ${cityName}, ${countryCode} is now ready. You can ask me specific questions about the market, opportunities, or any other business insights.`,
          timestamp: new Date()
        }]);
        onAnalysisReady();
      } else {
        console.error(`[BusinessAnalysisPanel] ❌ Analysis failed:`, result.error);
        setError(result.error || 'Failed to generate analysis');
      }
    } catch (error) {
      console.error(`[BusinessAnalysisPanel] 💥 Exception:`, error);
      setError('Network error occurred while generating analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!inputMessage.trim() || isChatLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsChatLoading(true);

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

      const result = await response.json();

      if (result.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: result.response,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const parseAnalysisSections = (analysisText) => {
    if (!analysisText) return [];
    
    const sections = [];
    const lines = analysisText.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for section headers (bold text with **)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Save previous section if exists
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.join('\n').trim()
          });
        }
        
        // Start new section
        currentSection = trimmedLine.replace(/\*\*/g, '');
        currentContent = [];
      } else if (currentSection && trimmedLine) {
        currentContent.push(line);
      }
    }
    
    // Add the last section
    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.join('\n').trim()
      });
    }
    
    return sections;
  };

  const getSectionIcon = (sectionTitle) => {
    const title = sectionTitle.toLowerCase();
    if (title.includes('market overview')) return <AssessmentIcon />;
    if (title.includes('diversity')) return <TrendingUpIcon />;
    if (title.includes('quality')) return <BusinessIcon />;
    if (title.includes('opportunity')) return <InsightsIcon />;
    if (title.includes('competitive')) return <SmartToyIcon />;
    if (title.includes('consumer')) return <TrendingUpIcon />;
    if (title.includes('executive')) return <AssessmentIcon />;
    return <BusinessIcon />;
  };

  const analysisSections = parseAnalysisSections(analysis);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <PanelHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Business Environment Analysis
          </Typography>
        </Box>
        <IconButton 
          onClick={generateAnalysis}
          disabled={isLoading}
          sx={{ color: 'white' }}
        >
          <RefreshIcon />
        </IconButton>
      </PanelHeader>

      {/* Content */}
      <AnalysisContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" color="text.secondary">
              Analyzing business environment for {cityName}...
            </Typography>
          </Box>
        ) : error ? (
          <AnalysisSection>
            <Typography variant="h6" color="error" gutterBottom>
              Analysis Error
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={generateAnalysis}
              sx={{ mt: 2 }}
            >
              Retry Analysis
            </Button>
          </AnalysisSection>
        ) : (
          <>
            {/* Main Analysis */}
            <AnalysisSection>
              <SectionHeader>
                <SmartToyIcon sx={{ color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#26324B' }}>
                  Business Environment Analysis
                </Typography>
              </SectionHeader>
              
              {analysisSections.length > 0 ? (
                <Box>
                  {analysisSections.map((section, index) => (
                    <AnalysisAccordion key={index} defaultExpanded={index < 2}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getSectionIcon(section.title)}
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {section.title}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            lineHeight: 1.6,
                            color: '#374151',
                            '& strong': { fontWeight: 600, color: '#1f2937' }
                          }}
                        >
                          {section.content}
                        </Typography>
                      </AccordionDetails>
                    </AnalysisAccordion>
                  ))}
                </Box>
              ) : (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    '& strong': { fontWeight: 600 }
                  }}
                >
                  {analysis}
                </Typography>
              )}
            </AnalysisSection>

            {/* Interactive Chat */}
            <AnalysisSection>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#26324B', mb: 2 }}>
                Ask Questions
              </Typography>
              
              <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
                {chatMessages.slice(1).map((message) => (
                  <MessageBubble key={message.id} isUser={message.type === 'user'}>
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
                  </MessageBubble>
                ))}
                
                {isChatLoading && (
                  <MessageBubble isUser={false}>
                    <Box className="message-content">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography>Analyzing...</Typography>
                      </Box>
                    </Box>
                  </MessageBubble>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask about the business environment..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isChatLoading}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: 'rgba(245, 245, 245, 0.8)',
                    }
                  }}
                />
                <IconButton
                  onClick={sendChatMessage}
                  disabled={!inputMessage.trim() || isChatLoading}
                  sx={{
                    bgcolor: '#667eea',
                    color: 'white',
                    '&:hover': { bgcolor: '#5a6fd8' },
                    '&:disabled': { bgcolor: '#ccc' }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </AnalysisSection>
          </>
        )}
      </AnalysisContent>
    </Box>
  );
};

export default BusinessAnalysisPanel; 