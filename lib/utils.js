const fs = require('fs')
const Axios = require('axios')
const HttpsProxyAgent = require('https-proxy-agent')
const iconvLite = require('iconv-lite')

const httpsAgent = new HttpsProxyAgent(`http://127.0.0.1:7890`)

const axios = Axios.create({
    proxy: false,
    httpsAgent,
})

const log = console.log.bind(console)

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

const downloadPage = async (url, path) => {
    let response = await axios.get(url, {
        responseType: 'arraybuffer',
    })
    let data = iconvLite.decode(response.data, 'gbk').toString()
    writeFile(path, data)
}

module.exports = { log, readFile, writeFile, appendFile, replaceAll, downloadPage }
