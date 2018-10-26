import React from 'react';
import './prizes.css';
const Prizes = (props) => {
    return (
        <div className="prizes-container">
        <div> </div>
        <div className="info-container players-info">{props.players} personas jugando</div>
        <div className="info-container prize-info">{props.prize} ether</div>
        </div>
    );
}

export default Prizes;