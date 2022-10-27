// Rilo
import App from "../App";
import React from "react";
import "../styles/errorModal.css";
import "../styles/chartsModal.css";

// function errorModal({ closeModal }){
//   return(
//     <div className="errorModalBg">
//       <div className="modalContainer">
//         <button className="close" onClick={() =>{closeModal(false)}}>Close</button>
//         <div className="title"><h2>Error Log</h2></div>
//         <div className="body">
//           <p>image of error log goes here</p>
//         </div>
//       </div>
//     </div>
//   );
// }


type ErrorProps = {
    show: boolean,
    toggleErrorModal: () => void;
  }
  
  const ErrorModal = (props: ErrorProps) => {
  
    const showModalClassName = props.show ? "modal display-block" : "modal display-none";
  
    return (
      <div className={showModalClassName}>
        <section className="modal-main">
          <img src={require('../img/charts.png')} alt="logs" className="logImage" />
          <button type="button" onClick={props.toggleErrorModal}>
            Close
          </button>
        </section>
      </div>
    )
  }
  
export default ErrorModal;
