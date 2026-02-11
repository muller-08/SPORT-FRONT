import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slide,
  Input,
  Checkbox,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { Card } from '@mui/joy';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from 'react-swipeable'; 

import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useExercices } from '../Données/exercices';

export default function ListAct() {
  const [slideIn] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  
  const { exercices } = useExercices();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const exercicesToReplaceId = location.state?.exercicesToReplaceId;
  const returnUrl = location.state?.returnUrl;

  const filteredExercises = exercices.filter((ex) =>
    ex.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectExercice = (exercice) => {
    setSelectedId(exercice.id);

    const newExercice = {
      id: `replaced-${Date.now()}`,
      exerciceId: exercice.id,
      name: exercice.title,
      groupe1: exercice.groupe1,
      groupe2: exercice.groupe2,
      image: exercice.image || 'https://picsum.photos/80',
      note: exercice.note || '',
      series: Array(4).fill(null).map((_, index) => ({
        id: `replaced-${Date.now()}-s${index + 1}`,
        reps: '12',
        duration: '',
        rpe: '8',
        type: 'reps',
      })),
      checked: [],
      performances: [],
      tab: 0,
    };
    navigate(returnUrl || '/planning', {
      state: {
        replacementData: {
          exercicesToReplaceId,
          newExercice
        }
      }
    });
  };

  const isSelected = (id) => selectedId === id;

  const handlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackTouch: true,
    trackMouse: false,
    delta: 80,
    preventScrollOnSwipe: false,
  });

  return (
    <Box {...handlers}>
      <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000', boxShadow: 1 }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(returnUrl || '/planning')}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" component="h1" fontWeight="bold">
            Remplacer l'exercice
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ p: 1, width: '100%', maxWidth: 400 }}>
          <Input
            fullWidth
            startAdornment={<SearchIcon />}
            placeholder="Rechercher un exercice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card>
      </Box>

      <Slide direction="right" in={slideIn} timeout={300}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {filteredExercises.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Aucun exercice trouvé
              </Typography>
            </Box>
          ) : (
            filteredExercises.map((exercice) => {
              const selected = isSelected(exercice.id);

              return (
                <CardActionArea
                  key={exercice.id}
                  onClick={() => handleSelectExercice(exercice)}
                  sx={{ borderRadius: 2, width: '100%', maxWidth: 400 }}
                >
                  <Card
                    sx={{
                      px: 1,
                      py: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      backgroundColor: selected ? '#caf3ce' : 'white',
                      '&:hover': {
                        backgroundColor: selected ? '#d4fad6' : '#f5f5f5',
                      },
                    }}
                  >
                    <Checkbox
                      checked={selected}
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon sx={{ color: '#36913b' }} />}
                      sx={{ pointerEvents: 'none' }}
                    />

                    <CardMedia
                      component="img"
                      image={exercice.image || 'https://picsum.photos/52/44'}
                      alt={exercice.title}
                      sx={{ width: 52, height: 44, borderRadius: 1, objectFit: 'cover' }}
                    />

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold" fontSize="0.85rem">
                        {exercice.title}
                      </Typography>
                      {(exercice.groupe1 || exercice.groupe2) && (
                        <Typography variant="caption" color="text.secondary">
                          {[exercice.groupe1, exercice.groupe2].filter(Boolean).join(' • ')}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </CardActionArea>
              );
            })
          )}
        </Box>
      </Slide>
    </Box>
  );
}
