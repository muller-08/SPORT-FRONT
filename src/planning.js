import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Box from "@mui/joy/Box";
import CardActionArea from '@mui/material/CardActionArea';
import Slide from '@mui/material/Slide';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function GradientCover() {
  const navigate = useNavigate();
  const [slideIn, setSlideIn] = useState(true);

  const handleClick = () => {
    setSlideIn(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        position: "fixed",
        bottom: 0,
      }}
    >
       <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}></Toolbar>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#000', p: 1 }}>
          Hello User
        </Typography>
      </AppBar>
      

      <Slide
        direction="right"
        in={slideIn}
        timeout={300}
        onExited={() => navigate('/list_act')}
      >

          <Card orientation="horizontal" variant="plain" sx={{ minHeight: 280 }}>
            <CardActionArea onClick={handleClick}>
              <CardCover
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px),' +
                    'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                }}
              />

              <CardContent sx={{ justifyContent: 'flex-end' }}>
                <Typography level="title-lg" textColor="neutral.300">
                  Place Holder Séance
                </Typography>
                <Typography textColor="neutral.300">
                  Blocs | Exo
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Slide>
      </Box>
  );
}
