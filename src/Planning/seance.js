import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable'; 
import {
  AppBar,
  Slide,
  Box,
  Typography,
  Button,
  Toolbar,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import { Card } from '@mui/joy';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import CardMedia from '@mui/material/CardMedia';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';

export default function SeanceDetail() {
  const [slideIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { seanceId } = useParams();
  
  const [seance, setSeance] = useState(null);
  
  const scrollLock = React.useRef(false);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const handleWheel = (e) => {
    if (scrollLock.current || isNavigating) return;

    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);

    if (absX > absY && absX > 60) {
      scrollLock.current = true;

      setIsNavigating(true);
      setTimeout(() => {
      if (e.deltaX > 0) {
        navigate(`/seance/${seanceId}/blocs`);
      } else {
        navigate('/planning');
      }
      }, 100)
    }
  };

  const navigateWithReset = (path) => {
    scrollLock.current = false;  
    navigate(path);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => navigateWithReset(`/seance/${seanceId}/blocs`),
    onSwipedRight: () => navigateWithReset('/Planning'),
  });

  useEffect(() => {
    if (location.state?.seance) {
      setSeance(location.state.seance);
      return;
    }

    try {
      const saved = localStorage.getItem('seancesCalendrier');
      if (saved) {
        const calendarSeances = JSON.parse(saved);
        for (const dateKey in calendarSeances) {
          const found = calendarSeances[dateKey].find(s => s.id === parseInt(seanceId));
          if (found) {
            setSeance(found);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche dans localStorage:', error);
    }
  }, [seanceId, location.state]);

  if (!seance) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Séance non trouvée</Typography>
        <Button onClick={() => navigate('/planning')}>Retour</Button>
      </Box>
    );
  }

  const ExerciseCard = ({ exercice, onClick }) => {
    if (!exercice) return null;

    return (
      <Card
        variant="outlined"
        sx={{
          px: 1,
          py: 1.5,
          gap: 1.5,
          minHeight: 42,
          cursor: 'pointer',
          display: 'flex',
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
        onClick={onClick}
      >
        <CardMedia
          component="img"
          image={exercice.image || 'https://picsum.photos/80/60'}
          alt={exercice.name}
          sx={{
            width: 80,
            height: 60,
            borderRadius: 1,
            flexShrink: 0,
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Typography fontWeight="bold" sx={{ fontSize: '0.85rem', lineHeight: 1.1 }}>
            {exercice.name}
          </Typography>

          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
            {exercice.groupe1 && (
              <Chip
                label={exercice.groupe1}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  bgcolor: '#e3f2fd',
                  color: '#1976d2',
                }}
              />
            )}
            {exercice.groupe2 && (
              <Chip
                label={exercice.groupe2}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  bgcolor: '#e8f5e9',
                  color: '#2e7d32',
                }}
              />
            )}
          </Stack>

          {exercice.series && exercice.series.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {exercice.series.length} série{exercice.series.length > 1 ? 's' : ''}
            </Typography>
          )}

          {exercice.note && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
              {exercice.note}
            </Typography>
          )}
        </Box>
      </Card>
    );
  };

  return (
    <>
    <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
      <Toolbar disableGutters sx={{ position: 'relative', height: 50 }}>
        <IconButton onClick={() => navigate("/planning")}>
          <ArrowBackIosIcon sx={{ color: '#000000' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
      <Toolbar disableGutters sx={{ position: 'relative', height: 350 }}>
        <Slide direction="right" in={slideIn} timeout={300}>
          <Card
            {...handlers}
            onWheel={handleWheel} 
            sx={{ 
              width: '100%', 
              height: '100%' 
            }}
          >
            <CardCover>
              <img src={seance.image || 'https://picsum.photos/800/400'} alt="background" />
            </CardCover>
            <CardCover
              sx={{
                background: 'linear-gradient(to top, rgba(0,0,0,.6), rgba(0,0,0,0))',
              }}
            />
            <CardContent sx={{ position: 'absolute', top: 5, left: 5 }}>
              <IconButton onClick={() => navigate("/planning")}>
                <ArrowBackIosIcon sx={{ color: '#fff' }} />
              </IconButton>
            </CardContent>
          </Card>
        </Slide>
      </Toolbar>
      <Slide direction="right" in={slideIn} timeout={300}>
        <Box
          {...handlers}
          onWheel={handleWheel}
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,   
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                {seance.title}
              </Typography>

              {seance.date && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {seance.date}
                </Typography>
              )}
            </Box>

            <IconButton 
              onClick={() => navigate('/creer-seance', { 
                state: { 
                  seance,
                  dateKey: location.state?.dateKey 
                } 
              })}
              sx={{ 
                bgcolor: '#f5f5f5',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          {seance.description && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {seance.description}
            </Typography>
          )}

          <Button
            variant="contained"
            startIcon={<PlayCircleFilledIcon/>}
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: '#000',
              borderRadius: 3,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#333' },
            }}
            onClick={() => navigate(`/seance/${seanceId}/blocs`, {
              state: { seance }
            })}
          >
            Démarrer la séance
          </Button>

          {/* Affichage sections + exercices */}
          {seance.sections && seance.sections.map((section, sectionIndex) => (
            <Box key={section.id} sx={{ mt: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 1.5 
              }}>
                <Typography variant="h6" fontWeight="bold">
                  #{sectionIndex + 1} - {section.title}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={section.type}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.75rem',
                      bgcolor: '#e3f2fd',
                      color: '#1976d2',
                    }}
                  />
                  {section.tracked && (
                    <Chip
                      label="Suivi"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.75rem',
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                      }}
                    />
                  )}
                </Stack>
              </Box>

              {/* Liste exercices blocs */}
              {section.exercices && section.exercices.length > 0 ? (
               <Stack spacing={1}>
                  {section.exercices.map((exercice, exIndex) => (
                    <ExerciseCard 
                      key={exercice.id}
                      exercice={exercice}
                      onClick={() => {
                        navigate(`/exercice/${exercice.exerciceId}`);
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Box sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 2 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucun exercice dans ce bloc
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Slide>
    </>
  );
}
