import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Box from "@mui/joy/Box";
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from "react-router-dom";
import BottomNavigation  from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BlenderIcon from '@mui/icons-material/Blender';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';

import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

export default function GradientCover() {
  const navigate = useNavigate();
  const [slideIn] = useState(true);
  const [value, setValue] = React.useState(3);

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

  const [avatarSrc, setAvatarSrc] = React.useState(undefined);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        position: 'relative', 
        minHeight: '100vh',
        touchAction: 'pan-y'
      }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
            </Typography>
          </Box>

          <IconButton sx={{ color: '#000000' }} onClick={() => navigate('/profile-settings')}>
            <SettingsOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
        <Box sx={{ width: 250 }} >
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
        </Box>
      <Toolbar />
    <Box display='flex' justifyContent='center'>
      <ButtonBase
            component="label"
            role={undefined}
            tabIndex={-1} 
            aria-label="Avatar image"
            sx={{
              borderRadius: '40px',
              '&:has(:focus-visible)': {
                outline: '2px solid',
                outlineOffset: '2px',
              },
            }}
          >
            <Avatar alt="Upload new avatar" src={avatarSrc}
              sx={{width: 56, height: 56}}
            />
            <input
              type="file"
              accept="image/*"
              style={{
                border: 0,
                clip: 'rect(0 0 0 0)',
                height: '1px',
                margin: '-1px',
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
              }}
              onChange={handleAvatarChange}
            />
          </ButtonBase>
    </Box>

        <Box>
          <Typography variant='body2' color='text.secondary' fontWeight='bold' sx={{display:'flex', justifyContent:'center', alignItems:'center', fontSize: '1rem'}}>
            Username
          </Typography>
          <Typography color='text.secondary' sx={{display:'flex', justifyContent:'center', alignItems:'center', fontSize: '0.8rem'}}>
            Sexe - Age - Taille
          </Typography>
        </Box>

          <Box display='flex' justifyContent='center' width='100%'>
            <Button
              sx={{
                borderRadius: 10,
                mb: 2,
              }}
            >
              {<InsertPhotoIcon/>} Gérer mes photos
            </Button>
          </Box>
  <Slide direction="right" in={slideIn} timeout={300}>
       <Box display='flex' justifyContent='center' width='100%' sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} columns={{ xs: 4, sm: 8 }}>
            <Grid size={{ xs: 6, md: 4 }}>
              <Item sx={{ color: '#003cff'}}>{<EmojiEventsOutlinedIcon/>}
                <Typography>Objectif</Typography>
                <Typography fontWeight='bold'> Remise en forme</Typography>
                </Item>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
                <Item sx={{ color: '#003cff'}}>{<DirectionsRunIcon/>} 
                <Typography>NAP</Typography>
                <Typography fontWeight='bold'> Sédentaire</Typography>
                </Item>
            </Grid>
            <Grid sx={{ textAlign: 'left'}} size={{ xs: 6, md: 4 }}>
              <Item sx={{ textAlign: 'left'}}>Poids
              <Typography fontWeight='bold'>Poids kg</Typography>
              <Typography>JJ/MM/YYYY</Typography>
              </Item>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Item sx={{ textAlign: 'left'}}>Masse grasse
                <Typography fontWeight='bold'> Nombre% </Typography>
                <Typography> JJ/MM/YYYY </Typography>
              </Item>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Item sx={{ textAlign: 'left'}}>Bras
                <Typography fontWeight='bold'> Nombre% </Typography>
                <Typography> JJ/MM/YYYY </Typography>
              </Item>
            </Grid>
            <Grid size={{ xs: 6, md: 4 }}>
              <Item sx={{ textAlign: 'left'}}>Avant-bras
                <Typography fontWeight='bold'> Nombre% </Typography>
                <Typography> JJ/MM/YYYY </Typography>
              </Item>
            </Grid>
          </Grid>
    </Box>
</Slide>
      <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
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
