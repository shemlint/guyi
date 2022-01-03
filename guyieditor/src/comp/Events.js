import React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { getCodeClass } from './util/data'
import { dataHtml, dataBasic } from './Widgets'

const basicComps = dataHtml.map(d => d.name).concat(dataBasic.map(d => d.name))

const EventRow = ({ event = {}, view = {}, setApp, app }) => {
    if (!view.events) view.events = {}
    let options = getCodeClass(app[0].classCode || '').methods
    options.unshift('none')
    const getName = () => {
        let n = view.events[event.name] || view.events[`${app[0].name},${event.name}`] || 'none'
        if (n.includes(',')) {
            n = n.split(',')[1]
        }
        return n
    }
    let current = getName()

    const onChange = (choice) => {
        let tmpApp = [...app]
        let tmpView = { ...view }
        if (choice === 'none') {
            tmpView.events[event.name] = null
        } else {
            // if(typeof tmpView.events[event.name]!=='object'){
            //     tmpView.events[event.name]
            // }
            if (basicComps.includes(view.name)) {
                tmpView.events[event.name] = choice
            } else {
                tmpView.events[`${app[0].name},${event.name}`] = choice
            }
        }
        let ids = tmpApp.map(c => c.id)
        let pos = ids.indexOf(view.id)
        if (pos !== -1) {
            tmpApp[pos] = tmpView
        }
        setApp(tmpApp)
    }
    const changeArgs=(e)=>{
        let tmpApp = [...app]
        let tmpView = { ...view }
        if(tmpView.events[event.name]){
            tmpView.events[event.name].args=e.target.value
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
            <div>{event.name}</div>
            <Select value={current} placeholder="Function " onChange={(e) => onChange(e.target.value)}>
                {options.map(m => <MenuItem value={m}>{m}</MenuItem>)}
            </Select>
            <input type='text' value={event.args===undefined?'':event.args} onChange={changeArgs}  />
        </div>
    )
}


const Events = ({ eventTypes = [], view = {}, funcs = [], setApp, app }) => {

    let typeNames = eventTypes.map(val => val.name);
    if (typeNames.includes(view.name)) {
        let events = eventTypes[typeNames.indexOf(view.name)].events
        return (
            <div>
                {events.map(event => {
                    return (
                        <EventRow event={event} funcs={funcs} view={view} setApp={setApp} app={app} />
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
