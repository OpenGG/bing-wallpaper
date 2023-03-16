export const readFile = async (p: string) => {
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(p);
    return decoder.decode(data);
}
