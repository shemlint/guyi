import React from 'react'

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
    ({ styles = {}, className, data = [], id
    }, ref) => {

        return (
            <div
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
        styles = {}, data = [], className, id
    }, ref) => {
        return (
            <div
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
    styles = {},
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
    if (styles.borderRadius && styles.borderRadius !== 0) {
        styles.borderTopleftRadius = undefined;
        styles.borderTopRightRadius = undefined;
        styles.borderBottomleftRadius = undefined;
        styles.borderBottomRightRadius = undefined;
    }
    if (styles.margin && styles.margin !== 0) {
        styles.marginLeft = undefined;
        styles.marginRight = undefined;
        styles.marginTop = undefined;
        styles.marginBottom = undefined;
    }

    if (styles.padding && styles.padding !== 0) {
        styles.paddingLeft = undefined;
        styles.paddingRight = undefined;
        styles.paddingTop = undefined;
        styles.paddingBottom = undefined;
    }
    if (styles.border && styles.border.trim() !== '') {
        styles.borderTop = undefined;
        styles.borderBottom = undefined;
        styles.borderLeft = undefined;
        styles.borderRight = undefined;
    }

    return (
        <div
            ref={ref}
            id={id}
            className={className}
            onClick={onClick}
            style={{
                ...styles,
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
            return <div>ReactRaw Error</div>
        } else {
            return this.props.comp
        }
    }
}


