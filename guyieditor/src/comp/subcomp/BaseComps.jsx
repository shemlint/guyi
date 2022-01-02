import React from 'react'
import { useRipple } from 'react-use-ripple'

export const Button = React.forwardRef(
    ({
        onClick = () => { }, onDbClick = () => { }, value = '', styles = {}, className, id
    }, ref) => {
        return (
            <button
                className={className}
                id={id}
                ref={ref}
                onClick={onClick}
                onDoubleClick={onDbClick}
                style={styles}
            >{value}</button>
        )
    }
)


export const Column = React.forwardRef(
    ({ styles = {}, className, data = [], id, onClick
    }, ref) => {
        let rprops = {
            rippleColor: styles.rcolor,
            animationLength: styles.rlength, rippleSize: styles.rsize
        }
        if (styles.rdisabled === false) {
            rprops.disabled = true
        }
        useRipple(ref, rprops)
        return (
            <div onClick={onClick}
                ref={ref}
                className={className}
                id={id}
                style={{
                    ...styles,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                {data.map((item, index) => {
                    return (
                        item
                    )
                })}
            </div>
        )
    }
)

export const Image = React.forwardRef(({
    src = '',
    alt = '',
    width = 80,
    height = 80,
    style,
    id,
    className },
    ref) => {
    return (
        <img
            ref={ref}
            src={src}
            alt={alt}
            style={{ height, width, ...style }}
            className={className}
            id={id}
        />
    )
})

export const Row = React.forwardRef(
    ({
        styles = {}, data = [], className, id, onClick
    }, ref) => {
        let rprops = {
            rippleColor: styles.rcolor,
            animationLength: styles.rlength, rippleSize: styles.rsize
        }
        if (styles.rdisabled === false) {
            rprops.disabled = true
        }
        useRipple(ref, rprops)
        return (
            <div onClick={onClick}
                ref={ref}
                style={{
                    ...styles,
                    display: 'flex',
                    flexDirection: 'row',
                }}
                className={className}
                id={id}
            >
                {data.map((item, index) => {
                    return (
                        item
                    )
                })}
            </div>
        )
    }
)
export const Text = React.forwardRef(({ styles = {}, value = '', className, id }, ref) => {
    return (
        <p ref={ref} style={{ margin: 0, padding: 0, ...styles }}
            className={className}
            id={id}>
            {value}
        </p>
    )
})

export const Textinput = React.forwardRef(({ styles = {}, otherProps = {},
    value = '', onChange, onClick, className, id
}, ref) => {
    return (
        <input {...otherProps}
            ref={ref} value={value}
            onChange={onChange}
            onClick={onClick}
            style={styles}
            className={className}
            id={id}
        />

    )
})

export const View = React.forwardRef(({
    id = '',
    className = '',
    data = [],
    styles:sty = {},
    center = false,
    onClick = () => { },
}, ref) => {
    let centerProps = {}
    if (center) {
        centerProps.display = 'flex';
        centerProps.flexDirection = 'row';
        centerProps.justifyContent = 'center';
        centerProps.alignItems = 'center';

    }
    if (sty.borderRadius && sty.borderRadius !== 0) {
        sty.borderTopleftRadius = sty.borderRadius;
        sty.borderTopRightRadius = sty.borderRadius;
        sty.borderBottomleftRadius = sty.borderRadius;
        sty.borderBottomRightRadius = sty.borderRadius;
        delete sty.borderRadius
    }
    if (sty.margin && sty.margin !== 0) {
        sty.marginLeft = sty.margin;
        sty.marginRight = sty.margin;
        sty.marginTop = sty.margin;
        sty.marginBottom = sty.margin;
        delete sty.margin
    }

    if (sty.padding && sty.padding !== 0) {
        sty.paddingLeft = sty.padding;
        sty.paddingRight = sty.padding;
        sty.paddingTop = sty.padding;
        sty.paddingBottom = sty.padding;
        delete sty.padding
    }
    if (sty.border && sty.border.trim() !== '') {
        sty.borderTop = sty.border;
        sty.borderBottom = sty.border;
        sty.borderLeft = sty.border;
        sty.borderRight = sty.border;
        delete sty.border
    }
    let rprops = {
        rippleColor: sty.rcolor,
        animationLength: sty.rlength, rippleSize: sty.rsize
    }
    if (sty.rdisabled === false) {
        rprops.disabled = true
    }
    useRipple(ref, rprops)
    return (
        <div
            ref={ref}
            id={id}
            className={className}
            onClick={onClick}
            style={{
                ...sty,
                display: 'flex',
                flexDirection: 'column',
                ...centerProps,

            }}
        >
            {data.length > 0 && data[0]}
        </div>
    )
}
)

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(err) {
        return { hasError: true }
    }
    componentDidCatch(error) {
        console.log('Erro from ReactRaw', error)
    }
    render() {
        if (this.state.hasError) {
            if (this.props.error) {
                return this.props.error(this)
            } else {
                return <div>React raw Error</div>
            }
        } else {
            if (this.props.comp) {
                return this.props.comp
            } else {
                return this.props.children
            }
        }
    }
}


