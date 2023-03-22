import {
    readFile,
} from '../lib/readFile.ts'

import PQueue from "https://deno.land/x/p_queue@1.0.1/mod.ts"

const content = await readFile('./wallpaper/all.txt')

const run = async (cmd: string[]): Promise<number> => {
    // create subprocess
    const p = Deno.run({ cmd });

    // await its completion
    const {
        code
    } = await p.status();

    return code
}

const validate = async (line: string) => {
    const [md, bingUrl] = line.split(' ').map(a => a.trim())

    const date = md.replace('.md', '')

    const id = bingUrl.replace(/^.*\?id=/, '').replace(/&.*/, '')

    const r2Path = `bing-wallpaper/${date}/${id}`

    const localPath = `tmp/${r2Path.replace(/\//g, '_')}`

    // console.log(r2Path, localPath)

    const loadSuccess = await run(['wrangler', 'r2', 'object', 'get', r2Path, '--file', localPath])

    // console.log('loadSuccess', loadSuccess)
    if (loadSuccess !== 0) {
        throw new Error(`Failed to get r2 object: ${r2Path}`)
    }

    const checkSuccess = await run(['./scripts/checkImages/checkImage.sh', localPath])

    // console.log('checkSuccess', checkSuccess)
    if (checkSuccess !== 0) {
        throw new Error(`Corrupt image: ${r2Path}`)
    }

    await Deno.remove(localPath)
}

const lines = content.split('\n').map(a => a.trim()).filter(a => a)

lines.reverse()

const queue = new PQueue({
    concurrency: 10,
})

for (const line of lines) {
    queue.add(() => validate(line))
}

await queue.onEmpty()
