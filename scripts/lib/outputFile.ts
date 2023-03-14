import { posix } from "../deps/path.ts";

export const outputFile = async (path: string, content: string) => {
    const encoder = new TextEncoder()
    await Deno.mkdir(posix.dirname(path), { recursive: true });
    
    const buf = encoder.encode(content)
    await Deno.writeFile(path, buf)
}