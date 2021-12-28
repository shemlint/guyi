const prompts = require('prompts')
console.log('loading ')
const init = async () => {
    const res = await prompts({
        name: 'value',
        type: 'number',
        validate: val => val > 18 ? true : 'Must be older than 18',
        message: 'Enter your age ',
    });
    console.log(res)

}

(async () => {
    const res = await prompts({
        name: 'value',
        type: 'number',
        validate: val => val > 18 ? true : 'Must be older than 18',
        message: 'Enter your age ',
        initial: 18,
        onRender(k) {
            this.msg = k.bold().red('Your name') + k.yellow('now') + k.italic().bgWhite().magenta(' ok ')
        }
    });
    console.log(res)

    const res2 = await prompts({
        type: 'select',
        name: 'topping',
        message: 'What topping to use',
        hint: 'choice one',
        warn: 'Not enable for you',
        choices: [
            { title: 'Cherry', value: 12 },
            { title: 'White', value: 13, disabled: true },
            { title: 'None', value: 14 },
        ]
    })
    console.log(res2)
    setTimeout(() => { console.log('ended') }, 20000)
})()
//init()

