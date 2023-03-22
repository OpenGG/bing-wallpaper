export const retry = async <T>(fn: () => Promise<T>, times = 3): Promise<T> => {
    let err: Error | null = null
    for (let i = 0; i < times; ++i) {
        try {
            const res = await fn()

            return res
        }catch(e: any) {
            err = e
        }
    }

    if (err) {
        throw err
    }

    throw new Error('Unknown error')
}
