
export const formattedDate = (date: Date): string => {

    const convertDate = date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return convertDate

}