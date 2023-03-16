import { output } from "../lib/output.ts";
import { processUrl } from '../lib/processUrl.ts'

const main = async () => {
    const res = await fetch('https://raw.githubusercontent.com/niumoo/bing-wallpaper/main/bing-wallpaper.md')

    const md = await res.text()

    const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<date>\d{2})[^[]+\[(?<desc>[^\]]+)\]\((?<img>[^\)]+)\)/g

    for (; ;) {
        const matches = regex.exec(md)
        if (!matches || !matches.groups) {
            break;
        }
        const {
            year,
            month,
            date,
            desc,
            img,
        } = matches.groups;

        const {
            previewUrl,
            downloadUrl,
        } = processUrl(img)

        const path = await output('legacy', {
            previewUrl,
            downloadUrl,
            year,
            month,
            date,
            title: desc,
            copyright: desc,
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