export type BingImage = {
    startdate: string
    url: string
    copyright: string
    title: string
}

export const isValidBingImage = ({
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
