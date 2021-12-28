import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TestFormat from './comp/TestFormat';
import reportWebVitals from './reportWebVitals';

const dropped = async (e) => {
  
  try {
    const readDataUrl = (file) => {
      return new Promise((res, rej) => {
        let reader = new FileReader()
        reader.onload = () => res(reader.result)
        reader.onerror = rej
        reader.readAsDataURL(file)
      })
    }
    const files = e.dataTransfer.files
    for (let i = 0; i < files.length; i++) {
      let f = files[i]
      let urlText = ''
      if (f.type.startsWith('text') || f.type.endsWith('json')) {
        urlText = await f.text()
      } else {
        urlText = await readDataUrl(f)
      }
      let file = { name: f.name, size: f.size, type: f.type, url: urlText, by: 'user' }
      global.files.unshift(file)

    }
    e.preventDefault()
    

  } catch (e) {
    console.log('Reading dropped files failed ')
  }
}
const dragOver = (e) => {
  let t = e.dataTransfer.types ? e.dataTransfer.types : []
  let isFile = false
  t.forEach(f => {
    if (f.toLowerCase().includes('file')) isFile = true
  })
  if (isFile) {
    e.preventDefault()
  }
}

ReactDOM.render(
  <React.StrictMode>
    <div onDrop={(e)=>{e.preventDefault();dropped(e)}} onDragOver={dragOver} >
      <TestFormat />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
