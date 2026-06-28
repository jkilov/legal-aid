import {useState} from "react"
export const useAsyncFunction = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const run = async <T,>(callback: () => Promise<T>): Promise<T> => {

        try {
            setIsLoading(true)
            setError(null)
         const result = await callback()
            return result
        } catch (err) {
            const message = err instanceof Error ? err.message : "something went wrong";
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }
    return {isLoading, error, run}
}


