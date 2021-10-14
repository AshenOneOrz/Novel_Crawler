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

const replaceAll = (data, searchValue, replaceValue) => {
    while (data.indexOf('searchValue') !== -1) {
        data = line.replace('searchValue', 'replaceValue')
    }
    return data
}

module.exports = { log, readFile, writeFile, replaceAll }
