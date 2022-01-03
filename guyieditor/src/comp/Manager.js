import React, { useState, useRef } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import Snackbar from '@material-ui/core/Snackbar'
import LocalForage from 'localforage'

import { BsInfoCircle } from 'react-icons/bs'
import ToolsMenu from './subcomp/ToolsMenu'
import { newApp } from './util/store'

const set = global.store.set
const get = global.store.get


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
const getKeys = async () => {
    for (const p of Object.keys(localStorage)) {//import old apps
        try {
            let pr = JSON.parse(localStorage[p])
            if (Array.isArray(pr.modules)) {
                let data = { ...pr, time: (new Date()).toDateString() }
                await LocalForage.setItem(p, JSON.stringify(data))
                localStorage.removeItem(p)
            }
        } catch (e) {
            //console.log('not project', p)
        }
    }
    let keys = await LocalForage.keys()
    keys = keys.filter(async (k) => {
        try {
            let data = await LocalForage.getItem(k)
            data = JSON.parse(data)
            return Array.isArray(data.modules)
        } catch (e) {
            return false
        }
    })
    try {
        localStorage.setItem('projectnames', JSON.stringify(keys))
    } catch (e) {
        console.log('Projectnames stored on cache error')
    }
    return keys
}

const Manager = ({ app, setApp, setFull, layout, setLayout, runScripts, info: mesInfo, connect, connected, onOpen, onSave, toolsProps }) => {
    const [name, setName] = useState(get('lastsave'))
    const [info, setInfo] = useState('')
    const [open, setOpen] = useState(get('lastopen'))
    const [delmod, setDelmod] = useState('')
    const [withRes, setWithRes] = useState(true)
    const [openLogs, setOpenLogs] = useState(false)
    const [wildCard,setWildCard]=useState('')

    const projoFile = useRef()

    const disMes = (mes) => {
        setInfo(mes)
        setTimeout(() => setInfo(''), 5000)
    }


    const onDelete = async () => {
        if (delmod.trim() === '') disMes('Specify a name')
        let options = getOptions()
        if (delmod.startsWith('*')) {
            const sufix = delmod.slice(1)
            options.forEach(p => {
                if (p.includes(sufix)) {
                    onDelete(p)
                }
            })
        }else if(delmod.endsWith('*')){
            const prefix=delmod.slice(0,delmod.length-1)
            options.forEach(p=>{
                if(p.includes(prefix)){
                    onDelete(prefix)
                }
            })
        }
        if (!options.includes(delmod)) {
            disMes('Project not found ')
            return
        }

        await LocalForage.removeItem(delmod)
        getKeys()//update project names in localstorage
        disMes('Delted : ' + delmod)
        setDelmod('')

    }
    const saveToDisk = (withRes = false) => {
        let data = JSON.stringify({
            modules: global.modules, comps: global.comps,
            remodules: global.remodules, files: withRes ? global.files : [],
        })
        let blob = new Blob([data], { type: 'text/plain' })
        let file = new File([blob], 'project.guyi', { type: 'text/plain' })
        let a = document.createElement('a')
        let d = new Date()
        a.download = `${name || 'guyi'} ${d.getHours()}-${d.getMinutes()}.guyi`
        a.href = URL.createObjectURL(file)
        a.click()

    }

    const loadFromDisk = async () => {
        try {
            let file = projoFile.current.files[0]
            if (!file) {
                disMes('Choose file first')
                return
            }
            let data = await file.text()
            if (!data) {
                disMes('Could not open project')
                return
            }
            try {
                data = JSON.parse(data)
            } catch (e) {
                disMes('Data corrupted ')
                return
            }
            let test = true
            if (data.modules.length === 0) test = false
            if (Array.isArray(data.modules)) {
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
            if (!Array.isArray(data.remodules)) data.remodules = []
            global.remodules = data.remodules
            if (!Array.isArray(data.files)) data.files = []
            global.files = data.files
            disMes('opened')
            global.appData = {}
            runScripts()
            setApp(global.modules[0])
            setStartId()

        } catch (e) {
            disMes('Loading projo failed ' + e.message)
        }

    }

    const startNewProjo = () => {
        let modules = [
            JSON.parse(JSON.stringify(newApp))
        ]
        global.modules = modules
        global.remodules = []
        global.comps = []
        global.files = []
        global.created = 0
        global.appData = {}

        setApp(global.modules[0])

    }
    const getOptions = () => {
        let keys = localStorage.getItem('projectnames')
        try {
            keys = JSON.parse(keys)
            if (!keys) {
                throw new Error('must be array')
            } else {
                return keys
            }
        } catch (e) {
            getKeys()
            return []
        }
    }

    const options = getOptions()

    // const FileMenu = () => {
    //     return (
    const getSize = () => {
        let data = JSON.stringify({
            modules: global.modules, comps: global.comps,
            remodules: global.remodules, files: withRes ? global.files : []
        })
        let size = data.length
        size = size / 1024
        if (size >= 1000) {
            size = size / 1024
            size = `${Math.floor(size)} Mbs `
        } else {
            size = `${Math.floor(size)} Kbs `
        }
        return size

    }
    let size = getSize()


    const [openFile, setOpenFile] = useState(false)
    const closeFile = () => {
        setOpenFile(false)
    }
    const saveLayout = (e) => {
        let newLay = e.target.value
        set('layoutstate', { new: newLay, old: layout })
        setLayout(newLay)

    }
    const changeWildCard=(e)=>{
        setWildCard(e.target.value)
        e.stopPropagation()
    }

    const FileMenu = (
        <Menu open={openFile} onClose={closeFile}  >
            <div style={{ maxWidth: 350 }} >
                <div style={{ color: 'blue', fontSize: 20, textAlign: 'center' }} >Guyi 0.9.1(23/10/2021)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }} >
                    <button onClick={startNewProjo} >NEW APP</button>
                    <button onClick={() => saveToDisk(withRes)} >DOWNLOAD APP</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }} >
                    <div>Save With resources ?</div>
                    <div>{size}</div>
                    <input type='checkbox' checked={withRes} onChange={(e) => setWithRes(e.target.checked)} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <button onClick={() => onSave(name, withRes)} >SAVE(browser)</button>
                    <TextField
                        value={name} variant='outlined'
                        size='small'
                        margin='none'
                        onChange={(e) => setName(e.target.value)} label='Name'
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                onSave(name, withRes)
                            }
                        }}
                    />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <button onClick={() => onOpen(open)} >OPEN(browser) </button>
                    <Select
                        size='small'
                        value={open}
                        onChange={v => setOpen(v.target.value)}
                    >
                        {options.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </Select>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <button onClick={onDelete} >Delete(browser)</button>
                    <Select
                        size='small'
                        value={delmod}
                        onChange={v => setDelmod(v.target.value)}
                    >
                        <input value={wildCard} onChange={changeWildCard} onClick={e=>e.stopPropagation()} />
                        {options.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </Select>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    <button onClick={loadFromDisk} >Open File</button>
                    <input type='file' id='projofile' ref={projoFile} accept='text/*,.guyi' />
                </div>
                <div>{info}</div>
                <Credits />
            </div>
        </Menu>
    )
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} className='guyi manager' >
            <button onClick={() => setOpenFile(true)} className='button button1'  >FILE</button>
            <button onClick={() => setFull(true)} className='button button2'  >FULL</button>
            <Select component="button" value={layout} onChange={saveLayout} >
                {['Desk', 'Phone', 'Code'].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
            {FileMenu}
            <ToolsMenu connect={connect} connected={connected} toolsProps={toolsProps} />
            <button onClick={() => setOpenLogs(true)} className='button button4' >LOGS</button>
            <Menu open={openLogs} onClose={() => setOpenLogs(false)} >
                <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', justifyContent: 'space-evenly' }} >
                    <div onClick={() => console.log(app[0].state)}
                        style={{ backgroundColor: 'khaki', borderRadius: 3, margin: 2, paddingLeft: 2, paddingRight: 2 }} >LOG STATE</div>
                    <div onClick={() => console.log(app[0].locals)}
                        style={{ backgroundColor: 'khaki', borderRadius: 3, margin: 2, paddingLeft: 2, paddingRight: 2 }} >LOG LOCALS</div>
                    <div onClick={() => console.log(app[0].funcs[0])}
                        style={{ backgroundColor: 'khaki', borderRadius: 3, margin: 2, paddingLeft: 2, paddingRight: 2 }} >LOG GLOB</div>

                </div>
            </Menu>
            <Snackbar
                open={!!mesInfo}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert info={mesInfo} />
            </Snackbar>
        </div>
    )
}


