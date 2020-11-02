var fs = require('fs');
var prettier = require('prettier');
var filename = "./build/index.html";

async function prettify() {
    var prettierConfig = await prettier.resolveConfig(filename);
    var codeStr = await fs.readFileSync(filename).toString();
    var formattedCode = await prettier.format(codeStr, { ...prettierConfig, filepath: filename });
    var splitted = formattedCode.split(/\r?\n/)
    var hrefs = []
    splitted.map((line) => {
        if (line.includes('/static/js')) {
            const start = line.indexOf('/static/js')
            const end = line.indexOf('.js">')
            hrefs.push({
                href: line.slice(start, end + 3),
                type: 'script'
            })
        }
        if (line.includes('/static/css')) {
            const start = line.indexOf('/static/css')
            const end = line.indexOf('.css"')
            hrefs.push({
                href: line.slice(start, end + 4),
                type: 'style'
            })
        }
    })

    var genPreloads = ''

    hrefs.map(item => {
        genPreloads = genPreloads + `<link rel="preload" as="${item.type}" href="${item.href}">`
    })

    splitted[6] = `${splitted[6]} ${genPreloads}`

    let final = splitted.map((line) => {
        line = line.replace(/\s{2,}/g,' ')
        .replace(/\s\s+/g, ' ')
        .replace(/\r?\n/g, ' ')
        .replace('> <', '><')
        return line
    }).join(' ').replace(/\n/g, ' ')

    for (let index = 0; index < 50; index++) {
        final = final.replace(/\s{2,}/g,' ')
        .replace(/\n/g, ' ')
        .replace(/\s\s+/g, ' ')
        .replace(/\r?\n/g, ' ')
        .replace('> <', '><')
    }

    await fs.writeFile(filename, final, (e) => console.log("Preloads tags added!"));
}

prettify()