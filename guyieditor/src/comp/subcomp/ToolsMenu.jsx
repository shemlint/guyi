import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'


const TabPanel = ({ children, open }) => open && (children || <div></div>)

const set = global.store.set
const get = global.store.get


const ToolsMenu = ({ toolsProps }) => {
    const { fetch, connect, changeSync, isConnected } = toolsProps
    const [open, setOpen] = useState(false)
    const [adr, setAdr] = useState(get('adress'))
    const [no, setNo] = useState(get('reloadno'))
    const [index, setIndex] = useState(get('toolsindex'))
    const [sync, setSync] = useState(get('toolssync'))
    const wsinfo = isConnected ? 'Connected' : 'Not Connected'

    return (
        <div>
            <button onClick={(e) => setOpen(!open)} className='button button3' >TOOLS</button>
            <Menu open={open} onClose={() => setOpen(false)} >
                <div>
                    <Tabs size='small' value={index} onChange={(e, i) => set('toolsindex', i, setIndex)}  >
                        <Tab label='Reload' index={0} />
                        <Tab label='Shortcuts' index={1} />
                    </Tabs>
                    <TabPanel open={index === 0} >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                            <div>{wsinfo}</div>
                            <div> Server : <input  type='text' value={adr} onChange={(e) => set('adress', e.target.value, setAdr)} /></div>
                            <div onClick={(e) => set('toolssync', !sync, setSync, changeSync)} >
                                Sync with server ? <input readOnly type='checkbox' checked={sync} />
                            </div>
                            <div onClick={() => set('reloadno', 0, setNo)} >on save(Ctrl+s)<input readOnly type='checkbox' checked={no === 0} /></div>
                            <div onClick={() => set('reloadno', 1, setNo)} >on reload(Ctrl+f)<input readOnly type='checkbox' checked={no === 1} /></div>
                            <div>
                                <button onClick={fetch} >Fetch Latest</button>
                                <button onClick={() => connect(adr)}>Connect  </button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel open={index === 1} >
                        <div>
                            <div>Ctrl +s save(project or function)</div>
                            <div>Ctrl +o open(project )</div>
                            <div>Ctrl +r run function</div>
                            <div>Ctrl +f forward to server</div>
                            <div>F9 format function</div>
                            <div>F10 run function</div>
                        </div>
                    </TabPanel >
                </div>
            </Menu>
        </div>
    )
}
export default ToolsMenu
