import React from 'react';
import './styles/Title.css';
import AnimatedText from './AnimatedText';
import ispm from '../src/img/ispm.png'

function Title({ setSwitchScreen }) {
  const handleButtonClick = (e) => {
    e.preventDefault();
    const button = e.target;
    button.classList.add('bounce');
    setTimeout(() => {
      button.classList.remove('bounce');
      setSwitchScreen(2);
    }, 500);
  };

  return (
    <div className="title-container">
      <img src={ispm} alt='ispm'/>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <AnimatedText />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="button-container">
        <div className="triangle left-triangle"></div>
        <a href="#" onClick={handleButtonClick}>Commencer</a>
        <div className="triangle right-triangle"></div>
      </div>
    </div>
  );
}

export default Title;
