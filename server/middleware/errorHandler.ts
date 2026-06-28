import type {Request, Response, NextFunction} from "express"

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {

    if (err instanceof Error) {
        return res.status(500).json({
            message: err.message ||  "something went wrong"
        })
    }

   
}