import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import { AiFillStar } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { FaDownload } from 'react-icons/fa'
import { Resizable } from 're-resizable'
import Scrollbars from 'react-custom-scrollbars'
import Upload from './subcomp/ExModUpload'

import Comp from './Comp'

const FileModules = ({ close }) => {
    const [info, setInfo] = useState('')
    const update = useState(0)[1]
    const disMes = (mes) => {
        setInfo(mes)
        setTimeout(() => setInfo(''), 3000)
    }
    const [modules, setModules] = useState([])
    const FMod = ({ mod, disMes }) => {
        let name = mod[0].name
        const saveMod = () => {
            let names = global.modules.map(m => m[0].name)
            if (names.includes(name)) {
                disMes(`Component ${name} exists!`)
                return
            }
            global.modules.push(mod)
            //update(Math.random())
            disMes(`Added ${name}`)

        }
        const saveReMod = () => {
            let names = global.remodules.map(m => m[0].name)
            if (names.includes(name)) {
                disMes(`Module ${name} exists!`)
                return
            }
            let tmpMod = [...mod]
            tmpMod[0].type = 'main'
            global.remodules.push(tmpMod)
            // update(Math.random())
            disMes(`Added ${name}`)
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 5, borderTop: '1px solid lavender' }}>
                <p style={{ color: 'Red', fontSize: 20, margin: 0 }}> {name}</p>
                <div style={{ display: 'flex' }}>
                    <div onClick={saveMod} >Comp<FaDownload size={20} color='purple' /></div>
                    <div onClick={saveReMod} >Mod<FaDownload size={20} color='blue' /></div>
                </div>
            </div>
        )
    }
    const fileChanged = async (e) => {
        let files = e.target.files
        if (files[0]) {
            try {
                let data = await files[0].text()
                data = JSON.parse(data)
                if (Array.isArray(data.modules)) {
                    let allArrays = true
                    data.modules.forEach(mod => {
                        if (!allArrays) return
                        if (!Array.isArray(mod)) {
                            allArrays = false
                        }
                    })
                    if (allArrays) {
                        setModules(data.modules)
                        update(Math.random())
                    } else {
                        disMes('Wrong data format')
                    }
                } else {
                    disMes('No modules In The file')
                }
            } catch (e) {
                disMes('Data corrupted', e)
            }
        }
    }
    return (
        <div>
            <input type='file' onChange={(e) => fileChanged(e)} />
            {modules.map(m => <FMod mod={m} disMes={disMes} />)}
            <div>{info}</div>
            <button onClick={close}>Close</button>
        </div>
    )
}

