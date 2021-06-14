import bcrypt from "bcrypt";
import { UsersModel } from "../entities/UsersEntity";
import { Messages } from "../models/Messages";
import { UserRolesEnum } from "../models/User";
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
