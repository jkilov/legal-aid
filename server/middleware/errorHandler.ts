import type {Request, Response, NextFunction} from "express"


export const errorHandler = async(err: unknown, _req: Request, res: Response, _next: NextFunction) => {


   
        return res.status(500).json({ message: err instanceof Error ? err.message  :  "something went wrong"
        })
    }

   
