import React, { createContext, useContext, useState } from "react";

const ExerciceContext = createContext();

export const ExerciceProvider = ({ children }) => {
  const [exercices] = useState([
    {
      id: 1,
      title: "Ab Wheel",
      image:'https://picsum.photos/800/400?1',
      groupe1: "Abdominaux",
      description:
        "Efficace pour renforcer la ceinture abdominale et améliorer le gainage. Sollicite principalement les abdominaux, les obliques, les épaules, les bras, le dos et même les fessiers.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE",
      note: "",
      prescriptions: [
        { reps: "max", RPE: "8", repos: "-" },
        { reps: "max", RPE: "8", repos: "-" },
        { reps: "max", RPE: "8", repos: "-" },
        { reps: "max", RPE: "8", repos: "-" }
      ],
      checked: [],
      performances: [],
      tab: 0
    },
    {
      id: 2,
      title: "Abduction de la jambe à la poulie",
      image:'https://picsum.photos/800/400?2',
      groupe1: "Abducteurs",
      description:
        "Renforce les muscles abducteurs de la hanche, principalement le moyen fessier et le petit fessier, tout en améliorant la stabilité du bassin et la symétrie musculaire du bas du corps.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE",
      note: "",
      prescriptions: [
        { reps: "max", RPE: "8", repos: "-" },
        { reps: "max", RPE: "8", repos: "-" },
        { reps: "max", RPE: "8", repos: "-" },
        { reps: "max", RPE: "8", repos: "-" }
      ],
      checked: [],
      performances: [],
      tab: 0
    },
    {
      id: 3,
      title: "Abduction des jambes à la machine",
      image:'https://picsum.photos/800/400?3',
      groupe1: "Abducteurs",
      description:
        "Visant spécifiquement les muscles abducteurs situés à l'extérieur des cuisses et du bassin.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE"
    },
    {
      id: 4,
      title: "Air Squat",
      image:'https://picsum.photos/800/400?4',
      groupe1: "Quadriceps",
      groupe2: "Fessier",
      description:
        "Consiste à descendre en position accroupie tout en maintenant le dos droit, puis à remonter en poussant avec les talons.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE"
    },
    {
      id: 5,
      title: "Assault AirBike",
      image:'https://picsum.photos/800/400?5',
      groupe1: "",
      description:
        "Conçu pour un entraînement complet du corps, combinant pédalage avec un mouvement des bras.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE"
    },
    {
      id: 6,
      title: "Barbell levers",
      image:'https://picsum.photos/800/400?6',
      groupe1: "Epaules",
      description:
        "Facilite des mouvements complexes en plusieurs plans, ciblant abdominaux, obliques et fessiers.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE"
    },
    {
      id: 7,
      title: "Box Jump",
      image:'https://picsum.photos/800/400?7',
      groupe1: "Mollets",
      groupe2: "Quadriceps",
      description:
        "Améliore l'explosivité, la puissance et la coordination des membres inférieurs.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE",
      sets: 4,
      note: "",
      prescriptions: [
        { duree: "01:00", RPE: "8", repos: "-" },
        { duree: "01:00", RPE: "8", repos: "-" },
        { duree: "01:00", RPE: "8", repos: "-" },
        { duree: "01:00", RPE: "8", repos: "-" }
      ],
      checked: [],
      performances: [],
      tab: 0
    },
    {
      id: 8,
      title: "Cossack Squat",
      image:'https://picsum.photos/800/400?8',
      groupe1: "",
      description:
        "Sollicite quadriceps, fessiers, ischio-jambiers et adducteurs.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE",
      sets: 4,
      note:
        "Avec barre olympique ou EZ, évoluer la charge selon la perception de l'effort.",
      prescriptions: [
        { reps: "8", RPE: "8", repos: "03:00" },
        { reps: "8", RPE: "8", repos: "03:00" },
        { reps: "8", RPE: "8", repos: "03:00" },
        { reps: "8", RPE: "8", repos: "03:00" }
      ],
      checked: [],
      performances: [],
      tab: 0
    },
    {
      id: 9,
      title: "Deep Squat",
      image:'https://picsum.photos/800/400?9',
      groupe1: "",
      description:
        "Descente complète jusqu'à ce que les hanches passent sous les genoux.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE"
    },
    {
      id: 10,
      title: "Fentes en marchant",
      image:'https://picsum.photos/800/400?10',
      groupe1: "Quadriceps",
      groupe2: "Fessiers",
      description:
        "Exercice polyarticulaire sollicitant fortement l'équilibre et le core.",
      videoUrl: "https://www.youtube.com/watch?v=LZ5gyhj5qeE",
      sets: 4,
      note: "8 répétitions de chaque côté par série",
      prescriptions: [
        { reps: "8", RPE: "8", repos: "-" },
        { reps: "8", RPE: "8", repos: "-" },
        { reps: "8", RPE: "8", repos: "-" },
        { reps: "8", RPE: "8", repos: "-" }
      ],
      checked: [],
      performances: [],
      tab: 0
    },
    { id: 11, 
    title: 'L-Sit assisté', 
    image:'https://picsum.photos/800/400?11',    
    groupe1:'', 
    description:"Conçue pour permettre aux débutants de travailler la force et la stabilité nécessaires pour maîtriser la position complète.", 
    videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE', 
    sets: 4, 
    note: "Note du coach: Max en terme de durée, ça va évoluer !",
    prescriptions: [
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" }
    ],
    checked: [],
    performances: [],
    tab: 0
    },

    { id: 12, 
    title: 'Pompes explosives', 
    image:'https://picsum.photos/800/400?12',
    groupe1:'', 
    description:"Une variante dynamique et puissante des pompes classiques, qui consistent à pousser le sol avec force pour décoller les mains du sol. Sollicite les pectoraux, triceps, deltoîdes antérieurs et les abdominaux.", 
    videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE', 
    sets: 4, 
    note: "",
    prescriptions: [
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" }
    ],
    checked: [],
    performances: [],
    tab: 0
    },

    { id: 13, 
      title: 'Rameur', 
      image:'https://picsum.photos/800/400?13',
      groupe1:'Dos', 
      groupe2:'Biceps', 
      description:"Conçu pour reproduire fidèlement les mouvements de l'aviron.  Il permet de pratiquer un entraînement cardiovasculaire complet tout en sollicitant une grande majorité des muscles du corps.", 
      videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE' 

    },

    { id: 14, 
      title: 'Stretch Chaine Postérieure', 
      image:'https://picsum.photos/800/400?14',
      groupe1:'', 
      description:"Vise à allonger les muscles situés à l’arrière du corps, de l’arrière des jambes jusqu’au crâne, en passant par le bas du dos, les fessiers et les trapèzes.", 
      videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE' 

    },

    { id: 15, 
      title: 'Stretch Fessier (unilatéral)', 
      image:'https://picsum.photos/800/400?15',
      groupe1:'', 
      description:"Cette posture cible spécifiquement un côté du corps pour étirer profondément les muscles fessiers. Sollicite les petit fessiers et le moyen fessiers.", 
      videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE' 

    },

    { id: 16, 
      title: 'Stretch Iscio Sol', 
      image:'https://picsum.photos/800/400?16',
      groupe1:'', 
      description:"Améliore la souplesse, prévien les blessures et soulage les tensions lombaires. Sollicite les ischio-jambiers.", 
      videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE' 

    },

    { id: 17, 
      title: 'Stretch Psoas (unilatéral)', 
      image:'https://picsum.photos/800/400?17',
      groupe1:'', 
      description:"Cet exercice cible spécifiquement un côté du muscle psoas, idéal pour corriger les déséquilibres posturaux ou soulager une douleur localisée.", 
      videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE' 

    }, 

    { id: 18, 
      title: 'Thoracic Rotattion', 
      image:'https://picsum.photos/800/400?18',
      groupe1:'', 
      description:"Correspond à la rotation du core au niveau de la colonne vertébrale thoracique, située dans le haut du dos. Elle permet environ 40 degrés de mobilité totale.", 
      videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE' 

    },

    { id: 19, 
      title: 'Thoracic Spine', 
      image:'https://picsum.photos/800/400?19',
      groupe1:'', 
      description:"", 
      videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE' 

    },

    { id: 20, 
      title: "Traction à l'élastique", 
      image:'https://picsum.photos/800/400?20',
      groupe1:'', 
      description:"Consiste à utiliser une bande élastique pour réduire la charge à soulever, facilitant ainsi l'exécution du mouvement. Cette méthode est particulièrement adaptée aux débutants ou à ceux souhaitant progresser vers des tractions strictes sans assistance.", 
    videoUrl: 'https://www.youtube.com/watch?v=LZ5gyhj5qeE', 
    sets: 4, 
    note: "Note du coach: Obligation de mettre l'élastique dès la 1ere série pour focus volume.",
    prescriptions: [
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" },
      { reps: "max", RPE:"8", repos: "-" }
    ],
    checked: [],
    performances: [],
    tab: 0
    },
  ]);

  const getExerciceById = (id) =>
    exercices.find((ex) => ex.id === parseInt(id));

  const searchExercices = (query) =>
    exercices.filter((ex) =>
      ex.title.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <ExerciceContext.Provider
      value={{ exercices, getExerciceById, searchExercices }}
    >
      {children}
    </ExerciceContext.Provider>
  );
};

export const useExercices = () => {
  const context = useContext(ExerciceContext);
  if (!context) {
    throw new Error("useExercices must be used within ExerciceProvider");
  }
  return context;
};
