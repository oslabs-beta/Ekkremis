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
      // const url = inputValue.toString() + '/metrics'
      if (inputValue) props.setCurrentUrl(inputValue);
      else inputValue = 'http://localhost:9090';
     
      inputElement.value = '';

      function helperClick() {
        document.getElementById('summary-button')?.click();
      }

      // this is the get real data from localhost 9090
      getPodInfo("actual", setAllPods, inputValue);
  
      // this uses mock data
      // getPodInfo("mock", setAllPods);
  
      // declare a resultObject -> {"pending": {}, "running": {}, "succeeded": {}, "unknown": {}, "failed": {}};
      // call our first fetch function to update result object, pass in resultObject as an argument 
      // second fetch 
      // third fetch
      // setAllPods(resultObject)
      setTimeout(() => {helperClick()}, 500)

      // document.getElementById('summary-button')?.click();
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
              className="FPbutton url-button"
              children="Update Url"
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