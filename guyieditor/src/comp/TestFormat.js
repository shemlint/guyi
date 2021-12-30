import React, { useState, useEffect } from 'react'
import RSL from 'react-splitter-layout'
import 'react-splitter-layout/lib/index.css'
import { Scrollbars } from 'react-custom-scrollbars'
import { Console, Hook, Unhook } from 'console-feed'
import LocalForage from 'localforage'

import * as THREE from 'three/build/three.module'
import htm from 'htm'

import { propT, eventT } from './util/data'
import { fetchApp, initApp, shortCuts, changeSync,newApp } from './util/store'

import Tab from './util/Tab'
import Comp from './Comp'
import Properties from './Properties'
import Outline from './Outline'
import Functions from './Functions'
import Events from './Events'
import Screen from './Screen'
import Modules from './Modules'
import Exports from './Exports'
import Libraries from './Libraries'
import Manager from './Manager'
import Resources from './Resources'
import Preview from './Preview'
import ExModules from './ExModules'
import ReModules from './ReModules'

import { css, keyframes,injectGlobal,cx } from '@emotion/css'

global.React = React
global.THREE = THREE
global.html = htm.bind(React.createElement)
global.css = css
global.keyframes = keyframes
global.cx=cx
global.injectGlobal=injectGlobal

global.created = 0
global.modules = []
global.files = []
global.treeData = {}//treeview
global.appData = {}//glob.data
global.resTab = 'view'
global.colFuncs = {}
global.prevSize = { width: 300, height: 400 }
global.screenSize = { width: 300, height: 400 }
global.modules = [JSON.parse(JSON.stringify(newApp))]
global.remodules = []
global.searchResult = []
global.fresult = { meta: {}, data: [] }
global.comps = []
global.compsView = {};
global.rootUrl = 'http://shemlint.orgfree.com/'
global.x = {}
global.process = { platform: 'web' }
global.user = {}

const set = global.store.set
const get = global.store.get

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
global.runScripts = runScripts

const setStartId = () => {
    let start = 0
    global.modules.forEach(m => {
        m.forEach(c => {
            if (c.id && c.id.startsWith('comp')) {
                let id = c.id.split('comp')[1]
                id = parseInt(id)
                if (!isNaN(id)) {
                    if (id > start) {
                        start = id + 1
                    }
                }
            }
        })
    })

    global.created = start
}
let propTypes = [...propT]
let eventTypes = [...eventT]

const CompSmall = (props) => {
    const [off, setOff] = useState(false)
    const reload = () => {
        setOff(true)
        setTimeout(() => setOff(false), 20)
    }
    useEffect(() => {
        window.addEventListener('codechange', reload)
        return ()=>window.removeEventListener('codechange',reload)
    })
    //return(<div>hiden</div>)
    if (off) {
        return <div></div>
    }
    return (
       <Comp {...props} />
    )
}

