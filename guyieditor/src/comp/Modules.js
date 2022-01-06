import React, { useState, useRef } from 'react'
import { MdDelete, MdSave, MdMoreVert } from 'react-icons/md'
import { BiDuplicate } from 'react-icons/bi'
import Popover from '@material-ui/core/Popover'
import EnterInput from './util/EnterInput'
import { dataBasic, dataHtml } from './Widgets'
import { newApp } from './util/store'
import TreeView from './util/TreeView'

const dbasic = dataBasic.map(b => b.name)
const dhtml = dataHtml.map(b => b.name)
const Modules = ({ app = [], changeApp, setApp }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    let modules = global.modules
    const disMes = (mes, ms = 5000) => {
        setStatus(mes);
        setTimeout(() => setStatus(''), ms)
    }
    const add = () => {
        let tname = name.trim();
        let nameOk = true
        tname.split('/').forEach(t => {
            if (t.length < 3) {
                disMes('Some parts of name short(<3)')
                nameOk = false
            }
        })
        if (!nameOk) return
        if (tname.length < 3) {
            disMes('Name too short');
            return;
        }
        if (tname.includes(' ') || tname.includes(',')) {
            disMes('Spaces or commas not allowed');
            return
        }
        let basicMods = [...dbasic, ...dhtml]
        if (basicMods.includes(tname)) {
            disMes('Basic Comp name')
            return
        }
        let cnames = global.modules.map(m => m[0].name)
        if (cnames.includes(tname)) {
            disMes('Name in use by a Component')
            return
        }
        let mnames = global.remodules.filter(m => m[0].type === 'main').map(m => m[0].name)
        if (mnames.includes(tname)) {
            disMes('Name in use by a Module')
            return
        }
        let mdnames = global.remodules.filter(m => m[0].type !== 'main').map(m => m[0].name)
        if (mdnames.includes(tname)) {
            disMes('Name in use by a Dependency')
            return
        }

        let tmpNewApp = JSON.parse(JSON.stringify(newApp))
        tmpNewApp[0].name = name
        let module = tmpNewApp
        modules.push(module);
        setName('');

    }
    const deletem = (e, index) => {
        if (modules.length === 1) {
            disMes('Leave one component')
            return
        }
        e.stopPropagation();
        modules.splice(index, 1)
        let names = modules.map(m => m[0].name)
        let pos = names.indexOf(app[0].name)
        if (pos === -1) pos = 0
        setApp([...modules[pos]])

    }
    const Module = ({ mod, index, hanging }) => {
        const [open, setOpen] = useState(false)
        const [name, setName] = useState(mod[0].name)
        const anchor = useRef()

        return (
            <div draggable={true}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => rearange(e, index)}
                style={{
                    display: 'flex', justifyContent: 'space-between', borderTop: '2px solid grey', marginBottom: 2,
                    backgroundColor: mod[0].name === app[0].name ? 'khaki' : '', width: '100%'
                }}
                onClick={() => changeApp(index)}
                onDragStart={(e) => e.dataTransfer.setData('text', mod[0].name)}
            >
                <div style={{ position: 'relative' }}>
                    <div style={{ color: 'purple', fontSize: 18 }} >{hanging ? mod[0].name : mod[0].name.split('/').reverse()[0]}</div>
                </div>
                <div ref={anchor} >
                    <MdMoreVert size={16} color='purple'
                        onClick={(e) => { setOpen(true); e.stopPropagation() }}
                        style={{ padding: "0px 2px", border: '1px solid purple', margin: '0px 5px 0px 0px' }}
                    />
                    <Popover anchorEl={anchor.current} open={open}
                        onClose={() => setOpen(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <div style={{ display: 'flex' }} onClick={(e) => e.stopPropagation()} >
                            <EnterInput type='text' value={name} onChange={(e) => setName(e.target.value)}
                                onEnter={() => rename(name, index)} />
                            <MdSave size={20} color='blue' onClick={() => rename(name, index)} />
                            <BiDuplicate size={20} color='blue' onClick={() => duplicate(name, index)} />
                            <MdDelete size={20} color='blue' onClick={(e) => deletem(e, index)} />
                        </div>
                    </Popover>
                </div>
            </div>
        )
    }
    const rename = (name, index) => {
        let nameOk = true
        name.split('/').forEach(t => {
            if (t.length < 3) {
                disMes('Some parts of name short(<3)')
                console.log('here')
                nameOk = false
            }
        })
        if (!nameOk) return
        let basicMods = [...dbasic, ...dhtml]
        if (basicMods.includes(name)) {
            disMes('Name taken by basic Comp')
            return;
        }
        let mnames = global.modules.map(m => m[0].name)
        if (mnames.includes(name)) {
            disMes('Name Taken by component')
            return
        }
        let rmnames = global.remodules.map(m => m[0].name)
        if (rmnames.includes(name)) {
            disMes(`Name Taken by Module/Module Dependency`)
            return
        }
        let oldName = global.modules[index][0].name
        global.modules.forEach(m => {
            m.forEach(c => {
                if (c.name === oldName) {
                    c.name = name

                }
                if (c.props) {//rename renderred children
                    for (let p in c.props) {
                        if (Array.isArray(c.props[p])) {
                            c.props[p].forEach((d, i) => {
                                if (typeof d === 'string' && d.includes(',')) {
                                    let parts = d.split(',')
                                    if (parts[0] === oldName) {
                                        c.props[p][i] = `${name},${parts[1]}`
                                    }
                                }

                            })
                        }
                    }
                }
            })
        })
        global.modules[index][0].name = name
        disMes('Name Changed ')

    }
    const duplicate = (name, index) => {
        let tmpMod = JSON.parse(JSON.stringify(global.modules[index]))
        if (name === tmpMod[0].name) {
            name = name + '-copy'
        }
        let allNames = global.modules.map(m => m[0].name).concat(global.remodules.map(m => m[0].name))
        if (allNames.includes(name)) {
            disMes('Name taken')
            return
        }
        tmpMod[0].name = name
        global.modules.push(tmpMod)
        disMes('Created duplicate')

    }
    const rearange = (e, index) => {
        let data = e.dataTransfer.getData('text')
        e.preventDefault()
        let names = modules.map(m => m[0].name)
        if (data && names.includes(data)) {
            let pos = names.indexOf(data)
            if (pos !== index) {
                let start = pos
                let go = index
                if (start < go) {
                    modules.splice(go + 1, 0, modules[start])
                    modules.splice(start, 1)
                } else if (start > go) {
                    modules.splice(go, 0, modules[start])
                    modules.splice(start + 1, 1)
                }
                disMes(data + ' moved', 600)
            }
        }

    }
    const ex = global.modules.map((mod, index) => ({ path: mod[0].name, mod, index, comp: <Module key={mod[0].name} mod={mod} index={index} /> }))

    const getTree = (data, index) => {
        const added = { '': { label: 'root', nodes: [] } }
        ex.forEach(e => {
            const d = e.path
            const comp = e.comp
            let parts = d.split('/')
            parts.forEach((p, i, a) => {
                const path = parts.slice(0, i + 1).join('/')
                if (!added[path]) {
                    added[path] = { label: '*', nodes: [] }
                }
                if (i === a.length - 1) {
                    added[path].label = d
                    added[path].comp = comp
                }
            })
            const ppath = parts.slice(0, -1).join('/')
            let parent = added[ppath]
            parent.nodes.push(added[d])

        })
        return added['']
    }
    const getOrder = (node) => {
        const names = [node.label]
        if (node.nodes && node.nodes[0]) node.nodes.forEach(n => names.push(...getOrder(n, names)))
        return names

    }

    const data = getTree()
    const names = getOrder(data)
    const setModuleOrderGlobally = () => {
        let otherNames = global.modules.map(m => m[0].name).filter(m => !names.includes(m))
        let allNames = names.concat(otherNames).slice(1)
         global.modulesOrder = allNames
    }
    setModuleOrderGlobally()
    const pinHanging = () => {
        const mods = []
        ex.forEach(e => {
            if (!names.includes(e.path)) {
                mods.push({ label: e.path, nodes: [], comp: <Module key={e.mod[0].name} mod={e.mod} index={e.index} hanging /> })
            }
        })
        data.nodes.push(...mods)
    }
    pinHanging()

    return (
        <div>
            <TreeView data={data.nodes} />
            <div style={{ border: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <EnterInput type='text' value={name} placeholder='Name' style={{ width: '100%', borderWidth: 0, margin: 2 }}
                    onChange={(e) => { setName(e.target.value) }}
                    onEnter={add}
                />
                <button onClick={add} >ADD</button>
                <div>{status}</div>
            </div>
        </div>
    )
}

export default Modules
