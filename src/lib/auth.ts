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
console.log("USer signed out")
}

export const signInGoogle = async() => {

    console.log("Starting Google sing in");

const {data, error} = await supabase.auth.signInWithOAuth({
    provider: "google", options: {
    redirectTo: "http://localhost:5173"
}})
console.log("google response", data, error)
return {data, error}
}