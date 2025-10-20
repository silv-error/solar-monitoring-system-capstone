const secondsToMinutes = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0 min";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes} min ${remainingSeconds}s`;
};
