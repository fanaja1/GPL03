import React, { useEffect } from 'react';
import './styles/Losanges.css';

const colorsHex = [
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFFF00",
  "#FFA500",
  "#800080",
  "#FFC0CB",
  "#A52A2A",
  "#00FFFF",
  "#00FF00",
  "#40E0D0",
  "#808080"
];

function Losanges() {
  useEffect(() => {
    function creerLosange() {
      const largeur = Math.random() * 180 + 30;
      const hauteur = Math.random() * 180 + 30;

      const positionTop = Math.random() * (window.innerHeight - hauteur);
      const positionLeft = Math.random() * (window.innerWidth - largeur);

      const couleurAleatoire = colorsHex[Math.floor(Math.random() * colorsHex.length)];

      const losange = document.createElement('div');
      losange.className = 'losange';
      losange.style.width = `${largeur}px`;
      losange.style.height = `${hauteur}px`;
      losange.style.top = `${positionTop}px`;
      losange.style.left = `${positionLeft}px`;
      losange.style.border = `1px solid ${couleurAleatoire}CC`;
      losange.style.backgroundColor = `${couleurAleatoire}26`;
      
      const a = document.createElement('p');
      a.innerHTML="dom";

      document.getElementById('losange-container').appendChild(losange);

      const delai = Math.random() * 5000 + 2000;
      losange.style.animation = `fadeInOut ${delai}ms ease-in-out`;

      setTimeout(() => {
        losange.remove();
        creerLosange();
      }, delai + 1000); // Adjust timing to match animation
    }

    for (let i = 0; i < 25; i++) {
      creerLosange();
    }
  }, []);

  return <div id="losange-container" className="losange-container"></div>;
}

export default Losanges;
