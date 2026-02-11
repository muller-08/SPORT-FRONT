import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Card,
  CardMedia,
  Button,
  CardActionArea,
  Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useSwipeable } from 'react-swipeable'; 

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

import { format, addDays, startOfMonth, endOfMonth, isToday, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CalendarList() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const todayRef = useRef(null);
  const itemRefs = useRef({});
  const seanceRefs = useRef({});
  const observerRef = useRef(null);
  const [slideIn] = useState(true);

  const [seancesParJour, setSeancesParJour] = useState(() => {
    try {
      const saved = localStorage.getItem('seancesCalendrier');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Erreur lors du chargement des séances:', error);
      return {};
    }
  });
  
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [lastCreatedId, setLastCreatedId] = useState(null);

  const RANGE = 2;
  const currentDate = new Date();

  const months = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    months.push(addMonths(currentDate, i));
  }

  const allDays = months.flatMap(monthDate => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  });

  const handlers = useSwipeable({
    onSwipedRight: () => navigate('/planning'),
    trackTouch: true,
    trackMouse: false,
    delta: 80,
    preventScrollOnSwipe: false,
  });

  useEffect(() => {
    try {
      localStorage.setItem('seancesCalendrier', JSON.stringify(seancesParJour));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des séances:', error);
    }
  }, [seancesParJour]);

  useEffect(() => {
    const handleFocus = () => {
      try {
        const saved = localStorage.getItem('seancesCalendrier');
        if (saved) {
          setSeancesParJour(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erreur lors du rechargement des séances:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const scrollToToday = () => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const addSeance = dateKey => {
    const newSeance = {
      id: Date.now(),
      title: 'Nouvelle séance',
      image: 'https://picsum.photos/300',
      done: false,
      isActive: false,
      type: 'Brouillon',
      date: dateKey, 
      dateKey: dateKey, 
      description: '',
      duration: '00:00:00',
      sections: [
        {
          id: `section-${Date.now()}-1`,
          title: 'Échauffement',
          type: 'Musculation',
          tracked: false,
          exercices: [], 
          expanded: true,
        },
        {
          id: `section-${Date.now()}-2`,
          title: 'Corps de séance',
          type: 'Musculation',
          tracked: true,
          exercices: [], 
          expanded: true,
        },
      ],
    };

    setSeancesParJour(prev => {
      const updated = {
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newSeance]
      };
      
      try {
        localStorage.setItem('seancesCalendrier', JSON.stringify(updated));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
      
      return updated;
    });

    setLastCreatedId(newSeance.id);

    navigate('/creer-seance', { 
      state: { 
        seance: newSeance,
        dateKey: dateKey
      } 
    });
  };

  const toggleEffectue = (dateKey, seanceId) => {
    setSeancesParJour(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map(s =>
        s.id === seanceId ? { ...s, done: !s.done } : s
      )
    }));
  };

  useEffect(() => {
    if (lastCreatedId && seanceRefs.current[lastCreatedId]) {
      seanceRefs.current[lastCreatedId].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setLastCreatedId(null);
    }
  }, [seancesParJour, lastCreatedId]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) {
          setActiveMonth(new Date(visible.target.dataset.date));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    Object.values(itemRefs.current).forEach(el => el && observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, [allDays]);


const handleDeleteAllStorage = () => {
  localStorage.clear();
};



  return (
    <Box {...handlers}
    sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <AppBar position="fixed" sx={{ bgcolor: '#fff', color: '#000', boxShadow: 0 }}>
        <Toolbar>
          <IconButton onClick={() => navigate('/planning')}>
            <ArrowBackIosIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 'bold', mx: 2 }}>
            {format(activeMonth, 'MMMM yyyy', { locale: fr })}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleDeleteAllStorage}>
              Clear
            </Button>
          <IconButton onClick={scrollToToday}>
            <EventIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <List>
        {allDays.map((date, index) => {
          const today = isToday(date);
          const dateKey = format(date, 'yyyy-MM-dd');
          const seances = seancesParJour[dateKey] || [];

          return (
            <React.Fragment key={index}>
              <Slide direction="right" in={slideIn} timeout={300}>
              <ListItem
                ref={el => {
                  if (el) {
                    itemRefs.current[dateKey] = el;
                    if (today) todayRef.current = el;
                  }
                }}
                data-date={dateKey}
                sx={{ alignItems: 'flex-start', py: 2, px: 2 }}
              >
                <Box sx={{ width: 4, height: 50, bgcolor: today ? '#2979ff' : '#e0e0e0', borderRadius: 2, mr: 2, mt: 0.5 }} />
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                        {format(date, 'EEE', { locale: fr })}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {format(date, 'd')}
                      </Typography>
                    </Box>

                    <Button size="small" startIcon={<AddIcon />} onClick={() => addSeance(dateKey)}>
                    </Button>
                  </Box>

                  {seances.map(seance => {
                    if (!seance || !seance.id) {
                      return null;
                    }

                    return (
                      <CardActionArea
                        key={seance.id}
                        ref={el => (seanceRefs.current[seance.id] = el)}
                        onClick={() => navigate('/creer-seance', { 
                          state: { 
                            seance,
                            dateKey 
                          } 
                        })}
                        sx={{ borderRadius: 2, overflow: 'hidden', mb: 1 }}
                      >
                        <Card 
                          sx={{ 
                            px: 1, 
                            py: 0.5, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            opacity: seance.isActive ? 1 : 0.5,
                            bgcolor: seance.isActive ? '#fff' : '#f5f5f5'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CardMedia
                              component="img"
                              image={seance.image || 'https://picsum.photos/300'}
                              sx={{ width: isMobile ? 44 : 52, height: isMobile ? 40 : 44, borderRadius: 1 }}
                            />
                            <Box>
                              <Typography fontWeight="bold" fontSize="0.85rem" noWrap>
                                {seance.title || 'Sans titre'}
                              </Typography>
                              {!seance.isActive && (
                                <Typography fontSize="0.7rem" color="text.secondary">
                                  Brouillon
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <IconButton
                            onClick={e => {
                              e.stopPropagation();
                              toggleEffectue(dateKey, seance.id);
                            }}
                            disabled={!seance.isActive}
                          >
                            {seance.done
                              ? <CheckCircleIcon sx={{ color: '#16be16' }} />
                              : <CancelIcon sx={{ color: '#992424' }} />}
                          </IconButton>
                        </Card>
                      </CardActionArea>
                    );
                  })}
                </Box>
            </ListItem>
              </Slide>
              <Divider sx={{ ml: 8 }} />
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
}
