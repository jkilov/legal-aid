import type {Request, Response, NextFunction} from "express"
import {supabase} from "../config/supabase"



export const requireAuth = async(req: Request,res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "Missing authorization header" })
    }

    const token = authHeader?.replace("Bearer ", "")

    const {data: {user}, error: authError} = await supabase.auth.getUser(token)

    if (authError || !user) {
      return  res.status(401).json({ message: "Invalid Authorization" })
    }

    req.user = user

    next()

   

}
