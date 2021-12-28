import React, { useState } from 'react'

import { MdDelete } from 'react-icons/md'

const ReModules = () => {
    const update = useState(0)[1]
    let remodules=global.remodules

    const ModItem = ({ mod, index }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', border: '1px solid grey', borderRadius: 6, padding: 2, margin: 2 }}
                draggable={true}
                onDragStart={(e) => e.dataTransfer.setData('text', mod[0].name)}
            >
                <div> {mod[0].name}</div>
                <div onClick={() => remove(index)} ><MdDelete size={20} color='blue' /></div>
            </div>
        )
    }
    const remove = (index) => {
        let name = mainRemods[index][0].name
        global.remodules = global.remodules.filter(m => !(m[0].name === name || m[0].type === name))
        update(Math.random())
    }
    let mainRemods = remodules.filter(m => m[0].type === 'main')
    return (
        <div>
            {mainRemods.map((mod, index) => <ModItem mod={mod} index={index} />)}
        </div>
    )
}

export default ReModules
