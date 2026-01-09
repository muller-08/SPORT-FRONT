import { Fab, Slide, Box, Tabs, Tab, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Card, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect } from 'react';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea'

export default function ListAct() {
  const navigate = useNavigate();
  const [slideIn] = useState(true);
  const [activeTab, setActiveTab] = useState({});
  const [timer, setTimer] = useState(0);


  useEffect(() => {
        const timeTimer = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
  
        return () => clearInterval(timeTimer);
      }, []);
      
      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };
      
  const renderDetails = (title) => (
    <Box sx={{ p: 2 }}>
         <CardActionArea>
        <CardMedia
          component="img"
          height="70"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="image test"
        />
        <Typography variant="body2" color="text.secondary">
          Titre Vidéo
        </Typography>
        </CardActionArea>
      <Typography fontWeight="bold">{title}</Typography>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>#</TableCell>
              <TableCell align="right"> Durée </TableCell>
              <TableCell align="right"> a </TableCell>
              <TableCell align="right"> b </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
                <TableCell align="right">00:00</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">
                  <Checkbox />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
                <TableCell align="right">00:00</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">
                  <Checkbox />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
                <TableCell align="right">00:00</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">
                  <Checkbox />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4</TableCell>
                <TableCell align="right">00:00</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">
                  <Checkbox />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Button variant="contained" size="medium" sx={{ backgroundColor: '#aaaaaaff', color: "#000000", fontWeight: "bold" }} onClick={() => navigate('/test')}>
          Bouton test
        </Button>
      </Box>
    </Box>
    
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#ffffffff', boxShadow: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            edge="start"
            sx={{ color: '#000000ff' }}
            aria-label="retour"
            onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ color: '#000', fontWeight: 'bold' }}>
              {formatTime(timer)}
            </Typography>
            
            <Box sx={{ width: 760 }} />
          </Toolbar>
        </AppBar>
      <Fab
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }}
        size="small"
        color="primary"
        onClick={() => navigate(-1)}
      >
        {'<'}
      </Fab>

      <Slide direction="right" in={slideIn} timeout={300} mountOnEnter unmountOnExit onExited={() => navigate('/exo-act')}>
        <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 2, pt: 8, alignItems: 'center' }}>
          <Button variant="contained" size="medium" sx={{ position: 'fixed', }} onClick={() => navigate('/exo-act')}>
            Suivant
          </Button>
          <Card orientation="vertical" variant="plain" sx={{ minHeight: 'auto', p: 0, width: '100%', maxWidth: 400, cursor: 'pointer' }}>

            {[0,1,2,3,4,5].map((i) => (
              <Card key={i} sx={{ my: 2, mx: 2, p: 0 }} variant="outlined">
                <Tabs
                  value={activeTab[i] || 0}
                  onChange={(e, newValue) => setActiveTab({ ...activeTab, [i]: newValue })}
                  sx={{ width: '100%', borderBottom: '1px solid #ddd' }}
                >
                  <Tab label="Activité 1" value={0} />
                  <Tab label="Test" value={1} />
                  
                </Tabs>
                {activeTab[i] === 0 ? renderDetails (`Description `) : renderDetails(`Test ${i+1}`)}
              </Card>
            ))}
          </Card>
        </Box>
      </Slide>
    </>
  );
}
