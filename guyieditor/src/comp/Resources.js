import React, { useState } from 'react'
import { MdDelete, MdSave } from 'react-icons/md'
import { BiSearch } from 'react-icons/bi'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import EnterInput from './util/EnterInput'


export const Preview = ({file, disMes=()=>{},size=100 }) => {
    let {type,url,name}=file
    const [data, setData] = useState({ run: file.run === undefined ? false : file.run })
    if (type.startsWith('image')) {
        return (
            <img src={url} alt={name} style={{ width: size, height: size, marginRight: 5, border: '2px solid blue' }} />
        )
    } else if (type.startsWith('video')) {
        return (
            <video src={url} style={{ width: size+50, height: size+50}} duration={1000} controls />
        )
    } else if (type.includes('javascript')) {
        const updateRun = (e) => {
            let val = e.target.checked
            file.run = val
            setData({ ...data, run: val })
            if (val) {
                try {
                    //eslint-disable-next-line
                    eval(file.url)
                    disMes(`1st Run ${name} done.\nScript Will run on project loads too!`)
                } catch (e) {
                    disMes(`${name} error ${e.message}`)

                }
            } else {
                disMes(`Library ${name} disabled. Won't load on next project open`)
            }

        }
        return (
            <code style={{ width: size+20, padding: 5, borderLeft: '5px solid lavender', diplay: 'flex', flexDirection: 'columns' }}>
                <div>Script</div>
                <div style={{ backgroundColor: 'lavender', color: '' }}>
                    Enable script ? <input type='checkbox' checked={data.run} onChange={updateRun} readOnly />
                </div>
            </code>
        )
    } else if (type.includes('css')) {
        const updateRun = (e) => {
            let val = e.target.checked
            file.run = val
            setData({ ...data, run: val })
            if (val) {
                try {
                    //eslint-disable-next-line
                    let css = file.url, head = document.head, style = document.createElement('style')
                    head.appendChild(style)
                    style.type = 'text/css'
                    style.id = 'css-' + file.name
                    if (style.styleSheet) {//IE 8&<
                        style.stylesheet.cssText = css
                    } else {
                        style.appendChild(document.createTextNode(css))
                    }
                    disMes(`1st Run ${name} done.\nCss Will inject on project loads too!`)
                } catch (e) {
                    disMes(`${name} error ${e.message}`)
                }
            } else {
                let styles = [...document.head.children]
                styles.forEach(s => {
                    if (s instanceof HTMLStyleElement) {
                        if (s.id === ('css-' + file.name)) {
                            //document.head.remove(s) //removing css causes layout issues
                        }
                    }
                })
                disMes(`Css ${name} disabled. Won't load on next project open`)
            }
        }
        return (
            <code style={{ width: size+20, padding: 5, borderLeft: '5px solid lavender', diplay: 'flex', flexDirection: 'columns' }}>
                <div>Css</div>
                <div style={{ backgroundColor: 'lavender', color: '' }}>
                    Enable css ? <input type='checkbox' checked={data.run} onChange={updateRun} readOnly />
                </div>
            </code>
        )
    }
    else {
        return (
            <div style={{ width: size ,height: size, marginRight: 5, border: '2px solid blue', textAlign: 'center' }}>
                No Preview</div>
        )
    }
}
const Resources = () => {
    const [all, setAll] = useState(false)
    const [useSmall, setUseSmall] = useState(false)
    const [search, rawsetSearch] = useState(global.resTab === 'view' ? false : true)
    const setSearch = (open) => {
        rawsetSearch(open)
        global.resTab = open ? 'download' : 'view'
    }
    let allfiles = global.files
    const update = useState(1)[1]
    if (!all) {
        allfiles = allfiles.filter(f => {
            if (f.by) {
                return !f.by.startsWith('module')
            } else {
                return true
            }
        })
    }
    const FileRow = ({ file = {}, index }) => {
        const [info, setInfo] = useState('')
        const [name, setName] = useState(file.name)
        const isDup = () => {
            let fnames = global.files.map(f => f.name)
            return fnames.lastIndexOf(file.name) !== fnames.indexOf(file.name)
        }
        const disMes = (mes) => {
            setInfo(mes)
            setTimeout(() => setInfo(''), 5000)
        }
        const remove = () => {
            global.files = global.files.filter(f => f.name !== file.name)
            update(Math.random())
        }
        const changeName = (e) => {
            if (name.length < 3) {
                disMes('Name too Short')
                setName(file.name)
                return
            }
            let rnames = global.files.map(f => f.name)
            if (rnames.includes(name)) {
                disMes('Name Taken by resource')
                setName(file.name)
                return
            }
            file.name = name
            disMes('Name changed')
            //update(Math.random)
        }
        const dragger = (<div onDragOver={(e) => e.preventDefault()} draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('text', file.name)
            }}
            style={{border:'2px solid blue', borderRadius: 4,display:'inline-block' }}
        >Drag Here</div>)
        return (
            <div onDrop={(e) => { e.stopPropagation(); dropped(e, true, index) }}
                style={{ display: 'flex', justifyContent: 'space-between', border: '2px solid brown', position: 'relative' }} >
                {useSmall && <div>{name + '\tSz-' + Math.ceil(file.size / 1024) + 'Kb'}{dragger}</div>}
                {!useSmall && [<div key='input' draggable={false} style={{ backgroundColor: isDup() ? 'lavender' : '' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}  >
                        Name : <EnterInput value={name} onChange={(e) => setName(e.target.value)}
                            onEnter={changeName} />
                        <div onClick={changeName} ><MdSave color='blue' size={20} /></div>
                        {dragger}
                    </div>
                    <div>Type : {file.type}</div>
                    <div>Size : {Math.ceil(file.size / 1024)}KB</div>
                    <div>By : {file.by}</div>
                    <div style={{ color: 'red', fontStyle: 'italic' }} >{info}</div>
                </div>,
                <Preview key='prev' file={file} disMes={disMes} />
                ]}
                <div style={{ position: 'absolute', top: 5, right: 5 }} onClick={remove} >
                    <MdDelete size={20} color='red' />
                </div>
            </div>
        )
    }

    const rearange = (e, index) => {
        let files = global.files
        let data = e.dataTransfer.getData('text')
        e.preventDefault()
        let names = files.map(m => m.name)
        if (data && names.includes(data)) {
            let pos = names.indexOf(data)
            if (pos !== index) {
                let start = pos
                let go = index
                if (start < go) {
                    files.splice(go + 1, 0, files[start])
                    files.splice(start, 1)
                } else if (start > go) {
                    files.splice(go, 0, files[start])
                    files.splice(start + 1, 1)
                }
                update(Math.random() + Math.random())
            }
        }

    }
    const readDataUrl = (file) => {
        return new Promise((res, rej) => {
            let reader = new FileReader()
            reader.onload = () => res(reader.result)
            reader.onerror = rej
            reader.readAsDataURL(file)

        })
    }
    const dropped = async (e, drop = true, index = -1) => {
        let files = [];
        if (drop) {
            let data = e.dataTransfer
            e.preventDefault()
            files = data.files
        } else {
            files = e.target.files;
        }
        if (files.length === 0) {
            rearange(e, index)
        }
        for (let i = 0; i < files.length; i++) {
            let f = files[i]
            try {
                let urlText = ''
                if (f.type.startsWith('text') || f.type.endsWith('json')) {
                    urlText = await f.text()
                } else {
                    urlText = await readDataUrl(f)
                }
                let file = { name: f.name, size: f.size, type: f.type, url: urlText, by: 'user' }
                if (index === -1) {
                    global.files.unshift(file)
                } else {
                    global.files.splice(index, 0, file)
                }
                update(Math.random())
            } catch (e) {
                console.log('Reading file failed ', f)
            }
        }

    }
    const getStats = () => {
        let size = 0
        allfiles.forEach(f => size += f.size)
        size = size / 1024
        if (size >= 1000) {
            size = size / 1024
            size = `${Math.floor(size)} Mbs `
        } else {
            size = `${Math.floor(size)} Kbs `
        }
        let stats = `Total of ${allfiles.length} files, Size ${size} `
        return stats
    }
    if (search) {
        return <Search close={() => setSearch(false)} />
    }
    return (
        <div onDragOver={(e) => { e.preventDefault(); }} onDrop={dropped}
            style={{ position: 'relative', width: '100%', minHeight: '100vh', border: '1px solid black' }}
        >
            <div>
                <button style={{ position: 'absolute', top: 3, right: 5 }} onClick={() => setSearch(true)} >Download New</button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    <div> Drop or Select to add Files</div>
                    <input type='file' multiple onChange={(e) => dropped(e, false)} />
                    <div>
                        <button onClick={() => setAll(!all)} >{all ? "Show Only for this" : "Show All"}</button>
                        <button onClick={() => setUseSmall(!useSmall)} >{useSmall ? "Large Icons" : "Small Icons"}</button>
                    </div>
                    <div>{getStats()}</div>
                </div>
                {allfiles.map((f, i) => <FileRow key={f.name} dropped={dropped} file={f} update={update} index={i} />)}
            </div>
        </div>

    )
}