const TestFormat = () => {
    const [app, _setApp] = useState(global.modules[0])
    const [view, setView] = useState(app[1]);
    const [appState, setAppState] = useState(app[0].state);
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [info, setInfo] = useState('')
    const [tabPos, setTabPos] = useState(0)
    const [connected, setConnected] = useState(false)
    let savedLayout = get('layoutstate')
    const [layout, setLayout] = useState(savedLayout.new) //savedLayout.new)
    let mutApp = [...app];
    const onSave = async (name, withRes = true) => {
        console.time('save')
        if (name.trim() === '') {
            disMes('No name !')
            return
        }

        try {
            // let modNames = global.modules.map(m => m[0].name)
            // let pos = modNames.indexOf(app[0].name)
            // global.modules[pos] = JSON.parse(JSON.stringify(app))
            let data = JSON.stringify({
                modules: global.modules,
                remodules: global.remodules, files: withRes ? global.files : []
            })
            await LocalForage.setItem(name.trim(), data)
            let keys = await LocalForage.keys()
            localStorage.setItem('projectnames', JSON.stringify(keys))
            disMes('Save succesful')
            try {
                localStorage.setItem('lastsave', name.trim())
                //LocalForage.setItem()
            } catch (e) {
                console.log('could not save last save name')
            }
        } catch (e) {
            console.log(e.message)
            disMes('could not save,Local Storage may be full')
        }
        console.timeEnd('save')
    }
    const onOpen = async (open) => {
        console.time('open')
        let options = JSON.parse(localStorage.getItem('projectnames'))
        if (!options.includes(open.trim())) {
            disMes('Project not found')
            return
        }
        let data = await LocalForage.getItem(open)
        if (!data) {
            disMes('Could not open project')
            return
        }
        try {
            data = JSON.parse(data)
        } catch (e) {
            console.log(e, data)
            disMes('Data corrupted ')
            return
        }
        let test = true
        if (Array.isArray(data.modules)) {
            if (data.modules.length === 0) test = false
            data.modules.forEach(cd => {
                if (!Array.isArray(cd)) {
                    test = false
                }

            })
        } else {
            test = false
        }
        if (!test) {
            disMes('Wrong data format')
            return
        }
        global.modules = data.modules
        global.remodules = data.remodules || []
        global.files = data.files || []
        global.appData = {}
        disMes('opened')
        runScripts()

        setApp(global.modules[0])
        // setView(global.modules[0][1])
        setStartId()
        try {
            localStorage.setItem('lastopen', open.trim())
        } catch (e) {
            console.log('could not save openned project data', e.message)
        }
        console.timeEnd('open')

    }
    const setApp = (app) => {
        global.tmpApp = app[0].name
        _setApp(app)
    }
    const disMes = (mes = '', duration = 2000) => {
        setInfo(mes)
        setTimeout(() => setInfo(''), duration)
    }
    const saveLayout = (name) => {
        let newLay = name
        set('layout', { new: newLay, old: layout })
        setLayout(newLay)
    }
    const shortCutsWrap = (e) => shortCuts(
        e,
        setTabPos,
        () => onOpen(get('lastsave')),
        () => onSave(get('lastsave'), true),
        saveLayout,
        disMes,
    )
    useEffect(() => {
        console.log('Guyi editor started.\nThanks for using GUYI.\nShare with others about our platform.')

        window.addEventListener('keydown', shortCutsWrap)
        return () => {
            window.removeEventListener('keydown', shortCutsWrap)
        }
        //eslint-disable-next-line
    }, [])

    //compileFunctions(appState, setAppState, app[0].locals, app[0].funcs)
    const setPropsEvents = (mod) => {
        if (mod[0].localPT === undefined) {
            mod[0].localPT = []
        }
        if (mod[0].localET === undefined) {
            mod[0].localET = [];
        }
        let types = propTypes.map(pt => pt.type)
        if (types.includes(mod[0].name)) {
            propTypes[types.indexOf(mod[0].name)] = { type: mod[0].name, props: mod[0].localPT };
        } else {
            propTypes.push({ type: mod[0].name, props: mod[0].localPT });
        }
        let names = eventTypes.map(et => et.name);
        if (names.includes(mod[0].name)) {
            eventTypes[names.indexOf(mod[0].name)] = { name: mod[0].name, events: mod[0].localET };
        } else {
            eventTypes.push({ name: mod[0].name, events: mod[0].localET });
        }
    }
    global.modules.forEach(mod => setPropsEvents(mod))
    global.remodules.forEach(mod => setPropsEvents(mod))

    const setProp = (prop, value, add = false) => {
        let tmpView = { ...view };
        let tmpProps = { ...tmpView.props };
        tmpProps[prop] = value;
        tmpView.props = tmpProps;
        setView(tmpView)
        let ids = app.map(val => val.id);
        let tmpApp = JSON.parse(JSON.stringify(app))
        let pos = ids.indexOf(view.id)
        if (tmpApp[pos] !== undefined) {//error after changing id of comp
            tmpApp[pos].props = tmpProps;

            if (add) {
                tmpApp.push(add)
            }
            setApp(tmpApp);
        } else {
            console.log('No view selected')
        }
        //update global.modules
        let mnames = global.modules.map(m => m[0].name)
        let m_pos = mnames.indexOf(app[0].name)
        if (m_pos !== -1) global.modules[m_pos] = tmpApp

    }
    const changeApp = (index) => {
        let names = global.modules.map(val => val[0].name)
        let pos = names.indexOf(app[0].name)
        global.modules[pos] = [...app]
        let newApp = global.modules[index]
        setApp(newApp)
        setAppState(newApp[0].state)
        setView(newApp[1])
    }
    const setReloadApp = (mes) => {
        let data = mes.app
        global.modules = data.modules || app
        global.remodules = data.remodules || []
        global.files = data.files || []
        global.appData = {}
        disMes('Reloaded', 700)
        runScripts()
        setApp(global.modules[0])
        setStartId()
    }
    const toolsProps = {
        fetch: () => fetchApp(disMes),
        connect: (adress) => initApp(adress, disMes, setConnected, (mes) => setReloadApp(mes)),
        changeSync,
        isConnected: connected,

    }
    let editScreen = (
        <div  >
            <RSL vertical secondaryInitialSize={70} >
                <RSL primaryIndex={1} secondaryInitialSize={100} >
                    <RSL vertical secondaryInitialSize={90} primaryIndex={1} >
                        <Scrollbars>
                            <Manager layout={layout} setLayout={setLayout} setFull={setIsFullScreen} setApp={setApp}
                                app={app} runScripts={runScripts} info={info}
                                onOpen={onOpen} onSave={onSave} toolsProps={toolsProps}
                            />
                        </Scrollbars>
                        <RSL vertical secondaryInitialSize={150} >
                            <Scrollbars >
                                <Modules setApp={setApp} app={app} changeApp={changeApp} />
                            </Scrollbars>
                            <Scrollbars >
                                <ReModules />
                            </Scrollbars>
                        </RSL>
                    </RSL>
                    <RSL secondaryInitialSize={150} style={{ bakgroundcolor: 'green', padding: 12 }}>
                        <Tab pos={tabPos} id='workspace'
                            setPos={setTabPos}
                            data={[
                                {
                                    title: 'Design', comp: <Screen ><Comp tree={mutApp} id={app[1].id} state={appState} setState={setAppState} /></Screen>
                                },
                                {
                                    title: 'Code', comp: <Functions app={app} setApp={setApp} />
                                },
                                { title: 'Exports', comp: <Exports app={app} setApp={setApp} /> },
                                { title: 'Resources', comp: <Resources /> },
                                { title: 'Modules', comp: <ExModules app={app} setApp={setApp} /> },
                            ]}
                        />
                        <RSL vertical >
                            <Tab pos={0} id='propsevents'
                                data={[
                                    {
                                        title: 'Props',
                                        comp: <Properties localProps={view.props} setProp={setProp} type={view.name} localPropTypes={propTypes}
                                            id={view.id} app={app} setApp={setApp} view={view} setView={setView} />
                                    },
                                    {
                                        title: 'Events',
                                        comp: <Events view={view} funcs={app[0].funcs} eventTypes={eventTypes} setApp={setApp} app={app} />
                                    }
                                ]}
                            />
                            <Scrollbars style={{ position: 'relative' }} >
                                <Outline id={app[1].id} setApp={setApp} tree={app} onClick={(node) => { setView(node.item); }} selected={view.id} />
                            </Scrollbars>
                        </RSL>
                    </RSL>
                </RSL>
                <RSL secondaryInitialSize={200} style={{ padding: '10' }} >
                    <Scrollbars>
                        <Libraries />
                    </Scrollbars>
                    <Scrollbars style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CompSmall tree={JSON.parse(JSON.stringify(app))} id={view.id} events={false} />
                    </Scrollbars>
                </RSL>
            </RSL>

        </div>
    )
    let layout2 = (
        <div >
            <RSL vertical secondaryInitialSize={300} >
                <Tab pos={tabPos} id='workspace'
                    setPos={setTabPos}
                    data={[
                        {
                            title: 'Design', comp: <Screen ><Comp tree={mutApp} id={app[1].id} state={appState} setState={setAppState} view={view} /></Screen>
                        },
                        {
                            title: 'Code', comp: <Functions app={app} setApp={setApp} />
                        },
                        { title: 'Exports', comp: <Exports app={app} setApp={setApp} /> },
                        { title: 'Resources', comp: <Resources /> },
                        { title: 'Modules', comp: <ExModules app={app} setApp={setApp} /> },
                    ]}
                />
                <RSL secondaryInitialSize={220} style={{ bakgroundcolor: 'green', padding: 12 }}>
                    <RSL vertical secondaryInitialSize={100}  >
                        <Tab pos={0} id='propsevents'
                            data={[
                                {
                                    title: 'Props',
                                    comp: <Properties localProps={view.props} setProp={setProp} type={view.name} localPropTypes={propTypes}
                                        id={view.id} app={app} setApp={setApp} view={view} setView={setView} />
                                },
                                {
                                    title: 'Events',
                                    comp: <Events view={view} funcs={app[0].funcs} eventTypes={eventTypes} setApp={setApp} app={app} />
                                }
                            ]}
                        />
                        <Scrollbars style={{ position: 'relative' }} >
                            <Outline id={app[1].id} setApp={setApp} tree={app} onClick={(node) => { setView(node.item); }} selected={view.id} />
                        </Scrollbars>

                    </RSL>
                    <RSL secondaryInitialSize={150} style={{ padding: '10' }} >
                        <Scrollbars>
                            <Libraries />
                        </Scrollbars>
                        <RSL vertical primaryIndex={1} secondaryInitialSize={80} >
                            <Scrollbars>
                                <CompSmall tree={JSON.parse(JSON.stringify(app))} id={view.id} events={false} />
                            </Scrollbars>
                            <RSL secondaryInitialSize={100} >
                                <Scrollbars>
                                    <Manager layout={layout} setLayout={setLayout} setFull={setIsFullScreen} setApp={setApp}
                                        app={app} runScripts={runScripts} info={info}
                                        onOpen={onOpen} onSave={onSave} toolsProps={toolsProps}
                                    />
                                </Scrollbars>
                                <RSL secondaryInitialSize={50} >
                                    <Scrollbars >
                                        <Modules setApp={setApp} app={app} changeApp={changeApp} />
                                    </Scrollbars>
                                    <Scrollbars >
                                        <ReModules />
                                    </Scrollbars>
                                </RSL>
                            </RSL>
                        </RSL>
                    </RSL>
                </RSL>
            </RSL>

        </div>
    )
    const CodeLayout = () => {
        const [prev, setPrev] = useState(false)
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', heigth: '100%',
                marginTop: prev ? '' : 20, marginBottom: prev ? 20 : 0
            }}>
                {!prev && <div style={{ position: 'fixed', right: 10, top: 8, zIndex: 100 }} >
                    <button onClick={() => {
                        setLayout(savedLayout.old)
                        set('layoutstate', { new: savedLayout.old, old: 'code' })
                    }}
                    >  Close </button>
                    <button onClick={() => setPrev(!prev)}  > {prev ? 'Stop' : 'Prev'}</button>
                </div>}
                {prev && <Preview mutApp={mutApp} app={app} state={appState} setFull={setPrev}
                    setState={setAppState}
                />}
                {!prev && [<Functions app={app} setApp={setApp} />,
                <div style={{ marginBottom: '70vh' }} />]}
                <LogsContainer prev={prev} />
            </div>
        )
    }

    if (isFullScreen) {
        return <Preview mutApp={mutApp} app={app} state={appState} setFull={setIsFullScreen}
            setState={setAppState}
        />
    } else {
        if (layout === 'Desk') {
            return editScreen
        } else if (layout === 'Code') {
            return <CodeLayout />
        } else {
            return layout2
        }
    }
}

