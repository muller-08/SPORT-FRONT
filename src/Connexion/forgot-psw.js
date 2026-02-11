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
import { useSwipeable } from 'react-swipeable'; 
import { useNavigate } from 'react-router-dom';

export default function ForgotPsw() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email pour réinitialisation :", email);
    setSent(true);
  };

  const handlers = useSwipeable({
    onSwipedRight: () => navigate(-1),
    trackTouch: true,
    trackMouse: false,
    delta: 80,
    preventScrollOnSwipe: false,
  });

  return (
    <Box {...handlers} >
    <Container {...handlers} maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }} >
        <Typography variant="h5" gutterBottom align="center">
          Mot de passe oublié
        </Typography>

        {!sent ? (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Entrez votre adresse mail.  
              Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Typography>

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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
              >
                Envoyer lien
              </Button>
            </Box>
          </>
        ) : (
          <Typography color="success.main" align="center">
          </Typography>
        )}

        <Typography align="center" sx={{ mt: 3 }}>
          <Link component={RouterLink} to="/">
            Se connecter
          </Link>
        </Typography>
      </Paper>
    </Container>
    </Box>
  );
}
