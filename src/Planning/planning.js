import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  CardActionArea,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Slide,
} from '@mui/material';
import { useSwipeable } from 'react-swipeable'; 

import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EventIcon from '@mui/icons-material/Event';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function Planning() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [seancesCalendrier, setSeancesCalendrier] = useState({});
  const [slideIn] = useState(true);

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate('/exo-search'),
    onSwipedRight: () => navigate('/profile'),
    trackTouch: true,
    trackMouse: false,
    delta: 80,
    preventScrollOnSwipe: false,
  });

  const seanceHandlers = useSwipeable({
    onSwiping: (e) => e.event.stopPropagation(),
    trackTouch: true,
    preventScrollOnSwipe: false,
  });

  useEffect(() => {
    const loadSeances = () => {
      try {
        const saved = localStorage.getItem('seancesCalendrier');
        if (saved) {
          setSeancesCalendrier(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des séances:', error);
      }
    };

    loadSeances();
 
    window.addEventListener('focus', loadSeances);
    
    return () => window.removeEventListener('focus', loadSeances);
  }, []);

  const seancesActives = Object.entries(seancesCalendrier).flatMap(([dateKey, seances]) => 
    seances
      .filter(s => s.isActive && !s.done) 
      .map(s => ({
        ...s,
        dateKey,
      }))
  );

  const countExercices = (sections) => {
    if (!sections || !Array.isArray(sections)) return 0;
    return sections.reduce((total, section) => {
      return total + (section.exercices?.length || 0);
    }, 0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('fr-FR');
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Box 
      {...handlers}
      minHeight="100vh" 
      display="flex" 
      flexDirection="column"
      sx={{ touchAction: 'pan-y' }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography level="title-lg" fontWeight="bold" sx={{ color:"#000", fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Hello User
          </Typography>
          <Box>
            <IconButton sx={{ color: '#000' }} onClick={() => navigate('/calendrier')}>
              <EventIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' } }} />
            </IconButton>
            <IconButton sx={{ color: '#000' }} onClick={() => navigate('/notifs')}>
              <NotificationsNoneIcon sx={{ fontSize: { xs: '1.3rem', sm: '1.5rem' } }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />
    
      <Box flexGrow={1} />
      
      <Box mb={7}>
        <Slide direction="right" in={slideIn} timeout={300}>
          <Box sx={{ 
            px: 2, 
            mb: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Typography level="title-lg" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Entraînement
            </Typography>
          </Box>
        </Slide>
        
        {seancesActives.length === 0 ? (
          <Box sx={{ px: 2, py: 8, textAlign: 'center' }}>
            <Typography level="body-lg" sx={{ color: '#666', mb: 2, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
              Aucune séance active
            </Typography>
            <Typography level="body-sm" sx={{ color: '#999', mb: 3, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
              Créez des séances depuis le calendrier pour commencer votre entraînement
            </Typography>
          </Box>
        ) : (
          <Box
            {...seanceHandlers}
            sx={{
              mb: 2,
              px: 2,
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Slide direction="right" in={slideIn} timeout={300}>
              <Grid container spacing={1} wrap="nowrap">
                {seancesActives.map((seance) => (
                  <Grid
                    key={`${seance.dateKey}-${seance.id}`}
                    sx={{
                      minWidth: '100%',
                    }}
                  >
                    <Card
                      sx={{
                        height: {
                          xs: 200,
                          sm: 220,
                          md: 250,
                          lg: 270,
                          xl: 300,
                        },
                        borderRadius: 15,
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <CardActionArea
                        onClick={() => navigate(`/seance/${seance.id}`, { 
                          state: { 
                            seance,
                            dateKey: seance.dateKey 
                          } 
                        })}
                        sx={{ height: '100%' }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: '#0000ff',
                            color: '#fff',
                            px: { xs: 1.2, sm: 1.5 },
                            py: 0.5,
                            borderRadius: 5,
                            fontSize: { xs: 11, sm: 12 },
                            fontWeight: 'bold',
                            zIndex: 2,
                          }}
                        >
                          En cours
                        </Box>

                        <CardCover
                          sx={{
                            borderRadius: 15,
                            background:
                              'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0) 60%)',
                          }}
                        />

                        <img
                          src={seance.image || 'https://picsum.photos/400/300'}
                          alt={seance.title}
                          loading="lazy"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 15,
                          }}
                        />

                        <CardContent
                          sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: 16,
                            right: 16,
                          }}
                        >
                          <Typography 
                            level="title-lg" 
                            fontWeight="bold" 
                            sx={{ 
                              position:'absolute', 
                              bottom: 30, 
                              color:'#ffffff',
                              maxWidth: '70%',
                              fontSize: { xs: '1rem', sm: '1.25rem' },
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            }}
                          >
                            {seance.title}
                          </Typography>
                          <Box
                            sx={{
                              position:'absolute',
                              bottom: 10,
                              width: { xs: 140, sm: 180 },
                              height: 2,
                              bgcolor: "white",
                              my: 2,
                              opacity: 0.7,
                            }}
                          />
                          <Typography sx={{ 
                            color: 'white', 
                            fontSize: { xs: 12, sm: 14 },
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          }}>
                            {seance.sections?.length || 0} blocs | {countExercices(seance.sections)} exercices
                          </Typography>
                          
                          <Typography 
                            sx={{ 
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              color: 'white',
                              fontSize: { xs: 10, sm: 11 },
                              opacity: 0.9,
                              bgcolor: 'rgba(0,0,0,0.4)',
                              px: { xs: 0.8, sm: 1 },
                              py: 0.4,
                              borderRadius: 6,
                              backdropFilter: 'blur(4px)',
                              fontWeight: 600,
                            }}
                          >
                            {formatDate(seance.date)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Slide>
          </Box>
        )}
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} xs={6} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            const routes = ['/planning', '/exo-search', '/profile'];
            navigate(routes[newValue]);
          }}
        >
          <BottomNavigationAction label="Planning" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Exercices" icon={<FitnessCenterIcon />} />
          <BottomNavigationAction label="Profile" icon={<PersonOutlineIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
