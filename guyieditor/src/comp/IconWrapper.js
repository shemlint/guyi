import React, { useState } from 'react'
import * as md from 'react-icons/md'
import * as fa from 'react-icons/fa'
import * as bi from 'react-icons/bi'
import Tooltip from '@material-ui/core/Tooltip'
import EnterInput from './util/EnterInput'

const micons = Object.keys(md)
const ficons = Object.keys(fa)
const bicons=Object.keys(bi)

const IconWrapper = () => {
    const [sch, setSch] = useState('icon')
    let mresIcons = micons.filter(ic => ic.toLowerCase().includes(sch.toLowerCase()))
    let fresIcons = ficons.filter(ic => ic.toLowerCase().includes(sch.toLowerCase()))
    let bresIcons = bicons.filter(ic => ic.toLowerCase().includes(sch.toLowerCase()))
    let allIcons = mresIcons.concat(fresIcons,bresIcons)  //mresIcons.concat(fresIcons)
    
    const Search = () => {
        const [optSrc, setOptSrc] = useState(sch)
        return (
            <div>
                <EnterInput type="text" placeholder='filter' value={optSrc}
                    onBlur={(e) => setSch(optSrc)}
                    onChange={(e) => { setOptSrc(e.target.value) }}
                    onEnter={(e) => setSch(optSrc)}
                />
            </div>
        )
    }

    const Drag = ({ icon }) => {
        if (icon.startsWith('Md')) {
            return (

                <Tooltip title={icon} placement='bottom' >
                    <div draggable={true} onDragStart={(e) => e.dataTransfer.setData('text', icon)}
                        style={{ padding: 5 }}
                    >
                        {React.createElement(md[icon], { size: 30, color: 'blue' }, [])}
                    </div>
                </Tooltip>
            )
        } else if (icon.startsWith('Fa')) {
            return (
                <Tooltip title={icon} placement='bottom' >
                    <div draggable={true} onDragStart={(e) => e.dataTransfer.setData('text', icon)}
                        style={{ padding: 5 }}
                    >
                        {React.createElement(fa[icon], { size: 30, color: 'blue' }, [])}
                    </div>
                </Tooltip>
            )

        }else if (icon.startsWith('Bi')) {
            return (
                <Tooltip title={icon} placement='bottom' >
                    <div draggable={true} onDragStart={(e) => e.dataTransfer.setData('text', icon)}
                        style={{ padding: 5 }}
                    >
                        {React.createElement(bi[icon], { size: 30, color: 'blue' }, [])}
                    </div>
                </Tooltip>
            )

        }

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap',alignItems:'flex-start' }}>
            <Search />
            {allIcons.map(ic => {
                return (
                    <Drag key={ic} icon={ic} />
                )
            })}

        </div>
    )
}

export default IconWrapper
