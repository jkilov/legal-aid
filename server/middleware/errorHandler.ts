import type {Request, Response, NextFunction} from "express"
import {supabase} from "../config/supabase"

export const errorHandler = async(err: unknown, _req: Request, res: Response, _next: NextFunction) => {

    const {data, error} = await supabase.from("documents")
    .update({status: "failed"})

    if (err instanceof Error) {
        return res.status(500).json({
            message: err.message ||  "something went wrong"
        })
    }

   
}