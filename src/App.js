import React, { useState } from "react";
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
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//Routes
import ForgotPassword from "./forgot-psw";
import Register from "./register";
import Planning from "./planning";
import ListAct from "./list_act";
import ExoAct from "./exo-act";
import Echauffement from "./echauffement";

import Test from "./test";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  };


  //Boîtes de formulaires
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

// Chemin Routes
export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-psw" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/planning" element={<Planning/>} />
        <Route path="/list_act" element={<ListAct/>}/>
        <Route path="/exo-act" element={<ExoAct/>}/>
        <Route path="/echauffement" element={<Echauffement/>}/>
        <Route path="/test" element={<Test/>}/>
      </Routes>
  );
}
