type BingImage = {
    startdate: string
    url: string
    copyright: string
    title: string
}

const isValidBingImage = ({
    startdate,
    url,
    copyright,
    title,
}: BingImage) => (
    typeof startdate === 'string'
    && /^\d{8}$/.test(startdate)
    && typeof url === 'string'
    && typeof copyright === 'string'
    && typeof title === 'string'
)

export const getBingImages = async (): Promise<BingImage[]> => {
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

    return images;
}
