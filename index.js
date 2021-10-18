const { log, readFile, writeFile, appendFile, replaceAll } = require('./lib/utils')

// const request = require('sync-request')
// const request = require('request')
// const Agent = require('socks5-http-client/lib/Agent')

const Axios = require('axios')
const HttpsProxyAgent = require('https-proxy-agent')
const iconvLite = require('iconv-lite')

const httpsAgent = new HttpsProxyAgent(`http://127.0.0.1:7890`)

const axios = Axios.create({
    proxy: false,
    httpsAgent,
})

const parseHtml = (html) => {
    let lines = html.split('\n')
    for (let i = 1; i < lines.length - 1; i++) {
        let line = lines[i]
        let prevLine = lines[i - 1]
        let nextLine = lines[i + 1]

        if (prevLine.startsWith('<br>') && nextLine.startsWith('</div>')) {
            let data = replaceAll(line, '<br />', '\r\n')
            data = replaceAll(data, '&nbsp;', '')
            data = replaceAll(data, '&emsp;', '')
            return data
        }
    }
}

const WriteChaptersToFile = (contents, novelName) => {
    log('下载完毕，开始写入')
    for (let i = 0; i < contents.length; i++) {
        const c = contents[i]
        let path = `./cache/${c.path}`

        let file = readFile(path)
        let title = `${c.title}\r\n\r\n`
        let data = title + parseHtml(file)
        appendFile(novelName, data)
    }
}

// contents 是[{title: '第一章', path: '1.html'}, ...] 格式的目录
// baseUrl 是 https://xiaoshuo.com/name/ 格式的 url， 用这个 url 和每个章节的 path 进行拼接即可得出完整的 url
const downloadPages = async (contents, baseUrl) => {
    let cs = JSON.parse(JSON.stringify(contents))
    log('开始下载 html 文件')
    for (const content of contents) {
        let url = baseUrl + content.path
        try {
            let response = await axios.get(url, {
                responseType: 'arraybuffer',
            })
            let data = iconvLite.decode(response.data, 'gbk').toString()
            writeFile(`./cache/${content.path.split('.')[0]}.html`, data)
            cs.shift()
        } catch (error) {
            log('error', content)
        }
    }

    if (cs.length !== 0) {
        downloadPages(cs, baseUrl)
    }

}

const parseContents = (url) => {
    let html = readFile(url)
    let lines = html.split('\n')
    let contents = []
    log('开始解析目录')
    for (const line of lines) {
        if (line.startsWith('<li>')) {
            let s1 = line.indexOf('href="') + 6
            let e1 = line.indexOf('html">') + 4
            let path = line.slice(s1, e1)

            let s2 = line.indexOf('html">') + 6
            let e2 = line.indexOf('</a></li>')
            let title = line.slice(s2, e2)

            if (path.indexOf('html') !== -1) {
                let content = {
                    path,
                    title,
                }
                contents.push(content)
            }
        }
    }
    return contents
}

const __main = () => {
    // 传入目录页 url，返回所有章节的 path 和 title
    // let url = `https://www.ptwxz.com/html/10/10125/`
    let url = './cache/mulu.html'
    // 解析目录
    let contents = parseContents(url)

    // 下载所有章节的页面
    let baseUrl = `https://www.ptwxz.com/html/10/10125/`
    downloadPages(contents, baseUrl)

    // 写入文件
    let novelName = '芝加哥1990.txt'
    WriteChaptersToFile(contents, novelName)
}

__main()
