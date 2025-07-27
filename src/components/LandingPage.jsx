import React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Button, Typography, Box } from '@mui/material';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LandingPageContainer = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(45deg, #f5f5f7, #e0e0e0, #f5f5f7, #d7d7d7)',
  backgroundSize: '400% 400%',
  animation: `${gradientAnimation} 15s ease infinite`,
  color: '#1d1d1f',
  textAlign: 'center',
  padding: '20px',
  zIndex: 10,
  overflow: 'hidden',
});

const ContentContainer = styled(Box)({
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled(Typography)({
  fontWeight: 700,
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  marginBottom: '20px',
  letterSpacing: '-0.02em',
  animation: `${fadeInUp} 1s ease-out forwards`,
  animationDelay: '0.5s',
  opacity: 0,
});

const Subtitle = styled(Typography)({
  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
  marginBottom: '40px',
  maxWidth: '600px',
  color: '#6e6e73',
  animation: `${fadeInUp} 1s ease-out forwards`,
  animationDelay: '0.8s',
  opacity: 0,
});

const CTAButton = styled(Button)({
  backgroundColor: '#0071e3',
  color: 'white',
  borderRadius: '9999px',
  padding: '15px 35px',
  fontSize: '1rem',
  fontWeight: 600,
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#147ce5',
    transform: 'scale(1.05)',
  },
  animation: `${fadeInUp} 1s ease-out forwards`,
  animationDelay: '1.1s',
  opacity: 0,
});

const GlassyOrb = styled(Box)(({ top, left, size, delay }) => ({
    position: 'absolute',
    top,
    left,
    width: size,
    height: size,
    background: 'rgba(0, 113, 227, 0.15)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    animation: `${fadeInUp} 2s ease-out forwards`,
    animationDelay: delay,
    opacity: 0,
}));


const LandingPage = ({ onEnter }) => {
  return (
    <LandingPageContainer>
      <GlassyOrb top="-10%" left="5%" size="300px" delay="1.5s" />
      <GlassyOrb top="50%" left="60%" size="400px" delay="1.8s" />
      <GlassyOrb top="20%" left="80%" size="250px" delay="2.1s" />
      
      <ContentContainer>
        <Title variant="h1">Welcome to GeoTaste</Title>
        <Subtitle variant="h2">
          Discover the world's business landscape. Get instant insights and visualizations for any city.
        </Subtitle>
        <CTAButton variant="contained" onClick={onEnter}>
          Explore the Map
        </CTAButton>
      </ContentContainer>
    </LandingPageContainer>
  );
};

export default LandingPage; 