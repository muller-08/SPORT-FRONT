import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { CircularProgress } from '@mui/joy';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
export default function RecipeReviewCard() {
    const [slideIn] = useState(true);
    const [progress, setProgress] = useState(0);
    const [timer, setTimer] = useState(0);
    const Navigate = useNavigate();

    useEffect(() => {
      const progressTimer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 1000);

      return () => clearInterval(progressTimer);
    }, []);
    
    useEffect(() => {
      const timeTimer = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(timeTimer);
    }, []);
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
      <>
      <AppBar position="fixed" sx={{ backgroundColor: '#ffffffff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            edge="start"
            sx={{ color: '#000000ff' }}
            aria-label="retour"
            onClick={() => Navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ color: '#000', fontWeight: 'bold' }}>
              {formatTime(timer)}
            </Typography>
            <Box sx={{ width: 760 }} />
          </Toolbar>
        </AppBar>

        <Slide
          direction="right"
          in={slideIn}
          timeout={300}
          mountOnEnter
          unmountOnExit
        >
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexDirection: 'column', 
            padding: 2, 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            maxWidth: 600, 
            margin: '0 auto',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
              Callisthénie 6
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <Typography sx={{ textAlign: 'center' }}>
              Sélectionne un bloc de cette séance pour effectuer les exercices prescrits par ton coach. Les blocs avec suivi nécessitent une validation des performances pour ton coach. Une fois terminé, valide ta séance.
            </Typography>
            </Box>
            {/* Card Échauffement */}
            <Card variant="outlined" sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardHeader
                  title="Échauffement"
                  titleTypographyProps={{ variant: 'h6' }}
                  subheaderTypographyProps={{ variant: 'caption' }}
                />
                <CardContent sx={{ flex: 1, paddingY: 0 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    8 exercices - Sans suivi
                  </Typography>
                </CardContent>
              </Box>
              <Fab
                size="small"
                color="primary"
                onClick={() => Navigate('/echauffement')}
                sx={{ marginRight: 1, backgroundColor: 'transparent', color: 'primary.main' }}
              >
                {'>'}
              </Fab>
            </Card>
            
            {/* Card Callisthénie */}
            <Card variant="outlined" sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardHeader
                  title="Callisthénie"
                  titleTypographyProps={{ variant: 'h6' }}
                  subheaderTypographyProps={{ variant: 'caption' }}
                />
                <CardContent sx={{ flex: 1, paddingY: 0 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    6 exercices - Avec suivi:
                  </Typography>
                </CardContent>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginRight: 1 }}>
                <Typography>{progress}%</Typography>
                <CircularProgress 
                  determinate 
                  value={progress} 
                  size="sm"
                  sx={{ '--CircularProgress-size': '40px' }}
                />
                <Fab
                  size="small"
                  color="primary"
                  onClick={() => console.log('Navigation vers callisthénie')}
                  sx={{ backgroundColor: 'transparent', color: 'primary.main' }}
                >
                  {'>'}
                </Fab>
              </Box>
            </Card>

            <Fab
              size="medium"
              variant="extended"
              sx={{ backgroundColor: 'primary.main', color: 'white', marginTop: 3, alignSelf: 'center' }}
              onClick={() => console.log('Valider la séance')}
            >
              Valider la séance
            </Fab>
          </Box>
        </Slide>
      </>
    );
}