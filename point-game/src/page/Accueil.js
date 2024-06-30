import React , { useEffect} from 'react';
import '../css/accueil.css';
import {useNavigate} from 'react-router-dom';
import player2 from '../img/2joueur.svg';
import player3 from '../img/3joueur.svg';
import robot from '../img/robot.svg';

function Home(){
    const navigate = useNavigate();
    useEffect(() => {
        const container = document.getElementById('frontView');
        const view = document.getElementById("text");
        view.addEventListener('click', function(){
            const front = document.getElementById("frontView");
            front.style.height = "45vh";
            view.style.bottom = "0%";
            view.style.paddingBottom = "10px";
        });

        document.querySelectorAll(".button").forEach(element => {
            element.addEventListener('click',function(){
                localStorage.setItem("typeJeu", element.className);
                navigate("/parametrage");
            })
        });
        function getRandomColor() {
            const hexadecimal = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += hexadecimal[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    
        async function createDiamond() {
            const diamond = document.createElement('div');
            diamond.className = 'diamond';
            diamond.style.backgroundColor = getRandomColor();
            diamond.style.left = `${Math.random() * (window.innerWidth-50)}px`;
            diamond.style.top = `${Math.random() * (window.innerHeight-50)}px`;
            container.appendChild(diamond);
    
            setTimeout(() => {
                container.removeChild(diamond);
            }, 1000);
        }
    
        setInterval(createDiamond, 500); 
    },[]);
    return (
        <div className="accueil">
            <div className="frontView" id="frontView">
                <p className="text" id="text">
                    <span className="letter">P</span><span className="letter">O</span><span className="letter">I</span><span className="letter">N</span><span className="letter">T</span> 
                    <span className="letter"> - </span> 
                    <span className="letter">G</span><span className="letter">A</span><span className="letter">M</span><span className="letter">E</span>
                </p>
            </div>
            <div className="gameSelect" id="game">
                <div className="button player2" id="1">
                    <img alt="2 players" src={player2}/>
                    <span></span>
                    <p>2 Players</p>
                </div>
                <div className="button player3" id="2">
                    <img alt="2 players" src={player3}/>
                    <span></span>
                    <p>3 Players</p>
                </div>
                <div className="button bot" id="3">
                    <img alt="2 players" src={robot}/>
                    <span></span>
                    <p>VS Computer</p>
                </div>
            </div>
        </div>
    );
}
export default Home;