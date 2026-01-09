import Typography from '@mui/joy/Typography';
import Box from "@mui/joy/Box";
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export default function GradientCover() {
  const Navigate = useNavigate();


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
          Test de(s) bouton(s)
        </Typography>
                  <IconButton
            edge="start"
            sx={{ color: '#000' }}
            aria-label="retour"
            onClick={() => Navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
      </AppBar>
    </Box>
    );
}
