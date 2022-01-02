import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import Switch from 'react-switch'
import { MdDelete, MdSave } from 'react-icons/md'
import Dialog from '@material-ui/core/Dialog'
import Tooltip from '@material-ui/core/Tooltip'
import Editor from 'react-simple-code-editor'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import './util/prism.css'
import JoditEditor from 'jodit-react'

import EnterInput from './util/EnterInput'
import { Preview } from './Resources'
const get = global.store.get
const set = global.store.set

const MSelectWrap = ({ options = [], value = '', onChange }) => {
    return (
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </Select>
    )
}

const Pm = ({ style, children, width = '50%', ...others }) => <p style={{ width, ...style, overflow: 'hidden', margin: 0 }} {...others} >{children}</p>

const Row = ({ style, children, onLeave, onClick }) => {

    return (
        <div onMouseLeave={onLeave} onClick={onClick} style={{ ...style, display: 'flex' }}>{children}
        </div>
    )
}
export const Color = ({ name = '', color = '', onChange = () => { } }) => {
    const [scolor, setColor] = useState(color)
    const [open, setOpen] = useState(false)
    const [istext, setIstext] = useState(false)
    const changeComplete = (col) => {
        onChange(col)
        let colors = get('lastcolors')
        if (col.hex !== colors[0]) {
            colors.unshift(col.hex)
            set('lastcolors', colors.slice(0, 6))
        }
    }
    return (
        <Row onLeave={() => setOpen(false)} onClick={() => setOpen(true)} style={{ position: 'relative' }}>
            <Pm>{name}</Pm>
            <div style={{ minHeight: 20, backgroundColor: scolor, minWidth: 40 }} >{scolor}</div>
            {open && !istext &&
                <div style={{ position: 'absolute', left: 0, top: 20, zIndex: 10 }}>
                    <SketchPicker color={scolor} width={180} presetColors={[...get('lastcolors'), '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']}
                        onChange={(col) => setColor(col.hex)} onChangeComplete={changeComplete}
                    />
                </div>
            }
            {open && istext &&
                <input type='text' value={scolor} onChange={(e) => { setColor(e.target.value); onChange({ hex: e.target.value }) }} />
            }
            <input type='checkbox' value={istext} onChange={(e) => setIstext(e.target.checked)} />

        </Row>
    )
}
export const SelectWrap = ({ name = '', options = [], onChange = () => { }, value = false }) => {
    return (
        <Row>
            <Pm>{name}</Pm>
            <div style={{ width: 120 }}>
                <MSelectWrap options={options} value={value ? value : ''} onChange={onChange} style={{ width: 180 }} />
            </div>
        </Row>
    )
}
export const Text = ({ name = '', value = '', onChange = () => { } }) => {
    const [text, setText] = useState(value)
    const dropped = (e) => {
        let dropText = e.dataTransfer.getData('text')
        if (dropText && dropText.startsWith('res://')) {
            setText(dropText)
            onChange(dropText)
        }
    }
    return (
        <div onDrop={dropped} onDragOver={(e) => e.preventDefault()} style={{ display: 'flex' }}>
            <Pm>{name}</Pm>
            <EnterInput value={text} type='text' style={{ width: 100 }} onBlur={() => onChange(text)}
                onChange={(e) => setText(e.target.value)} onDragOver={(e) => e.preventDefault()}
                onEnter={() => onChange(text)} />
        </div>
    )
}
export const NumberInput = ({ name = '', value = 0, onChange = () => { } }) => {
    const [istext, setIstext] = useState(isNaN(Number(value)) ? true : false)
    //const [text, setText] = useState(value)
    return (
        <Row>
            <Pm>{name}</Pm>
            <input type='text' value={value} style={{ width: 100 }}
                //onBlur={() => onChange(text)}
                onChange={(e) => {
                    let val = e.target.value;
                    if (!istext) {
                        let no = Number(val.endsWith('.') ? val + '0' : val)
                        if (!isNaN(no)) {
                            onChange(no)
                        }
                    } else {
                        onChange(e.target.value)
                    }
                }} />
            <input type='checkbox' checked={istext}
                onChange={(e) => setIstext(e.target.checked)}
            />
        </Row>
    )
}
export const Bool = ({ name = '', value = false, onChange = () => { } }) => {
    return (
        <Row>
            <Pm>{name}</Pm>
            <Switch checked={value} height={20} handleDiameter={18} onChange={onChange} />
        </Row>
    )
}
export const Json = ({ name = '', value = '', onChange = () => { }, title = true }) => {
    const [open, setOpen] = useState(false)
    if (typeof value !== 'string') {
        try {
            value = JSON.stringify(value)
        } catch (e) {
            console.log('JSON value erro')
            value = 'Json error'
        }
    }
    const [code, setCode] = useState(value)
    const [info, setInfo] = useState('')

    const disMes = (mes) => {
        setInfo(mes)
        setTimeout(() => setInfo(''), 10000)

    }
    const updateCode = (val) => {
        setCode(val)
    }
    const save = () => {
        try {
            onChange(JSON.parse(code))
            disMes('Saved')
        } catch (e) {
            setInfo()
            disMes('Error : ' + e.message)
        }

    }
    return (
        <Row>
            {title && <Pm>{name}</Pm>}
            <Tooltip title={value}><div onClick={() => setOpen(true)}>EDIT</div></Tooltip>
            {open && <Dialog open={open} onClose={() => setOpen(false)} >
                <div style={{ minWidth: '70%', minHeight: '50%' }} >
                    <Editor
                        onKeyDown={e => {
                            if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
                                e.preventDefault()
                                e.stopPropagation()
                                save()
                            }
                        }}
                        value={code}
                        onValueChange={updateCode}
                        highlight={(code) => highlight(code, languages.js)}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 16,
                            fontWeight: 'bold',
                            minWidth: '30vw',
                            minHeight: '30vh',
                        }}
                    />
                    <button onClick={() => setOpen(false)}>Close</button>
                    <button onClick={() => save()}>Save</button>
                    <div>{info}</div>
                </div>
            </Dialog>}
        </Row>
    )
}

