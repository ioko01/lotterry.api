import { UsersModel } from "../entities/UsersEntity";
import { UserStatusEnum } from "../models/User";

/**
 * @description ตรวจสอบไอดีที่ล็อกอินเข้ามาว่ามี Token แนบมาด้วยหรือไม่
 * @returns User Model
 */
export const isAuthenticated = async (UID?: string, tokenVersion?: number) => {
    const isUser = await UsersModel.findById(UID);
    if (!isUser) throw new Error("please login");

    if (isUser.status !== UserStatusEnum.REGULAR)
        throw new Error("not authorization");

    if (tokenVersion !== isUser.tokenVersion)
        throw new Error("not authentication");

    return isUser;
};
