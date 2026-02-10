/**
 * Vérifie si notifs activées
 */
const areNotificationsEnabled = () => {
  try {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true; 
  } catch {
    return true;
  }
};

export const addNotification = (notification) => {
  try {
    const notifications = getNotifications();
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    const alreadyExists = notifications.some(
      n =>
        n.type === notification.type &&
        n.message === notification.message
    );

    if (alreadyExists) return null;
    
    notifications.unshift(newNotification); 
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    return newNotification;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de notification:', error);
    return null;
  }
};

export const getNotifications = () => {
  try {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return [];
  }
};

/**
 * Marque une notification comme lue
 */
export const markAsRead = (notificationId) => {
  try {
    const notifications = getNotifications();
    const updated = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Erreur lors du marquage de notification:', error);
    return false;
  }
};

/**
 * Marque toutes les notifications comme lues
 */
export const markAllAsRead = () => {
  try {
    const notifications = getNotifications();
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error);
    return false;
  }
};

/**
 * Supprime toutes les notifications
 */
export const deleteAllNotifications = () => {
  try {
    localStorage.setItem('notifications', JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
    return false;
  }
};

/**
 * Supprime une notification spécifique
 */
export const deleteNotification = (notificationId) => {
  try {
    const notifications = getNotifications();
    const filtered = notifications.filter(notif => notif.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de notification:', error);
    return false;
  }
};

/**
 * Compte les notifications non lues
 */
export const getUnreadCount = () => {
  try {
    const notifications = getNotifications();
    return notifications.filter(notif => !notif.read).length;
  } catch (error) {
    console.error('Erreur lors du comptage des notifications:', error);
    return 0;
  }
};

/**
 * Notifications pré-définies
 */
export const NotificationTypes = {
  SEANCE_CREATED: {
    type: 'seance_created',
    icon: 'FitnessCenterOutlined',
    getTitle: (seanceName) => `Nouvelle séance créée`,
    getMessage: (seanceName) => `Ta séance "${seanceName}" a été créée avec succès et ajoutée à ton planning.`,
  },
  SEANCE_COMPLETED: {
    type: 'seance_completed',
    icon: 'CheckCircleOutline',
    getTitle: (seanceName) => `Séance terminée !`,
    getMessage: (seanceName, stats) => 
      `Bravo ! Tu as terminé "${seanceName}". ${stats?.series || 0} séries complétées, ${stats?.tonnage || 0}kg de tonnage total.`,
  },
  SEANCE_MODIFIED: {
    type: 'seance_modified',
    icon: 'EditOutlined',
    getTitle: (seanceName) => `Séance modifiée`,
    getMessage: (seanceName) => `Ta séance "${seanceName}" a été mise à jour.`,
  },
};

/**
 * Crée une notification pour une nouvelle séance
 */
export const notifySeanceCreated = (seanceName) => {
  if (!areNotificationsEnabled()) {
    console.log('Notifications désactivées - notification non créée');
    return null;
  }
  
  const notifType = NotificationTypes.SEANCE_CREATED;
  return addNotification({
    type: notifType.type,
    date: notifType.date,
    icon: notifType.icon,
    title: notifType.getTitle(seanceName),
    message: notifType.getMessage(seanceName),
  });
};

/**
 * Crée une notification pour une séance terminée
 */
export const notifySeanceCompleted = (seanceName, stats) => {
  if (!areNotificationsEnabled()) {
    console.log('Notifications désactivées - notification non créée');
    return null;
  }
  
  const notifType = NotificationTypes.SEANCE_COMPLETED;
  return addNotification({
    type: notifType.type,
    icon: notifType.icon,
    title: notifType.getTitle(seanceName),
    message: notifType.getMessage(seanceName, stats),
  });
};

/**
 * Crée une notification pour une séance modifiée
 */
export const notifySeanceModified = (seanceName) => {
  if (!areNotificationsEnabled()) {
    console.log('Notifications désactivées - notification non créée');
    return null;
  }
  
  const notifType = NotificationTypes.SEANCE_MODIFIED;
  return addNotification({
    type: notifType.type,
    icon: notifType.icon,
    title: notifType.getTitle(seanceName),
    message: notifType.getMessage(seanceName),
  });
};