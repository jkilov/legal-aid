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
    if (!req.headers) {
        return res.status(401).send("No Auth Headers Exist")
    }
    const authHeader = req.headers.authorization

if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Not Authenticated")
} 

const token = authHeader.replace("Bearer ", "")

const {data: {user}, error} = await supabase.auth.getUser(token)
if (error || !user) {
    return res.status(401).send("Invalid token")
}
res.status(200).json({user,})
})



app.listen(port, () => {
    console.log(`Express listening on port ${port}`)
})