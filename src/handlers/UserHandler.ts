import bcrypt from "bcrypt";
import { UsersEntity, UsersModel } from "../entities/UsersEntity";
import { Messages } from "../models/Messages";
import { UserRolesEnum, UserStatus } from "../models/User";
import { GMT } from "../utils/time";

export const createSuperAdmin = async (): Promise<Messages | null> => {
    const user = await UsersModel.findOne({
        role: UserRolesEnum.SUPER_ADMIN,
    });

    if (!user) {
        const hashedPassword = await bcrypt.hash(
            process.env.SUPERADMIN_PASSWORD!,
            10
        );

        const createUser = await UsersModel.create({
            username: process.env.SUPERADMIN_USERNAME!,
            password: hashedPassword,
            role: UserRolesEnum.SUPER_ADMIN,
            lastActive: GMT(),
            updateAt: GMT(),
            createAt: GMT(),
        });

        await createUser.save();

        return { message: "success", statusCode: 200 };
    } else {
        return null;
    }
};

export const checkUserStatus = async (
    UID: string
): Promise<UsersEntity | null> => {
    const user = await UsersModel.findById(UID);
    if (!user) throw new Error("please login");

    switch (user.status as UserStatus) {
        case "BANNED":
            throw new Error("BANNED");
        case "CLOSED":
            throw new Error("CLOSE");
        case "EXPIRE":
            throw new Error("EXPIRE");
        case "REGULAR":
            return user;
        default:
            return null;
    }
};