export default Resources

const ResultRow = ({ index, res, select }) => {
    let name = res.url.split('photo/')[1]
    name = name.substring(0, name.lastIndexOf('-')).replaceAll('-', ' ')
    return (
        <div
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: 200, cursor: 'pointer', backgroundColor: res.selected ? res['avg_color'] : '', margin: 2
            }}
            onClick={select}
        >

            <Tooltip
                title={<div style={{ fontSize: 16, color: 'red', fontWeight: 'bold', backgroundColor: 'white' }}>
                    {name}
                </div>}
            >
                <img src={res.src.medium} alt={name}
                    style={{ width: '100%', height: 200, objectFit: 'contain' }}
                />
            </Tooltip>
            <a href={res.url} target="blank" ><div>{'By : ' + res.photographer}</div></a>
        </div>
    )
}


const PAFetch = (url, query) => {
    const key = "563492ad6f917000010000014f23981846f94cd482eeb40800d4d813"
    return new Promise((res, rej) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': key
            },
        }).then(d => d.text())
            .then(d => res(d))
            .catch(rej)
    })
}
const PGFetch = (url) => {
    return new Promise((res, rej) => {
        fetch(url)
            .then(d => d.blob())
            .then(d => {
                let reader = new FileReader()
                reader.onload = () => res({ size: d.size, type: d.type, url: reader.result })
                reader.onerror = rej
                reader.readAsDataURL(d)
            })
            .catch(rej)
    })
}

