import React, { useState } from 'react'
import TreeView from './util/TreeView'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import {
 MdDashboard, MdInsertEmoticon, MdDeleteForever,
} from 'react-icons/md'

import {dataBasic,dataHtml} from './Widgets'

global.copiedTrees = []

const size = 18, color = 'red';

const alltypes = [...dataBasic, ...dataHtml]
const iconObject = {}
alltypes.forEach(t => {
    iconObject[t.name] = React.cloneElement(t.icon,{size,color})
})

const getOutlineData = (id, tree, used) => {
    id = id.includes(',') ? id.split(',')[1] : id
    let node = { label: `${id}(failed)`, nodes: [], item: tree[1] }
    let ids = tree.map(val => val.id);
    let item = tree[ids.indexOf(id)]
    if (item) {
        let props = item.props;
        node.label = item.id;
        node.item = item;
        node.icon = iconObject[item.name] || (item.extras ? <MdInsertEmoticon size={size} color={color} /> :
            <MdDashboard size={size} color={color} />)
        used.push(item.id)
        for (let p in props) {
            if (Array.isArray(props[p]) && props[p].length > 0 && typeof props[p][0] === 'string') {
                props[p].forEach(val => {
                    node.nodes.push(getOutlineData(val, tree, used))
                })
            }
        }
    }
    return node;

}
const getExt = (tree, used) => {
    let unused = tree.filter((c, ind) => ind !== 0 && !used.includes(c.id))
    let roots = unused.map(c => c.id)
    let consumed = []
    let treeviews = []
    unused.forEach(c => {
        let start = consumed.length
        if (consumed.includes(c)) {
            return
        }
        let tv = getOutlineData(c.id, tree, consumed)
        treeviews.push({ id: c.id, tree: tv })
        consumed.splice(start, 1)

    })
    roots = roots.filter(r => !consumed.includes(r))
    treeviews = treeviews.filter(t => roots.includes(t.id))
    return treeviews.map(t => t.tree)
}
const getIds = (node, tree = []) => {
    let ids = []

    if (node.item) {
        ids.push(node.item.id)
        tree.push(node.item)
        if (Array.isArray(node.nodes)) {
            node.nodes.forEach(n => {
                ids.push(...getIds(n, tree))
            })
        }
    }
    return ids
}

const Outline = ({ id, tree, onClick, style, selected, setApp }) => {
    const [info, setInfo] = useState('')
    const [copyId, setCopyId] = useState(null)
    const disMes = (mes) => {
        setInfo(mes)
        setTimeout(() => setInfo(''), 5000)
    }
    let used = []
    let data = [getOutlineData(id, tree, used)]
    let extData = getExt(tree, used)
    const deleteComp = (node) => {
        let used = []
        getOutlineData(node.item.id, tree, used)
        let tmpApp = [...tree]
        tmpApp = tmpApp.filter((c, ind) => ind === 0 || !used.includes(c.id))
        setApp(tmpApp)

    }
    const copyTree = (node, path) => {
        let ctree = []
        let ids = getIds(node, ctree)
        try {
            ctree = JSON.parse(JSON.stringify(ctree))
        } catch (e) {
            console.log('Copy failed', e.message);
            disMes('Could Not copy tree')
            return
        }
        let data = { ids, tree: ctree, desc: `${(new Date()).getHours()}:${(new Date()).getMinutes()}.${(new Date()).getSeconds()} ${tree[0].name} ${ctree[0].id}` }
        global.copiedTrees.unshift(data)
        disMes('Copied Tree : ' + data.desc)

    }
    const pasteTree = () => {
        let pos = copyId
        if (global.copiedTrees[pos] === undefined) {
            disMes('No data here')
            return
        }
        let ctree = JSON.parse(JSON.stringify(global.copiedTrees[pos]))
        let ids = tree.map(c => c.id)
        const getDups = (ids) => {
            let dups = []
            ids.forEach(id => {
                if (ctree.tree.map(c => c.id).includes(id)) {
                    dups.push(id)
                }
            })
            return dups
        }
        let dups = getDups(ids)
        if (dups.length > 0) {
            disMes(`Id clashes : "${dups.join(', ')}"`)
            let cont = false //window.confirm(`${dups.join(', ')}exist.\nRename and paste here?`)
            if (!cont) {
                return
            } else {
                // let no = 0
                // while (true) {
                //     let renamed = dups.map(d => d + '-1')
                //     let ndups = getDups(renamed)
                //     dups.forEach((c,i)=>replaceId(ctree.tree,c,renamed[i]))
                //     no++
                //     dups=ndups
                //     if (ndups.length === 0) {
                //         console.log('runned', no,ctree)
                //         break
                //     }
                //     if(no>12){
                //         console.log('infinite',no)
                //         break
                //     }
                // }
            }
        }
        let tmpTree = [...tree]
        tmpTree.push(...ctree.tree)
        setApp(tmpTree)
        disMes(`Tree pasted ${ctree.length} new Comps`)

    }
    const deleteCopied = (e, index) => {
        e.stopPropagation()
        global.copiedTrees = global.copiedTrees.slice(0, index)
        if (copyId > index - 1) setCopyId(null)
        disMes('Cleared Items')
    }
    return (
        <div /*style={{ position: 'relative' }} */ >
            <div style={{ position: 'absolute', top: 3, right: 3, backgroundColor: 'black', color: 'white', borderRadius: 4 }} >{info}</div>
            <TreeView data={data} onClick={onClick} style={style} selected={selected} tree={tree}
                action={true}
                onAction={copyTree}
            />
            <div style={{ borderTop: '2px solid grey', marginTop: 10 }} >
                <div style={{ width: '100', textAlign: 'center', borderBottom: '1px solid lavender' }}>
                    Extraneous Comps
                </div>
                {extData.map(t => {
                    return (
                        <TreeView key={t.label} data={[t]} onClick={onClick} action={true} tree={tree}
                            onAction={deleteComp} drag={true} actionIcon={<MdDeleteForever size={size} color={color} />}
                        />
                    )
                })}
            </div>
            <div style={{ borderTop: '2px solid grey', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div >Paste copied </div>
                <Select value={copyId === null ? '' : copyId} onChange={(e) => setCopyId(e.target.value)} >
                    {global.copiedTrees.map((t, i) => <MenuItem value={i} >
                        <div>{t.desc}<MdDeleteForever onClick={(e) => deleteCopied(e, i)} /></div>
                    </MenuItem>)}
                </Select>
                <button onClick={pasteTree} >Paste</button>
            </div>
        </div>
    )
}

export default Outline
//vim tisu apik
