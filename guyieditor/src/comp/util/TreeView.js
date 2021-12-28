import React, { useState } from 'react'
import { MdExpandMore, MdDeleteForever } from 'react-icons/md'

const TreeView = ({ data = [], tree, style, onClick = () => { }, drag = false, onAction = () => { },
    selected = '', action = false, actionIcon = false }) => {

    const Row = ({ node, tabs, path }) => {
        let savedOpen = global.treeData[tree[0].name + node.label]
        let savedopen = savedOpen === undefined ? true : savedOpen
        const [open, rawsetOpen] = useState(savedopen)
        const setOpen = (open) => {
            rawsetOpen(open)
            global.treeData[tree[0].name + node.label] = open
        }
        return (
            <div style={{ marginLeft: tabs * 5, }}>
                <div draggable={drag} onDragStart={drag ? (e) => e.dataTransfer.setData('text', node.label + ',no') : undefined}
                    className='outlineRow' key={node.label} style={{ display: 'flex' }}
                    onClick={() => {
                        node.isOpen = !node.sOpen;
                        onClick(node, path)
                    }}>
                    <div className='expandRow' style={{ transform: open ? 'rotate(2deg)' : 'rotate(-90deg)', transition: 'transform 0.7s' }}
                        onClick={(e) => { e.stopPropagation(); setOpen(!open) }} >
                        <MdExpandMore style={{ visibility: node.nodes && node.nodes[0] ? 'visible' : 'hidden' }} />
                    </div>
                    <div style={{ width: '100%', backgroundColor: selected === node.label ? 'khaki' : '',display:'flex' }} >{node.label}</div>
                    {action && <div style={{ alignSelf: 'flex-end',display:'flex' }}
                        onClick={(e) => {
                            e.stopPropagation()
                            onAction(node, path)
                        }} >
                        {node.icon}
                        { actionIcon}
                        {!actionIcon && !node.icon && <MdDeleteForever size={20} color='blue' />}
                    </div>}
                </div>
                {
                    open && node.nodes &&
                    getRows(node.nodes, tabs + 1, path)
                }
            </div>
        )

    }
    const getRows = (nodes, tabs = 0, path = '') => {
        let rows = [];
        nodes.forEach(val => {
            let newPath=path + '/' + val.label
            rows.push(<Row key={newPath} node={val} tabs={tabs} path={newPath} />)
        })
        return rows
    }
    return (
        <div style={style} >
            {getRows(data, 0)}
        </div>
    )
}


export default TreeView


