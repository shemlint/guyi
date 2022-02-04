import React, { useState, useEffect } from 'react'
import * as THREE from 'three'
import LocalForage from 'localforage'
import Comp from './Comp'
import { css, keyframes, injectGlobal, cx } from '@emotion/css'
import htm from 'htm'
global.React = React
global.THREE = THREE
global.html = htm.bind(React.createElement)
global.css = css
global.keyframes = keyframes
global.cx = cx
global.injectGlobal = injectGlobal


const Reload = ({ setReload }) => {
  React.useEffect(() => {
    setTimeout(() => setReload(false), 200)

  })
  return (
    <div style={{
      width: '100vw', height: '100vh', backgroundColor: 'black', color: 'blue',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }} >
      <h1 style={{ fontWeight: 'bolder' }}>Reloading ...</h1>
    </div>
  )

}
let lastOpened = ''
const AppSelect = ({ setShowApp, startApp, openLoad, setShowChange }) => {
  const [loaded, setLoaded] = useState(false)
  const [apps, setApps] = useState([])

  const getApps = () => {
    (async () => {
      setLoaded(false)
      setApps([])
      let appNames = (await LocalForage.keys()) || []
      lastOpened = await LocalForage.getItem('guyilastapp')
      let loadedApps = []
      let got = []
      for (let i = 0; i < appNames.length; i++) {
        let an = appNames[i]
        let app = await LocalForage.getItem(an)
        if (typeof app === "object" && Array.isArray(app.modules)) {
          loadedApps.push(app)
          got.push(an)
        }
      }
      setLoaded(true)
      setApps([...loadedApps])
      setLoaded(true)
    })()
  }

  useEffect(getApps, [])

  const deleteApp = async (name) => {
    try {
      let res = window.confirm('Delete ' + name + " ?")
      if (!res) return
      await LocalForage.removeItem(name)
      getApps()
    } catch (e) {
      console.log('delete app error', e.message)
    }
  }
  const saveApp = (app) => {
    try {
      let name = app.modules[0][0].name
      const a = window.document.createElement('a')
      a.href = URL.createObjectURL(new Blob([JSON.stringify(app)], { type: 'text/plain' }))
      a.download = `Guyi-app,${name}`
      a.click()
      if (global.process.platform === 'phone') {
        const res = window.navigator.clipboard.writeText(JSON.stringify(app))
        if (res) {
          alert('Guyi app saved to clipboard')
        } else {
          alert('could not copy app to clipboard')
        }
      }
    } catch (e) {
      console.log('save app error', e.message)
    }
  }
  const App = ({ app, index }) => {
    try {
      let pics = app.files.filter(n => n.name === 'splash')
      const pinApp = (name) => {
        let icon = pics[0] ? pics[0].url : ""
        let id = Math.random().toString()
        switch (global.process.platform) {
          case 'phone':
            window.Phone.pinShortcut(id, name, icon)
            break
          case 'desk':
            window.Desk.pinShortcut(id, name, icon)
            break
          case 'neu':
            window.guyi.dispatch('pinshortcut',id,name,icon)
            break
          default:
            console.info('Target does not support shortcuts')
            break
        }
      }

      let name = app.modules[0][0].displayName || app.modules[0][0].name || "UnNamed"
      const color = () => `rgb(${Math.floor(Math.random() * 125)},${Math.floor(Math.random() * 125)}` +
        `,${Math.floor(Math.random() * 125)})`
      const randColor = () => `radial-gradient(${color() + ',' + color()})`
      return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <div onClick={() => {
            setShowApp(false)
            startApp(app)
          }}
            style={{
              width: 100, height: 100, borderRadius: 10, boxShadow: (lastOpened === name) ? '0px 0px 8px 4px blue' : '0px 0px 3px 3px grey',
              margin: 5,
              backgroundImage: pics[0] ? `url(${pics[0].url})` : randColor(), backgroundSize: 'cover', overflow: 'auto',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}  >
            <div style={{ fontSize: 20, color: 'red', fontWeight: 'bolder', textShadow: '0 0 3px #ffff', textAlign: 'center' }} >{name}</div>
          </div>
          <div>
            <button onClick={() => deleteApp(app.modules[0][0].name)} >Del</button>
            <button onClick={() => saveApp(app)} >Save</button>
            <button onClick={() => pinApp(app.modules[0][0].name)} >Pin</button>
          </div>
        </div>
      )
    } catch (e) {
      return <div>App Error</div>
    }
  }

  const loading = (
    <div style={{ color: 'blue', textShadow: '0 0 5px green', fontSize: 30, fontWeight: "bold" }}>
      Loading Apps Please Wait
    </div>)
  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexWrap: 'wrap',
      justifyContent: 'space-evenly', alignItems: 'center', position: 'relative'
    }} >
      <div style={{ fontSize: 24, color: 'purple', fontWeight: 'bold', position: 'absolute', top: 0, width: '100%', textAlign: 'center' }} >
        Saved Guyi Apps
      </div>
      <div style={{ position: 'absolute', top: 5, right: 5 }}>
        <button onClick={() => store.set('showapp', false, openLoad)} >Dev.</button>
        <button onClick={() => { setShowApp(false); setShowChange(false) }} >Close</button>
      </div>
      {!loaded && loading}
      {loaded && apps.length === 0 && <h1 style={{ color: 'blue' }} >NO APPS YET</h1>}
      {apps.map((app, i) => <App app={app} index={i} />)}
    </div>
  )

}

