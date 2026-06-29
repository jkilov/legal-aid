import type {Request, Response, NextFunction} from "express"
import {supabase} from "../config/supabase"



export const requireAuth = async(req: Request,res: Response, next: NextFunction) => {

try {

  const authHeader = req.headers.authorization

  if (!authHeader) {
      throw new Error("Missing auth Header")
  }

  const token = authHeader?.replace("Bearer ", "")

  const {data: {user}, error: authError} = await supabase.auth.getUser(token)

  if (authError || !user) {
throw new Error ("Invalid Auth")
}

  req.user = user

  next()

  
} catch (error) {
  return res.status(503).json({ message: error instanceof Error ? error.message : "Something went wrong"})
}


   
   

}
