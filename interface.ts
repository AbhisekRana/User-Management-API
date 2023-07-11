
declare global {
    namespace Express {
        export interface Request {
            user: string
        }
    }
}

export interface tokenstr {
    name: string
}