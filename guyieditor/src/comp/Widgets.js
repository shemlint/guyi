import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'

import {
    BiText, BiSlider, BiEditAlt, BiBadge, BiChip,
    BiCheckboxChecked, BiRadioCircleMarked, BiLinkAlt, BiGitBranch,
} from 'react-icons/bi'
import {
    MdMovie,MdMusicVideo,
    MdBorderRight, MdBorderBottom, MdVideogameAsset,
    MdImage, MdCheckBoxOutlineBlank,
} from 'react-icons/md'
import { FaInfo, FaMap, FaCode,FaReact } from 'react-icons/fa'
import { GiSuspicious, GiLaddersPlatform, GiRunningNinja} from 'react-icons/gi'
import { GrRadial, GrToast } from 'react-icons/gr'
import { GoDiffModified } from 'react-icons/go'
import { BsNewspaper, BsCardHeading } from 'react-icons/bs'
import { IoMdSwitch } from 'react-icons/io'
import { SiFloatplane } from 'react-icons/si'
import { CgSelect } from 'react-icons/cg'

let size = 30, color = 'blue';

export const dataBasic = [
    { name: 'Text', icon: <BiText size={size} color={color} /> },
    { name: 'Row', icon: <MdBorderRight size={size} color={color} /> },
    { name: 'Column', icon: <MdBorderBottom size={size} color={color} /> },
    { name: 'Button', icon: <MdVideogameAsset size={size} color={color} /> },
    { name: 'TextInput', icon: <BiEditAlt size={size} color={color} /> },
    { name: 'View', icon: <MdCheckBoxOutlineBlank size={size} color={color} /> },
    { name: 'Image', icon: <MdImage size={size} color={color} /> },
    { name: 'Html', icon: <FaCode size={size} color={color} /> },
    {name:'Video',icon:<MdMovie  size={size} color={color}  /> },
    {name:'Audio',icon:<MdMusicVideo  size={size} color={color}  /> },
    { name: 'MapList', icon: <FaMap size={size} color={color} /> },
    { name: 'CondList', icon: <BiGitBranch size={size} color={color} /> },
    {name:'ReactRaw',icon:<FaReact  size={size} color={color}  /> },
]
export const dataHtml = [
    { name: 'MButton', icon: <MdVideogameAsset size={size} color={color} /> },
    { name: 'MTextField', icon: <BiEditAlt size={size} color={color} /> },
    { name: 'MAvatar', icon: <GiSuspicious size={size} color={color} /> },
    { name: 'MBadge', icon: <BiBadge size={size} color={color} /> },
    { name: 'MChip', icon: <BiChip size={size} color={color} /> },
    { name: 'MTooltip', icon: <FaInfo size={size} color={color} /> },
    { name: 'MTypography', icon: <BiText size={size} color={color} /> },
    { name: 'MCProgress', icon: <GrRadial size={size} color={color} /> },
    { name: 'MLProgress', icon: <GiRunningNinja size={size} color={color} /> },
    { name: 'MDialog', icon: <GoDiffModified size={size} color={color} /> },
    { name: 'MSnackbar', icon: <GrToast size={size} color={color} /> },
    { name: 'MPaper', icon: <BsNewspaper size={size} color={color} /> },
    { name: 'MCard', icon: <BsCardHeading size={size} color={color} /> },
    { name: 'MSwitch', icon: <IoMdSwitch size={size} color={color} /> },
    { name: 'MSlider', icon: <BiSlider size={size} color={color} /> },
    { name: 'MFab', icon: <SiFloatplane size={size} color={color} /> },
    { name: 'MCheckbox', icon: <BiCheckboxChecked size={size} color={color} /> },
    { name: 'MRadio', icon: <BiRadioCircleMarked size={size} color={color} /> },
    { name: 'MFormCL', icon: <GiLaddersPlatform size={size} color={color} /> },
    { name: 'MLink', icon: <BiLinkAlt size={size} color={color} /> },
    { name: 'MSelect', icon: <CgSelect size={size} color={color} /> }

]

const Wid = ({ data }) => {
    return (
        <Tooltip title={data.name}>
            <div draggable={true} onDragStart={(e) => {
                e.dataTransfer.setData('text', data.name)
            }}
            >
                {data.icon}
            </div>
        </Tooltip>
    )
}

const Widgets = () => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }} >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div>Basic</div>
                {dataBasic.map(val => {

                    return (
                        <Wid key={val.name} data={val} />
                    )
                })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div>HTML</div>
                {dataHtml.map(val => {

                    return (
                        <Wid key={val.name} data={val} />
                    )
                })}
            </div>

        </div>
    )
}

export default Widgets
