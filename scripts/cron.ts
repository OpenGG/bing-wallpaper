import { getBingImages } from './lib/BingImage.ts'
import { output } from "./lib/output.ts";
import { processUrl } from './lib/processUrl.ts'
import { resolve } from './deps/path.ts'
import { retry } from './lib/retry.ts'

const main = async () => {
    const root = resolve('wallpaper')

    const images = await retry(getBingImages);

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