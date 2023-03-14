import type { BingImage } from './lib/BingImage.ts'
import { isValidBingImage } from './lib/BingImage.ts'
import { output } from "./lib/output.ts";
import { processUrl } from './lib/processUrl.ts'
import { resolve } from './deps/path.ts'


const main = async () => {
    const root = resolve('wallpaper')

    const api = 'https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&uhd=1&uhdwidth=3840&uhdheight=2160&mkt=en-US'
    const res = await fetch(api)

    if (res.status !== 200) {
        throw new Error(`Response status not valid (${res.status}): ${api}`)
    }

    const json = await res.json()

    const images = json?.images as BingImage[]

    if (!images || !Array.isArray(images)) {
        throw new Error(`Invalid response: ${api}`)
    }

    if (!images.every(isValidBingImage)) {
        throw new Error(`Invalid response content: ${api}`)
    }

    for (const {
        startdate,
        url,
        copyright,
        title,
    } of images) {
        const {
            previewUrl,
            downloadUrl,
        } = processUrl(url)

        const year = startdate.slice(0, 4)
        const month = startdate.slice(4, 6)
        const date = startdate.slice(6)

        const path = await output(root, {
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