export const Html = ({ name = '', value = '', onChange = () => { }, title = true }) => {
    const [open, setOpen] = useState(false)
    const [html, setHtml] = useState(value)
    return (
        <Row>
            {title && <Pm>{name}</Pm>}
            <Tooltip title={value}><div onClick={() => setOpen(true)}>EDIT</div></Tooltip>
            <Dialog open={open} onClose={() => { setOpen(false); onChange(html); }} >
                <div>{name}</div>
                <JoditEditor onBlur={(v) => setHtml(v)} value={html} />
                <div>
                    <button onClick={() => setOpen(false)} >Close</button>
                    <button onClick={() => onChange(html)} >Save</button>
                </div>
            </Dialog>
        </Row>
    )
}
export const Comps = ({ name = '', values = [], app, setApp, passChild = false, onChange = () => { } }) => {
    if (!Array.isArray(values)) {
        values = []
        console.log(values)
    }

    const Insert = ({ pos = 0, children }) => {
        let name = children
        return (
            <div style={{
                width: '95%', minHeight: 20,
                backgroundColor: 'khaki', padding: 2, marginBottom: 2, borderRadius: 2
            }}
                draggable={true}
                onDragStart={(e) => e.dataTransfer.setData('text', `change,${pos}`)}

                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    let data = e.dataTransfer.getData('text');
                    e.preventDefault();
                    add(pos, data)
                }}

            >{name}</div>
        )
    }
    const Child = ({ id, pos }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{id}</div>
                <div onClick={(e) => deletec(e, pos)}><MdDelete size={20} color={'purple'} /></div>
            </div>
        )
    }

    const deletec = (e, pos) => {
        e.stopPropagation();
        let tmpChilds = [...values];
        tmpChilds.splice(pos, 1);
        onChange(tmpChilds, false);

    }
    const add = (pos, data = '') => {
        let tmpChilds = [...values];
        if (data.startsWith('change,')) {
            let opos = data.split('change,')[1]
            let npos = pos
            if (npos === opos) return
            let child = tmpChilds.splice(opos, 1)[0]
            if (npos < opos) {
                tmpChilds.splice(npos, 0, child)
            } else {
                tmpChilds.splice(npos, 0, child)
            }
            onChange(tmpChilds)
            return
        }
        if (data.endsWith(',no')) {
            let tmpChilds = [...values]
            let oldId = data.split(',')[0]
            tmpChilds.splice(pos, 0, passChild ? `${app[0].name},${oldId}` : oldId)
            onChange(tmpChilds)
            return;
        }
        global.created++;
        let id = 'comp' + global.created;
        let child = { name: data, id, props: {} };
        if (data.startsWith('Md') || data.startsWith('Fa') || data.startsWith('Bi')) {
            child.name = 'Icon'
            child.extras = data
        }
        tmpChilds.splice(pos, 0, passChild ? `${app[0].name},${child.id}` : child.id);
        onChange(tmpChilds, child);

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 3, border: '1px solid grey' }}>
            <Pm style={{ textAlign: 'center', width: '100%' }}>{name}</Pm>
            {values.map((child, index) => {
                return (
                    <Insert pos={index}   ><Child id={child} pos={index} /></Insert>
                )
            })}
            <Insert pos={values.length} />
        </div>
    )
}
export const Comp = ({ name = '', values = [], app, setApp, passChild = false, onChange = () => { } }) => {
    if (!Array.isArray(values)) {
        values = []
        console.log(values)
    }
    const Insert = ({ pos = 0, children }) => {

        return (
            <div style={{
                width: '95%', minHeight: 20,
                backgroundColor: 'khaki', padding: 2, marginBottom: 2, borderRadius: 2
            }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    let data = e.dataTransfer.getData('text');
                    e.preventDefault();
                    add(pos, data)
                }}

            >{children}</div>
        )
    }
    const Child = ({ id, pos }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{id}</div>
                <div onClick={(e) => deletec(e, pos)}><MdDelete size={20} color={'purple'} /></div>
            </div>
        )
    }

    const deletec = (e, pos) => {
        e.stopPropagation();
        let tmpChilds = [...values];
        tmpChilds.splice(pos, 1);
        onChange(tmpChilds, false);

    }

    const add = (pos, data = '') => {
        if (data.endsWith(',no')) {
            let tmpChilds = [...values]
            let oldId = data.split(',')[0]
            let passId = passChild ? `${app[0].name},${oldId}` : oldId
            if (tmpChilds.length > 0) {
                tmpChilds.splice(0, 1, passId)

            } else {
                tmpChilds.push(passId)
            }
            onChange(tmpChilds)
            return;
        }
        let tmpChilds = [...values];
        global.created++;
        let id = 'comp' + global.created;
        let child = { name: data, id, props: {} };
        if (data.startsWith('Md') || data.startsWith('Fa') || data.startsWith('Bi')) {
            child.name = 'Icon'
            child.extras = data
        }
        let passId = passChild ? `${app[0].name},${child.id}` : child.id

        if (tmpChilds.length > 0) {
            tmpChilds.splice(0, 1, passId)

        } else {
            tmpChilds.push(passId)
        }
        onChange(tmpChilds, child);

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: 3, border: '1px solid grey' }}>
            <Pm style={{ textAlign: 'center', width: '100%' }}>{name}</Pm>
            {values.map((child, index) => {
                return (
                    <Insert pos={index}   ><Child id={child} pos={index} /></Insert>
                )
            })}
            {!values[0] && <Insert pos={0} />}
        </div>
    )
}