export default TestFormat
//#endregion


const LogsContainer = ({ prev }) => {
    const [logs, setLogs] = useState([])
    const [show, setShow] = useState(get('consoleopen'))
    const [h, setH] = useState(get('consoleheight'))
    // run once!
    useEffect(() => {
        Hook(
            window.console,
            (log) => setLogs((currLogs) => [...currLogs, log]),
            false
        )
        return () => Unhook(window.console)
    }, [])

    const clear = () => {
        setLogs([])
    }

    return (
        <div style={{
            position: 'fixed', bottom: 0, width: '100%', display: 'flex', flexDirection: 'column',
            backgroundColor: 'black', height: show ? `${h}vh` : 20, borderTop: '1px solid blue'
        }}>
            <div style={{ alignSelf: 'flex-end', display: 'flex', padding: 3 }}>
                <button onClick={() => set('consoleheight', h + 5, setH)}>+</button>
                <button onClick={() => set('consoleheight', h - 5, setH)}>-</button>
                <button onClick={() => set('consoleopen', !show, setShow)}  >{show ? 'Hide' : 'Show'}</button>
                <button onClick={clear}  >Clear</button>
            </div>
            <Scrollbars style={{ flex: 1, }} >
                <Console logs={logs} variant="dark" />
            </Scrollbars>
        </div>
    )
}


