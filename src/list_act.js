import React, { useState, useEffect } from 'react';
import { List, Slide, CardHeader, CardMedia, CardContent } from '@mui/material';
import { Card, Typography, Box, Button } from '@mui/joy';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function ListAct() {
  const [slideIn] = useState(true);
  const [timer, setTimer] = useState(0);
  const Navigate = useNavigate();
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
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            edge="start"
            sx={{ color: '#000' }}
            aria-label="retour"
            onClick={() => Navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#000' }}>
            {formatTime(timer)}
          </Typography>
          
          
          <Box sx={{ width: 720 }} />
        </Toolbar>
      </AppBar>

      <Slide
        direction="right"
        in={slideIn}
        timeout={300}
        mountOnEnter
        unmountOnExit
        onExited={() => console.log('/exo-act')}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 10,
            alignItems: 'center',
          }}
        >
          <Typography level="title-lg" textColor="#000">
            Callisthénie 6
          </Typography>
          <Button
            sx={{
              alignSelf: 'center',
              backgroundColor: '#000000ff',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              }
            }}
            variant="contained"
            onClick={() => Navigate('/exo-act')}>
            Démarrer la séance
          </Button>
          <Card
            orientation="horizontal"
            variant="plain"
            sx={{ minHeight: 140, p: 2, width: '100%', maxWidth: 400, cursor: 'pointer' }}
          >
            <List sx={{ width: '100%' }}>
              <Typography fontWeight="bold">#1 – Échauffement</Typography>

              <CardHeader
                title="Activité 1"
              />

              <CardMedia
                component="img"
                height="97"
                image="https://via.placeholder.com/150"
              />

              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Exemple
                </Typography>
              </CardContent>

              <CardHeader
                title="Activité 2"
              />

              <CardMedia
                component="img"
                height="97"
                image="https://via.placeholder.com/150"
              />

              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Exemple
                </Typography>
              </CardContent>

              <CardHeader
                title="Activité 3"
              />

              <CardMedia
                component="img"
                height="97"
                image="https://via.placeholder.com/150"
              />

              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Exemple
                </Typography>
              </CardContent>

              <Typography fontWeight="bold" sx={{ mt: 2 }}>
                #2 – Callisthénie
              </Typography>
              <CardHeader
                title="Activité 1"
              />

              <CardMedia
                component="img"
                height="97"
                image="https://via.placeholder.com/150"
              />

              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Exemple
                </Typography>
              </CardContent>
              <CardHeader
                title="Activité 2"
              />

              <CardMedia
                component="img"
                height="97"
                image="https://via.placeholder.com/150"
              />

              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Exemple
                </Typography>
              </CardContent>
              <CardHeader
                title="Activité 3"
              />

              <CardMedia
                component="img"
                height="97"
                image="https://via.placeholder.com/150"
              />

              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Exemple
                </Typography>
              </CardContent>
            </List>
          </Card>
        </Box>
      </Slide>
    </>
  );
}