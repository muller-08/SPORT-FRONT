import React, { useState } from "react";
import {
  Box,
  BottomNavigation,
  Button,
  Paper,
  Card,
  Typography,
  Switch,
  FormControlLabel,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from 'react-swipeable'; 

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import TimerIcon from '@mui/icons-material/Timer';
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

export default function FinSeance() {
  const navigate = useNavigate();
  const [value] = useState(0);
  const [showResume, setShowResume] = useState(true);
  const [showTonnage, setShowTonnage] = useState(true);

 
  const handlers = useSwipeable({
      onSwipedLeft: () => navigate('/exo-search'),
      onSwipedRight: () => navigate('/profile'),
      trackTouch: true,
      trackMouse: false,
      delta: 80,
      preventScrollOnSwipe: false,
  });
  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 12 }} {...handlers}>
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton edge="start" sx={{ color: '#000' }} onClick={() => navigate("/planning")}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Séance terminée
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            Paramètres d'affichage
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showResume}
                  onChange={() => setShowResume((prev) => !prev)}
                  color="primary"
                />
              }
              label="Résumé de séance"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showTonnage}
                  onChange={() => setShowTonnage((prev) => !prev)}
                  color="primary"
                />
              }
              label="Afficher le tonnage"
            />
          </Box>
        </Box>

        {showResume && (
          <Card
            sx={{
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              background: "linear-gradient(180deg, #9fb2c9 0%, #5aa0c8 100%)",
              color: "white",
              mb: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.625rem' },
                  letterSpacing: 1,
                }}
              >
                SÉANCE VALIDÉE
              </Typography>
              <Box
                sx={{
                  width: { xs: 80, sm: 120 },
                  height: 2,
                  bgcolor: "white",
                  mx: "auto",
                  my: 2,
                  opacity: 0.7,
                }}
              />
              <Typography
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                NOUVELLE SÉANCE
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: showTonnage ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' 
                },
                gap: 2,
              }}
            >
              <StatBox icon={<TimerIcon />} label="DURÉE" value="0 min" />
              {showTonnage && (
                <StatBox icon={<FitnessCenterIcon />} label="TONNAGE" value="0 kg" />
              )}
              <StatBox icon={<AccessibilityNewIcon />} label="EXERCICES" value="0" />
            </Box>
          </Card>
        )}
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          sx={{ p: { xs: 1, sm: 1.5 } }}
        >
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 'bold',
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mx: { xs: 1, sm: 2 },
              backgroundColor: '#3045ff',
              '&:hover': { backgroundColor: '#5087ff' },
            }}
          >
            Partager
          </Button>
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <Box
      sx={{
        bgcolor: "#f2f6f9",
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        textAlign: "center",
        color: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1,
          color: "#4aa3d8",
          fontSize: { xs: 28, sm: 32, md: 36 },
        }}
      >
        {icon}
      </Box>

      <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, mb: 0.5 }}>
        {label}
      </Typography>

      <Typography fontWeight="bold" sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
        {value}
      </Typography>
    </Box>
  );
}
