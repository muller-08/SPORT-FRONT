import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Typography from '@mui/joy/Typography';
import Box from "@mui/joy/Box";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { IconButton, Switch, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

export default function ProfileSettings() {
  const navigate = useNavigate();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true; 
  });

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  return (
    <Box  
      sx={{ 
        width: '100%', 
        position: 'relative', 
        minHeight: '100vh',
        touchAction: 'pan-y',
        bgcolor: '#f5f5f5',
      }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: '#000000' }} onClick={() => navigate(-1)}>
              <ArrowBackIosIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            </IconButton>
            <Typography fontWeight='bold' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Paramètres du profil
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Box 
        display='flex' 
        justifyContent='center' 
        width='100%' 
        sx={{ 
          flexGrow: 1, 
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={2} sx={{ maxWidth: 600 }}>
          <Grid item xs={12} sm={6}>
            <Item sx={{ textAlign: 'left', p: { xs: 1.5, sm: 2 } }}>
              <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' }, mb: 0.5 }}>
                Nom
              </Typography>
              <Typography fontWeight='bold' sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                Nom
              </Typography>
            </Item>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Item sx={{ textAlign: 'left', p: { xs: 1.5, sm: 2 } }}> 
              <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' }, mb: 0.5 }}>
                Date de naissance
              </Typography>
              <Typography fontWeight='bold' sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                JJ/MM/YYYY
              </Typography>
            </Item>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Item sx={{ textAlign: 'left', p: { xs: 1.5, sm: 2 } }}>
              <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' }, mb: 0.5 }}>
                Sexe
              </Typography>
              <Typography fontWeight='bold' sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                Sexe
              </Typography>
            </Item>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Item sx={{ textAlign: 'left', p: { xs: 1.5, sm: 2 } }}>
              <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' }, mb: 0.5 }}>
                Email
              </Typography>
              <Typography fontWeight='bold' sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                Email@mail.d
              </Typography>
            </Item>
          </Grid>

          <Grid item xs={12}>
            <Item 
              sx={{ 
                textAlign: 'left', 
                p: { xs: 1.5, sm: 2 },
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
              onClick={toggleNotifications}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {notificationsEnabled ? (
                    <NotificationsActiveIcon sx={{ 
                      color: '#4caf50', 
                      fontSize: { xs: '1.2rem', sm: '1.5rem' } 
                    }} />
                  ) : (
                    <NotificationsOffIcon sx={{ 
                      color: '#999', 
                      fontSize: { xs: '1.2rem', sm: '1.5rem' } 
                    }} />
                  )}
                  <Box>
                    <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' }, mb: 0.5 }}>
                      Notifications
                    </Typography>
                    <Typography 
                      fontWeight='bold' 
                      sx={{ 
                        fontSize: { xs: '0.95rem', sm: '1rem' },
                        color: notificationsEnabled ? '#4caf50' : '#999',
                      }}
                    >
                      {notificationsEnabled ? 'Activées' : 'Désactivées'}
                    </Typography>
                  </Box>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationsEnabled}
                      onChange={toggleNotifications}
                      onClick={(e) => e.stopPropagation()}
                      color="success"
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </Box>
            </Item>
          </Grid>

          <Grid item xs={12}>
            <Item 
              sx={{ 
                textAlign: 'left', 
                p: { xs: 1.5, sm: 2 },
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockOutlinedIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  Protection des données
                </Typography>
              </Box>
            </Item>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              onClick={() => navigate('/')}
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              sx={{ 
                p: { xs: 1.5, sm: 2 },
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500,
                borderRadius: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: '#ffebee',
                },
              }}
            >
              Déconnexion
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
