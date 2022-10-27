// Cesar
import React from "react";
import '../styles/frontPage.css'; // css folder
import Button from './smallComps/Button'; // this should be button 
import Link from "react-router-dom";

const logo = require('../img/Ekkremis-md.png') // https://stackoverflow.com/questions/39999367/how-do-i-reference-a-local-image-in-react

function FrontPage() {
  return (
    <div>
        <div className="fp">
          {/* <Button 
            path="/dashboard"
            className="FPbutton"
            children="Continue to Dashboard"
          />  */}
          {/* <Link to="/dashboard">Continue to Dashboard</Link> */}
        </div>
        
        <div className="fpLogo">
           <img src={logo} alt="Ekkremis Logo"/>
        </div>
        
        <div className="fpH1">
          <h1> EKKREMIS </h1>
        </div>
        
        {/* <h3 className="fpH3">Coming Soon ... </h3>  IN CASE DASHBOARD WAS NOT READY FOR MVP PRESENTATION*/}
    </div>
  );
}

export default FrontPage;