export default Manager

const Alert = ({ info }) => {

    return (
        <div style={{
            backgroundColor: 'lightgreen', display: 'flex', alignItems: 'center',
            borderRadius: 5, padding: 5, border: '2px solid green'
        }}>
            <BsInfoCircle color='white' size={24} />
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>{info}</div>
        </div>
    )
}

const Credits = () => {
    const [open, rawsetOpen] = useState(global.showCred)
    const setOpen = (open) => {
        rawsetOpen(open)
        global.showCred = open
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 30 }}>
            <div style={{ position: 'absolute', top: 3, right: 5, display: 'flex' }} >
                <div>{open ? 'Hide Credits' : 'Show Credits'}</div>
                <input type='checkbox' checked={open} onChange={(e) => setOpen(e.target.checked)} />
            </div>
            {open && <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', marginTop: 20 }}>
                <div>Runners : </div>
                <a href="https://github.com/lintshem/my-files/raw/main/guyi.html" target="_blank" download rel="noreferrer" >Web</a>
                <a href="https://github.com/lintshem/my-files/raw/main/guyi.apk" target="_blank" download rel="noreferrer" >Android </a>
                <a href="https://github.com/lintshem/my-files/raw/main/guyinstaller.exe" target="_blank" download rel="noreferrer" >Windows</a>
                <a href="https://github.com/lintshem/my-files/raw/main/guyidocs.pdf" target="_blank" download rel="noreferrer" >Docs</a>
                <a href="https://github.com/lintshem/my-files/raw/main/guyiserver.exe" target="_blank" download rel="noreferrer" >DevServer</a>
            </div>}
            {open && <div dangerouslySetInnerHTML={{ __html: htmlCred }} />}
            {open && <div style={{ display: 'flex', justifyContent: 'space-evenly' }} >
                <img src={'guyi/assets/tso1.jpg'} alt={'Teddy shem Okoth '} style={{ width: 100, height: 100 }} />
                <img src={'guyi/assets/tso2.jpg'} alt={'Teddy shem Okoth '} style={{ width: 100, height: 100 }} />
            </div>}

            {open && <div>use Local server <input type='checkbox' value={global.rootUrl.endsWith('mods/')} onChange={(e) => {
                if (e.target.checked) {
                    global.rootUrl = 'http://localhost:80/sites/mods/'
                } else {
                    global.rootUrl = 'http://shemlint.orgfree.com/'
                }
            }} />
            </div>}
        </div>
    )
}
let htmlCred = `<h2 style="text-align: center;"><span style="color: rgb(255, 0, 0);"><em>By</em></span><em>:</em><span style="color: rgb(102, 0, 255);">Teddy Shem Okoth Geda</span><br>
                </h2>

                <p><span style="color: rgb(255, 94, 0);">Available at :<br>
                </span></p>

                <ul>
                    <li style="margin-left: 25px;"><span style="color: rgb(102, 0, 255);"><a target="_blank" href="http://guyi.epizy.com" alt="guyi.epizy.com">guyi.epizy.com</a></span></li>
                    <li style="margin-left: 25px;"><span style="color: rgb(102, 0, 255);"><a target="_blank" href="http://guyi.orgfree.com" alt="guyi.orgfree.com">guyi.orgfree.com</a></span></li>
                    <li style="margin-left: 25px;"><span style="color: rgb(102, 0, 255);"><a target="_blank" href="https://guyieditor.herokuapp.com" alt="guyi.orgfree.com">guyi.herokuapp.com(secure)</a></span></li>
                </ul>

                <p><span style="font-size: 18px;"><span style="color: rgb(255, 94, 0);">Guyi</span> is a project by Teddy Shem, started in the year <span style="color: rgb(255, 94, 0);">2021</span>.</span></p>

                <p><span style="font-size: 18px;">Goals :</span></p>

                <ol>
                    <li style="font-size: 18px;"><span style="font-size: 18px;">&nbsp; &nbsp; Both <span style="color: rgb(255, 94, 0);">online</span> and <span style="color: rgb(255, 94, 0);">offline</span> full Featured <span style="color: rgb(255, 94, 0);">IDE</span> for Graphical user Interface.</span><br>
                    </li>
                    <li style="font-size: 18px;"><span style="font-size: 18px;">&nbsp; &nbsp; To support all three major platforms ie <span style="color: rgb(255, 94, 0);">Web</span> Apps/Sites, <span style="color: rgb(255, 94, 0);">Windows</span> Apps and <span style="color: rgb(255, 94, 0);">Android</span> Apps</span></li>
                    <li style="font-size: 18px;"><span style="font-size: 18px;">&nbsp; &nbsp; To be <span style="color: rgb(255, 94, 0);">easy </span>for Both beginners and advance users&nbsp;</span><br>
                    </li>
                </ol>
                `