import React, { useState, useEffect } from 'react';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Box from "@mui/joy/Box";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Toolbar, 
  AppBar, 
  Stack, 
  Slide,
  Badge,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { IconButton } from '@mui/material';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CommentIcon from '@mui/icons-material/Comment';

import { 
  getNotifications, 
  deleteAllNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../Données/notifService';

export default function Notif() {
  const navigate = useNavigate();
  const [notifsDialogOpen, setNotifsDialogOpen] = useState(false);
  const [slideIn] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notifs = getNotifications();
    setNotifications(notifs);
  };

  const handleOpenDialog = () => {
    setNotifsDialogOpen(true);
  };

  const handleDeleteNotifications = () => {
    deleteAllNotifications();
    setNotifications([]);
    setNotifsDialogOpen(false); 
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    loadNotifications();

    if (notification.data?.seanceId) {
      navigate(`/seance/${notification.data.seanceId}`);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    loadNotifications();
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'seance_created':
        return <FitnessCenterOutlinedIcon />;
      case 'seance_completed':
        return <CheckCircleIcon />;
      case 'coach_comment':
        return <CommentIcon />;
      default:
        return <FitnessCenterOutlinedIcon />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `Il y a ${minutes} min`;
    } else if (hours < 24) {
      return `Il y a ${hours}h`;
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Box 
      sx={{ width: '100%', position: 'relative', minHeight: '100vh', pb: 4 }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', boxShadow: 0 }}>
        <Toolbar sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: '#000000' }} onClick={() => navigate("/planning")}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography fontWeight='bold' sx={{ color: '#000' }}>
              Notifications
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {unreadNotifications.length > 0 && (
              <IconButton 
                sx={{ color: '#000000' }} 
                onClick={handleMarkAllAsRead}
                size="small"
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton 
              sx={{ color: '#000000' }} 
              onClick={handleOpenDialog}
            >
              <ClearAllOutlinedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={notifsDialogOpen}
        onClose={() => setNotifsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={600}>
              Souhaites-tu effacer tes notifications ?
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Cette action supprimera toutes les notifications existantes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotifsDialogOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteNotifications} color="primary">
            Effacer
          </Button>
        </DialogActions>
      </Dialog>

      <Toolbar />

      <Slide direction="right" in={slideIn} timeout={300}>
        <Box sx={{ px: 2, pt: 2 }}>
          {unreadNotifications.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography fontWeight='bold' sx={{ mb: 2 }}>
                Nouvelles ({unreadNotifications.length})
              </Typography>
              {unreadNotifications.map((notification) => (
                <Button
                  key={notification.id}
                  variant="contained"
                  sx={{
                    width: '100%',
                    mb: 1.5,
                    backgroundColor: '#e3f2fd',
                    '&:hover': { backgroundColor: '#bbdefb' },
                    color: 'black',
                    textTransform: 'none',
                    padding: 2,
                    justifyContent: 'flex-start',
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ mt: 0.5, color: '#1976d2' }}>
                      {getIconForType(notification.type)}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                      <Typography fontWeight="bold">
                        {notification.title}
                      </Typography>

                      <Typography variant="body2" sx={{ textAlign: 'left' }}>
                        {notification.message}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.timestamp)}
                      </Typography>
                    </Box>
                    <Badge 
                      color="primary" 
                      variant="dot" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Button>
              ))}
            </Box>
          )}

          {readNotifications.length > 0 && (
            <Box>
              <Typography fontWeight='bold' sx={{ mb: 2 }}>
                Déjà lues
              </Typography>
              {readNotifications.map((notification) => (
                <Button
                  key={notification.id}
                  variant="contained"
                  sx={{
                    width: '100%',
                    mb: 1.5,
                    backgroundColor: '#ffffff',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    color: 'black',
                    textTransform: 'none',
                    padding: 2,
                    justifyContent: 'flex-start',
                    opacity: 0.7,
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ mt: 0.5, color: '#666' }}>
                      {getIconForType(notification.type)}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                      <Typography fontWeight="bold">
                        {notification.title}
                      </Typography>

                      <Typography variant="body2" sx={{ textAlign: 'left' }}>
                        {notification.message}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                </Button>
              ))}
            </Box>
          )}

          {notifications.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <FitnessCenterOutlinedIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucune notification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tes notifications apparaîtront ici
              </Typography>
            </Box>
          )}
        </Box>
      </Slide>
    </Box>
  );
}
