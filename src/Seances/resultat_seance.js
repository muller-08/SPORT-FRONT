import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  FormControl,
  Stack,
} from '@mui/material';

import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable'; 

import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RepeatIcon from '@mui/icons-material/Repeat';

export default function FinSeance() {
  const navigate = useNavigate();

  const handlers = useSwipeable({
      onSwipedLeft: () => navigate('/exo-search'),
      onSwipedRight: () => navigate('/profile'),
      trackTouch: true,
      trackMouse: false,
      delta: 80,
      preventScrollOnSwipe: false,
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }} {...handlers}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'black' }}>
        <Toolbar>
          <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" component="h1" fontWeight="bold">
            Résultats
          </Typography>
        </Toolbar>
      </AppBar>
        <Box sx={{ display:'flex', gap: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="black">
            Nouvelle séance
          </Typography>
          </Box>
          <Box sx={{ gap : 2 }}>
            <Typography variant="h7" sx={{ mb: 3 }}>
              Séance effectué le JJ/MMMM/YYYY à 00:00
            </Typography>
            </Box>
          <Box sx={{ gap : 2 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
              Résumé
            </Typography>
            </Box>

        <Card sx={{ borderRadius: 4, mb: 3, boxShadow: 1 }}>
          <CardContent sx={{ p: 2 }}>
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
                  00:00:00
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
                  0 kg
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
                  0
                </Typography>
              </Box>
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
                    <BarChartIcon />
                  </Box>
                  <Typography variant="body1">Difficulté</Typography>
                </Box>
                <Typography variant="h6" fontWeight="600">
                  5/10
                </Typography>
              </Box>
          </CardContent>
        </Card>

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
                <FormControl fullWidth variant="standard" sx= {{ fontWeight:'bold', fontSize:'1.25rem', padding: 0}}>
                    En forme
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
                <FormControl fullWidth variant="standard" sx={{
                      fontWeight: 'bold',
                      fontSize: '1.25rem',}}
                      >
                        Moyenne
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
                <FormControl fullWidth variant="standard"
                  sx={{
                      fontWeight: 'bold',
                      fontSize: '1.25rem',}}
                      >
                        Bien
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
            Circuits
          </Typography>
        </Box>

        <Typography variant='h6' fontWeight="600" sx={{ mb: 2 }}>
            Performances 
        </Typography>
    <Stack spacing={2}>
      <Card
        variant="outlined"
        sx={{
          px: 1,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          width: 400,
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CardMedia
            image="https://picsum.photos/300?9"
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
            }}
          />
          <Box>
            <Typography fontWeight="bold">
              Ab Wheel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aucune performance enregistrée
            </Typography>
          </Box>
        </Box>
      </Card>

      <Card
        variant="outlined"
        sx={{
          px: 1,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          width: 400,
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CardMedia
            image="https://picsum.photos/300?10"
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
            }}
          />
          <Box>
            <Typography fontWeight="bold">
              Abduction de la jambe à la poulie basse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aucune performance enregistrée
            </Typography>
          </Box>
        </Box>
      </Card>

      <Card
        variant="outlined"
        sx={{
          px: 1,
          py: 0.5,
          display: 'flex',
          alignItems: 'center',
          width: 400,
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CardMedia
            image="https://picsum.photos/300?11"
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
            }}
          />
          <Box>
            <Typography fontWeight="bold">
              Abduction des jambes à la machine
              </Typography>
            <Typography variant="body2" color="text.secondary">
              Aucune performance enregistrée
            </Typography>
          </Box>
        </Box>
      </Card>
    </Stack>
    </Box>
  );
}
