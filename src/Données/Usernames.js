const NOMS = [
  "Tartempion", "Bidule", "Trucmuche", "Machin", "Chose",
  "Groschat", "Petitloup", "Pouledor", "Renardargent", "Ours",
  "Faucon", "Tigre", "Panthère", "Dragon", "Phoenix",
  "Spartiate", "Guerrier", "Champion", "Viking", "Samurai",
  "Tornado", "Eclair", "Tempête", "Avalanche", "Cyclone",
  "Rocco", "Bruno", "Maximus", "Titan", "Atlas",
  "Hercule", "Thor", "Zeus", "Odin", "Ares"
];

const SUFFIXES = [
  "99", "2000",
  "Legend", "Supreme", "Ultra", "Mega", "Super",
  "Prime", "Elite", "Alpha", "Omega", "X"
];

export const generateRandomUsername = () => {
  const randomNom = NOMS[Math.floor(Math.random() * NOMS.length)];
  const randomSuffix = Math.random() > 0.5 
    ? SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] 
    : "";
  
  return randomNom + randomSuffix;
};

export const getUsername = () => {
  let username = localStorage.getItem('username');
  
  if (!username) {
    username = generateRandomUsername();
    localStorage.setItem('username', username);
    console.log('Nouveau nom généré:', username);
  }
  
  return username;
};

export const setUsername = (username) => {
  localStorage.setItem('username', username);
};

export const resetUsername = () => {
  const newUsername = generateRandomUsername();
  setUsername(newUsername);
  return newUsername;
};