import * as React from "react";
import {
  Slide,
  Box,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Card, Typography } from '@mui/joy';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { useMediaQuery } from '@mui/material';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from 'swiper/modules'; 
import LinearProgress from '@mui/joy/LinearProgress';     

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DoneIcon from '@mui/icons-material/Done';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TimerIcon from '@mui/icons-material/Timer';

export default function SeanceExecute() {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [seance, setSeance] = useState(null);
  const [slideIn] = useState(true);
  const [timer, setTimer] = useState(0);

  const [cards, setCards] = useState([]);
  const [originalCards, setOriginalCards] = useState([]);

  const [replacedExercices, setReplacedExercices] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ cardId: null, setIndex: null });
  
  const [reps, setReps] = useState(0);
  const [poids, setPoids] = useState(0);
  const [time, setTime] = useState(0);
  
  const [superDialog, setSuperDialog] = useState(false);
  const [timerDialogOpen, setTimerDialogOpen] = useState(false); 
  
  const [restTimer, setRestTimer] = useState(60); 
  const [restTimerActive, setRestTimerActive] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');

  
  useEffect(() => {
    const saveProgress = () => {
      if (!seance) return;

      const sectionId = location.state?.sectionId;
      const storageKey = `seance-exec-${seanceId}-${sectionId || 'all'}`;

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          timer,
          cards, 
          restTimer,
          restTimerActive,
          sectionId,
          savedAt: Date.now()
        })
      );
    };

    const timeoutId = setTimeout(saveProgress, 500);

    return () => {
      clearTimeout(timeoutId);
      saveProgress();
    };
  }, [timer, cards, restTimer, restTimerActive, seance, seanceId, location.state]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('seancesCalendrier');
      if (!saved) return;

      const calendarSeances = JSON.parse(saved);

      for (const dateKey in calendarSeances) {
        const found = calendarSeances[dateKey].find(
          s => s.id === parseInt(seanceId)
        );

        if (!found) continue;

        setSeance(found);

        const sectionId = location.state?.sectionId;
        
        let exercicesToLoad = [];
        if (sectionId) {
          const selectedSection = found.sections?.find(s => s.id === sectionId);
          exercicesToLoad = selectedSection?.exercices || [];
        } else {
          exercicesToLoad = found.sections?.flatMap(s => s.exercices || []) || [];
        }
        const draft = localStorage.getItem(`seance-exec-${found.id}-${sectionId || 'all'}`);

        if (draft) {
          const parsed = JSON.parse(draft);
          setTimer(parsed.timer ?? 0);
          setCards(parsed.cards ?? exercicesToLoad);
          setRestTimer(parsed.restTimer ?? 60);
          setRestTimerActive(parsed.restTimerActive ?? false);
        } else {
          setCards(exercicesToLoad);
        }

        setOriginalCards(JSON.parse(JSON.stringify(exercicesToLoad)));

      }
    } catch (error) {
      console.error("Erreur chargement séance:", error);
    }
  }, [seanceId, location.state]);

  useEffect(() => {
    if (location.state?.replacementData) {
      const { exercicesToReplaceId, newExercice } = location.state.replacementData;
      
      setCards((prev) =>
        prev.map((c) =>
          c.id === exercicesToReplaceId ? newExercice : c
        )
      );
      
      setReplacedExercices((prev) => ({
        ...prev,
        [newExercice.id]: true
      }));

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => { 
    let interval; 
    if (restTimerActive && restTimer > 0) { 
      interval = setInterval(() => { 
        setRestTimer((prev) => prev - 1); 
      }, 1000);
    } else if (restTimer === 0) { 
      setRestTimerActive(false); 
    }
    return () => clearInterval(interval); 
  }, [restTimerActive, restTimer]); 

  const addRestTime = (seconds) => { 
    setRestTimer((prev) => prev + seconds); 
  };
    
  const formatRestTime = (seconds) => {
    const mins = Math.floor(seconds / 60); 
    const secs = seconds % 60; 
    return `${mins}:${secs.toString().padStart(2, '0')}`; 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeDisplay = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCheckboxClick = (cardId, setIndex) => {
    const card = cards.find(c => c.id === cardId);
    
    if (card.checked && card.checked.includes(setIndex)) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? {
                ...c,
                checked: c.checked.filter((i) => i !== setIndex),
                performances: (c.performances || []).filter((p) => p.setIndex !== setIndex)
              }
            : c
        )
      );
    } else {
      setCurrentEdit({ cardId, setIndex });

      const existingPerf = card.performances?.find(p => p.setIndex === setIndex);
      
      setReps(existingPerf?.reps || 0);
      setPoids(existingPerf?.poids || 0);
      setTime(existingPerf?.time || 0);
      
      setDialogOpen(true);
    }
  };

  const handleDialogConfirm = () => {
    const { cardId, setIndex } = currentEdit;
    
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              checked: [...(c.checked || []), setIndex],
              performances: [
                ...(c.performances || []).filter(p => p.setIndex !== setIndex),
                { setIndex, reps, poids, time }
              ]
            }
          : c
      )
    );
    setSuperDialog(false);
    setDialogOpen(false);
    setTimerDialogOpen(true);
    setRestTimer(60);
    setRestTimerActive(true);
    setReps(0);
    setPoids(0);
    setTime(0);
    setCurrentEdit({ cardId: null, setIndex: null });
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setReps(0);
    setPoids(0);
    setTime(0);
    setCurrentEdit({ cardId: null, setIndex: null });
  };

  const handleDialogOpen = () => {
    setSuperDialog(true);
  };

  const handleDialogClose = () => {
    setSuperDialog(false);
  };
  
  const groupedCards = [];
  for (let i = 0; i < cards.length; i += 2) {
    groupedCards.push(cards.slice(i, i + 2));
  }

  const functionRemplacer = (exercicesId) => {
    navigate("/remplacerexo", {
      state: {
        exercicesToReplaceId: exercicesId,
        returnUrl: `/seance/${seanceId}/execute`
      }
    });
  };

  const functionAnnulerRemplacement = (exercicesId) => {
    const originalExercices = originalCards.find(c => c.id === exercicesId);
    
    if (originalExercices) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === exercicesId ? {...originalExercices} : c
        )
      );
      
      setReplacedExercices((prev) => {
        const newState = { ...prev };
        delete newState[exercicesId];
        return newState;
      });
    }
  };

  const renderExercicesCard = (card, showSuperset) => {
    const isReplaced = replacedExercices[card.id];
    
    return (
      <Box sx={(theme) => ({
        textAlign: 'center',
        [theme.breakpoints.up('md')]: {textAlign:'left'}
      })} key={card.id}>
        {showSuperset && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{ borderRadius: 10, fontWeight:"bold" }}
              onClick={handleDialogOpen} 
            >
              SUPERSET
            </Button>
          </Box>
        )}

        <Dialog
          open={superDialog}
          onClose={handleDialogClose}
          maxWidth="xs"
          BackdropProps={{
            sx: { 
              boxShadow: 0 
            }
          }}
        >
          <DialogTitle sx={{ textAlign: "center" }}>Superset</DialogTitle>
          <DialogContent>
            <Typography>Enchainez les séries des 2 exercices sans prendre de temps de repos. Reposez-vous lorsque vous avez effectué une série de chaque exercice.</Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button 
            onClick={handleDialogClose} 
              sx={{ 
                fontWeight: 'bold',
                 color:'black' 
              }}
            >
              COMPRIS
              </Button>
          </DialogActions>
        </Dialog>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <Box 
          sx={{ width: "100%", p: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <CardActionArea 
                sx={{ position:'relative', display: "flex", alignItems: "center", gap: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/exercice/${card.exerciceId}`)
                }}
              >
                <CardMedia
                  component="img"
                  image={card.image || 'https://picsum.photos/156/76'}
                  alt="thumbnail"
                  sx={{ width: 160, height: 80, borderRadius: 1, objectFit: "cover" }}
                />
                <AssignmentIcon sx={{ color: "#002fff" }} />
                <Typography fontWeight="bold">{card.name}</Typography>
              </CardActionArea>

              {card.note && (
                <Typography fontStyle="italic">{card.note}</Typography>
              )}

              <Tabs
                sx={(theme) => ({
                  [theme.breakpoints.up('xs')]: {justifyContent: 'center'},
                  [theme.breakpoints.up('sm')]: {justifyContent: 'left'},
                })}
                value={card.tab || 0}
                onChange={(e, v) =>
                  setCards((prev) =>
                    prev.map((c) => (c.id === card.id ? { ...c, tab: v } : c))
                  )
                }
              >
                <Tab label="Prescriptions" />
                <Tab label="Performances" />
              </Tabs>

              {(card.tab || 0) === 0 ? (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                  <Table size={isMobile ? "small" : "medium"} sx={{ minWidth: 280 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 1 : 2 }}>#</TableCell>
                        <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>
                          Reps/Durée
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>RPE</TableCell>
                        <TableCell align="center" sx={{ px: isMobile ? 0.5 : 2, width: isMobile ? 40 : 60 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(card.series || []).map((serie, index) => (
                        <TableRow 
                          key={serie.id}
                          sx={{  
                            opacity: (card.checked || []).includes(index) ? 0.4 : 1,
                            pointerEvents: (card.checked || []).includes(index) ? "none" : "auto"
                          }}
                        >
                          <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 1 : 2 }}>
                            {index + 1}
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>
                            {serie.type === 'reps' 
                              ? (serie.reps || '-')
                              : `${serie.duration || '-'}s`
                            }
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>
                            {serie.rpe || '-'}
                          </TableCell>
                          <TableCell align="center" sx={{ px: isMobile ? 0.5 : 2 }}>
                            <Checkbox
                              icon={<DoneOutlineIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />}
                              checkedIcon={<DoneIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />}
                              checked={(card.checked || []).includes(index)}
                              disabled={(card.checked || []).includes(index)}
                              onChange={() => handleCheckboxClick(card.id, index)}
                              sx={{ 
                                p: isMobile ? 0.5 : 1,
                                '& .MuiSvgIcon-root': {
                                  fontSize: isMobile ? '1.2rem' : '1.5rem'
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                  <Table size={isMobile ? "small" : "medium"} sx={{ minWidth: 280 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 1 : 2 }}>#</TableCell>
                        <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>Reps</TableCell>
                        <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>Poids</TableCell>
                        <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>Temps</TableCell>
                        <TableCell align="center" sx={{ px: isMobile ? 0.5 : 2, width: isMobile ? 40 : 60 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(card.series || []).map((serie, index) => {
                        const perf = (card.performances || []).find(p => p.setIndex === index);
                        return (
                          <TableRow key={serie.id}>
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 1 : 2 }}>
                              {index + 1}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>
                              {perf?.reps ? `${perf.reps}` : "-"}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>
                              {perf?.poids ? `${perf.poids} kg` : "-"}
                            </TableCell>
                            <TableCell align="center" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', px: isMobile ? 0.5 : 2 }}>
                              {perf?.time ? formatTimeDisplay(perf.time) : "-"}
                            </TableCell>
                            <TableCell align="center" sx={{ px: isMobile ? 0.5 : 2 }}>
                              <Checkbox
                                icon={<DoneOutlineIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />}
                                checkedIcon={<DoneIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />}
                                checked={(card.checked || []).includes(index)}
                                disabled={(card.checked || []).includes(index)}
                                onChange={() => handleCheckboxClick(card.id, index)}
                                sx={{ 
                                  p: isMobile ? 0.5 : 1,
                                  '& .MuiSvgIcon-root': {
                                    fontSize: isMobile ? '1.2rem' : '1.5rem'
                                  }
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Button
                variant="contained"
                sx={{ 
                  borderRadius: 30, 
                  backgroundColor: isReplaced ? "#c0c0c0" : "#dddddd", 
                  color: isReplaced ? "#2c2c2c" : "#000",
                  '&:hover': {
                    backgroundColor: isReplaced ? "#c0c0c0" : "#dddddd"
                  }
                }}
                startIcon={isReplaced ? <SettingsBackupRestoreIcon /> : <SwapHorizIcon />}
                onClick={() => isReplaced ? functionAnnulerRemplacement(card.id) : functionRemplacer(card.id)}
              >
                {isReplaced ? "Annuler le remplacement" : "Remplacer l'exercice"}
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  };

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress));
    });
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (restTimer === 0 && timerDialogOpen) {
      setRestTimerActive(false); 
      setTimerDialogOpen(false); 
    }
  }, [restTimer, timerDialogOpen]);

  const currentExercice = cards.find((c) => c.id === currentEdit.cardId);
  const currentSerie = currentExercice?.series?.[currentEdit.setIndex];

  const handleValidateSeance = () => {
    const sectionId = location.state?.sectionId;
    const storageKey = `seance-exec-${seanceId}-${sectionId || 'all'}`;
    localStorage.removeItem(storageKey);
  
    navigate(`/fin-seance/${seanceId}`, {
      state: {
        sessionTimer: timer,
        performances: cards
      }
    });
  };

  if (!seance) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Séance non trouvée</Typography>
        <Button onClick={() => navigate('/planning')}>Retour</Button>
      </Box>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Cette séance n'a pas d'exercices</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ajoutez des exercices à cette séance depuis la page de création.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/seance/${seanceId}`)}
        >
          Retour à la séance
        </Button>
      </Box>
    );
  }

  return (
    <>
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            top: 100.1% !important;
            transform: translateY(-50%) !important;
          }
          
          .swiper-pagination {
            display: none !important;
          }
        `}
      </style>

      <AppBar position="fixed" sx={{ backgroundColor: "#fff", color: "#000" }}>
        <Toolbar
          sx={(theme) => ({
            [theme.breakpoints.up('xs')]: {justifyContent: 'center'},
            [theme.breakpoints.up('sm')]: {justifyContent: 'left'},
          })}
        >
          <IconButton onClick={() => navigate(`/seance/${seanceId}/blocs`, { state: { seance } })}>
            <ArrowBackIosIcon />
          </IconButton>

          <Typography fontWeight="bold">
            {formatTime(timer)}
          </Typography>
          <LinearProgress variant="soft" sx={{color:'#0252ff', bottom: -27}} determinate value={progress} />
          <Typography sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
            {formatRestTime(restTimer)}
            <TimerIcon />
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Slide direction="right" in={slideIn} timeout={300}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 600, px: 2 }}>
            <Swiper
              modules={[Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={30}
              loop={false}
              pagination={{ type: 'progressbar' }}
              navigation
              cssMode={true}
              onSlideChange={(swiper) => {
                const currentSlide = swiper.realIndex + 1;
                setProgress((currentSlide / groupedCards.length) * 100);
              }}
            >
              {groupedCards.map((group, groupIndex) => (
                <SwiperSlide key={groupIndex}>
                  <Box sx={{ py: 2 }}>
                    {group.map((card, cardIndex) =>
                      renderExercicesCard(card, cardIndex === 1)
                    )}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

              <Button
              fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  fontWeight: "bold",
                  

                }}
                onClick={handleValidateSeance}
              >
                Valider la séance
              </Button>
          </Box>
        </Box>
      </Slide>

      {/* Popup kg + reps */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogCancel} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: { xs: 1.5, sm: 2 },
            m: { xs: 2, sm: 3 }
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1, pt: { xs: 1.5, sm: 2 } }}>
          <Typography 
            fontWeight={700} 
            fontSize={{ xs: '1.1rem', sm: '1.25rem' }}
          >
            {currentExercice?.name}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', mt: 0.5 }}
          >
            Série {(currentEdit.setIndex || 0) + 1}
            {currentSerie && (
              <> • {currentSerie.type === 'reps' 
                ? `${currentSerie.reps || '-'} reps` 
                : `${currentSerie.duration || '-'}s`
              } • RPE {currentSerie.rpe || '-'}</>
            )}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2.5, sm: 2 },
            mt: { xs: 2, sm: 3 },
            mb: 2
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>              
              <TextField
                type="number"
                value={poids}
                onChange={(e) => setPoids(Number(e.target.value))}
                inputProps={{
                  min: 0,
                  step: 2.5,
                  style: {
                    textAlign: 'center',
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    fontWeight: 'normal',
                    width: isMobile ? 80 : 100,
                    padding: isMobile ? '10px 8px' : '12px 8px'
                  },
                }}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                  }
                }}
              />
              
              <Typography 
                fontWeight="500" 
                fontSize={{ xs: '1rem', sm: '1.1rem' }}
              >
                kg
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              <TextField
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                inputProps={{
                  min: 0,
                  style: {
                    textAlign: 'center',
                    fontSize: isMobile ? '1.3rem' : '1.5rem',
                    fontWeight: 'bold',
                    width: isMobile ? 70 : 80,
                    padding: isMobile ? '10px 8px' : '12px 8px'
                  },
                }}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                  }
                }}
              />
              
              <Typography 
                fontWeight="500" 
                fontSize={{ xs: '1rem', sm: '1.1rem' }}
              >
                reps
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display:'flex', 
            justifyContent:'center', 
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: 1, sm: 1.5 }, 
            mt: { xs: 2.5, sm: 3 },
            mb: 1,
            px: { xs: 1, sm: 0 }
          }}>
            <Button 
              variant="outlined" 
              onClick={() => setPoids(p => Math.max(0, p + 2.5))}
              sx={{
                borderRadius: 3,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 0.8, sm: 1 },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                fontWeight: 600,
                borderColor: '#e0e0e0',
                color: '#000',
                backgroundColor: '#f5f5f5',
                flex: { xs: '1 1 calc(33.333% - 8px)', sm: '0 1 auto' },
                '&:hover': {
                  backgroundColor: '#eeeeee',
                  borderColor: '#d0d0d0',
                }
              }}
            >
              +2.5kg
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setPoids(p => Math.max(0, p + 5))}
              sx={{
                borderRadius: 3,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 0.8, sm: 1 },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                fontWeight: 600,
                borderColor: '#e0e0e0',
                color: '#000',
                backgroundColor: '#f5f5f5',
                flex: { xs: '1 1 calc(33.333% - 8px)', sm: '0 1 auto' },
                '&:hover': {
                  backgroundColor: '#eeeeee',
                  borderColor: '#d0d0d0',
                }
              }}
            >
              +5kg
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setPoids(p => Math.max(0, p + 10))}
              sx={{
                borderRadius: 3,
                px: { xs: 2, sm: 2.5 },
                py: { xs: 0.8, sm: 1 },
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                fontWeight: 600,
                borderColor: '#e0e0e0',
                color: '#000',
                backgroundColor: '#f5f5f5',
                flex: { xs: '1 1 calc(33.333% - 8px)', sm: '0 1 auto' },
                '&:hover': {
                  backgroundColor: '#eeeeee',
                  borderColor: '#d0d0d0',
                }
              }}
            >
              +10kg
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 } }}>
          <Button
            onClick={handleDialogConfirm}
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              borderRadius: 10,
              py: { xs: 1.5, sm: 1.8 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 700,
              textTransform: 'uppercase',
              backgroundColor: '#0066ff',
              '&:hover': {
                backgroundColor: '#0052cc',
              }
            }}
          >
            Valider la série
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup Repos */}
      <Dialog open={timerDialogOpen} onClose={() => setTimerDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>Temps de repos</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2, alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: '4rem',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                color: restTimer <= 10 ? '#d32f2f' : '#000',
              }}
            >
              {formatRestTime(restTimer)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={() => addRestTime(30)}
                sx={{ boxShadow:'none', fontWeight: 'bold', color:'black' }}
              >
                +30s
              </Button>
              <Button
                onClick={() => addRestTime(60)}
                sx={{ boxShadow:'none', fontWeight: 'bold', color:'black' }}
              >
                +1min
              </Button>
            </Box>

            <Button
              onClick={() => setRestTimerActive(!restTimerActive)}
              sx={{ fontWeight: 'bold', color:'black' }}
              startIcon={restTimerActive ? <PauseIcon /> : <PlayArrowIcon />}
            >
              {restTimerActive ? 'Pause' : 'Play'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
