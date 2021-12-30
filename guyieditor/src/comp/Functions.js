import React, { useState } from 'react'
import Editor,{loader} from '@monaco-editor/react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { getCodeClass } from './util/data'
//import reactTypes from './react.d.ts'

loader.config({
    paths:{
        vs:'/vs'
    }
})
const set = global.store.set
const get = global.store.get
window.codeChangeEvent = new Event('codechange')
const Functions = ({ app, setApp }) => {
    const [code, setCode] = useState(app[0].classCode || '')
    const [test, setTest] = useState(get('lasttest'))
    const [minimap, setMinimap] = useState(get('mipmapopen'))

    const updateCode = (newCode) => {
        setCode(newCode)
    }
    const keyDown = (e) => {
        if (e.ctrlKey) {
            switch (e.key) {
                case 's':
                case 'S':
                    saveCode()
                    e.stopPropagation()
                    e.preventDefault()
                    break
                case 'r':
                case 'R':
                    testMethod()
                    e.stopPropagation()
                    e.preventDefault()
                    break

                default:
                    break

            }
        }

    }
    const saveCode = () => {
        let tmpApp = [...app]
        tmpApp[0].classCode = code
        window.dispatchEvent(window.codeChangeEvent)
        setApp(tmpApp)
    }
    const testMethod = () => {
        try {
            let inst = getCodeClass(code).instance
            inst[test]()
        } catch (e) {
            console.log(e)
        }
    }
   
    let methods = getCodeClass(code).methods
    return (
        <div onKeyDown={keyDown}
            style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Editor
                value={code}
                onChange={updateCode}
                theme='vs-dark'
                path={app[0].name}
                defaultLanguage='javascript'
                height={"100vh"}
                options={{ minimap: { enabled: minimap } }}
            />
            <div style={{ position: 'absolute', top: 0, right: 0 }} >
                <input type='checkbox' checked={minimap} onChange={(e) => set('mipmapopen', e.target.checked, setMinimap)} />
                <Select value={test} onChange={(e) => set('lasttest', e.target.value, setTest)} >
                    {methods.map(m => <MenuItem key={m} value={m} ><div style={{ color: 'blue' }}>{m}</div></MenuItem>)}
                </Select>
                <button onClick={testMethod} >Test</button>
                <button onClick={saveCode} >Save .</button>
            </div>
        </div>
    )
}

export default Functions
