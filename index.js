
const {
    log,
    readFile,
    writeFile,
    replaceAll,
} = require('./lib/utils')

const request = require('sync-request')

const parseHtml = (html) => {
    let lines = html.split('\n')

    for (let i = 1; i < lines.length - 1; i++) {

        let line = lines[i]
        let prevLine = lines[i - 1]
        let nextLine = lines[i + 1]

        if (prevLine.startsWith('<br>') && nextLine.startsWith('</div>')) {
            let data = line

            replaceAll(data, '<br />', '\r\n')
            replaceAll(data, '&nbsp;', ' ')

            return data
        }
    }
}

// contents 是[{title: '第一章', path: '1.html'}, ...] 格式的目录
// baseUrl 是 https://xiaoshuo.com/name/ 格式的 url， 用这个 url 和每个章节的 path 进行拼接即可得出完整的 url
const getPages = (contents, baseUrl) => {
    for (const content of contents) {
        let url = baseUrl + content.path
        // url = "https://www.baidu.com/"
        // url = 'https://www.npmjs.com/package/sync-request'
        log(`开始请求，地址是\r\n${url}`)
        let response = request('GET', url)
        if (response.statusCode < 300) {
            let body = response.getBody().toString()
            writeFile('a.html', body)
        }
        break
    }

}

const parseContents = (url) => {
    let html = readFile(url)
    let lines = html.split('\n')
    let contents = []

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
    let contents = parseContents(url)

    let baseUrl = `https://www.ptwxz.com/html/10/10125/`
    let pages = getPages(contents, baseUrl)

    // let  = parseHtml(url)
}

__main()