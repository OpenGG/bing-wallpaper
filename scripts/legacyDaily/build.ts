import { output } from "../lib/output.ts";
import { processUrl } from '../lib/processUrl.ts'
import { readFile } from '../lib/readFile.ts'

const main = async () => {
    const content = await readFile('./temp.txt')

    const lines = content.split('\n').map(a => a.trim()).filter(a => a)

    for (const line of lines) {
        const json = JSON.parse(line)
        const {
            startdate,
            title,
            copyright,
            url,
        } = json.images[0];

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