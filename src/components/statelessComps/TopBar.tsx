// importing dependencies 
import React from 'react';
import Button from '../smallComps/Button'; // this should be button 
import '../../styles/topBar.css';
// inpoting functiosn from utils
import { getPodInfo } from '../../utils';
import { nextTick } from 'process';

// the top nav bar containing URL event listener and (potentially login?)
const TopBar = (props: any) => {
    function handleClick(setAllPods: any) {
      console.log('inside handleClick')
      // document.getElementById() returns the type HTMLElement which does not contain a value property. The subtype HTMLInputElement does however contain the value property.
      const inputElement = (document.getElementById('endpoint-url') as HTMLInputElement);
      let inputValue = inputElement.value
      
      if (inputValue) props.setCurrentUrl(inputValue);
      else props.setCurrentUrl('http://localhost:9090');
     
      inputElement.value = '';

      (function destroyLoadingLogo() {
        const loadingLogo = document.getElementById('loading-logo'); 
        loadingLogo?.remove();
      })();

      // this is the get real data from localhost 9090
      // getPodInfo("actual", setAllPods, inputValue);
      props.setStatus('summary')
  
      // this uses mock data
      // getPodInfo("mock", setAllPods);

      // setTimeout(() => {
      //   helperClick();
      props.setPreventChartLooping(true);
      // }, 1000)
    }
  
    let placeholder = ' enter your url here';
    // if (props.currentUrl) placeholder = props.currentUrl;
  
    return(
      <div className='top-bar'>
        <img className='header-logo' src={require('../../img/Ekkremis-logo-dark.png')} alt="Ekkremis" height='100px' width='180px'/>
        <div className='url-input'>
            <input id='endpoint-url' type="text" placeholder={placeholder}/>
            <h5>/metrics</h5>
            <Button 
              className="FPbutton update-button"
              children="Update"
              onClick={()=>{handleClick(props.setAllPods)}}
            />
            {/* <button className='url-btn' onClick={()=>{handleClick(props.setAllPods)}}>update url</button> */}
        </div>
        <div className='login-button-container'>
        <Button 
          className="FPbutton"
          children="Login"
        />
        <Button 
          className="FPbutton"
          children="Sign Up"
        />
        </div>
      </div>
    )
  }

  export default TopBar;