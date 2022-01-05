let ex = [
    { path: 'work/level', comp: 'wfwf' },
    { path: 'food', comp: 'fdgds' },
    { path: 'food/des', comp: 'fsggs' },
    { path: 'work', comp: 'dsfs' },
]
const added = { '': { label: 'root', nodes: [] } }
const nodes = []
ex.forEach(e => {
    const d = e.path
    let parts = d.split('/')
    parts.forEach((p, i, a) => {
        const path = parts.slice(0, i + 1).join('/')
        if (!added[path]) {
            added[path] = { label: '*', nodes: [] }
        }
        if (i === a.length - 1) {
            added[path].label = d
        }
    })
    console.log(parts, added)
    const ppath = parts.slice(0, -1).join('/')
    let parent = added[ppath]
    parent.nodes.push(added[d])

})
console.log(added)

