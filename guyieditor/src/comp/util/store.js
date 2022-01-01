import LocalForage from 'localforage'


global.store = {
    /*Set store item
    *@param [string] name
    *@param [any] value
    *@param [(e)=>Null] cb
    */
    set(name, value, cb, cb2) {
        let schema = global.schema[name]
        if (schema) {
            try {
                if (typeof schema.def === 'object') {
                    localStorage.setItem(name, JSON.stringify(value))
                } else {
                    localStorage.setItem(name, value)

                }
                if (typeof cb === 'function')
                    cb(value)
                if (typeof cb2 === 'function')
                    cb2(value)
                return true
            } catch (e) {
                console.log('Data not set', name, value)
            }
        } else {
            console.log('Not in store', name)
        }
        return false
    },
    get(name) {
        let schema = global.schema[name]
        if (schema) {
            let val = localStorage.getItem(name)
            if (val !== null) {
                switch (typeof schema.def) {
                    case 'number':
                        val = Number(val)
                        break;
                    case 'object':
                        try {
                            val = JSON.parse(val)
                        } catch (e) {
                            console.log('store val corrupt', name, e.message)
                            return null
                        }
                        break;
                    case 'boolean':
                        val = val === 'true'
                        val = !!val

                        break
                    default:
                        break;
                }
                return val
            } else {
                return schema.def
            }
        } else {
            console.log('Get item not in schema', name)
            return null
        }
    }
}
global.schema = {
    adress: { def: 'ws://localhost:8080' },
    reloadno: { def: 0 },
    layoutstate: { def: { new: 'Desk', old: 'Desk' } },
    lastsave: { def: '' },
    lastopen: { def: '' },
    toolsindex: { def: 0 },
    toolssync: { def: true },
    doc: { def: '' },
    consoleheight: { def: 30 },
    consoleopen: { def: true },
    lasttest:{def:''},
    mipmapopen:{def:true},
    restype:{def:'media'},
    lastcolors:{def:['blue','red','green','purple','violet']}
}
const get = global.store.get
const set = global.store.set


const newApp=[
    {
        name: 'Main', state: {}, locals: {}, propTypes: [], funcs: [{
            name: 'globals', props: {},
            events: {},

        }],
        classCode:
`//write code for module here
class main {
    constructor({ getState, setState, mergeState, tiePS, getRef, getProps, getEvents, getExtras }) {
        this.gs = getState
        this.ss = setState
        this.ms = mergeState
        this.tiePS = tiePS
        this.getRef = getRef
        this.gp = getProps
        this.gv = getEvents
        this.gx = getExtras
    }
    //put code below :)


}
`
    },
    { name: 'Column', id: 'root', props: {} },
]

let wsRef = null

const fetchApp = (disMes) => {
    console.log('fetching')
    try {
        if (wsRef) {
            wsRef.send(JSON.stringify({
                type: 'get'
            }))
        } else {
            disMes('No connection ', 1000)
        }

    } catch (e) {
        console.log('Fetch error', e.message)
    }
}
const uploadApp = (typeNo, disMes) => {
    try {
        if (wsRef) {
            let reloadNo = get('reloadno')
            if (typeNo === reloadNo) {
                wsRef.send(JSON.stringify({
                    type: 'update',
                    app: {
                        modules: global.modules, comps: global.comps,
                        remodules: global.remodules, files: global.files
                    }
                }))
                disMes('uploaded', 700)
            }
        } else {
            // console.log('No connection')
            // disMes('No Connection')
        }
    } catch (e) {
        console.log('upload erro', e.message)
    }
}

const changeSync = (sync) => {
    try {
        if (wsRef) {
            wsRef.send(JSON.stringify({
                type: 'useupdate',
                data: sync,
            }))
        } else {
            throw new Error('Not connected')
        }

    } catch (e) {
        console.log( e.message)
    }
}

const initApp = (adress, disMes, setConnected, open) => {
    try {
        let ws = new WebSocket(adress)
        ws.onclose = (e) => {
            console.log('Server socket down')
            if (wsRef) {
                try {
                    wsRef.close()
                    wsRef = null
                    setConnected(false)
                } catch (e) {
                    console.log(e.message)
                }
            }
            disMes('Closed' + e.message)
        }
        ws.onerror = (e) => {
            console.log('Server error', e.message)
        }
        ws.onopen = () => {
            wsRef = ws
            disMes('Listening')
            set('adress', adress)
            setConnected(true)
        }
        ws.onmessage = (mes) => {
            try {
                let data = JSON.parse(mes.data)
                if (data.type === 'reload') {
                    console.log('reload', data.app)
                    if (get('toolssync')) {
                        open(data)
                        disMes('Reloaded', 1000)
                    }
                }
                if (data.type === 'getresult') {
                    open(data)
                    disMes('Latest', 1000)
                }
            } catch (e) {
                console.log('Message error', e)
            }
        }

    } catch (e) {
        return false
    }

}

const shortCuts = (e, setTabPos, open, save, saveLayout, disMes) => {
    if (e.ctrlKey) {
        switch (e.key) {
            case '1':
                e.preventDefault()
                setTabPos(0)
                break;
            case '2':
                e.preventDefault()
                setTabPos(1)
                break;
            case '3':
                e.preventDefault()
                setTabPos(2)
                break;
            case '4':
                e.preventDefault()
                setTabPos(3)
                break;
            case '5':
                e.preventDefault()
                setTabPos(4)
                break;
            case 'f':
            case 'F':
                e.preventDefault()
                uploadApp(1, disMes)
                break;
            case 's':
            case 'S':
                e.preventDefault()
                save()
                uploadApp(0, disMes)
                break;
            case 'o':
            case 'O':
                e.preventDefault()
                open();
                break;
            default:
            // console.log('just ctrl')

        }

    }
    if (e.shiftKey) {
        switch (e.key) {
            case 1:
                e.preventDefault()
                saveLayout('edit')
                break;
            case 2:
                e.preventDefault()
                saveLayout('lay2')
                break;
            case 3:
                e.preventDefault()
                saveLayout('code')
                break;
            default:
            //just shift
        }
    }
}

const importOldProjos = async() => {
    for (const p of Object.keys(localStorage)) {//import old apps
        try {
            let pr = JSON.parse(localStorage[p])
            if (Array.isArray(pr.modules)) {
                let data = { ...pr, time: (new Date()).toDateString() }
                await LocalForage.setItem(p, JSON.stringify(data))
                localStorage.removeItem(p)
            }
            let keys = await LocalForage.keys()
            localStorage.setItem('projectnames', JSON.stringify(keys))

        } catch (e) {
            // console.log('not project', p)
        }
    }
}
importOldProjos()

const done='DONE'
export { fetchApp, uploadApp, initApp, changeSync, shortCuts,done ,newApp }


