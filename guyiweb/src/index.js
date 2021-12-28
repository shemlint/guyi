import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
//create splash creen
let img=window.document.createElement('img')
img.style='width:100vw;height:100vh;position:absolute;top:0,left:0;z-index:1000000000;'
img.id='--guyisplashscreen--'
let src=img.src=localStorage.getItem('guyisplashscreen')
if(src){
  window.document.body.appendChild(img)
}else{
  console.log('no splash screen')
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


