import React from 'react'
import { Row, Column, View, Text, Button, Image, ErrorBoundary } from './BaseComps'
import * as md from 'react-icons/md'
import * as fa from 'react-icons/fa'
import * as bi from 'react-icons/bi'

import MButton from '@material-ui/core/Button'
import MTextField from '@material-ui/core/TextField'
import MAvatar from '@material-ui/core/Avatar'
import MBadge from '@material-ui/core/Badge'
import MChip from '@material-ui/core/Chip'
import MTooltip from '@material-ui/core/Tooltip'
import MTypography from '@material-ui/core/Typography'
import MCProgress from '@material-ui/core/CircularProgress'
import MLProgress from '@material-ui/core/LinearProgress'
import MDialog from '@material-ui/core/Dialog'
import MSnackbar from '@material-ui/core/Snackbar'
import MPaper from '@material-ui/core/Paper'
import MCard from '@material-ui/core/Card'
import MSwitch from '@material-ui/core/Switch'
import MSlider from '@material-ui/core/Slider'
import MFab from '@material-ui/core/Fab'
import MCheckbox from '@material-ui/core/Checkbox'
import MRadio from '@material-ui/core/Radio'
import MFormCL from '@material-ui/core/FormControlLabel'
import MLink from '@material-ui/core/Link'
import MSelect from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import {withStyles} from '@material-ui/core/styles'

import { getCodeClass, template } from './data'



