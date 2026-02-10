import React, { useState } from 'react';
  import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Stack,
  Link,
  Slide,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useExercices } from './exercices';



export default function ExercicePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [slideIn] = useState(true);
  const { exercices } = useExercices();

  const getYoutubeEmbedUrl = (url) => {
  const videoId = url.split("v=")[1];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

  const exercice = exercices.find(
    (ex) => ex.id === Number(id)
  );

  if (!exercice) {
    return (
      <Typography style={{ padding: 20 }}>
        <h2>Exercice introuvable</h2>
        <Link onClick={() => navigate(-1)}>Retour</Link>
      </Typography>
    );
  }

return(
  <Slide direction="right" in={slideIn} timeout={300}>
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <AppBar position="sticky" color="transparent" elevation={0}
      sx={{ top:0, background: '#fff' }}
      >
        <Toolbar>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Exercice
          </Typography>
        </Toolbar>
      </AppBar>
    
        <Box sx={{ position: "relative", width: "100%", height: 460 }}>
          <iframe
            width="100%"
            height="100%"
            src={getYoutubeEmbedUrl(exercice.videoUrl)}
            title={exercice.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 8 }}
          />
        </Box>
      <Box sx={{ p: 2 }}>
        <Link
          href={exercice.videoUrl}
          underline="hover"
          sx={{ color: "primary.main", fontWeight: 500 }}
        >
          Voir sur Youtube 
        </Link>

        <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
          {exercice.title}
        </Typography>

          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[exercice.groupe1, exercice.groupe2]
              .filter(Boolean)
              .map((groupe) => (
                <Box
                  key={groupe}
                  sx={{
                    bgcolor: "#2e2e2e",
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 999,
                    fontSize: 13,
                  }}
                >
                  {groupe}
                </Box>
              ))}
          </Box>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Description
            </Typography>
            <Typography color="text.secondary">
              {exercice.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Meilleure performance
            </Typography>
            <Typography color="text.secondary">
              Aucun enregistrement
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Dernière séance
            </Typography>
            <Typography color="text.secondary">
              Aucun enregistrement
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
    </Slide>
  );
}