export const processUrl = (input: string) => {
    if (input.startsWith('/th?')) {
        input = `https://bing.com${input}`
    }
    const url = new URL(input);

    if (url.host === 'cn.bing.com') {
        url.host = 'bing.com'
    }

    const downloadUrl = url.toString()

    if (url.pathname === '/th') {
        url.searchParams.set('w', '1024')
        url.searchParams.set('h', '576')
    }

    return {
        downloadUrl,
        previewUrl: url.toString()
    }
}