const drawComp = (tree, id, prev = false, slData = {}, dynamic = false) => {

    let dynamicCount = slData.dynamicCount

    let comp = <p>unknown</p>
    const cnames = tree.map(c => c.id)


    let pos = cnames.indexOf(id)

    if (pos === -1 && !dynamic)
        return comp
    let node = {}
    if (dynamic) {
        node = dynamic
    } else {
        node = tree[pos]
    }
    if (node.props === undefined) node.props = {}
    if (node.events === undefined) node.events = {}
    const props = node.props
    const events = node.events
    const inst = slData.inst

    const isVisible = () => {
        try {
            if (typeof props.visibleWhen === 'string' && props.visibleWhen.trim().length > 0) {
                //eslint-disable-next-line
                const annoy = Function('main,state', `return ${props.visibleWhen}`)
                return annoy(slData.class, inst.state)
            } else {
                return true
            }
        } catch (e) {
            console.log(`visibleWhen error ${node.id} ${e.message}`)
            return true
        }
    }
    if (!isVisible()) {
        return false
    }
    let autoEvent =undefined
    const tieValue = () => {
        try {
            const onChange = (e, s,) => {
                const isSlider = (node.name === 'MSlider')
                inst.setState({ [node.id]: isSlider ? s : e.target.value})
            }
            const onChangeBool = (e, v) => {
                inst.setState({ [node.id]: v })
            }
            if (props.TrackValue !== undefined ? props.TrackValue : true) {
                if (['TextInput', 'MTextField', 'MSelect', 'MSlider'].includes(node.name)) {
                    const prop = (node.name === 'TextInput') ? 'value' : 'Value'
                    if (inst.state[node.id] !== undefined)props[prop] = inst.state[node.id]
                    else props[prop] = props[prop] || ''
                    autoEvent = onChange
                } else if (['MSwitch', 'MCheckbox', 'MRadio'].includes(node.name)) {
                    const prop = 'Value'
                    if (inst.state[node.id] !== undefined) props.Value = inst.state[node.id]
                    else props[prop] = props[prop] || false
                    autoEvent = onChangeBool
                }
                else {
                    //   console.log(`tievalue not supported on ${node.name}`)
                }
            }
        } catch (e) {
            console.log(`TrackValue error ${node.id} ${e.message}`)
            return true
        }
    }
    tieValue()
    let resources = {}
    global.files.forEach(f => {
        resources[f.name] = f.url
    })
    const getRef = () => {
        let ref = React.createRef()
        if (inst.usedRefs[id]) {
            ref = inst.usedRefs[id]
        } else {
            inst.usedRefs[id] = ref
        }
        return ref
    }
    const getEvent = (type) => {
        const m = events[type] ? events[type].method : ''
        const args = (events[type] && events[type].args) ? events[type].args : ''
        const userArgs = args === '' ? [] : args.split(',')
        let p = slData.class[m]
        if (typeof p === 'function') {
            //let userArgs=events
            return (...args) => {
                try {
                    if (autoEvent) autoEvent(...args)
                    return slData.class[m](...userArgs, ...args)
                }
                catch (e) { console.warn(`Method ${type}[${m}] error ${e.message}`, e) }
            }
        } else {
            return autoEvent 
        }
    }
    const drawChilds = (name) => {
        let childs = node.props[name]
        let data = []

        if (Array.isArray(childs) && childs.length > 0) {
            childs.forEach(c => {
                let child = <p>NO TREE</p>
                if (typeof c === 'string' && c.includes(',')) {
                    let tree_id = c.split(',')
                    if (!prev) {
                        let mnames = global.modules.map(m => m[0].name)
                        let pos = mnames.indexOf(tree_id[0])
                        if (pos !== -1) {
                            // console.log('got tree ',pos,global.modules[pos])
                            child = drawComp(global.modules[pos], tree_id[1], prev, slData)
                            data.push(child)
                        } else {
                            let rmnames = global.remodules.map(m => m[0].name)
                            let rpos = rmnames.indexOf(tree_id[0])
                            if (rpos !== -1) {
                                // console.log('got tree ',pos,global.modules[pos])
                                child = drawComp(global.remodules[rpos], tree_id[1], prev, slData)
                                data.push(child)
                            }
                        }
                    } else {
                        let dnames = prev.deps.map(d => d[0].name)
                        let pos = dnames.indexOf(tree_id[0])
                        if (pos !== -1) {
                            // console.log('got tree ',pos,global.modules[pos])
                            child = drawComp(prev.deps[pos], tree_id[1], prev, slData)
                            data.push(child)
                        }
                    }

                } else if (typeof c === 'string') {
                    child = drawComp(tree, c, prev, slData)
                    data.push(child)
                } else if (typeof c === 'object' && c.comp) {
                    //  child = c.comp
                }

            })
        }
        return data
    }
    //#region basic comps
    if (node.name === 'Column') {
        let styleProps = { ...props, children: '' }
        comp = <Column key={id} ref={getRef()} data={drawChilds('children')} styles={styleProps}
            className={props.className} id={props.id}
            onClick={getEvent('onClick')} />
    }
    if (node.name === 'Row') {
        let styleProps = { ...props, children: '' }
        comp = <Row key={id} ref={getRef()} data={drawChilds('children')} styles={styleProps}
            className={props.className} id={props.id}
            onClick={getEvent('onClick')} />
    }
    if (node.name === 'View') {
        let backImage = ''
        if (props.backgroundImage) {
            let src = props.backgroundImage
            if (src && src.startsWith('res://')) {
                let name = src.split('//')[1]
                if (!prev) {
                    src = resources[name]
                } else {
                    let fnames = prev.files.map(f => f.name)
                    let pos = fnames.indexOf(name)
                    if (pos !== -1) {
                        src = prev.files[pos].url
                    }
                }
            }
            backImage = `url(${src})`
        }
        let styleProps = { ...props, children: '', backgroundImage: backImage }
        comp = <View key={id} ref={getRef()} data={drawChilds('child')} styles={styleProps}
            center={props.center} onClick={getEvent('onClick')}
            className={props.className} id={props.id}
        />
    }
    if (node.name === 'Text') {
        let styleProps = { ...props, value: '' }
        comp = <Text key={id} ref={getRef()} value={props.value} styles={styleProps}
            className={props.className} id={props.id} />
    }
    if (node.name === 'Button') {
        let styleProps = { ...props, value: '' }
        comp = <Button key={id} ref={getRef()} value={props.value} styles={styleProps}
            className={props.className} id={props.id}
            onClick={getEvent('onClick')}
            ondblClick={getEvent('ondbClick')}
        />
    }
    if (node.name === 'TextInput') {
        let styleProps = { ...props, value: '' }
        comp = <input
            {...styleProps}
            key={id} ref={getRef()}
            value={props.value}
            styles={styleProps}
            className={props.className}
            id={props.id}
            type={styleProps.type || 'text'}

            onClick={getEvent('onClick')}
            onChange={getEvent('onChange')}
        />
    }
    if (node.name === "Image") {
        let src = props.src
        if (src && src.startsWith('res://')) {
            let name = src.split('//')[1]
            if (!prev) {
                src = resources[name]
            } else {
                let fnames = prev.files.map(f => f.name)
                let pos = fnames.indexOf(name)
                if (pos !== -1) {
                    src = prev.files[pos].url
                }
            }
        }
        comp = <Image key={id} ref={getRef()} src={src} alt={props.alt} style={props}
            className={props.className} id={props.id}
            onClick={getEvent('onClick')}
        />
    }
    if (node.name === 'MapList') {
        let tmp = props.Template
        const getProps = (type, obj = true) => {
            let data = obj ? {} : []
            if (typeof !props[type] === 'string') {
                try {
                    let p = JSON.parse(props[type])
                    data = p
                } catch (e) { console.warn(`${type} data eror `, e.message) }
            }
            if (obj) {
                if (typeof props[type] === 'object' && !Array.isArray(props[type])) {
                    data = props[type]
                }
            } else {
                if (Array.isArray(props[type])) {
                    data = props[type]
                }
            }
            return data
        }
        let data = getProps('Data', false)
        let map = getProps('Mapping')
        let extras = getProps('Extras')
        let mapKeys = Object.keys(map)
        //let unionKeys=mapKeys.filter(pname=>dataKeys.includes(k))
        let compiled = []
        let allmodules = global.modules.concat(global.remodules)
        let modNames = allmodules.map(m => m[0].name);
        // console.log('draw map',slData.parentData)
        data.forEach((d, index) => {
            let id = 'dynamic' + dynamicCount++
            let props = {}
            let ext = { ...extras, ...slData.parentData }
            mapKeys.forEach(k => {
                props[map[k]] = d[k]
            })
            if (typeof d === 'object' && !Array.isArray(d) && Object.keys(mapKeys).length < 1) {
                props = { ...d }
            }
            ext.index = index
            props.Extras = ext
            props.extras = ext
            let dynComp = { name: tmp, props, id }
            if (modNames.includes(tmp)) {
                let pos = modNames.indexOf(tmp)
                let modTree = JSON.parse(JSON.stringify(allmodules[pos]))
                modTree[0].props = props
                modTree[0].funcs[0].ext = ext
                tree[0].events = node.events
                compiled.push(<Comp tree={modTree} id={modTree[1].id} prev={prev} />)
            } else {
                compiled.push(drawComp(tree, id, prev, slData, dynComp))
            }
        })
        comp = compiled

    }
    if (node.name === 'CondList') {

        if (props.Routes === undefined) {
            props.Routes = []
        }
        let Extras = {}
        if (props.Extras !== undefined) {
            Extras = props.Extras
        }
        if (typeof props.Extras === 'string') {
            try {
                Extras = JSON.parse(props.Extras)
            } catch (e) { console.warn('Cond extras error ', e.message) }
        }
        let dataObj = props.Routes
        let data = dataObj

        let compiled = []
        data.forEach(d => {
            try {
                //eslint-disable-next-line
                let anony = new Function('main,state', `return ${d[0]}`)
                if (anony(slData.class, inst.state)) {
                    let pos = tree.map(c => c.id).indexOf(d[1])
                    if (pos !== -1) {
                        tree[pos].props.Extras = Extras
                    }
                    compiled.push(drawComp(tree, d[1], prev, slData))
                }

            }
            catch (e) { console.warn(`ConditionList error (${d[0] + ' ' + d[1]}) :`, e.message) }

        })
        props.children = [...new Set(data.map(d => d[1]))] //.filter((v,i,a)=>a.indexOf(v)===i)
        comp = compiled

    }
    if (node.name === 'Html') {
        comp = <div key={id} ref={getRef()} dangerouslySetInnerHTML={{ __html: props.Html }} width={props.Width}
            height={props.Height} className={props.className} id={props.id}
            onClick={getEvent('onClick')}
        />
    }
    if (node.name === 'Ripples') {//exists only forbackward compatibility
        let child = props.Child && props.Child[0] ? drawComp(tree, props.Child[0], prev, slData) : <div></div>
        comp = <div style={{ width: '100%', height: '100%' }} color={props.Color}
            during={props.During}
            onClick={getEvent('onClick')}
        >{child}</div>
    }
    if (node.name === 'Video') {
        let src = props.src
        if (src && src.startsWith('res://')) {
            let name = src.split('//')[1]
            if (!prev) {
                src = resources[name]
            } else {
                let fnames = prev.files.map(f => f.name)
                let pos = fnames.indexOf(name)
                if (pos !== -1) {
                    src = prev.files[pos].url
                }
            }
        }
        comp = <video key={id} ref={getRef()} src={src} controls={props.controls}
            style={{ ...props }} height={150} width={150}
            autoPlay={props.autoplay || undefined}
            className={props.className} id={props.id}
        />
    }
    if (node.name === 'Audio') {
        let src = props.src
        if (src && src.startsWith('res://')) {
            let name = src.split('//')[1]
            if (!prev) {
                src = resources[name]
            } else {
                let fnames = prev.files.map(f => f.name)
                let pos = fnames.indexOf(name)
                if (pos !== -1) {
                    src = prev.files[pos].url
                }
            }
        }
        comp = <audio key={id} ref={getRef()} src={src} controls={props.controls}
            style={{ ...props }} height={100} width={100}
            autoPlay={props.autoplay || undefined}
            className={props.className} id={props.id}
        />
    }
    if (node.name === 'ReactRaw') {
        try {
            const inst = slData.class
            if (typeof inst[props.Function] !== 'function') throw new Error(`(${props.Function}) Not a function`)
            const childs = drawChilds('Children')
            const reactComp = inst[props.Function]({ children: childs })
            if (React.isValidElement(reactComp)) {
                comp = <ErrorBoundary comp={reactComp} />
            } else {
                throw new Error('Not a react element')
            }
        } catch (e) {
            console.info('React raw error ', e.message)
        }
    }

    //#endregion 

    //render remodules
    const setModuleRef = (ref) => {
        inst.usedRefs[id] = { current: ref }
    }

    if (!prev) {
        let names = global.modules.map(m => m[0].name);
        let renames = global.remodules.map(m => m[0].name);

        if (names.includes(node.name)) {
            let pos = names.indexOf(node.name)
            let tree = JSON.parse(JSON.stringify(global.modules[pos]))
            tree[0].props = node.props
            tree[0].props.extras = slData.parentData
            tree[0].events = node.events
            comp = <Comp setRef={setModuleRef} key={id} tree={tree} id={tree[1].id} prev={prev} />

        } else if (renames.includes(node.name)) {
            let pos = renames.indexOf(node.name)
            let tree = JSON.parse(JSON.stringify(global.remodules[pos]))
            tree[0].props = node.props
            tree[0].props.extras = slData.parentData
            tree[0].events = node.events
            comp = <Comp setRef={setModuleRef} key={id} tree={tree} id={tree[1].id} prev={prev} />

        }
    } else {
        let dnames = prev.deps.map(d => d[0].name)
        if (dnames.includes(node.name)) {
            let pos = dnames.indexOf(node.name)
            if (pos !== -1) {
                let tree = JSON.parse(JSON.stringify(prev.deps[pos]))
                tree[0].props = node.props
                tree[0].props.parentData = slData.parentData
                tree[0].events = node.events
                comp = <Comp setRef={setModuleRef} key={id} tree={tree} id={tree[1].id} prev={prev} />
            }
        }
    }

    if (node.name === 'Icon') {
        const clicked = getEvent('onClick')
        if (node.extras && md[node.extras]) {
            comp = React.createElement(md[node.extras], { key: id, size: node.props.Size, color: node.props.Color, onClick: clicked }, [])
        } else if (node.extras && fa[node.extras]) {
            comp = React.createElement(fa[node.extras], { key: id, size: node.props.Size, color: node.props.Color, onClick: clicked }, [])
        } else if (node.extras && bi[node.extras]) {
            comp = React.createElement(bi[node.extras], { key: id, size: node.props.Size, color: node.props.Color, onClick: clicked }, [])
        }
    }
    //#region material ui
    if (node.name === 'MButton') {
        const CMButton=withStyles((theme)=>({
            root:{
                color:props.TextColor,
                backgroundColor:props.BackColor,
                '&:hover':{
                    backgroundColor:props.HoverBackColor,
                }
            }
        }))(MButton)
        comp = React.createElement(
            CMButton, {
            key: id,
            color: props.Color || 'primary',
            variant: props.Variant || 'contained',
            size: props.Size,
            disabled: props.Disabled,
            disableElevation: props.Elevation,
            onClick: getEvent('onClick')
        },
            node.props.Value
        )
    }
    if (node.name === 'MTextField') {
        comp = React.createElement(
            MTextField, {
            key: id,
            variant: props.Variant || 'standard',
            label: props.Label,
            value: props.Value,
            type: props.Type || 'text',
            color: props.Color || 'default',
            error: props.Error,
            multiline: props.Multiline,
            select: props.Select,
            size: props.Size || 'medium',
            margin: props.Margin,
            disabled: props.Disabled,
            helperText: props.HelperText,
            width: props.Width,
            onChange: getEvent('onChange')
        }
        )
    }
    if (node.name === 'MAvatar') {
        let src = node.props.Source
        if (src && src.startsWith('res://')) {
            let name = src.split('//')[1]
            if (!prev) {
                src = resources[name]
            } else {
                let fnames = prev.files.map(f => f.name)
                let pos = fnames.indexOf(name)
                if (pos !== -1) {
                    src = prev.files[pos].url
                }
            }

        }
        comp = React.createElement(
            MAvatar, {
            key: id,
            alt: props.Alt,
            src: src,
            width: props.Width,
            height: props.Height,
            variant: props.Variant,
            onClick: getEvent('onClick'),
        }, props.Value
        )
    }
    if (node.name === 'MBadge') {
        let child = props.Child && props.Child[0] ?
            drawComp(tree, props.Child[0], prev, slData) : ''
        comp = React.createElement(
            MBadge, {
            key: id,
            badgeContent: props.Value,
            color: props.Color,
            invisible: props.Invisible,
            disabled: props.Disabled,
            showZero: props.ShowZero,
            variant: props.Variant,
            badgeOverLap: props.Overlap,
            anchorOrigin: {
                vertical: props.Vertical || 'top',
                horizontal: props.Horizontal || 'right',
            },

        }, child
        )
    }

    if (node.name === 'MChip') {
        let avatar = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : undefined
        comp = React.createElement(
            MChip, {
            key: id,
            avatar: avatar,
            label: props.Value,
            onClick: getEvent('onClick'),
            onDelete: (node.events.onDelete) ? node.events.onDelete : undefined,
            color: props.Color,
            variant: props.Variant,
            size: props.Size,
        }
        )
    }
    if (node.name === 'MTooltip') {
        let child = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : <div>Child</div>
        comp = React.createElement(
            MTooltip, {
            key: id,
            title: props.Value,
            placement: props.Placement,
            arrow: props.Arrow,
            open: props.Open,
            onClose: getEvent('onClose'),
            onOpen: getEvent('onOpen'),
            interactive: props.Interactive,
            leaveDelay: props.LeaveDelay,

        },
            <div>{child}</div>
        )
    }
    if (node.name === 'MTypography') {
        comp = React.createElement(
            MTypography, {
            key: id,
            variant: props.Variant,
            align: props.Align,
            color: props.Color,
            display: props.Display,
            gutterBottom: props.GutterBottom,
            noWrap: props.NoWrap,

        },
            props.Value || ''
        )
    }
    if (node.name === 'MCProgress') {
        comp = React.createElement(
            MCProgress, {
            key: id,
            color: props.Color,
            variant: props.Variant,
            value: props.Value || 0,

        }
        )
    }

    if (node.name === 'MLProgress') {
        comp = React.createElement(
            MLProgress, {
            key: id,
            color: props.Color,
            variant: props.Variant,
            value: props.Value || 0,
            valueBuffer: props.ValueBuffer || 0,

        }
        )
    }
    if (node.name === 'MDialog') {
        let child = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : 'No Child'
        comp = React.createElement(
            MDialog, {
            key: id,
            open: props.Open,
            fullScreen: props.FullScreen,
            onClose: getEvent('onClose'),
            maxWidth: props.MaxWidth,
        },
            <div>{child}</div>
        )
    }
    if (node.name === 'MSnackbar') {
        let child = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : undefined
        comp = React.createElement(
            MSnackbar, {
            key: id,
            open: props.Open,
            anchorOrigin: { vertical: props.Vertical || 'bottom', horizontal: props.Horizontal || 'left' },
            autoHideDuration: props.HideAfter || 6000,
            message: !child ? props.Message : undefined,
            onClose: getEvent('onClose'),
        },
            child
        )
    }
    if (node.name === 'MPaper') {
        let child = (node.Child && node.Child[0]) ? drawComp(tree, node.Child[0], prev, slData) : undefined
        comp = React.createElement(
            MPaper, {
            key: id,
            elevation: props.Elevation,
            variant: props.Variant,
            square: props.Square,
        },
            child
        )
    }
    if (node.name === 'MCard') {
        let child = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : undefined
        comp = React.createElement(
            MCard, {
            key: id,
            variant: props.Variant,
        },
            child
        )
    }
    if (node.name === 'MSwitch') {
        comp = React.createElement(
            MSwitch, {
            key: id,
            checked: props.Value,
            color: props.Color,
            name: props.Name,
            size: props.Size,
            onChange: getEvent('onChange')
        }
        )
    }
    if (node.name === 'MSlider') {
        comp = React.createElement(
            MSlider, {
            key: id,
            value: props.Value,
            defaultValue: props.DefaultValue,
            step: props.Step || undefined,
            marks: props.Marks,
            orientation: props.Orientation,
            min: props.Min,
            max: props.Max,
            valueLabelDisplay: props.LabelOn,
            onChange: getEvent('onChange'),//(e,no)=>{}

        }
        )
    }

    if (node.name === 'MFab') {
        let child = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : <div></div>
        comp = React.createElement(
            MFab, {
            key: id,
            variant: props.Variant,
            size: props.Size,
            color: props.Color,
            disabled: props.Disabled,
            onClick: getEvent('onClick'),

        },
            child
        )
    }

    if (node.name === 'MCheckbox') {
        comp = React.createElement(
            MCheckbox, {
            key: id,
            checked: props.Value,
            defaultChecked: props.DefaultChecked,
            color: props.Color,
            indeterminate: props.Indeterminate,
            size: props.Size,
            onChange: getEvent('onChange'),

        }
        )
    }

    if (node.name === 'MRadio') {//onChange not working
        comp = React.createElement(
            MRadio, {
            key: id,
            checked: props.Value,
            defaultChecked: props.DefaultChecked,
            color: props.Color,
            indeterminate: props.Indeterminate,
            size: props.Size,
            onClick: (e) => {
                const ev = getEvent('onChange')
                if (typeof ev === 'function') {
                    ev(e, !props.Value)
                }
            },
            //onChange: getEvent('onChange'),

        }
        )
    }
    if (node.name === 'MFormCL') {
        let child = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : <div></div>
        comp = React.createElement(
            MFormCL, {
            key: id,
            label: props.Label,
            control: child,
            labelPlacement: props.Placement,

        }
        )
    }
    if (node.name === 'MLink') {
        let child = (props.Child && props.Child[0]) ? drawComp(tree, props.Child[0], prev, slData) : undefined
        comp = React.createElement(
            MLink, {
            key: id,
            href: props.Href,
            color: props.Color,
            underline: props.Underline,
        },
            child
        )
    }
    if (node.name === 'MSelect') {
        //eslint-disable-next-line
        let data = props.Values && props.Values.split(',') || []
        let children = data.length > 0 ? data.map(d => <MenuItem value={d}>{d}</MenuItem>) : <div></div>
        comp = React.createElement(
            MSelect, {
            key: id,
            value: props.Value,
            onChange: getEvent('onChange')

        },
            children
        )
    }
    //#endregion

    return comp;

}
const updateApp = (tree) => {
    if (tree[0].funcs && tree[0].funcs.length > 1) {
        let funcs = tree[0].funcs
        let code =
            `//code auto imported but with errors
${template}
    //put code below :)

`
        funcs.forEach((f, i) => {
            if (i === 0) return
            code += `
        ${f.name}(${f.args}){
            ${f.body}
        }
        `
        })
        code += `
          }
         `
        tree[0].funcs = []
        tree[0].classCode = code
        console.log('Simple code import done')
    }
}
class Comp extends React.Component {
    static data = {};
    static createCount = 0
    static classes = {}


