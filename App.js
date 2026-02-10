import React, { useState, useEffect } from "react";
import { Link as RouterLink, Routes, Route } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Link,
  Fab,
} from "@mui/material";

import { ExerciceProvider } from "./Données/exercices";
import { SeancesProvider } from "./Données/seancepage";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GetAppIcon from "@mui/icons-material/GetApp";

//Routes
import ForgotPassword from "./Connexion/forgot-psw";
import Register from "./Connexion/register";

import Planning from "./Planning/planning";
import ExoAct from "./Planning/exo-act";
import Calendrier from "./Planning/calendrier";
import Notifs from "./Planning/notifs";
import Seance from "./Planning/seance";

import Profile from "./Profile/profile";
import ProfileSettings from "./Profile/profile-settings";

import BlocSeance from "./Seances/bloc-seance";
import CreerSeance from "./Seances/creer-seance";
import FinSeance from "./Seances/fin-seance";
import SaveSeance from "./Seances/save_seance";
import ResultatSeance from"./Seances/resultat_seance"; 
import SeanceExo from "./Seances/seance-exo";

import RemplacerExo from "./Exercices/remplacerexo";
import ExercicePage from "./Données/exercicepage";
import ExoSearch from "./Exercices/exo-search";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };

  //Boîtes formulaires
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant="h5" align="center" gutterBottom>
          Connexion
        </Typography>
      
        {/* Formulaire du mail + mdp */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Mot de passe</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Mot de passe"
            />
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            component={RouterLink}
            to="/planning"
          >
            Se connecter
          </Button>

          <Typography mt={2}>
            <Link component={RouterLink} to="/forgot-psw">
              Mot de passe oublié ?
            </Link>
          </Typography>

          <Typography>
            <Link component={RouterLink} to="/register">
              Créer un compte
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('[PWA] beforeinstallprompt déclenché');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA] App déjà installée');
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('[PWA] Pas de prompt disponible');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Choix utilisateur: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <Fab
      color="primary"
      aria-label="installer l'application"
      onClick={handleInstallClick}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1300,
      }}
    >
      <GetAppIcon />
    </Fab>
  );
}

// Chemin Routes
export default function App() {
  return (
    <ExerciceProvider>
      <SeancesProvider>
        <InstallPWA />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-psw" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />

          <Route path="/planning" element={<Planning/>} />
          <Route path="/exo-act" element={<ExoAct/>}/>
          <Route path="/calendrier" element={<Calendrier/>}/>
          <Route path="/notifs" element={<Notifs/>}/>
          <Route path="/seance/:seanceId/" element={<Seance/>} />
          
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/profile-settings" element={<ProfileSettings/>}/>

          <Route path="/seance/:seanceId/blocs" element={<BlocSeance/>}/>
          <Route path="/creer-seance" element={<CreerSeance/>}/>
          <Route path="/fin-seance/:seanceId" element={<FinSeance/>}/>
          <Route path="/resultat_seance" element={<ResultatSeance/>}/>
          <Route path="/save_seance" element={<SaveSeance/>}/>
          <Route path="/seance/:seanceId/execute" element={<SeanceExo />} />

          <Route path="/remplacerexo" element={<RemplacerExo/>}/>
          <Route path="/exercice/:id" element={<ExercicePage />} />
          <Route path="/exercices" element={<ExerciceProvider/>}/>
          <Route path="/exo-search" element={<ExoSearch/>}/>
        </Routes>
      </SeancesProvider>
    </ExerciceProvider>
  );
}
