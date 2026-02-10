import React, { createContext, useContext, useState, useEffect } from "react";

const SeancesContext = createContext();

export const SeancesProvider = ({ children }) => {
  const [seances, setSeances] = useState([
    {
      id: 1,
      title: 'CALLISTHÉNIE 6',
      date: 'lun. 29 déc.',
      duration: '00:00:00',
      type: 'Activé',
      description: '',
      image: 'https://picsum.photos/800/400',
      sections: [
        {
          id: 'section-1',
          title: 'ÉCHAUFFEMENT',
          type: 'Musculation',
          tracked: false,
          exerciceIds: [14, 9, 17, 15, 16, 18, 19, 13]
        },
        {
          id: 'section-2',
          title: 'CALLISTHÉNIE 6',
          type: 'Musculation',
          tracked: true,
          isSuperset: true,
          exerciceIds: [20, 11, 10, 12, 7, 8]
        }
      ]
    },
    {
      id: 2,
      title: 'FORCE HAUT DU CORPS',
      date: 'mar. 30 déc.',
      duration: '00:00:00',
      type: 'Brouillon',
      description: 'Séance de force pour le haut du corps',
      image: 'https://picsum.photos/800/401',
      sections: [
        {
          id: 'section-1',
          title: 'ÉCHAUFFEMENT',
          type: 'Musculation',
          tracked: false,
          exerciceIds: [14, 9, 18]
        },
        {
          id: 'section-2',
          title: 'FORCE',
          type: 'Musculation',
          tracked: true,
          exerciceIds: [1, 2, 6]
        }
      ]
    }
  ]);

  useEffect(() => {
    const loadCalendarSeances = () => {
      try {
        const saved = localStorage.getItem('seancesCalendrier');
        if (saved) {
          const calendarSeances = JSON.parse(saved);
          const flatSeances = Object.values(calendarSeances).flat();
          
          setSeances(prevSeances => {
            const existingIds = new Set(prevSeances.map(s => s.id));
            const newSeances = flatSeances.filter(s => !existingIds.has(s.id));
            return [...prevSeances, ...newSeances];
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des séances du calendrier:', error);
      }
    };

    loadCalendarSeances();

    window.addEventListener('focus', loadCalendarSeances);
    return () => window.removeEventListener('focus', loadCalendarSeances);
  }, []);

  const getSeanceById = (id) => {
    let seance = seances.find(s => s.id === parseInt(id));
    
    if (!seance) {
      try {
        const saved = localStorage.getItem('seancesCalendrier');
        if (saved) {
          const calendarSeances = JSON.parse(saved);
          const flatSeances = Object.values(calendarSeances).flat();
          seance = flatSeances.find(s => s.id === parseInt(id));
        }
      } catch (error) {
        console.error('Erreur lors de la recherche dans localStorage:', error);
      }
    }
    
    return seance;
  };
  
  const addSeance = (seance) => {
    const newSeance = {
      ...seance,
      id: seance.id || Date.now(),
    };
    setSeances(prev => [...prev, newSeance]);
    return newSeance;
  };

  const updateSeance = (id, updatedSeance) => {
    setSeances(prevSeances => 
      prevSeances.map(s => s.id === id ? { ...s, ...updatedSeance } : s)
    );
    
    try {
      const saved = localStorage.getItem('seancesCalendrier');
      if (saved) {
        const calendarSeances = JSON.parse(saved);
        let updated = false;
        
        Object.keys(calendarSeances).forEach(dateKey => {
          calendarSeances[dateKey] = calendarSeances[dateKey].map(s => {
            if (s.id === id) {
              updated = true;
              return { ...s, ...updatedSeance };
            }
            return s;
          });
        });
        
        if (updated) {
          localStorage.setItem('seancesCalendrier', JSON.stringify(calendarSeances));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour dans localStorage:', error);
    }
  };

  const deleteSeance = (id) => {
    setSeances(seances.filter(s => s.id !== id));
    
    try {
      const saved = localStorage.getItem('seancesCalendrier');
      if (saved) {
        const calendarSeances = JSON.parse(saved);
        
        Object.keys(calendarSeances).forEach(dateKey => {
          calendarSeances[dateKey] = calendarSeances[dateKey].filter(s => s.id !== id);
          if (calendarSeances[dateKey].length === 0) {
            delete calendarSeances[dateKey];
          }
        });
        
        localStorage.setItem('seancesCalendrier', JSON.stringify(calendarSeances));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression dans localStorage:', error);
    }
  };

  return (
    <SeancesContext.Provider
      value={{
        seances,
        getSeanceById,
        addSeance,
        updateSeance,
        deleteSeance
      }}
    >
      {children}
    </SeancesContext.Provider>
  );
};

export const useSeances = () => {
  const context = useContext(SeancesContext);
  if (!context) {
    throw new Error("useSeances must be used within SeancesProvider");
  }
  return context;
};