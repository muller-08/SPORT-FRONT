import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';

import CardActionArea from '@mui/material/CardActionArea';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useSeances } from '../Données/seancepage';

export default function ExoAct() {
  const [slideIn] = useState(true);
  const [timer, setTimer] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { seanceId } = useParams();
  
  const { getSeanceById } = useSeances();
  const seance = getSeanceById(seanceId);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const timeTimer = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeTimer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  if (!seance) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Séance non trouvée</Typography>
        <Button onClick={() => navigate('/planning')}>Retour</Button>
      </Box>
    );
  }

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton edge="start" sx={{ color: '#000' }} onClick={() => navigate(`/seance/${seanceId}`)}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
              {formatTime(timer)}
            </Typography>
          </Box>

          <IconButton sx={{ color: '#000' }} onClick={toggleDrawer(true)}>
            <MoreHorizIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(`/seance/${seanceId}`)}>
                <ListItemText primary="Retour à la séance" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/planning')}>
                <ListItemText primary="Retour au planning" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => console.log('Abandonner la séance')}>
                <ListItemText primary="Abandonner la séance" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Toolbar />

      <Slide direction="right" in={slideIn} timeout={300} mountOnEnter unmountOnExit>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            px: isMobile ? 1.5 : 2,
            maxWidth: isMobile ? '100%' : 700,
            margin: '0 auto',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
            {seance.title}
          </Typography>

          <Typography sx={{ textAlign: 'left', mb: 2 }}>
            Sélectionne un bloc de cette séance pour effectuer les exercices prescrits par ton coach. Les blocs avec suivi nécessitent une validation des performances pour ton coach. Une fois terminé, valide ta séance.
          </Typography>

          {seance.sections.map((section, index) => (
            <Card 
              key={section.id} 
              variant="outlined" 
              sx={{ width: '100%', borderRadius: '15px' }}
            >
              <CardActionArea
                onClick={() => navigate(`/seance/${seanceId}/section/${section.id}`)}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  px: 2, 
                  '&:hover': { backgroundColor: '#eeeeee' } 
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardHeader 
                    title={`#${index + 1} - ${section.title}`} 
                    sx={{ pb: 0 }}
                  />
                  <CardContent sx={{ py: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      {section.exerciceIds?.length || 0} exercices - {section.tracked ? 'Avec suivi' : 'Sans suivi'}
                    </Typography>
                  </CardContent>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {section.tracked && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      0%
                    </Typography>
                  )}
                  <ArrowForwardIosIcon sx={{ color: '#b6b6b6' }} />
                </Box>
              </CardActionArea>
            </Card>
          ))}

          <Button 
            size="medium" 
            variant="contained" 
            sx={{ 
              backgroundColor: 'primary.main', 
              color: '#fff', 
              mt: 3, 
              alignSelf: 'center', 
              borderRadius: 30,
              px: 4,
              py: 1.5
            }} 
            onClick={() => navigate('/valideseance')}
          >
            Valider la séance
          </Button>
        </Box>
      </Slide>
    </>
  );
}