global.loadedScripts = []
const runScripts = (files = global.files) => {
  files.forEach(f => {
    if (global.loadedScripts.includes('js-' + f.name) || global.loadedScripts.includes('css-' + f.name)) {
      console.log('skipped Script/Css ' + f.name + ' already loaded')
      return
    }
    if (f.type.startsWith('text/javascript') && f.url.length && f.run) {
      try {
        //eslint-disable-next-line
        let func = Function(f.url)
        func()
        global.loadedScripts.push('js-' + f.name)
        console.log(`JS ${f.name} Loaded`)
      } catch (e) {
        console.log(`scritp ${f.name} run error ${e.message}`, e)
      }
    }
    if (f.type.startsWith('text/css') && f.url.length && f.run) {
      try {
        let css = f.url, head = document.head, style = document.createElement('style')
        head.appendChild(style)
        style.type = 'text/css'
        style.id = 'css-' + f.name
        if (style.styleSheet) {//IE 8&<
          style.stylesheet.cssText = css
        } else {
          style.appendChild(document.createTextNode(css))
        }
        global.loadedScripts.push('css-' + f.name)
        console.log(`CSS ${f.name} Loaded`)
      } catch (e) {
        console.log(`Css ${f.name} inject error ${e.message}`, e)
      }
    }
  })
}

const updateAppStore = async (app) => {
  try {
    let name = app.modules[0][0].name
    let splash = app.files.filter(f => f.name === 'splash')
    await LocalForage.setItem(name, JSON.parse(JSON.stringify(app)))
    await LocalForage.setItem('guyilastapp', name)
    try {
      if (splash[0]) {
        let icon = splash[0].url
        let id = Math.random().toString()
        let pinnedCuts = []
        try {
          pinnedCuts = JSON.parse(await LocalForage.getItem('shortcutspinned'))
          if (!Array.isArray(pinnedCuts)) pinnedCuts = []
        } catch (e) {
          console.info('No shortcut data')
        }
        let cutExists = pinnedCuts.includes(name)
        if (!cutExists) {
          LocalForage.setItem('shortcutspinned', JSON.stringify([...pinnedCuts, name]))
        }
        switch (global.process.platform) {
          case 'phone':
            if (!cutExists) window.Phone.pinShortcut(id, name, icon)
            break
          case 'desk':
            if (!cutExists) window.Desk.pinShortcut(id, name, icon)
            break
          case 'neu':
            if(!cutExists)window.guyi.dispatch('pinshortcut',id,name,icon)
            break
          case 'web':
            let link = window.document.querySelector("link[rel~='icon']")
            if (!link) {
              link = window.document.createElement('link')
              link.rel = 'icon'
              window.document.getElementsByTagName('head')[0].appendChild(link)
            }
            link.href = icon
            break
          default:
            break
        }
        localStorage.setItem('guyisplashscreen', icon)
      }
    } catch (e) {
      console.info('Pinnind shortcut fail,or storage full for splash screen')
    }
  } catch (e) {
    console.info('updateAppStore error', e.message)
  }
}

