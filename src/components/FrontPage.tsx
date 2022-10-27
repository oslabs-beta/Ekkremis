// Cesar
import React from "react";
import '../styles/frontPage.css'; // css folder
// import logo from '../img/Ekkremis-md.png' // logo for front page not working
import Button from './smallComps/Button'; // this should be button 

function FrontPage() {
  return (
    <div className="fp">
        <Button />
        <img className="fpLogo" src={'../img/Ekkremis-md.png'} alt="Ekkremis Logo"/>
        <h1 className="fpH1">
          Ekkremis
        </h1>
        <h3 className="fpH3">Coming Soon ... </h3>
    </div>
  );
}

export default FrontPage;