export const Res = ({ name = '', value = '', onChange = () => { } }) => {
    const [text, setText] = useState(value)
    const [isText, setIsText] = useState(false)
    const [resType, setResType] = useState(get('restype'))
    const [open, setOpen] = useState(false)
    const dropped = (e) => {
        let dropText = e.dataTransfer.getData('text')
        if (dropText && dropText.startsWith('res://')) {
            setText(dropText)
            onChange(dropText)
        }
    }
    const files = global.files.filter(f => {
        if (f.by && f.by.startsWith('module,')) return false
        switch (resType) {
            case 'all':
                return true
            case 'image':
                return f.type.includes('image')
            case 'video':
                return f.type.includes('video')
            case 'media':
                return f.type.includes('video') || f.type.includes('image')
            default:
        }
        return true
    }).sort()
    const anchor = React.useRef()
    const resArea = (
        <div ref={anchor}>
            {text}
            <Popover anchorEl={anchor.current} open={open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <div style={{ display: 'flex', maxWidth: '80vw', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}
                    onClick={(e) => e.stopPropagation()} >
                    <Select value={resType} onChange={e => set('restype', e.target.value, setResType)} >
                        {['media', 'image', 'video', 'all'].map(m => <MenuItem value={m}>{m}</MenuItem>)}
                    </Select>
                    {files.map(f => <div key={f.name} onClick={() => { setText(`res://${f.name}`); onChange(`res://${f.name}`); setOpen(false) }}
                    > <Preview file={f} size={50} /></div>)}
                </div>
            </Popover>
        </div>
    )
    return (
        <div
            style={{ display: 'flex' }} onClick={() => setOpen(true)}
            onDrop={dropped} onDragOver={(e) => e.preventDefault()}
        >
            <Pm >{name}</Pm>
            <input type='checkbox' value={isText} onChange={e => setIsText(e.target.checked)} />
            {isText && <EnterInput value={text} type='text' style={{ width: 100 }} onBlur={() => onChange(text)}
                onChange={(e) => setText(e.target.value)} onDragOver={(e) => e.preventDefault()}
                onEnter={() => onChange(text)} />}
            {!isText && resArea}
        </div>
    )
}
export const Conditional = ({ name = '', value = { data: [] }, props, onChange }) => {
    let data = value
    props.children = data.map(d => d[1])

    let Row = ({ row, index }) => {
        const [cond, setCond] = useState(row[0])

        const condChange = (e) => {
            let dataWrap = [...data]
            dataWrap[index][0] = cond
            props.children = dataWrap.map(d => d[1])
            onChange(dataWrap)
        }

        const onDelete = () => {
            let dataWrap = data
            dataWrap.splice(index, 1)
            props.chidren = dataWrap.map(d => d[1])
            onChange(dataWrap)
        }

        return (
            <div style={{ border: '1px solid black', borderRadius: 3 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: 2 }}>
                    <EnterInput type='text' value={cond} readOnly={false} style={{ flex: 1, width: '80%' }}
                        onChange={(e) => setCond(e.target.value)} onEnter={condChange} />
                    <div onClick={condChange} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <MdSave size={20} color='blue' />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', borderRadius: 3, backgroundColor: 'khaki', flex: 1 }}>
                        {row[1]}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        onClick={onDelete}>
                        <MdDelete size={20} color='blue' />
                    </div>
                </div>
            </div>
        )
    }
    const insert = (e) => {
        let type = e.dataTransfer.getData('text')
        e.preventDefault()

        let id = 'cond' + global.created++
        let child = { name: type, id, props: {} }
        if (type.startsWith('Md') || type.startsWith('Fa') || type.startsWith('Bi')) {
            child.name = 'Icon'
            child.extras = type
        }
        let dataWrap = data
        if (type.endsWith(',no')) {
            dataWrap.push(['true', type.split(',')[0]])
            onChange(dataWrap)
            return
        }
        props.children = dataWrap.map(d => d[1])
        dataWrap.push(['true', id])
        onChange(dataWrap, child)

    }
    return (
        <div style={{ border: '1px solid black', padding: 2 }}>
            <div style={{ textAlign: 'center' }}>{name}</div>
            {data.map((v, index) => {
                return (
                    <Row row={v} index={index} />
                )
            })}
            <div style={{ display: 'flex', justifyContent: 'center', height: 20, backgroundColor: 'khaki', borderRadius: 3, margin: 2 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={insert}
            >
                Drop To Add
            </div>
        </div>
    )

}

//let types = { name: 'text', age: 'number', body: 'html' }
let keyNo = 0
const MapData = ({ name, value, onChange, types }) => {
    const [isJson, setIsJson] = useState(false)
    let data = []
    if (Array.isArray(value)) data = value
    let localProps = {}
    let propList = []
    let type = '$$guyimapper$$'
    for (let p in types) {
        let name = p
        let propType = types[p]
        propList.push({ name, prop: name, type: propType, value: undefined })
        localProps[p] = ''
    }

    let localPropTypes = [{ type, props: propList }]
    let rows = []
    data.forEach((d, index) => {
        const setProp = (prop, val) => {
            d[prop] = val
            onChange(data)
        }
        const deleteRow = () => {
            data.splice(index, 1)
            onChange(data)
        }
        const rearangeRows = (e, newPos) => {
            let oldPos = e.dataTransfer.getData('text')
            e.preventDefault()
            oldPos = parseInt(oldPos)
            if (isNaN(oldPos) || oldPos === newPos) return
            let oldData = data.splice(oldPos, 1)[0]
            if (newPos > oldPos) {
                data.splice(newPos, 0, oldData)

            } else {
                data.splice(newPos, 0, oldData)
            }
            onChange(data)

        }
        let ptys = (
            <div key={'data-row' + (keyNo++)}
                style={{ display: 'flex', flexWrap: 'wrap', borderTop: '2px dotted grey' }}
                draggable={true}
                onDragStart={(e) => e.dataTransfer.setData('text', index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => rearangeRows(e, index)}
            >
                <Properties key={Math.random()} showIdRow={false} localProps={d} type={type} localPropTypes={localPropTypes}
                    id='' setProp={setProp}
                />
                <MdDelete size={20} color='blue' onClick={deleteRow} />
            </div>
        )
        rows.push(ptys)
    })
    const addRow = () => {
        data.push({ ...localProps })
        onChange(data)
    }
    if (isJson) {
        return (
            <div>
                <button onClick={() => setIsJson(false)} >Use mapper?</button>
                <Json name={name} value={value} onChange={onChange} />
            </div>
        )
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', border: '2px solid blue', borderRadius: 4, padding: 2 }}>
            <div style={{ textAlign: 'center' }} onClick={() => setIsJson(!isJson)} >
                {name}<input type='checkbox' checked={isJson} readOnly />
            </div>
            {rows}
            <button onClick={addRow} >Add Row</button>
        </div>
    )

}

const IdRow = ({ changeId, oid, app, type,extras }) => {
    const [id, setId] = useState(oid)
    const [info, setInfo] = useState('')
    const disMes = (mes) => {
        setInfo(mes)
        setTimeout(() => setInfo(''), 2000)
    }
    const save = () => {
        let ids = app.map(a => a.id)
        if (id.length < 3) {
            disMes('Id Too Short')
            return
        }
        if (id.includes(',')) {
            disMes('Comma not allowed')
            return
        }
        if (ids.includes(id)) {
            disMes('Id in use')
            return
        }
        disMes('Id Changed ')
        setId('')
        changeId(id)
    }
    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid blue' }} >
                <div style={{ color: 'blue' }}>{`${extras||type}-${oid}`}</div>
                <EnterInput type='text' value={id} onChange={(e) => setId(e.target.value)}
                    style={{ width: '80%' }}
                    onEnter={save}
                />
                <div style={{ display: 'flex' }}
                    onClick={save}>
                    <MdSave size={20} color='blue' />
                </div>
            </div>
            <div>{info}</div>
        </>
    )

}
const Properties = ({
    localProps = {}, type = '', localPropTypes = [], id = '',
    view = {}, setView = () => { }, setProp = () => { },
    app = [], setApp, showIdRow = true
}) => {

    const setFields = () => {
        let fields = []
        let types = localPropTypes.map(val => val.type)
        if (!types.includes(type)) {
            fields.push(<Pm>No props</Pm>)
            return fields;
        }
        let props = localPropTypes[types.indexOf(type)].props
        props.forEach(({ name, prop, type, value }, pos) => {
            if (type === 'event') return
            let comp = <Pm>Unkown</Pm>
            if (type === 'text') {
                comp = <Text key={view.id + name} name={name} value={localProps[prop]} onChange={(text) => setProp(prop, text)} />
            }
            if (type === 'number') {
                comp = <NumberInput key={view.id + name} name={name} defaultValue={value} value={localProps[prop]} onChange={(no) => setProp(prop, no)} />
            }
            if (type === 'bool') {
                comp = <Bool key={view.id + name} name={name} value={localProps[prop]} onChange={(bool) => { setProp(prop, bool) }} />
            }
            if (type.startsWith('select')) {
                let options = type.split(',');
                options.splice(0, 1)
                comp = <SelectWrap key={view.id + name} name={name} options={options} value={localProps[prop]} onChange={(opt) => { setProp(prop, opt) }} />
            }
            if (type === 'color') {
                comp = <Color key={view.id + name} name={name} color={localProps[prop]} onChange={(col) => setProp(prop, col.hex)} />
            }
            if (type === 'comps') {
                comp = <Comps key={view.id + name} name={name} values={localProps[prop]} app={app} onChange={(vals, add) => setProp(prop, vals, add)} />
            }

            if (type === 'comp') {
                comp = <Comp key={view.id + name} name={name} values={localProps[prop]} app={app} onChange={(vals, add) => setProp(prop, vals, add)} />
            }
            if (type === 'json') {
                comp = <Json key={view.id + name} name={name} value={localProps[prop]} onChange={(text) => setProp(prop, text)} />
            }
            if (type === 'conditional') {
                comp = <Conditional key={view.id + name} name={name} value={localProps[prop]} props={localProps} onChange={(data, add) => setProp(prop, data, add)} />
            }
            if (type === 'html') {
                comp = <Html key={view.id + name} name={name} value={localProps[prop]} onChange={(val) => setProp(prop, val)} />
            }
            if (type === 'children') {
                comp = <Comps passChild={true} key={view.id + name} name={name} values={localProps[prop]} app={app} onChange={(vals, add) => setProp(prop, vals, add)} />
            }
            if (type === 'child') {
                comp = <Comp passChild={true} key={view.id + name} name={name} values={localProps[prop]} app={app} onChange={(vals, add) => setProp(prop, vals, add)} />
            }
            if (type.startsWith('mapdata,')) {
                let typeOps = type.split('mapdata,')[1]
                try {
                    typeOps = JSON.parse(typeOps)
                } catch (e) {
                    try {
                        typeOps = localProps['FormatInfo']
                    } catch (e) {
                        console.log('mapdata error', e.message)
                        typeOps = {}
                    }
                }
                comp = <MapData key={view.id + name} name={name} types={typeOps} value={localProps[prop]} onChange={(val) => setProp(prop, val)} />
            }
            if (type === 'res') {
                comp = <Res key={view.id + name} name={name} value={localProps[prop]} onChange={(text) => setProp(prop, text)} />
            }
            fields.push(comp)
        })
        return fields;

    }
    //also used in outline paste tree
    const replaceId = (tree, oid, nid) => {
        tree.forEach(c => {
            for (let p in c.props) {
                if (Array.isArray(c.props[p])) {
                    c.props[p].forEach((child, index) => {
                        if (child === oid) {
                            c.props[p][index] = nid
                        }
                        if (typeof child === 'string' && child.includes(',')) {
                            let part = child.split(',')
                            if (part[1] === oid) {
                                c.props[p][index] = `${part[0]},${nid}`
                            }
                        }
                    })
                    if (p === 'Routes' && Array.isArray(c.props[p])) {//deal with condlist
                        c.props[p].forEach(cond => {
                            if (Array.isArray(cond)) {
                                if (cond[1] && cond[1] === oid) {
                                    cond[1] = nid
                                }
                            }
                        })
                    }
                }
            }
        })
    }
    const changeId = (newId) => {
        let tmpView = { ...view }
        tmpView.id = newId
        let tmpApp = JSON.parse(JSON.stringify(app))
        let ids = app.map(m => m.id)
        let pos = ids.indexOf(view.id)
        tmpApp[pos] = tmpView
        replaceId(tmpApp, view.id, newId)
        setApp(tmpApp)

    }

    return (
        <div >
            {showIdRow && <IdRow changeId={changeId} oid={view.id} type={view.name} extras={view.extras} app={app} />}
            {setFields()}
        </div>
    )
}

export default Properties

