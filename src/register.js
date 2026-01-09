import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from "@mui/material";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    console.log("Créer un compte avec :", { email, password });
    setSuccess(true);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Créer un compte
        </Typography>

        {!success ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              type="email"
              label="Adresse e-mail"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              required
              type="password"
              label="Mot de passe"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              fullWidth
              required
              type="password"
              label="Confirmer le mot de passe"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
            >
              Créer un compte
            </Button>
          </Box>
        ) : (
          <Typography color="success.main" align="center">
          </Typography>
        )}

        <Typography align="center" sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/">
            Retour à la connexion
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
