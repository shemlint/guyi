import React, { useState, useEffect } from 'react'

const useFetch = (url) => {
    const [data, setData] = useState(false)
    const [pending, setPending] = useState(false)
    //eslint-disable-next-line
    useEffect(() => {
        setPending(true)
        fetch(url, {
            method: 'GET',
        })
            .then(d => d.text())
            .then(d => {
                try {
                    console.log(d)
                    d = JSON.parse(d)
                    setData(d)

                } catch (e) {
                    console.log('fetch Json error')
                }
                setPending(false)
            })
            .catch((e) => {
                console.log('failed to fetch ', url)
            })

    }, [])

    return { data, pending }

}
const Hint = () => {
    const [data, setData] = useFetch('assets/hints.json')

    const Row = ({ d }) => {
        const { data: hints, pending } = useFetch('assets/hints.json')
        return (
            <div >
                <div >{d.title}</div>
                <div >{d.html}</div>ks
            </div>
        )
    }
    return (
        <div>
            {data && data}
        </div>
    )

}


const Docs = () => {
    const [page, setPage] = useState('hint')
    let root = <div>None</div>
    if (page === 'hint') {
        root = <Hint />
    }
    return (
        <div style={{
            position: 'absolute', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000, zIndex: '',
        }} >
            <div className="conts" style={{ height: '80%', width: '80%', backgroundColor: 'black', }} >
                {root}
            </div>
            <style>
                {`
                .conts{
                    color:blue;
                    font-size:50;
                }
                

                `}
            </style>
        </div>
    )
}

export default Docs

