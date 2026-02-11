import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { notifySeanceCompleted } from '../Données/notifService';
import { useSwipeable } from 'react-swipeable'; 

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RepeatIcon from '@mui/icons-material/Repeat';

export default function FinSeance() {
  const [fatiguePost, setFatiguePost] = useState('En forme');
  const [difficulte, setDifficulte] = useState('Moyenne');
  const [satisfaction, setSatisfaction] = useState('Bien');
  const [commentaire, setCommentaire] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { seanceId } = useParams();

  const sessionTimer = location.state?.sessionTimer || 0;
  const coachNote = location.state?.coachNote || '';
  
  const performances = useMemo(
    () => location.state?.performances || [],
    [location.state?.performances]
  );

  const fatigueOptions = ['Fatigué', 'En forme', 'Très en forme'];
  const difficulteOptions = ['Facile', 'Moyenne', 'Difficile'];
  const satisfactionOptions = ['Pas satisfait', 'Bien', 'Très bien'];

  const [stats, setStats] = useState({
    duration: '00:00:00',
    tonnage: 0,
    series: 0,
  });
  
  const handlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackTouch: true,
    trackMouse: false,
    delta: 80,
    preventScrollOnSwipe: false,
  });

  useEffect(() => {
    const hours = Math.floor(sessionTimer / 3600);
    const minutes = Math.floor((sessionTimer % 3600) / 60);
    const seconds = sessionTimer % 60;
    const durationFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    let totalTonnage = 0;
    let totalSeries = 0;

    performances.forEach(exercice => {
      if (exercice.performances) {
        exercice.performances.forEach(perf => {
          if (perf.poids && perf.reps) {
            totalTonnage += perf.poids * perf.reps;
          }
          totalSeries++;
        });
      }
    });

    setStats({
      duration: durationFormatted,
      tonnage: totalTonnage,
      series: totalSeries,
    });

    if (coachNote) {
      setCommentaire(coachNote);
    }
  }, [sessionTimer, performances, coachNote]);

  const handleSaveSeance = () => {
    try {
      const saved = localStorage.getItem('seancesCalendrier');
      if (saved) {
        const calendarSeances = JSON.parse(saved);
        
        let seanceToUpdate = null;
        
        for (const dateKey in calendarSeances) {
          const seanceIndex = calendarSeances[dateKey].findIndex(s => s.id === parseInt(seanceId));
          if (seanceIndex !== -1) {
            seanceToUpdate = calendarSeances[dateKey][seanceIndex];
            calendarSeances[dateKey][seanceIndex] = {
              ...seanceToUpdate,
              done: true,
              isActive: false,
              type: 'Terminé',
              duration: stats.duration,
              performances: performances,
              stats: {
                fatiguePost,
                difficulte,
                satisfaction,
                commentaire,
                tonnage: stats.tonnage,
                series: stats.series,
                completedAt: new Date().toISOString()
              }
            };
            
            notifySeanceCompleted(seanceToUpdate.title, stats);
            break;
          }
        }
        
        localStorage.setItem('seancesCalendrier', JSON.stringify(calendarSeances));
        
        const planningSeances = JSON.parse(localStorage.getItem('planningSeances') || '[]');
        const updatedPlanning = planningSeances.filter(s => s.id !== parseInt(seanceId));
        localStorage.setItem('planningSeances', JSON.stringify(updatedPlanning));
        
        navigate('/save_seance', {
          state: {
            stats: stats,
            seanceId: seanceId
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la séance:', error);
      navigate("/planning");
    }
  };

  return (
    <Box {...handlers} sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'black' }}>
        <Toolbar>
          <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(`/seance/${seanceId}/execute`)}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" component="h1" fontWeight="bold">
            Fin de séance
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display:'flex', gap: 2, mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="black">
            Résumé de la séance
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
            Statistiques
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4, mb: 3, boxShadow: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#f5f5f5',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccessTimeIcon />
                  </Box>
                  <Typography variant="body1">Durée</Typography>
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {stats.duration}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#f5f5f5',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FitnessCenterIcon />
                  </Box>
                  <Typography variant="body1">Tonnage</Typography>
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {stats.tonnage.toFixed(1)} kg
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#f5f5f5',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RepeatIcon />
                  </Box>
                  <Typography variant="body1">Séries</Typography>
                </Box>
                <Typography variant="h6" fontWeight="600">
                  {stats.series}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
            Ressentis
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Fatigue pré-séance
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  En forme
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Fatigue post-séance
                </Typography>
                <FormControl fullWidth variant="standard">
                  <Select
                    value={fatiguePost}
                    onChange={(e) => setFatiguePost(e.target.value)}
                    disableUnderline
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      '& .MuiSelect-select': {
                        padding: 0,
                      },
                    }}
                  >
                    {fatigueOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Difficulté
                </Typography>
                <FormControl fullWidth variant="standard">
                  <Select
                    value={difficulte}
                    onChange={(e) => setDifficulte(e.target.value)}
                    disableUnderline
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      '& .MuiSelect-select': {
                        padding: 0,
                      },
                    }}
                  >
                    {difficulteOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 1 }}>
              <CardContent>
                <Typography variant='body2' color="text.secondary" sx={{ mb: 1 }}>
                    Satisfaction
                </Typography>
                <FormControl fullWidth variant="standard">
                  <Select
                    value={satisfaction}
                    onChange={(e) => setSatisfaction(e.target.value)}
                    disableUnderline
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.25rem',
                      '& .MuiSelect-select': {
                        padding: 0,
                      },
                    }}
                  >
                    {satisfactionOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="600" sx={{ mb: 2 }}>
            Ajoute un commentaire
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Pour ton coach"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            sx={{
              bgcolor: '#f5f5f5',
              borderRadius: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          />
        </Box>

        <Button
          onClick={handleSaveSeance}
          fullWidth
          variant="contained"
          sx={{
            bgcolor: '#1976d2',
            borderRadius: 30,
            py: 2,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#1565c0',
            },
          }}
        >
          ENREGISTRER LA SÉANCE
        </Button>
      </Box>
    </Box>
  );
}
