export const processUrl = (input: string) => {
    if (input.startsWith('/th?')) {
        input = `https://bing.com${input}`
    }
    const url = new URL(input);

    if (url.host === 'cn.bing.com') {
        url.host = 'bing.com'
    }

    let downloadUrl = url.toString()

    if (url.pathname === '/th') {
        const id = url.searchParams.get('id')

        if (id && id.includes('1920x1080')) {
            url.searchParams.set('id', id.replace('1920x1080', 'UHD'))
        }

        const rf = url.searchParams.get('rf')

        if (rf && rf.includes('1920x1080')) {
            url.searchParams.set('rf', rf.replace('1920x1080', 'UHD'))
        }

        url.searchParams.set('w', '3840')
        url.searchParams.set('h', '2160')

        downloadUrl = url.toString()
    }

    if (url.pathname === '/th') {
        url.searchParams.set('w', '1024')
        url.searchParams.set('h', '576')
    }

    const previewUrl = url.toString()

    return {
        downloadUrl,
        previewUrl,
    }
}
