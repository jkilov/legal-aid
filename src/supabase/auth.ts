import {supabase} from "./client"

export const createUser = async (email: string, password: string) => {
    const {data, error} = await supabase.auth.signUp({
        email, password
    })

    return {data, error}
}

export const signInUser = async(email: string, password: string) => {

    const {data, error} = await supabase.auth.signInWithPassword({
        email, password
    })

    return {data, error}
}

export const signOutUser = async() => {
    await supabase.auth.signOut()
}