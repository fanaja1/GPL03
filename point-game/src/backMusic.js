import React, { useEffect, useRef } from 'react';
import { useMusic } from './MusicContext';

const BackMusic = () => {
  const audioRef = useRef(null);
  const { musicSrc } = useMusic();//miacceder anleh musique

  useEffect(() => {
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current.src = musicSrc;
        audioRef.current.play().catch(error => {
          console.error('Erreur lors de la lecture de la musique :', error);
        });
      }
    };

    playMusic();
  }, [musicSrc]);

  return (
    <audio ref={audioRef} loop>
      <source src={musicSrc} type="audio/mpeg" />
    </audio>
  );
};

export default BackMusic;