const Search = ({ close }) => {
    const [data, rawsetData] = useState(global.fresult.data)
    const [meta, rawsetMeta] = useState(global.fresult.meta)
    const [text, setText] = useState('')
    const [info, setInfo] = useState('')
    const [size, setSize] = useState('medium')

    const setData = (newData) => {
        rawsetData(newData)
        global.fresult.data = newData
    }
    const setMeta = (newMeta) => {
        rawsetMeta(newMeta)
        global.fresult.meta = newMeta
    }

    const getPage = async (page) => {
        setInfo(`Searching : "${text}"`)
        let url = new URL('https://api.pexels.com/v1/search')
        url.search = new URLSearchParams({
            query: text,
            'per_page': 30,
        })
        try {
            if (page) {
                if (page === 'next')
                    url = meta['next_page']
                else if (page === 'prev')
                    url = meta['prev_page']
            }
            let res = await PAFetch(url)  //page=3\u0026per_page=15\u0026&&')
            res = JSON.parse(res)
            if (Array.isArray(res.photos)) {
                setData(res.photos)
                setMeta({ ...res, photos: [] })
                setInfo(`Results for "${text}"`)
            }
        } catch (e) {
            console.log(e.message)
            setInfo('Net Error')
        }
    }
    const select = (index) => {
        let tmpData = [...data]
        if (tmpData[index].selected === undefined) tmpData[index].selected = false
        tmpData[index].selected = !tmpData[index].selected
        setData(tmpData)
    }
    const saveAll = async (setInfo) => {
        let selPics = data.filter(d => d.selected)
        let fnames = global.files.map(f => f.name)
        let addedFiles = []
        let skippedFiles = []
        for (let p in selPics) {
            let pic = selPics[p]
            let name = pic.url.split('photo/')[1]
            name = name.substring(0, name.lastIndexOf('-'))
            try {
                if (fnames.includes(name)) {
                    skippedFiles.push(name)
                    setInfo(`Skipped ${p + 1} : ${name}`)
                    continue
                }
                let file = await PGFetch(pic.src[size])
                file.name = name
                file.by = 'pexels'
                global.files.unshift(file)
                setInfo(`Added ${p + 1} : ${name}`)
                addedFiles.push(name)

            } catch (e) {
                setInfo(`Skipped ${p + 1} : ${name}`)

            }
        }
        let skipped = <div><div>Skipped</div><ol>{skippedFiles.map(f => <li key={f} >{f}</li>)}</ol></div>
        let added = <div><div>Added</div><ol>{addedFiles.map(f => <li key={f} >{f}</li>)}</ol></div>
        let info = <div>{added}{skipped}</div>
        setInfo(info)

    }

    let nextPrev = (
        <div style={{ display: 'flex' }}>
            <button disabled={!meta['prev_page']} style={{ marginRight: 8 }} onClick={() => getPage('prev')} >Previous</button>
            {meta.page && <div style={{ marginRight: 8 }} >{`  ${meta.page}/${Math.ceil(meta['total_results'] / 30)} `}</div>}
            <button disabled={!meta['next_page']} onClick={() => getPage('next')} >Next</button>
        </div>
    )
    const SaveRow = () => {
        let no = 0
        data.forEach(d => {
            if (d.selected) no += 1
        })
        const [info, setInfo] = useState('')
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <div>{`${no} Selected Photos`}</div>
                <div style={{ display: 'flex' }}>
                    <div>Size : </div>
                    <Select value={size} onChange={(e) => setSize(e.target.value)} >
                        {[{ s: 'Original', m: 'Original size' }, { s: 'large', m: 'large H:950 x W:650' }, { s: 'medium', m: 'Medium H:350 X W:Orig' }, { s: 'small', m: 'small H:130 X W:Orig' },
                        { s: 'portrait', m: 'portrait H:1200 X W:800' }, { s: 'landscape', m: 'landscape H:627 X W:1200' }, { s: 'tiny', m: 'Tiny H:200 X W:280' }]
                            .map(d => <MenuItem value={d.s}>{d.m}</MenuItem>)}
                    </Select>
                </div>
                <button onClick={() => saveAll(setInfo)} > Save Selected Photos </button>
                <div>{info}</div>
            </div >
        )
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <button onClick={close} style={{ position: 'absolute', top: 3, right: 5 }} >View Resources</button>
            <div dangerouslySetInnerHTML={{ __html: '<a href="https://www.pexels.com" target="blank" style="color:blue" ><h2>Photos Provided by Pexel</h2></a>' }} />
            <div>Select Photos Then press download select Photos button Below</div>
            <div style={{ display: 'flex' }} >
                <TextField label='Search query' value={text} onChange={(e) => setText(e.target.value)} onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        getPage()
                    }
                }} />
                <div onClick={getPage} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <BiSearch color='blue' size={20} />
                </div>
            </div>
            <div>{info}</div>
            {data.length > 0 && nextPrev}
            {data.length > 0 && <SaveRow />}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', flex: 1, marginBottom: 40 }}>
                {data.map((d, index) => <ResultRow res={d} select={() => select(index)} />)}
            </div>
            {data.length > 0 && nextPrev}
            {data.length > 0 && <SaveRow />}
            {data.length === 0 && <div>Enter a search query and press search to get Results from PEXEL</div>}
        </div>
    )
}
