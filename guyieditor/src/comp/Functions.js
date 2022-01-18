import React, { useState } from 'react'
import Editor, { loader, useMonaco } from '@monaco-editor/react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { getCodeClass } from './util/data'
//import reactTypes from './react.d.ts'

loader.config({
    paths: {
        vs: '/vs'
    }
})

const set = global.store.set
const get = global.store.get
window.codeChangeEvent = new Event('codechange')
const Functions = ({ app, setApp }) => {
    const [code, setCode] = useState(app[0].classCode || '')
    const [test, setTest] = useState(get('lasttest'))
    const [minimap, setMinimap] = useState(get('mipmapopen'))
    const monaco = useMonaco()
    const models = global.monacoModels
    React.useEffect(() => {
        if (monaco) {
            // console.log(monaco,monaco.create())

        }
    }, [monaco])
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
        saveModel()

    }
    const saveModel = () => {
        try {
            if (editorRef.current) {
                const viewState = editorRef.current.saveViewState()
                models[app[0].name].viewState = viewState
            }
        } catch (e) {//TODO error to be worked on 
            //   console.log('save error',e)
        }
    }
    const testMethod = () => {
        try {
            let inst = getCodeClass(code).instance
            inst[test]()
        } catch (e) {
            console.log(e)
        }
    }
    const handeleMount = (editor, monaco) => {
        try {
            const appName = app[0].name
            editorRef.current = editor
            if (!models[appName]) {
                try {
                    const modNames = monaco.editor.getModels().map(m => ({ path: m?._associatedResource?.path, model: m }))
                    const paths = modNames.map(m => m.path)
                    const modPos = paths.indexOf(`/${appName}`)

                    if (modPos !== -1 && !models[appName]) {
                        if (Object.keys(models).length === 0) {
                            modNames[modPos].model.dispose()
                            const model = monaco.editor.createModel(app[0].classCode, 'javascript', new monaco.Uri().with({ path: appName }))
                            models[appName] = { model }
                            console.log('here')
                        } else {
                            models[appName] = { model: modNames[modPos].model }
                        }
                    } else {
                        const model = monaco.editor.createModel(app[0].classCode, 'javascript', new monaco.Uri().with({ path: appName }))
                        models[appName] = { model }
                    }
                } catch (e) {//TODO model exists
                    console.log('model create', e)
                }
            }
            const { model, viewState } = models[appName]
            try {
                editor.setModel(model)
            } catch (e) {//TODO model exists
                // console.log('editoy model', e)
            }
            if (viewState) editor.restoreViewState(viewState)
        } catch (e) {//TODO error to be worked on
            //console.log('mount error', e)
        }
    }
    const editorRef = React.useRef(null)
    const contRef = React.useRef(null)
    let methods = getCodeClass(code).methods
    return (
        <div onKeyDown={keyDown} ref={contRef}
            style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Editor
                // value={code}
                onChange={updateCode}
                theme='vs-dark'
                // path={app[0].name}
                defaultLanguage='javascript'
                height={"100vh"}
                options={{ minimap: { enabled: minimap } }}
                onMount={handeleMount}
                keepCurrentModel={true}
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
