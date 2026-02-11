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
  Chip,
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable'; 

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircularProgress from '@mui/material/CircularProgress';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export default function BlocSeance() {
  const [slideIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { seanceId } = useParams();
  const [seance, setSeance] = useState(null);

  const handlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackTouch: true,
    trackMouse: false,
    delta: 80,
    preventScrollOnSwipe: false,
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

  const calculateBlockProgress = (section) => {
    if (!section.exercices || section.exercices.length === 0) return 0;
    
    const draft = localStorage.getItem(`seance-exec-${seanceId}`);
    if (!draft) return 0;

    try {
      const parsed = JSON.parse(draft);
      const savedCards = parsed.cards || [];
      
      let totalSeries = 0;
      let completedSeries = 0;

      section.exercices.forEach(exercice => {
        const savedExercice = savedCards.find(c => c.id === exercice.id);
        if (savedExercice && savedExercice.series) {
          totalSeries += savedExercice.series.length;
          completedSeries += (savedExercice.checked || []).length;
        } else if (exercice.series) {
          totalSeries += exercice.series.length;
        }
      });

      return totalSeries > 0 ? Math.round((completedSeries / totalSeries) * 100) : 0;
    } catch (error) {
      return 0;
    }
  };

  const handleStartBlock = (sectionId) => {
    navigate(`/seance/${seanceId}/execute`, {
      state: {
        sectionId: sectionId,
        seance: seance
      }
    });
  };

  const handleValidateSeance = () => {
    navigate(`/fin-seance/${seanceId}`);
  };

  return (
    <Box {...handlers}>
      <AppBar
        position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box          
           sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton edge="start" sx={{ color: '#000' }} onClick={() => navigate(`/seance/${seanceId}`)}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
              {seance.title}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Slide direction="right" in={slideIn} timeout={300}>
        <Box {...handlers}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: 2,
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
            Sélectionne un bloc
          </Typography>

          <Typography sx={{ textAlign: 'left', mb: 2, color: 'text.secondary' }}>
            Sélectionne un bloc de cette séance pour effectuer les exercices prescrits. Les blocs avec suivi nécessitent une validation des performances. Une fois tous les blocs terminés, valide ta séance.
          </Typography>

          {seance.sections && seance.sections.map((section, sectionIndex) => {
            const progress = calculateBlockProgress(section);
            const exerciceCount = section.exercices?.length || 0;

            return (
              <Box {...handlers} >
              <Card 
                onClick={() => handleStartBlock(section.id)}
                key={section.id}
                variant="outlined" 
                sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: progress === 100 ? '#4caf50' : '#e0e0e0',
                  '&:hover': {
                    borderColor: progress === 100 ? '#4caf50' : '#1976d2',
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                <Box
                sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardHeader 
                    onClick={() => handleStartBlock(section.id)}
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          #{sectionIndex + 1} - {section.title}
                        </Typography>
                      </Box>
                    }
                    sx={{ pb: 0 }}
                  />
                  <CardContent sx={{ py: 0, pt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FitnessCenterIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {exerciceCount} exercice{exerciceCount > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">•</Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: section.tracked ? '#2e7d32' : '#fd4141',
                          fontWeight: 500
                        }}
                      >
                        {section.tracked ? 'Avec suivi' : 'Sans suivi'}
                      </Typography>

                      {section.type && (
                        <>
                          <Typography variant="body2" color="text.secondary">•</Typography>
                          <Chip
                            label={section.type}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: '#e3f2fd',
                              color: '#1976d2',
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, marginRight: 2 }}>
                  {progress > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        sx={{ color: progress === 100 ? '#4caf50' : 'text.primary' }}
                      >
                        {progress}%
                      </Typography>
                      <CircularProgress 
                        variant="determinate" 
                        value={progress} 
                        size={40}
                        sx={{
                          color: progress === 100 ? '#4caf50' : '#1976d2',
                        }}
                      />
                    </Box>
                  )}
                  <IconButton 
                    onClick={() => handleStartBlock(section.id)}
                    sx={{
                      bgcolor: progress === 100 ? '#e8f5e9' : '#e3f2fd',
                      '&:hover': {
                        bgcolor: progress === 100 ? '#c8e6c9' : '#bbdefb',
                      }
                    }}
                  >
                    <ArrowForwardIosIcon 
                      sx={{ 
                        color: progress === 100 ? '#4caf50' : '#1976d2' 
                      }} 
                    />
                  </IconButton>
                </Box>
              </Card>
              </Box>
            );
          })}

          <Button 
            size="large" 
            variant="contained" 
            sx={{ 
              backgroundColor: '#1976d2', 
              color: '#fff', 
              mt: 3, 
              alignSelf: 'center', 
              borderRadius: 10,
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }} 
            onClick={handleValidateSeance}
          >
            Valider la séance
          </Button>
        </Box>
      </Slide>
    </Box>
  );
}
