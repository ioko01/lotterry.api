import { Request, Response } from "express";

interface AppRequest extends Request {
    UID?: string;
    tokenVersion?: number;
}

export interface AppContext {
    req: AppRequest;
    res: Response;
}
