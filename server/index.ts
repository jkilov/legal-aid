import express, {Request, Response} from "express";

import { createClient } from "@supabase/supabase-js";
import "dotenv/config"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing supabase environment variables")
}

const supabase = createClient(supabaseUrl,supabaseKey )
const app = express()
const port = 3000

app.use(express.json())

app.get('/health', (req: Request, res: Response) => {res.status(200).send("Health Status: good")});

app.post('/placeholder', (req: Request, res: Response) => {
    const {name, age, email} = req.body

    if (typeof name !== "string" || typeof age !== "number" || typeof email !== "string") {
       return res.status(400).send("Invalid payload")
    } 
    return res.status(200).json({
        message: "valid payload"
    })
    
})

app.post('/authcheck', async(req, res)=> {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace("Bearer ", "")
    const test = "eyJhbGciOiJFUzI1NiIsImtpZCI6ImI3ZjI5Y2UwLWY0MzUtNGI2Zi05ZmQ3LTg1ZmZlNzQyZTlkYiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ZkeGhodmJ4bHZlc3p5cWNsZ254LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyNjNhYzcyZi04YjRkLTQyMmUtODRmYS0yZjNiZTQ2NGJlYjYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzgxMDgyMjQ0LCJpYXQiOjE3ODEwNzg2NDQsImVtYWlsIjoiam9zaC5raWxvdkBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiam9zaC5raWxvdkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIyNjNhYzcyZi04YjRkLTQyMmUtODRmYS0yZjNiZTQ2NGJlYjYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc4MTA3ODY0NH1dLCJzZXNzaW9uX2lkIjoiYjMwZWUwZTgtMmM0Yi00MDU3LWEyMjAtNmRlOTkwOWYxYTIzIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.0enZOObs5ScaBjVuFYkyZe13fy3gvoCJ_tdSB7iOb98sndJ1co6HE0xgWxhkcTlRtmqbCEJDXYAqpyXsdwxyVw"

    console.log({"url": authHeader})
if (!authHeader) {
    return res.status(401).send("Authorization token missing")
} else if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized access")
}
const {data: {user}, error} = await supabase.auth.getUser(token)
if (error || !user) {
    return res.status(401).send("Invalid token")
}
res.status(200).json({user,})
})

app.listen(port, () => {
    console.log(`Express listening on port ${port}`)
})