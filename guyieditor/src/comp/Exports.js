import React, { useState } from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from 'react-switch'
import { ChromePicker } from 'react-color'
import { MdDelete } from 'react-icons/md'

import { Json, Html } from './Properties'

const MSelect = ({ options, onChange, value }) => {
    return (
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map(m => <MenuItem value={m}>{m}</MenuItem>)}
        </Select>
    )
}

const InputBox = ({ type, onChange, value, setType }) => {
    const [open, setOpen] = useState(true);
    let comp = <p>NO EDIT OF TYPE</p>
    if (type === 'text') {
        comp = <input type='text' value={value} onChange={(e) => onChange(e.target.value)} />
    }
    if (type === 'number') {
        comp = <input type='number' value={value} onChange={(e) => {
            let val = e.target.value;
            try {
                val = parseInt(val);
            } catch (e) {
                val = 0;
            }
            onChange(val);

        }} />
    }
    if (type.startsWith('select')) {
        comp = <input value={type.substring(7) || ''} onChange={(e) => {
            setType('select,' + e.target.value)

        }} />
    }
    if (type === 'bool') {
        comp = <Switch checked={value} onChange={onChange} />
    }
    if (type === 'color') {
        comp = (<div>
            <div style={{ display: 'flex' }}>
                <p style={{ margin: 0 }}>Open Picker </p>
                <input type='checkbox' width={120} checked={open} onChange={e => setOpen(e.target.checked)} />
            </div>
            {open && <ChromePicker color={value} onChangeComplete={col => onChange(col.hex)} />}
        </div>)
    }
    if (type === 'comps') {
        comp = <p>Set By code/editor</p>
    }
    if (type === 'comp') {
        comp = <p>Set By code/editor</p>
    }
    if (type === 'children') {
        comp = <p>Set By code/editor</p>
    }
    if (type === 'child') {
        comp = <p>Set By code/editor</p>
    }

    if (type === 'json') {
        comp = <Json name='EDIT JSON' value={value} onChange={onChange} title={false} />
    }
    if (type === 'html') {
        comp = <Html name='EDIT HTML' value={value} onChange={onChange} title={false} />
    }
    if (type === 'event') {
        comp = <MSelect options={['undefined', '()=>{ }']} value={value} onChange={onChange} />
    }
    if (type.startsWith('mapdata')) {
        const changed=(d)=>{
            setType('mapdata,'+JSON.stringify(d))
}
        let val=type.split('mapdata,')[1]
        comp=    <Json name='EDIT MAPDATA' value={val} onChange={changed} title={false}  />

    }
    if (type === 'res') {
        comp = <input type='text' value={value} onChange={(e) => onChange(e.target.value)} />
    }

    return comp;

}

const Row = ({ lname, ltype, lvalue, index, setProps, remove }) => {
    const [name, setName] = useState(lname)
    const [type, rawsetType] = useState(ltype)
    const [value, setValue] = useState(lvalue)

    const setType = (typ) => {
        rawsetType(typ)
        switch (typ) {
            case 'child':
            case 'children':
            case 'comps':
            case 'comp':
                setValue(undefined)
                break;
            case 'mapdata':
                setValue([])
                break;
            default:
                break;
        }
    }

    setProps(index, { name, prop: name, type, value });

    let opts = ['text', 'number', 'color', 'select', 'bool','res', 'child', 'children', 'json', 'mapdata', 'html', 'event'];
    let onChange = (val) => {
        setValue(val)
        setProps(index, { name, prop: name, type, value })
    }
    return (
        <tr >
            <td>
                <input type='text' value={name} onChange={(e) => {
                    setName(e.target.value); setProps(index, { name, prop: name, type, value })
                }} style={{ width: 80 }}
                />
            </td>
            <td>
                <MSelect value={type.startsWith('select') ? 'select' : type.startsWith('mapdata') ? 'mapdata' : type}
                    options={opts} onChange={(val) => {
                        setType(val); setProps(index, { name, prop: name, type, value })
                    }}
                />
            </td>
            <td>
                <InputBox value={value} onChange={onChange} type={type} setType={setType} />
            </td>
            <td>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    onClick={(e) => remove(index)}
                >
                    <MdDelete size={20} color='blue' />
                </div>
            </td>
        </tr>
    )
}
const Exports = ({ app = [], setApp }) => {

    const update = useState(0)[1];

    let localPT = app[0].localPT
    let localET = [];
    if (!localPT) {
        localPT = [];
    }

    if (!app[0].localPT) {
        app[0].localPT = [];
    }
    const setProps = (index, row) => {
        localPT[index] = row;

        localET = [];
        localPT.forEach(({ name, type, value, prop }) => {
            if (type === 'event') {
                let def = value === 'undefined' ? undefined : () => { };
                localET.push({ name, def });

            }
        })

    }
    const add = () => {
        let len = localPT.push({ name: '', prop: '', type: 'text', value: '' });
        update(len)

    }
    const remove = (index) => {
        let tmpApp = [...app];
        if (tmpApp[0].props === undefined) {
            tmpApp[0].props = {};
        }
        let p = tmpApp[0].localPT.splice(index, 1)
        setApp(tmpApp)
        console.log(p)
    }

    const set = () => {
        let tmpApp = [...app];
        if (tmpApp[0].props === undefined) {
            tmpApp[0].props = {};
        }
        tmpApp[0].localPT.forEach(pt => {
            tmpApp[0].props[pt.prop] = pt.value;
        })
        if (tmpApp[0].events === undefined) {
            tmpApp[0].events = {}
        }
        tmpApp[0].localET = localET;
        localET.forEach(e => {
            tmpApp[0].events[e.name] = e.def;
        })

        setApp(tmpApp);

    }
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <table  >
                <thead>
                    <tr>
                        <th>Name </th>
                        <th>Type </th>
                        <th>Initial/Extras </th>
                    </tr>
                </thead>
                <tbody>
                    {localPT.map(({ name, type, value }, index) => {
                        return (
                            <Row lname={name} ltype={type} lvalue={value} index={index}
                                setProps={setProps} remove={remove} />
                        )
                    })}
                </tbody>

            </table>
            <div style={{ display: 'flex', justifyContent: 'center' }} >
                <button onClick={add} >Add a Row</button>
                <button onClick={set} >Set props</button>
            </div>
        </div>
    )
}

export default Exports

