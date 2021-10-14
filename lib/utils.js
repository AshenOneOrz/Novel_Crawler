const fs = require('fs')

const log = console.log.bind(console)

const readFile = (path) => {
    let data = ''
    data = fs.readFileSync(path, 'utf-8')
    return data
}

const writeFile = (path, data) => {
    fs.writeFileSync(path, data, 'utf-8')
}

module.exports = { log, readFile, writeFile }
