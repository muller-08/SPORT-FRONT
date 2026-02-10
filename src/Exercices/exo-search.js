import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Slide,
  Input,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Card } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';

import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BlenderIcon from '@mui/icons-material/Blender';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import { useExercices } from '../Données/exercices';

export default function ListAct() {
  const [slideIn] = useState(true);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState(1);

  const navigate = useNavigate();
  const { exercices } = useExercices();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollLock = React.useRef(false);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const handleWheel = (e) => {
    if (scrollLock.current || isNavigating) return;

    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);

    if (absX > absY && absX > 60) {
            e.preventDefault();
      scrollLock.current = true;

      setIsNavigating(true);
      setTimeout(() => {
      if (e.deltaX > 0) {
        navigate('/profile');
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
    onSwipedLeft: () => navigateWithReset('/profile'),
    onSwipedRight: () => navigateWithReset('/planning'),
  });

  const filteredExercice = exercices.filter((ex) =>
    ex.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box 
      {...handlers}
      onWheel={handleWheel}
      sx={{ 
        minHeight: '100vh',
        touchAction: 'pan-y',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Card
          sx={{
            p: 1,
            width: '100%',
            maxWidth: 400,
          }}
        >
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
            pb: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {filteredExercice.map((exercice) => (
            <CardActionArea
              key={exercice.id}
              onClick={() => navigate(`/exercice/${exercice.id}`)}
              sx={{
                width: '100%',
                maxWidth: 400,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  px: 1.5,
                  py: isMobile ? 1 : 0.75,
                  display: 'flex',
                  gap: 1.5,
                  width: '100%',
                  '&:hover': { backgroundColor: '#f0f0f0' },
                }}
              >
                <CardMedia
                  component="img"
                  image={exercice.image}
                  alt={exercice.title}
                  sx={{
                    width: isMobile ? 56 : 52,
                    height: isMobile ? 48 : 44,
                    borderRadius: 1,
                    objectFit: 'cover',
                  }}
                />

                <Typography
                  fontWeight="bold"
                  fontSize={isMobile ? '0.95rem' : '0.85rem'}
                  noWrap
                >
                  {exercice.title}
                </Typography>
              </Card>
            </CardActionArea>
          ))}
        </Box>
      </Slide>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            const routes = ['/planning', '/exo-search', '/recettes', '/profile'];
            navigate(routes[newValue]);
          }}
        >
          <BottomNavigationAction label="Planning" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Exercices" icon={<FitnessCenterIcon />} />
          <BottomNavigationAction label="Recettes" icon={<BlenderIcon />} />
          <BottomNavigationAction label="Profile" icon={<PersonOutlineIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
