const { log, readFile, writeFile, appendFile, replaceAll, downloadPage } = require('./lib/utils')

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
    for (let i = 0; i < contents.length; i++) {
        const c = contents[i]
        let path = `./cache/${c.path}`
        let file = readFile(path)
        let title = `${c.title}\r\n\r\n`
        let data = title + parseHtml(file)

        appendFile(novelName, data)
    }
}

const downloadPages = async (contents, baseUrl) => {
    let cs = JSON.parse(JSON.stringify(contents))
    for (const content of contents) {
        let url = baseUrl + content.path
        try {
            let path = `./cache/${content.path.split('.')[0]}.html`
            await downloadPage(url, path)
            cs.shift()
        } catch (error) {
            log('下载失败', error)
            return
        }
    }

    if (cs.length !== 0) {
        downloadPages(cs, baseUrl)
    }

}

const parseContents = () => {
    let path = './cache/contents.html'
    let html = readFile(path)
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

const downloadContentsPage = async (url) => {
    let path = './cache/contents.html'
    await downloadPage(url, path)
}

const __main = async () => {

    let url = `https://www.ptwxz.com/html/10/10125/`
    let novelName = '芝加哥1990.txt'

    log('开始下载目录页')
    await downloadContentsPage(url)
    log('开始解析目录')
    let contents = parseContents()
    log('开始下载所有章节的 html 文件')
    await downloadPages(contents, url)
    log('下载完毕，开始写入')
    WriteChaptersToFile(contents, novelName)
    log('写入完毕')
}

__main()
