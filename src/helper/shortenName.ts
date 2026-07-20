
export const shortenName = (name: string): string => {

    const splitName = name.slice(0, 20)

    return splitName+"..."

}