import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { notifySeanceCreated } from '../Données/notifService';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  FormControlLabel,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
} from '@mui/material';

import {
  ArrowBackIos,
  MoreVert,
  CalendarToday,
  AccessTime,
  FitnessCenter,
  Delete,
  Download,
  ContentCopy,
  ExpandLess,
  Add,
  Search,
  Close,
  ExpandMore,
  Remove,
  Edit,
} from '@mui/icons-material';
import { useExercices } from '../Données/exercices';

const CreerSeance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exercices, searchExercices } = useExercices();
  
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const seanceFromState = location.state?.seance;
  const dateKey = location.state?.dateKey;
  
  const [sections, setSections] = useState(() => {
    if (seanceFromState?.sections) {
      return seanceFromState.sections.map(section => ({
        ...section,
        exercices: Array.isArray(section.exercices) ? section.exercices : []
      }));
    }
    return [
      {
        id: 'section-1',
        title: 'Échauffement',
        type: 'Musculation',
        tracked: false,
        exercices: [],
        expanded: true,
      },
      {
        id: 'section-2',
        title: 'Corps de séance',
        type: 'Musculation',
        tracked: true,
        exercices: [],
        expanded: true,
      },
    ];
  });

  const [sessionData, setSessionData] = useState({
    id: seanceFromState?.id || Date.now(),
    date: seanceFromState?.date || new Date().toISOString().split('T')[0],
    duration: seanceFromState?.duration || '00:00:00',
    type: seanceFromState?.type || 'Brouillon',
    title: seanceFromState?.title || 'Nouvelle séance',
    description: seanceFromState?.description || 'Description de la séance',
    image: seanceFromState?.image || 'https://picsum.photos/300',
    autoSave: true,
    isActive: seanceFromState?.isActive || false,
    done: seanceFromState?.done || false,
  });

  const [exerciceDialogOpen, setExerciceDialogOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedExercices, setExpandedExercices] = useState({});
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');

  useEffect(() => {
    if (sessionData.autoSave && dateKey) {
      const saveSeance = () => {
        const seanceToSave = {
          ...sessionData,
          sections,
        };

        const allSeances = JSON.parse(localStorage.getItem('seancesCalendrier') || '{}');
        
        if (allSeances[dateKey]) {
          allSeances[dateKey] = allSeances[dateKey].map(s => 
            s.id === sessionData.id ? seanceToSave : s
          );
        }

        localStorage.setItem('seancesCalendrier', JSON.stringify(allSeances));

        if (sessionData.isActive) {
          const planningSeances = JSON.parse(localStorage.getItem('planningSeances') || '[]');
          const existingIndex = planningSeances.findIndex(s => s.id === sessionData.id);
          
          if (existingIndex >= 0) {
            planningSeances[existingIndex] = seanceToSave;
          } else {
            planningSeances.push(seanceToSave);
          }
          
          localStorage.setItem('planningSeances', JSON.stringify(planningSeances));
        }
      };

      const timeoutId = setTimeout(saveSeance, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [sections, sessionData, dateKey]);

  const toggleActive = () => {
    setSessionData(prev => {
      const newIsActive = !prev.isActive;
      const newData = {
        ...prev,
        isActive: newIsActive,
        type: newIsActive ? 'Activé' : 'Brouillon'
      };

      const planningSeances = JSON.parse(localStorage.getItem('planningSeances') || '[]');
      
      if (newIsActive) {
        const seanceToAdd = {
          ...newData,
          sections,
        };
        planningSeances.push(seanceToAdd);
        
        notifySeanceCreated(seanceToAdd.title);
      } else {
        const filtered = planningSeances.filter(s => s.id !== prev.id);
        localStorage.setItem('planningSeances', JSON.stringify(filtered));
        return newData;
      }
      
      localStorage.setItem('planningSeances', JSON.stringify(planningSeances));
      return newData;
    });
  };

  const toggleTracked = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, tracked: !section.tracked };
      }
      return section;
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  const openExerciceDialog = (sectionId) => {
    setCurrentSectionId(sectionId);
    setExerciceDialogOpen(true);
    setSearchQuery('');
  };

  const addExercicesToSection = (exercice) => {
    setSections(sections.map(section => {
      if (section.id === currentSectionId) {
        const currentExercices = Array.isArray(section.exercices) ? section.exercices : [];
        const newExerciceId = `${section.id}-ex-${Date.now()}`;
        
        const defaultSeries = Array.from({ length: 4 }, (_, i) => ({
          id: `${newExerciceId}-s${i + 1}`,
          reps: '',
          duration: '',
          rpe: '',
          type: 'reps',
        }));

        return {
          ...section,
          exercices: [...currentExercices, {
            id: newExerciceId,
            exerciceId: exercice.id,
            name: exercice.title,
            groupe1: exercice.groupe1,
            groupe2: exercice.groupe2,
            series: defaultSeries,
            note: exercice.note || '',
            image: exercice.image || 'https://picsum.photos/80',
          }]
        };
      }
      return section;
    }));
    setExerciceDialogOpen(false);
  };

  const removeExercices = (sectionId, exercicesId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const currentExercices = Array.isArray(section.exercices) ? section.exercices : [];
        return {
          ...section,
          exercices: currentExercices.filter(ex => ex.id !== exercicesId)
        };
      }
      return section;
    }));
  };

  const deleteSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const toggleSection = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, expanded: !section.expanded };
      }
      return section;
    }));
  };

  const toggleExerciceExpanded = (exerciceId) => {
    setExpandedExercices(prev => ({
      ...prev,
      [exerciceId]: !prev[exerciceId]
    }));
  };

  const addSerie = (sectionId, exerciceId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          exercices: section.exercices.map(ex => {
            if (ex.id === exerciceId) {
              const newSerieId = `${exerciceId}-s${ex.series.length + 1}`;
              return {
                ...ex,
                series: [...ex.series, {
                  id: newSerieId,
                  reps: '',
                  duration: '',
                  rpe: '',
                  type: ex.series[0]?.type || 'reps',
                }]
              };
            }
            return ex;
          })
        };
      }
      return section;
    }));
  };

  const removeSerie = (sectionId, exerciceId, serieId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          exercices: section.exercices.map(ex => {
            if (ex.id === exerciceId && ex.series.length > 1) {
              return {
                ...ex,
                series: ex.series.filter(s => s.id !== serieId)
              };
            }
            return ex;
          })
        };
      }
      return section;
    }));
  };

  const updateSerie = (sectionId, exerciceId, serieId, field, value) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          exercices: section.exercices.map(ex => {
            if (ex.id === exerciceId) {
              return {
                ...ex,
                series: ex.series.map(s => {
                  if (s.id === serieId) {
                    return { ...s, [field]: value };
                  }
                  return s;
                })
              };
            }
            return ex;
          })
        };
      }
      return section;
    }));
  };

  const addBlock = () => {
    setSections([...sections, {
      id: `section-${Date.now()}`,
      title: 'Nouveau bloc',
      type: 'Musculation',
      tracked: false,
      exercices: [],
      expanded: true,
    }]);
  };

  const startEditingSectionTitle = (sectionId, currentTitle) => {
    setEditingSectionId(sectionId);
    setEditingSectionTitle(currentTitle);
  };

  const saveSectionTitle = (sectionId) => {
    if (editingSectionTitle.trim()) {
      setSections(sections.map(section => {
        if (section.id === sectionId) {
          return { ...section, title: editingSectionTitle.trim() };
        }
        return section;
      }));
    }
    setEditingSectionId(null);
    setEditingSectionTitle('');
  };

  const cancelEditingSectionTitle = () => {
    setEditingSectionId(null);
    setEditingSectionTitle('');
  };

  const handleBack = () => {
    if (dateKey) {
      navigate(-1, {
        state: {
          updatedSeance: {
            ...sessionData,
            sections
          },
          dateKey
        }
      });
    } else {
      navigate(-1);
    }
  };

  const filteredExercices = searchQuery
    ? searchExercices(searchQuery)
    : exercices;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f5f5f7',
        pb: 4,
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            borderBottom: '1px solid #e0e0e0',
            bgcolor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }}>
              <IconButton onClick={handleBack} size={isMobile ? 'small' : 'medium'}>
                <ArrowBackIos fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                {isMobile ? 'Séance' : 'Séance d\'entraînement'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: '#4caf50',
                }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#4caf50',
                  }} />
                  <Typography variant="body2" color="#4caf50">
                    Sauvegarde auto
                  </Typography>
                </Box>
              )}
              <IconButton size={isMobile ? 'small' : 'medium'}>
                <MoreVert fontSize={isMobile ? 'small' : 'medium'} />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>

        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1.5, sm: 2, md: 3 }, pt: { xs: 2, sm: 3 } }}>
          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }}>
                <Box
                  component="img"
                  src={sessionData.image}
                  alt="Training"
                  sx={{
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 180, sm: 140 },
                    borderRadius: 2,
                    objectFit: 'cover',
                    bgcolor: '#f0f0f0',
                  }}
                />
                
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    value={sessionData.title}
                    onChange={(e) => setSessionData(prev => ({ ...prev, title: e.target.value }))}
                    variant="standard"
                    sx={{
                      mb: 2,
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        fontWeight: 600,
                      },
                    }}
                  />
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={sessionData.isActive}
                          onChange={toggleActive}
                          color="success"
                        />
                      }
                      label={sessionData.isActive ? "Activé" : "Brouillon"}
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                    />
                    <Chip 
                      label={sessionData.isActive ? "Activé" : "Brouillon"}
                      size="small" 
                      sx={{ 
                        bgcolor: sessionData.isActive ? '#e8f5e9' : '#f5f5f5',
                        color: sessionData.isActive ? '#2e7d32' : '#666',
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    />
                  </Stack>

                  <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Description de la séance
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={sessionData.description}
                    onChange={(e) => setSessionData(prev => ({ ...prev, description: e.target.value }))}
                    variant="standard"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: 'text.secondary',
                        fontStyle: 'italic',
                      },
                    }}
                  />
                </Box>
              </Stack>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={{ xs: 1.5, sm: 3 }} 
                sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday sx={{ fontSize: { xs: 16, sm: 18 }, color: '#1976d2' }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Date : <strong>{sessionData.date}</strong>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTime sx={{ fontSize: { xs: 16, sm: 18 }, color: '#1976d2' }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Durée : <strong>{sessionData.duration}</strong>
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Droppable droppableId="sections">
            {(provided) => (
             <Box 
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {sections.map((section, index) => (
                  <Draggable 
                    key={section.id} 
                    draggableId={section.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        elevation={0}
                        sx={{
                          mb: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          bgcolor: snapshot.isDragging ? '#f0f4ff' : 'white',
                          boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.15)' : 'none',
                          touchAction: 'none',
                        }}
                      >
                        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Stack 
                            direction="row" 
                            alignItems="center" 
                            justifyContent="space-between"
                            sx={{ mb: 2 }}
                            flexWrap="wrap"
                            gap={1}
                          >
                            <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }} sx={{ flex: 1, minWidth: 0 }}>
                              {/* Icône drag avec points - visible sur mobile et desktop */}
                              <Box
                                {...provided.dragHandleProps}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: { xs: 28, sm: 32 },
                                  height: { xs: 28, sm: 32 },
                                  cursor: 'grab',
                                  '&:active': { cursor: 'grabbing' },
                                  touchAction: 'none',
                                  flexShrink: 0,
                                }}
                              >
                                <Box sx={{
                                  width: { xs: 3, sm: 4 }, 
                                  height: { xs: 3, sm: 4 }, 
                                  borderRadius: '50%', 
                                  bgcolor: '#bdbdbd',
                                  position: 'relative',
                                  '&::before, &::after': {
                                    content: '""', 
                                    position: 'absolute',
                                    width: { xs: 3, sm: 4 }, 
                                    height: { xs: 3, sm: 4 }, 
                                    borderRadius: '50%', 
                                    bgcolor: '#bdbdbd',
                                  },
                                  '&::before': { top: { xs: -6, sm: -8 } },
                                  '&::after': { top: { xs: 6, sm: 8 } },
                                }} />
                                <Box sx={{
                                  width: { xs: 3, sm: 4 }, 
                                  height: { xs: 3, sm: 4 }, 
                                  borderRadius: '50%', 
                                  bgcolor: '#bdbdbd',
                                  position: 'relative', 
                                  ml: 0.5,
                                  '&::before, &::after': {
                                    content: '""', 
                                    position: 'absolute',
                                    width: { xs: 3, sm: 4 }, 
                                    height: { xs: 3, sm: 4 }, 
                                    borderRadius: '50%', 
                                    bgcolor: '#bdbdbd',
                                  },
                                  '&::before': { top: { xs: -6, sm: -8 } },
                                  '&::after': { top: { xs: 6, sm: 8 } },
                                }} />
                              </Box>
                              
                              {editingSectionId === section.id ? (
                                <TextField
                                  autoFocus
                                  value={editingSectionTitle}
                                  onChange={(e) => setEditingSectionTitle(e.target.value)}
                                  onBlur={() => saveSectionTitle(section.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      saveSectionTitle(section.id);
                                    } else if (e.key === 'Escape') {
                                      cancelEditingSectionTitle();
                                    }
                                  }}
                                  variant="standard"
                                  size="small"
                                  sx={{
                                    flex: 1,
                                    '& .MuiInputBase-input': {
                                      fontSize: { xs: '1rem', sm: '1.25rem' },
                                      fontWeight: 600,
                                      padding: 0,
                                    },
                                  }}
                                />
                              ) : (
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} noWrap>
                                    #{index + 1} - {section.title}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={() => startEditingSectionTitle(section.id, section.title)}
                                    sx={{ 
                                      color: '#666',
                                      opacity: 0.6,
                                      '&:hover': { opacity: 1 },
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Stack>
                              )}
                            </Stack>

                            <Stack direction="row" spacing={0.5}>
                              <IconButton 
                                size="small"
                                onClick={() => deleteSection(section.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                              {!isMobile && (
                                <>
                                  <IconButton size="small">
                                    <Download fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small">
                                    <ContentCopy fontSize="small" />
                                  </IconButton>
                                </>
                              )}
                              <IconButton 
                                size="small"
                                onClick={() => toggleSection(section.id)}
                              >
                                <ExpandLess 
                                  fontSize="small"
                                  sx={{
                                    transform: section.expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                                    transition: 'transform 0.3s',
                                  }}
                                />
                              </IconButton>
                            </Stack>
                          </Stack>

                          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <FitnessCenter sx={{ fontSize: 18, color: '#666' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                {section.type}
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Switch
                                checked={section.tracked}
                                onChange={() => toggleTracked(section.id)}
                                size="small"
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#4caf50',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#4caf50',
                                  },
                                }}
                              />
                              <Typography 
                                variant="body2" 
                                color={section.tracked ? 'success.main' : 'error.main'}
                                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, fontWeight: 500 }}
                              >
                                {section.tracked ? 'Avec suivi' : 'Sans suivi'}
                              </Typography>
                            </Stack>
                          </Stack>

                          {section.expanded && (
                            <>
                              {(section.exercices && section.exercices.length > 0) ? (
                                <Stack spacing={2} sx={{ mb: 2 }}>
                                  {(section.exercices || []).map((exercices, exercicesIndex) => (
                                    <Card
                                      key={exercices.id}
                                      variant="outlined"
                                      sx={{
                                        bgcolor: 'white',
                                        borderColor: '#e0e0e0',
                                        borderRadius: 2,
                                      }}
                                    >
                                      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                                        <Stack spacing={2}>
                                          <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={{ xs: 1, sm: 2 }}
                                          >
                                            <Box
                                              component="img"
                                              src={exercices.image}
                                              alt={exercices.name}
                                              loading="lazy"
                                              sx={{
                                                width: { xs: 60, sm: 80 },
                                                height: { xs: 60, sm: 80 },
                                                borderRadius: 1,
                                                objectFit: 'cover',
                                                bgcolor: '#f0f0f0',
                                              }}
                                            />

                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                                <Typography 
                                                  variant="body1" 
                                                  fontWeight={600}
                                                  sx={{ color: '#1976d2', fontSize: { xs: '0.9rem', sm: '1rem' } }}
                                                >
                                                  {exercicesIndex + 1}
                                                </Typography>
                                                <Typography 
                                                  variant="body1" 
                                                  fontWeight={600}
                                                  sx={{ 
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                                  }}
                                                >
                                                  {exercices.name}
                                                </Typography>
                                              </Stack>

                                              <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                                {exercices.groupe1 && (
                                                  <Chip
                                                    label={exercices.groupe1}
                                                    size="small"
                                                    sx={{
                                                      height: { xs: 18, sm: 22 },
                                                      bgcolor: '#e3f2fd',
                                                      color: '#1976d2',
                                                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                      fontWeight: 500,
                                                    }}
                                                  />
                                                )}
                                                {exercices.groupe2 && (
                                                  <Chip
                                                    label={exercices.groupe2}
                                                    size="small"
                                                    sx={{
                                                      height: { xs: 18, sm: 22 },
                                                      bgcolor: '#e8f5e9',
                                                      color: '#2e7d32',
                                                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                      fontWeight: 500,
                                                    }}
                                                  />
                                                )}
                                              </Stack>

                                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                                {exercices.series?.length || 0} série{exercices.series?.length > 1 ? 's' : ''}
                                              </Typography>
                                            </Box>

                                            <Stack direction="row" spacing={0.5}>
                                              <IconButton
                                                size="small"
                                                onClick={() => toggleExerciceExpanded(exercices.id)}
                                                sx={{ color: '#666' }}
                                              >
                                                {expandedExercices[exercices.id] ? (
                                                  <ExpandLess fontSize="small" />
                                                ) : (
                                                  <ExpandMore fontSize="small" />
                                                )}
                                              </IconButton>
                                              <IconButton
                                                size="small"
                                                onClick={() => removeExercices(section.id, exercices.id)}
                                                sx={{ color: '#666' }}
                                              >
                                                <Delete fontSize="small" />
                                              </IconButton>
                                            </Stack>
                                          </Stack>

                                          {/* Détails séries */}
                                          <Collapse in={expandedExercices[exercices.id]}>
                                            <Box sx={{ 
                                              bgcolor: '#f9f9f9', 
                                              borderRadius: 1, 
                                              p: { xs: 1.5, sm: 2 },
                                              mt: 1
                                            }}>
                                              <Stack spacing={1.5}>
                                                {exercices.series?.map((serie, serieIndex) => (
                                                  <Stack 
                                                    key={serie.id}
                                                    direction={{ xs: 'column', sm: 'row' }} 
                                                    spacing={1} 
                                                    alignItems={{ xs: 'stretch', sm: 'center' }}
                                                  >
                                                    <Typography 
                                                      variant="body2" 
                                                      sx={{ 
                                                        minWidth: { xs: 'auto', sm: 60 },
                                                        fontWeight: 600,
                                                        color: '#666',
                                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                      }}
                                                    >
                                                      Série {serieIndex + 1}
                                                    </Typography>

                                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ flex: 1 }}>
                                                      <FormControl size="small" sx={{ minWidth: { xs: 90, sm: 100 }, flex: { xs: 1, sm: 'none' } }}>
                                                        <Select
                                                          value={serie.type}
                                                          onChange={(e) => updateSerie(section.id, exercices.id, serie.id, 'type', e.target.value)}
                                                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                                        >
                                                          <MenuItem value="reps">Répétitions</MenuItem>
                                                          <MenuItem value="duration">Durée</MenuItem>
                                                        </Select>
                                                      </FormControl>

                                                      {serie.type === 'reps' ? (
                                                        <TextField
                                                          size="small"
                                                          placeholder="Reps"
                                                          type="number"
                                                          value={serie.reps}
                                                          onChange={(e) => updateSerie(section.id, exercices.id, serie.id, 'reps', e.target.value)}
                                                          sx={{ width: { xs: 70, sm: 80 } }}
                                                          InputProps={{
                                                            sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                                                          }}
                                                        />
                                                      ) : (
                                                        <TextField
                                                          size="small"
                                                          placeholder="Durée (s)"
                                                          type="number"
                                                          value={serie.duration}
                                                          onChange={(e) => updateSerie(section.id, exercices.id, serie.id, 'duration', e.target.value)}
                                                          sx={{ width: { xs: 70, sm: 80 } }}
                                                          InputProps={{
                                                            sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                                                          }}
                                                        />
                                                      )}

                                                      <TextField
                                                        size="small"
                                                        placeholder="RPE"
                                                        type="number"
                                                        inputProps={{ min: 0, max: 10, step: 0.5 }}
                                                        value={serie.rpe}
                                                        onChange={(e) => updateSerie(section.id, exercices.id, serie.id, 'rpe', e.target.value)}
                                                        sx={{ width: { xs: 60, sm: 70 } }}
                                                        InputProps={{
                                                          sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' } }
                                                        }}
                                                      />

                                                      <IconButton
                                                        size="small"
                                                        onClick={() => removeSerie(section.id, exercices.id, serie.id)}
                                                        disabled={exercices.series.length === 1}
                                                        sx={{ color: '#666' }}
                                                      >
                                                        <Remove fontSize="small" />
                                                      </IconButton>
                                                    </Stack>
                                                  </Stack>
                                                ))}

                                                <Button
                                                  size="small"
                                                  startIcon={<Add />}
                                                  onClick={() => addSerie(section.id, exercices.id)}
                                                  sx={{
                                                    alignSelf: 'flex-start',
                                                    textTransform: 'none',
                                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                  }}
                                                >
                                                  Ajouter une série
                                                </Button>
                                              </Stack>
                                            </Box>
                                          </Collapse>
                                        </Stack>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </Stack>
                              ) : (
                                <Box
                                  sx={{
                                    border: '2px dashed #e0e0e0',
                                    borderRadius: 2,
                                    py: { xs: 4, sm: 8 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: '#fafafa',
                                  }}
                                >
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                  >
                                    Aucun exercice ajouté
                                  </Typography>
                                </Box>
                              )}
                              <Button
                                variant="text"
                                startIcon={<Add />}
                                onClick={() => openExerciceDialog(section.id)}
                                fullWidth={isMobile}
                                sx={{
                                  color: '#1976d2',
                                  textTransform: 'none',
                                  fontWeight: 500,
                                  mt: 1,
                                  bgcolor: '#e3f2fd',
                                  borderRadius: 2,
                                  px: 2,
                                  py: 1,
                                  fontSize: { xs: '0.85rem', sm: '1rem' },
                                  '&:hover': {
                                    bgcolor: '#bbdefb',
                                  },
                                }}
                              >
                                Ajouter un exercice
                              </Button>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="text"
              startIcon={<Add />}
              onClick={addBlock}
              fullWidth={isMobile}
              sx={{
                color: '#1976d2',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              Ajouter un bloc
            </Button>
          </Box>
        </Box>
      </Box>
      
      {/* Exercise Selection Dialog */}
      <Dialog
        open={exerciceDialogOpen}
        onClose={() => setExerciceDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Sélectionner un exercice
            </Typography>
            <IconButton onClick={() => setExerciceDialogOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Rechercher un exercice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            size={isMobile ? 'small' : 'medium'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <List sx={{ maxHeight: { xs: '100%', sm: 400 }, overflow: 'auto' }}>
            {filteredExercices.map((exercice) => (
              <ListItem key={exercice.id} disablePadding>
                <ListItemButton
                  onClick={() => addExercicesToSection(exercice)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      borderColor: '#1976d2',
                      bgcolor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemText
                    primary={exercice.title}
                    secondary={
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                        {exercice.groupe1 && (
                          <Chip
                            label={exercice.groupe1}
                            size="small"
                            sx={{
                              height: { xs: 18, sm: 20 },
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
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
                              height: { xs: 18, sm: 20 },
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              bgcolor: '#e8f5e9',
                              color: '#2e7d32',
                            }}
                          />
                        )}
                      </Stack>
                    }
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {filteredExercices.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                Aucun exercice trouvé
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </DragDropContext>
  );
};

export default CreerSeance;