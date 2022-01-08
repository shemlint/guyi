import React, { useState } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import { dataBasic, dataHtml } from '../Widgets'
import JoditEditor from 'jodit-react'

const dBasic = dataBasic.map(d => d.name)
const dHtml = dataHtml.map(d => d.name)
const get = global.store.get
const set = global.store.set

let usedFiles = []
const Upload = ({ setUpload }) => {
    const [mod, _setMod] = useState('')
    const [info, setInfo] = useState('')
    const [doc, setDoc] = useState(get('doc'))
    const [author, setAuthor] = useState('')
    const [secretKey, setSecretKey] = useState('')

    const disMes = (mes) => {
        setInfo(mes)
        setTimeout(() => setInfo(''), 6000)
    }
    const uploadModule = async () => {
        if (author.length < 4) {
            disMes('Author name too Short (4)')
            return
        }
        if (doc.length < 10) {
            disMes('Documentation too short (10)')
            return
        }
        if (secretKey.length < 5) {
            disMes('Secret key too short')
            return
        }
        if (info === 'Uploading') return
        disMes('Uploading')
        let module = global.modules[global.modules.map(m => m[0].name).indexOf(mod)]
        let depsMods = []
        let missing = []
        let allDeps = deps.concat(deepDeps)
        allDeps.forEach(d => {
            let mnames = global.modules.map(m => m[0].name)
            let rnames = global.remodules.map(m => m[0].name)
            if (mnames.includes(d)) {
                depsMods.push(global.modules[mnames.indexOf(d)])
            } else if (rnames.includes(d)) {
                depsMods.push(global.remodules[rnames.indexOf(d)])
            } else {
                missing.push(d)
            }

        })
        if (missing.length > 0) {
            setInfo(`Missing ${missing.length} components : \n${missing.join('\n')}`)
        }
        let resFiles = []
        usedFiles.forEach(f => {
            let fnames = global.files.map(f => f.name)
            let pos = fnames.indexOf(f)
            if (pos === -1) return
            let file = global.files[pos]
            resFiles.push(file)

        })

        let req = {
            do: 'upload',
            name: mod,
            creator: JSON.stringify({ creator: author, email: secretKey }),
            doc: doc,
            data: JSON.stringify(module),
            deps: JSON.stringify(depsMods),
            files: JSON.stringify(resFiles),
        }
        let size = JSON.stringify(req).length
        if (size > 5 * 1024 * 1024) {
            disMes("Module larger than 5mbs,Can't host on free servers")
            return
        }
        try {
            let res = await fetch(`${global.rootUrl}allguyi.php`, {
                method: 'POST',
                body: JSON.stringify(req),
            })
            res = await res.text()
            res = JSON.parse(res)
            if (res.exits && !res.deleted) {
                disMes('Component with that name exists, use same secret key to update.')
                return
            }
            if (res.status === 'ok') {
                if (missing.length > 0) {
                    setInfo('Uploaded Finished \n' + info)
                } else {
                    disMes('Upload Finished ')
                }

            } else {
                if (missing.length > 0) {
                    setInfo('Uploaded Error \n' + info)
                } else {
                    disMes('Upload Error ')
                }
            }
        } catch (e) {
            disMes('Upload failed ')
            console.log(e.message)
        }

    }
    const getDeepDeps = (comp) => {
        let deepDeps = getDeps(comp)
        deepDeps.forEach(d => {
            deepDeps.push(...getDeepDeps(d))
        })
        return deepDeps

    }
    const getDeps = (comp, compsOnly = false) => {
        let names = global.modules.map(m => m[0].name)
        let pos = names.indexOf(comp)
        let module = pos === -1 ? [] : global.modules[pos]
        if (!compsOnly) {
            if (pos === -1) {
                names = global.remodules.map(m => m[0].name)
                pos = names.indexOf(comp)
                if (pos !== -1) {
                    module = global.remodules[pos]
                }
            }
        }
        if (pos === -1) return []

        let deps = []
        let basicMods = [...dBasic, ...dHtml, 'Icon']
        module.forEach(c => {
            if (c.name !== comp && !basicMods.includes(c.name)) {
                deps.push(c.name)
            }
            if (c.name === 'MapList' && c.props && c.props.Template) {
                const template = c.props.Template
                if (!basicMods.includes(template) && names.includes(template)) {
                    deps.push(template)
                }
            }
        })
        return deps
    }
    const callGetDeepDeps = (gotDeps) => {
        let deepDeps = []
        gotDeps.forEach(c => {
            deepDeps.push(...getDeepDeps(c))
        })
        return deepDeps
    }
    let comps = global.modules.map(m => m[0].name)
    let deps = getDeps(mod, true).filter((val, index, data) => data.indexOf(val) === index)
    let deepDeps = callGetDeepDeps(deps).filter((val, i, a) => (!deps.includes(val)) && (a.indexOf(val) === i));
    const getUsedFiles = (moduleName) => {
        let loc_deps = getDeps(moduleName, true).filter((val, index, data) => data.indexOf(val) === index)
        let loc_deepDeps = callGetDeepDeps(loc_deps).filter(val => !deps.includes(val));
        let allDeps = loc_deps.concat(loc_deepDeps)
        allDeps.push(moduleName)
        let cnames = global.modules.map(m => m[0].name)
        let mnames = global.remodules.map(m => m[0].name)
        let used = []
        allDeps.forEach(d => {
            let pos = 0
            let module = []
            if ((pos = cnames.indexOf(d)) !== -1)
                module = global.modules[pos]
            else if ((pos = mnames.indexOf(d)) !== -1)
                module = global.remodules[pos]
            module.forEach(m => {
                let props = m.props || {}
                for (let p in props) {
                    let val = props[p]
                    if (typeof val === 'string' && val.startsWith('res://')) {
                        used.push(val.split('res://')[1])
                    }
                }
            })
        })
        return used

    }

    const setMod = (mod) => {
        usedFiles = getUsedFiles(mod)
        console.log(usedFiles, getUsedFiles().length)
        _setMod(mod)
    }
    const ManualFiles = () => {
        const [files, _setFiles] = useState(global.files.map(f => ({ ...f, selected: usedFiles.includes(f.name) })))
        const setFiles = (files) => {
            usedFiles = files.filter(f => f.selected).map(f => f.name)
            _setFiles(files)
        }
        const File = ({ ff, i }) => {
            let f = { ...ff }
            const toggleSelect = () => {
                let tmpFiles = [...files]
                tmpFiles[i].selected = !tmpFiles[i].selected
                setFiles(tmpFiles)
            }
            return (
                <div onClick={toggleSelect} style={{
                    maxWidth: 200, overflow: 'hidden',
                    borderBottom: '1px solid grey', padding: '0px 4px',
                    backgroundColor: !f.selected ? '' : i % 2 === 0 ? 'lavender' : 'khaki'
                }}>
                    <div><input type='checkbox' readOnly checked={f.selected} />{f.name}</div>
                    <div>
                        {f.type.includes('image') && <img src={f.url} style={{ width: 50, height: 50 }} alt={f.name} />}
                        {f.type.includes('video') && <video src={f.url} style={{ width: 80, height: 80 }} controls />}
                        {f.type.includes('text') && f.run &&
                            <div style={{ width: 80, height: 30, backgroundColor: 'lavenderblush' }}>Script File </div>}
                    </div>
                </div>
            )
        }
        return (
            <div style={{ maxHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 20, color: 'blueviolet', textAlign: 'center' }} >
                    {`Added ${files.filter(f => f.selected).length} of ${files.length} Files (${(files.filter(f => f.selected).map(f => f.size || 0)
                        .reduce((c, s) => c + s, 0) / (10240 * 1024)).toFixed(2)}Mbs)`}
                </div>
                <div style={{ height: 20 }} />
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} >
                    {files.map((ff, i) => <File key={ff.name} ff={ff} i={i} />)}
                </div>
                {files.length === 0 && <div>No Files in Project</div>}
            </div>
        )
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid blue' }}>
            <div style={{ position: 'absolute', right: 5, top: 5 }}>
                <button onClick={() => setUpload(false)}>Download</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: 10, fontSize: 24, color: 'purple' }}>Component</div>
                <Select value={mod} onChange={e => setMod(e.target.value)} >
                    {comps.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
            </div>
            <div>
                <div style={{ color: 'blue', borderBottom: '1px solid grey' }}>Dependencies</div>
                <ol>
                    {deps.map(d => <li key={d} style={{ textAlign: 'center' }} >{d}</li>)}
                </ol>
                {deps.length === 0 && <div style={{ textAlign: 'center' }} >None</div>}
                <div style={{ color: 'red', borderBottom: '1px solid grey' }}>Hidden Dependencies</div>
                <ol>
                    {deepDeps.map(d => <li key={d} style={{ textAlign: 'center' }} >{d}</li>)}
                </ol>
                {deepDeps.length === 0 && <div style={{ textAlign: 'center' }} >None</div>}
            </div>
            <ManualFiles />
            <div style={{ fontSize: 20, color: 'marron', paddingTop: 5 }}>Documentation for Component</div>
            <JoditEditor value={doc} onBlur={(v) => set('doc', v, setDoc)} />
            <TextField label='Author Name' color='primary' onChange={(e) => setAuthor(e.target.value)} value={author} />
            <TextField label='Secret Key (used to update module)' color='primary' onChange={(e) => setSecretKey(e.target.value)} value={secretKey} type="password" />
            <div style={{ margin: 5, color: 'purple', }}>{info}</div>
            <button onClick={uploadModule} >Upload Module</button>
            <p>Please keep copies of your modules locally, Guyi host on free servers and may loose data</p>
        </div>
    )
}
export default Upload


