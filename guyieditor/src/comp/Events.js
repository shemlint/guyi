import React,{useState} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { getCodeClass } from './util/data'
import { dataHtml, dataBasic } from './Widgets'

const basicComps = dataHtml.map(d => d.name).concat(dataBasic.map(d => d.name))

const EventRow = ({ eventType = {}, view = {}, setApp, app }) => {
    if (!view.events) view.events = {}
    let options = getCodeClass(app[0].classCode || '').methods
    options.unshift('none')
    let events=view.events[eventType.name]
    if (typeof events !== 'object'||!events) {
        events = {}
    }
    const [args,setArgs]=useState(events.args||'')
    const onChange = (choice) => {
        let tmpApp = [...app]
        let tmpView = { ...view }
        if(!tmpView.events[eventType.name]){
            tmpView.events[eventType.name]={}
        }
        let tmpEvents=tmpView.events[eventType.name]
        if (choice === 'none') {
            tmpView.events[eventType.name] = {}
            tmpEvents={}
        } else {
            tmpEvents.method = choice
            if (basicComps.includes(view.name)) {
                tmpEvents.module = null
            }else{
                tmpEvents.module = app[0].name
            }
        }
        let ids = tmpApp.map(c => c.id)
        let pos = ids.indexOf(view.id)
        if (pos !== -1) {
            tmpApp[pos] = tmpView
        }
        setApp(tmpApp)
    }
    const changeArgs = (e) => {
        let tmpApp = [...app]
        let tmpView = { ...view }
        if (tmpView.events[eventType.name]) {
            tmpView.events[eventType.name].args = args
        }
        let ids = tmpApp.map(c => c.id)
        let pos = ids.indexOf(view.id)
        if (pos !== -1) {
            tmpApp[pos] = tmpView
        }
        setApp(tmpApp)
    }
    return (
        <div style={{ display: 'flex', borderTop: '1px solid grey', justifyContent: 'space-between' }}>
            <div>{eventType.name}</div>
            <Select value={events.method} placeholder="Function " onChange={(e) => onChange(e.target.value)}>
                {options.map(m => <MenuItem value={m}>{m}</MenuItem>)}
            </Select>
            <input type='text' value={args} onChange={e=>setArgs(e.target.value)}  onBlur={changeArgs} />
        </div>
    )
}


const Events = ({ eventTypes = [], view = {}, funcs = [], setApp, app }) => {

    let typeNames = eventTypes.map(val => val.name);
    if (typeNames.includes(view.name)) {
        let events = eventTypes[typeNames.indexOf(view.name)].events
        return (
            <div>
                {events.map((event,i) => {
                    return (
                        <EventRow key={`${app[0].name}-${view.id}-${i}`} eventType={event} funcs={funcs} view={view} setApp={setApp} app={app} />
                    )
                })}
            </div>
        )
    }
    else {
        return (
            <div>
                <div>No events for this Comp</div>
            </div>
        )
    }
}

export default Events