    constructor(props) {
        super(props)
        updateApp(props.tree)
        Comp.createCount++
        this.usedRefs = {}
        this.locals = {}
        this.dynamicCount = 0
        this.renderCount = 0
        this.isInit = { value: true }
        this.state = {}
        this.parentData = {}
        this.propsEvents = {}
        this.classInst = getCodeClass(props.tree[0].classCode, props.prev, this).instance
        this.guyiInit()
    }
    componentDidMount() {
        this.runMagicFunc('load')

    }
    guyiUpdate() {
        this.runMagicFunc('update')
    }
    guyiInit() {
        this.runMagicFunc('init')
    }
    componentDidUpdate() {
        this.runMagicFunc('draw')
    }
    shouldComponentUpdate() {
        this.runMagicFunc('undraw')
        return true
    }
    componentWillUnmount() {
        this.runMagicFunc('unload')
    }

    runMagicFunc(name) {
        try {
            if (this.classInst[name]) {
                this.classInst[name]()
            }
        } catch (e) { console.log(`${this.props.tree[0].name} ${name} error`, e.message, e) }
    }
    getParentData() {
        let { tree } = this.props
        let parentData = {}
        let initIndex = -1
        if (!tree[0].props) tree[0].props = {}
        if (!tree[0].events) tree[0].events = {}
        if (tree[0].props.extras) {
            initIndex = tree[0].props.extras.index
            let kys = Object.keys(tree[0].props.extras)
            let pkys = kys.filter(k => k.startsWith('p'))
            pkys.forEach(pk => {
                let no = Number(pk.split('p')[1]) + 1
                parentData['p' + no] = tree[0].props.extras[pk]
            })
        }
        parentData['p1'] = {
            index: initIndex,
            name: tree[0].name,
            props: tree[0].props, events: tree[0].events,
            instance: this.classInst,
        }
        this.parentData = parentData
        this.classInst.props = tree[0].props
        // this.classInst.extras=parentData
        this.setEvents()
        return parentData
    }
    setEvents() {
        const events = {}
        let pd = Object.values(this.parentData).map(d => [d.name, d.instance])
        Object.entries(this.props.tree[0].events).forEach(([method, inst]) => {
            if (inst.module) {
                let mod = inst.module, name = inst.method, args = inst.args || ''
                const userArgs = args === '' ? [] : args.split(',')
                pd.forEach(([passedmod, m]) => {
                    if (passedmod === mod) {
                        events[method] = (...args) => {
                            try {
                                return m[name](...userArgs, ...args)
                            } catch (e) { console.log(`Error ${this.props.tree[0].name}[${name}] ${e.message}`) }
                        }
                    }
                })
            }
        })
        this.events = events
    }

    render() {
        let { tree, id, prev } = this.props
        this.guyiUpdate()
        if (typeof this.props.setRef === 'function') {
            this.props.setRef(this.classInst)
        }
        return drawComp(tree, id, prev,
            {
                usedRefs: this.usedRefs, dynamicCount: this.dynamicCount, parentData: this.getParentData(),
                class: this.classInst, inst: this
            })
    }

}

export default Comp;


