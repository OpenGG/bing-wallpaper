import { output } from "../lib/output.ts";
import { processUrl } from '../lib/processUrl.ts'
import { readFile } from '../lib/readFile.ts'

const main = async () => {
    const content = await readFile('./tmp/temp.txt')

    const lines = content.split('----').map(a => a.trim()).filter(a => a)

    for (const line of lines) {
        const json = JSON.parse(line)
        const {
            startdate,
            title,
            copyright,
            url,
        } = json['en-US'].images[0];

        if (!url.startsWith('/th?')) {
            continue;
        }

        if (parseInt(startdate, 10) < 20190426) {
            continue;
        }

        const {
            previewUrl,
            downloadUrl,
        } = processUrl(url)

        const year = startdate.slice(0, 4)
        const month = startdate.slice(4, 6)
        const date = startdate.slice(6)

        const path = await output('legacy', {
            previewUrl,
            downloadUrl,
            year,
            month,
            date,
            title,
            copyright,
        })

        console.log(path)
    }
}

main().then(() => {
    console.log('Finish')
}, err => {
    console.error(err.stack)
    Deno.exit(1)
})