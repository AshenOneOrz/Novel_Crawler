const fs = require('fs')

const log = console.log.bind(console)
const iconvLite = require('iconv-lite')

const readFile = (path) => {
    let data = fs.readFileSync(path, 'utf-8')
    return data
}

const writeFile = (path, data) => {
    fs.writeFileSync(path, data, 'utf-8')
}

const appendFile = (path, data) => {
    fs.appendFileSync(path, data, 'utf-8')
}

const replaceAll = (data, searchValue, replaceValue) => {
    while (data.indexOf(searchValue) !== -1) {
        data = data.replace(searchValue, replaceValue)
    }
    return data
}

module.exports = { log, readFile, writeFile, appendFile, replaceAll }
