import { sign, verify } from "jsonwebtoken";
import { Response } from "express";
import { privateKey, publicKey } from "../utils/keys";

const { COOKIE_NAME, FRONT_URI } = process.env;

/**
 * @description สร้าง Token โดยใช้อัลกอริธึม RS256 มีอายุ 1 วัน
 * @param tokenVersion เวอร์ชันของ Token
 */
export const createToken = (UID: string, tokenVersion: number) => {
    return sign({ UID, tokenVersion }, privateKey, {
        algorithm: "RS256",
        expiresIn: "1d",
    });
};

/**
 * เก็บ Token ไว้ใน Cookies
 */
export const sendToken = (res: Response, token: string) =>
    res.cookie(COOKIE_NAME!, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        domain: FRONT_URI,
    });

export const verifyToken = (token: string) =>
    verify(token, publicKey, {
        algorithms: ["RS256"],
    });
