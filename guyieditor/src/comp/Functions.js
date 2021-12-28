import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { getCodeClass } from './util/data'
const set = global.store.set
const get = global.store.get
window.codeChangeEvent=new Event('codechange')
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
            let inst = getCodeClass(code, []).instance
            inst[test]()
        } catch (e) {
            console.log(e)
        }
    }
    let methods = getCodeClass(code, []).methods
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
                options={{minimap:{enabled:minimap}}}
            />
            <div style={{ position: 'absolute', top: 0, right: 0 }} >
                <input type='checkbox' checked={minimap} onChange={(e) => set('mipmapopen', e.target.checked, setMinimap)} />
                <Select value={test} onChange={(e) => set('lasttest', e.target.value, setTest)} >
                    {methods.map(m => <MenuItem value={m} ><div style={{ color: 'blue' }}>{m}</div></MenuItem>)}
                </Select>
                <button onClick={testMethod} >Test</button>
                <button onClick={saveCode} >Save .</button>
            </div>
        </div>
    )
}

export default Functions

//eslint-disable-next-line
const defCode = `
let old
class main{
    constructor({ state, ms,setState }) {
        this.state = state
        this.ms = ms
        this.ss=setState
        console.log('constructed')
    }
    load() {
        return 'working'
    }
    init() {
        console.log('Initialized')
    }
    helper(a, b) {
        return { a, b }
    }
    draw(c) {
        console.log('drawiingi')
        console.log(old===this.state)
        old=this.state
        this.ss({no:Math.random()})
    }
    getState(){
        console.log(this.state)
    }
    setState(){
        let no=Math.random()
        console.log(no,this.ss)
        this.ss({no})

    }

}
`