let wsRef = null
let loadedShortcut = false
const store = {
  set(key, val, cb) {
    try {
      localStorage.setItem(key, val)
    } catch {
      console.warn('store set error ' + key)
    }
    if (cb) {
      cb(val)
    }
  },
  get(key) {
    let res = localStorage.getItem(key)
    if (key === 'showapp') {
      try {
        res = JSON.parse(res)
      } catch { }
      if (typeof res !== 'boolean') {
        return false
      } else {
        return res
      }

    }
    return res
  }

}
const App = () => {
  const [loaded, setLoaded] = useState(false)
  const [app, setApp] = useState([])
  const [minimal, setMinimal] = useState(false)
  const [reload, setReload] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [buttonPosition, setButtonPosition] = useState('right')
  const [showChange, setShowChange] = useState(false)
  const [showApp, setShowApp] = useState(false)

  let mutApp = [...app]

  React.useEffect(() => {
    window.__GUYI__ = '1.0.0'
    const sendDone = () => {
      try {
        switch (global.process.platform) {
          case 'phone':
            window.Phone.appLoadDone()
            break
          case 'desk':
            window.Desk.appLoadDone()
            break
          case 'neu':
            window.guyi.dispatch('apploaddone')
            break
          case 'web':
            console.info('web does not support load done')
            break
          default:
            console.info('platform not supported')
            break
        }
      } catch (e) {
        console.info(e.message)
      }
    }
    window.addEventListener('message', (e) => {
      let data = e.data
      if (typeof data === 'string') {
        if (data.startsWith('minimal=')) {
          let val = data.split('minimal=')[1]
          setMinimal(val === 'true')
          console.log('minimal status changed', val === 'true')
          return
        }
        if (data.startsWith('reload=')) {
          let val = data.split('reload=')[1]
          setReload(val === 'true')
          console.log('reload status changed', val === 'true')
          return
        }
        if (data.startsWith('buttonposition=')) {
          let val = data.split('buttonposition=')[1]
          setButtonPosition(val === 'left' ? 'left' : 'right')
          console.log('Button position changed', val === 'left' ? 'left' : 'right')
          return
        }
        if (data.startsWith('startapp,')) {
          const start = async () => {
            let val = data.split('startapp,')[1]
            let got = await restoreApp(val)
            if (got) {
              setMinimal(true)
              store.set('showapp', false, setShowApp)
              loadedShortcut = true
            }
          }
          start()
        }
        try {
          data = JSON.parse(data)
          if (Array.isArray(data.modules)) {
            console.log('Got app loading it ...')
            startApp(data)
          }
        } catch (e) {
          console.log('Message not json')
        }
      }
    })
    loadApp()
    sendDone()
    let splashImg = document.getElementById('--guyisplashscreen--')
    if (splashImg) {
      splashImg.parentElement.removeChild(splashImg)
    }
    //eslint-disable-next-line
  }, [])

  const open = async (e) => {
    try {
      let f = e.target.files
      f = f[0]
      let data = await f.text()
      data = JSON.parse(data)
      startApp(data)
    } catch (e) {
      console.log(e.message)
    }

  }
  const loadApp = async () => {
    try {
      let res = await fetch('app.guyi')
      let body = await res.json()
      if (!Array.isArray(body.modules)) {
        throw new Error('App corrupted')
      }
      startApp(body)
      setReload(true)
    } catch (e) {
      console.log('Network error', e.message)
      setLoadFailed(true)
    }
  }
  const startApp = (data) => {
    updateAppStore(data)
    global.appData = {}
    global.modules = data.modules
    global.remodules = data.remodules || []
    global.files = data.files || []
    runScripts(global.files)
    setApp(global.modules[0])
    setLoaded(true)
  }
  const restoreApp = async (appName = null) => {
    let data = ''
    let success = false
    if (loadedShortcut && !appName) return false
    try {
      let name = appName ? appName : await LocalForage.getItem('guyilastapp')
      data = await LocalForage.getItem(name)
    } catch (e) {
      console.log('Load error', e.message)
      data = null
    }
    if (loadedShortcut) return false
    if (data && Array.isArray(data.modules)) {
      startApp(data)
      success = true
    }
    setLoadFailed(false)
    return success
  }
  if (loadFailed) {
    restoreApp()
  }
  global.process = {}
  global.process.os = global.guyi_os
  if (global.Phone) {
    global.process.platform = "phone"
  } else if (global.Desk) {
    global.process.platform = "desk"
  } else if(global.Neutralino){
    global.process.platform='neu'
  }else {
    global.process.platform = "web"
    global.process.os = "web"
  }

  let appComp = <div>Load Error</div>
  try {
    appComp = <Comp key={app[0].name} tree={mutApp} id={app[1].id} />
  } catch (e) { console.log('App eror', e.message) }
  const LoadArea = () => {
    const [url, _setUrl] = useState(localStorage.getItem('lastsaveaddr') || 'ws://localhost:8080')
    const [info, setInfo] = useState('')
    const setUrl = (url) => {
      try {
        _setUrl(url)
        localStorage.setItem('lastsaveaddr', url)
      } catch (e) {

      }
    }
    const disMes = (mes) => {
      setInfo(mes)
      setTimeout(() => setInfo(''), 2000)
    }
    const connect = () => {
      try {
        if (wsRef) {
          wsRef.close()
          disMes('Disconnected')
          return
        }
        let ws = new WebSocket(url)
        ws.onopen = (e) => {
          wsRef = ws
          disMes('Connected')
        }
        ws.onerror = (e) => {
          console.log('error', e)
          disMes('Error ' + e)
        }
        ws.onclose = (e) => {
          try {
            wsRef.close()
            wsRef = null
            disMes('Connection Lost')
          } catch (e) {
            console.log('close error', e.message)
          }
        }
        ws.onmessage = (e) => {
          try {
            let data = JSON.parse(e.data)
            if (data.type === 'getresult') {
              startApp(data.app)
            }
            if (data.type === 'reload') {
              startApp(data.app)
            }
          } catch (e) {
            console.log('message error', e)
          }
        }
      } catch (e) {
        console.log(e.message)
      }
    }
    const fetchApp = () => {
      try {
        if (wsRef) {
          wsRef.send(JSON.stringify({
            type: 'get',
          }))

        } else {
          throw new Error('No ws')
        }
      } catch (e) {
        console.log(e.message)
        disMes('No connection')
      }
    }
    if (!showChange) {
      let pos = {}; pos[buttonPosition] = 0;
      return (
        <div style={{
          display: 'flex', justifyContent: 'flex-end', position: 'absolute', bottom: 5,
          right: 5, zIndex: '1000000000', ...pos
        }} >
          <button onClick={() => setReload(true)}
            style={{ fontSize: 16, opacity: 0.4, fontWeight: 'bolder', border: '2px solid red' }} >Reload</button>
          <button onClick={() => {
            if (store.get('showapp')) {
              setShowApp(true)
            } else {
              setShowChange(!showChange)
            }
          }}
            style={{ fontSize: 16, opacity: 0.4, fontWeight: 'bolder', border: '2px solid red' }} >Open</button>
        </div>
      )
    }

    return (
      <div style={{
        display: 'flex', borderTop: '1px solid grey', justifyContent: 'center', transition: 'height 2s',
        position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,250,0.4)', zIndex: '1000000000'
      }} >
        <div style={{ padding: 4 }} >
          <div >New App: <input type='file' onChange={open} /></div>
          <div>Server: <input value={url} onChange={e => setUrl(e.target.value)} /></div>
          <button onClick={connect} style={{ backgroundColor: wsRef ? 'green' : 'aqua', color: 'white' }} >
            {wsRef ? 'Disconnect' : 'Connect'}
          </button>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'space-around' }}>
            <button onClick={() => { store.set('showapp', true, setShowApp) }} >Apps</button>
            <button onClick={fetchApp}>Fetch app</button>
            <button onClick={() => setReload(true)}>Reload</button>
            <button onClick={() => setShowChange(false)}>Close</button>
          </div>
          <div>{info}</div>
        </div>
      </div>
    )
  }
  if (reload) {
    return <Reload setReload={setReload} />
  }
  if (showApp) {
    return <AppSelect startApp={startApp} setShowApp={setShowApp} setShowChange={setShowChange} openLoad={() => {
      setShowApp(false)
      setShowChange(true)
      setMinimal(false)
    }} />
  }
  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {loaded && appComp}
      </div>
      <div style={{ height: 0, position: 'relative' }} >
        {!minimal && <LoadArea />}
      </div>
    </div>
  )

}

export default App;