const Header = ({ setUpload, search, setApp, app }) => {
    const [text, setText] = useState('')
    const [openFile, setOpenFile] = useState(false)
    const closeFile = () => {
        setApp([...app])
        setOpenFile(false)
    }
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }} >
            <TextField
                label='Search'
                value={text} onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        search(text)
                    }
                }}
            />
            <div onClick={() => search(text)}>
                <BiSearch size={20} color='blue' />
            </div>
            <button onClick={() => setOpenFile(true)} style={{ marginLeft: 7, marginRight: 7 }} >Import From File</button>
            <div style={{ position: 'relative' }}><Menu open={openFile} onClose={closeFile} ><FileModules close={closeFile} /></Menu></div>
            <button style={{ position: 'absolute', top: 3, right: 5 }} onClick={() => setUpload(true)} >Upload</button>
        </div>
    )
}
const ExModules = ({ app, setApp }) => {
    const [data, rawSetData] = useState(global.searchResult)
    const [upload, rawsetUpload] = useState((global.isUpload === undefined) ? false : global.isUpload)
    const [info, setInfo] = useState('')
    let loading = false
    const setUpload = (val) => {
        rawsetUpload(val)
        global.isUpload = val
    }
    const setData = (newData) => {
        rawSetData(newData)
        global.searchResult = newData
    }
    const ModuleItem = ({ item, index }) => {
        const [info, setInfo] = useState('')
        const disMes = (mes) => {
            setInfo(mes)
            setTimeout(() => setInfo(''), 6000)
        }
        try {
            let crtEmail = JSON.parse(item.creator)
            item.creator = crtEmail.creator
        } catch (e) {
            //console.log('Item from old version,update!!')

        }

        let tree = Array.isArray(item.tree) ? item.tree : false
        let preview = <div>No Preview</div>
        try {
            if (tree) {
                let files = Array.isArray(item.files) ? item.files : []
                global.runScripts(files)
                preview = <Comp tree={tree} id={tree[1].id} prev={{ deps: item.deps, files }} />
            }
        } catch (e) { console.log('tree error ', item) }
        let deps = <p>None</p>
        if (Array.isArray(item.deps) && item.deps.length > 0) {
            deps = <ol>
                {item.deps.map(d => <li>{d[0].name}</li>)}
            </ol>
        }
        let files = <p>None</p>
        if (Array.isArray(item.files) && item.files.length > 0) {
            files = <ol>
                {item.files.map(f => <li>{`size:${Math.floor(f.size / 1024)} Kbs, ${f.name} `}</li>)}
            </ol>
        }

        const like = () => {
            disMes('Like comming soon ✌')
        }
        const download = async (asModule) => {
            setInfo('downloading')
            const save = (module) => {
                if (asModule) {
                    saveReMod(module)
                } else {
                    saveMod(module)
                }
            }
            let id = item.id
            if (Array.isArray(item.tree) && Array.isArray(item.deps)) {
                disMes('Saving from Cache')
                save({ data: item.tree, deps: item.deps, files: item.files })
                return
            }
            try {
                let res = await fetch(`${global.rootUrl}allguyi.php`, {
                    method: 'POST',
                    body: JSON.stringify({ id, do: 'download' })
                })
                res = await res.text()
                res = JSON.parse(res)
                let module = res.data
                if (res.status === 'ok' && module.length === 1) {
                    try {
                        module = module[0]
                        module.data = JSON.parse(module.data)
                        module.deps = JSON.parse(module.deps)
                        module.files = JSON.parse(module.files)
                        if (module.data.length >= 2) {
                            disMes('Download finished')
                            save(module)
                        } else {
                            disMes('Module incomplete')
                        }
                    } catch (e) {
                        disMes('Module Format error');
                         console.log(e.message)
                    }
                } else {
                    disMes('download failed')
                }

            } catch (e) {
                disMes('Error')
                console.log(e.message)
            }

        }
        const saveMod = (mod) => {
            let names = global.modules.map(m => m[0].name)
            if (names.includes(mod.data[0].name)) {
                disMes(`Comp ${mod.data[0].name} exists`)
                return
            }
            let deps = mod.deps
            if (!Array.isArray(deps)) deps = []
            let depNames = deps.map(d => d[0].name).concat([mod.data[0].name])
            let clash = []
            let modNames = global.modules.map(m => m[0].name).concat(global.remodules.map(m => m[0].name))
            modNames.forEach(n => {
                if (depNames.includes(n)) {
                    clash.push(n)
                }
            })
            if (clash.length > 0) {
                disMes(`Dependency name clash "${clash.join('" , "')}" exists in App Tree`)
                return
            }
            let fnames = global.files.map(f => f.name)
            let fclash = []
            mod.files.forEach(f => {
                if (fnames.includes(f.name)) {
                    fclash.push(f.name)
                }
            })
            if (fclash.length > 0) {
                disMes(`Resource name clash "${fclash.join('" , "')}" `)
                return
            }
            let files = JSON.parse(JSON.stringify(mod.files))
            files.forEach(f => {
                f.by = `module,${mod.data[0].name}`
                global.files.push(f)
            })


            global.modules.push(JSON.parse(JSON.stringify(mod.data)))
            deps.forEach(d => {
                let tmpD = JSON.parse(JSON.stringify(d))
                tmpD.type = mod.data[0].name
                global.modules.push(tmpD)
            })

            setApp([...app])
        }
        const saveReMod = (mod) => {
            let names = global.remodules.map(m => m[0].name)
            if (names.includes(mod.data[0].name)) {
                disMes(`Module ${mod.data[0].name} exists`)
                return
            }
            let deps = mod.deps
            if (!Array.isArray(deps)) deps = []
            let depNames = deps.map(d => d[0].name).concat([mod.data[0].name])
            let clash = []
            let modNames = global.modules.map(m => m[0].name).concat(global.remodules.map(m => m[0].name))
            modNames.forEach(n => {
                if (depNames.includes(n)) {
                    clash.push(n)
                }
            })
            if (clash.length > 0) {
                disMes(`Dependency name clash ${' "' + clash.join('" , "') + '" '} exists in App Tree`)
                return
            }
            let fnames = global.files.map(f => f.name)
            let fclash = []
            mod.files.forEach(f => {
                if (fnames.includes(f.name)) {
                    fclash.push(f.name)
                }
            })
            if (fclash.length > 0) {
                disMes(`Resource name clash "${fclash.join('" , "')}" exists in App tree`)
                return
            }
            let files = JSON.parse(JSON.stringify(mod.files))
            files.forEach(f => {
                f.by = `module,${mod.data[0].name}`
                global.files.push(f)
            })


            let tmpMod = [...mod.data]
            tmpMod[0].type = 'main'
            global.remodules.push(JSON.parse(JSON.stringify(tmpMod)))
            deps.forEach(d => {
                let tmpD = JSON.parse(JSON.stringify(d))
                tmpD[0].type = mod.data[0].name
                global.remodules.push(tmpD)
            })
            console.log('mod', mod)
            disMes('Added module')
            setApp([...app])
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '5px solid grey', marginTop: 5 }}>
                <Resizable style={{ border: '1px solid red' }} defaultSize={{ width: '100%', height: 200 }}>
                    <Scrollbars style={{
                        display: 'flex', minHeight: 80, padding: 4
                    }}>
                        <div style={{ display: 'flex' }}>
                            <Resizable style={{ border: '1px solid green', }} defaultSize={{ width: '50%', height: 150 }} >
                                <Scrollbars style={{ display: 'flex', flexDirection: 'column', margin: 4 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'lavender' }} >
                                        <div>{item.name}</div>
                                        <div>{item.creator}</div>
                                    </div>
                                    <div style={{ width: '100%', flex: 1 }} dangerouslySetInnerHTML={{ __html: item.doc }} />
                                </Scrollbars>
                            </Resizable>
                            <Resizable style={{ border: '1px solid grey', margin: 4 }} defaultSize={{ width: '50%', height: 150 }} >
                                <Scrollbars style={{ width: '100%', height: '100%' }}>
                                    {preview}
                                </Scrollbars>
                            </Resizable>
                        </div>
                    </Scrollbars>
                </Resizable>
                <div style={{ borderTop: '0px solid red' }}>
                    <div style={{ width: '100%', textAlign: 'center', color: 'blue' }}>Dependencies</div>
                    <div>{deps}</div>
                </div>
                <div style={{ borderTop: '1px solid red' }}>
                    <div style={{ width: '100%', textAlign: 'center', color: 'blue' }}>Resources</div>
                    <div>{files}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
                    <div style={{ display: 'flex', alignItems: 'center', margin: 20 }} onClick={like} >
                        <div style={{ marginRight: 5 }}>589</div>
                        <AiFillStar size={20} color='blue' />
                    </div>
                        <div style={{ display: 'flex', alignItems: 'center', margin: 20 }} onClick={() => download(false)} >Comp<FaDownload size={20} color='purple' /></div>
                       <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => download(true)} >Mod<FaDownload size={20} color='blue' /></div>
                    </div>
                <div style={{ display: 'flex', justifyContent: 'center', minHeight: 16 }}>{info}</div>
            </div>
        )
    }

    const search = async (text) => {
        loading = true
        if (text.length < 3) {
            setInfo('Query too Short')
            return
        }
        setInfo(`Searching : ${text}`)
        try {
            let res = await fetch(`${global.rootUrl}allguyi.php`, {
                method: 'POST',
                body: JSON.stringify({ query: text, do: 'search' })
            })
            res = await res.text()
            res = JSON.parse(res)
            if (res.status === 'ok') {
                loading = false
                setData(res.data)
                getPreviews(res.data, 0)
                setInfo(`Results for "${text}" `)

            } else {
                setInfo('Search Error')
            }

        } catch (e) {
            console.log('net error', e.messsage)
            setInfo('Net Error ')
        }
        loading = false
    }
    const getPreviews = async (data, pos) => {
        if (loading) return
        if (data.length > pos) {
            try {
                let res = await fetch(`${global.rootUrl}allguyi.php`, {
                    method: 'POST',
                    body: JSON.stringify({ id: data[pos].id, do: 'download' })
                })
                res = await res.text()
                res = JSON.parse(res)
                let data1 = res.data[0]
                if (res.status === 'ok' && data1) {
                    let tmpData = [...data]
                    tmpData[pos].tree = JSON.parse(data1.data)
                    let deps = JSON.parse(data1.deps)
                    if (!Array.isArray(deps)) deps = []
                    tmpData[pos].deps = deps
                    let files = JSON.parse(data1.files)
                    if (!Array.isArray(files)) files = []
                    console.log(files)
                    tmpData[pos].files = files
                    setData(tmpData)
                }

            } catch (e) { console.log('preview error ', e.message) }
            finally { getPreviews(data, pos + 1) }
        }
    }
    if (upload) {
        return <Upload setUpload={setUpload} />
    }

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <Header setUpload={setUpload} search={search} setApp={setApp} app={app} />
            <div style={{ display: 'flex', justifyContent: 'center', }} >
                <h3 style={{ color: 'blue' }}>{info}</h3>
            </div>
            {data.map((d, index) => <ModuleItem item={d} index={index} />)}
            {data.length === 0 &&
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>No Results </div>
                    <div>Search using Module name or Author Name</div>
                </div>}
        </div>
    )
}
export default ExModules
