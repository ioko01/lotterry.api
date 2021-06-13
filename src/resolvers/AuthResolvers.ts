import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UsersEntity, UsersModel } from "../entities/UsersEntity";
import { AppContext } from "../models/AppContext";
import { GMT } from "../utils/time";
import bcrypt from "bcrypt";
import { UserStatusEnum } from "../models/User";
import { createToken, sendToken } from "../handlers/TokenHandler";

@Resolver()
export class AuthResolvers {
    @Mutation(() => UsersEntity, { nullable: true })
    async signin(
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Ctx() { res }: AppContext
    ): Promise<UsersEntity | null> {
        try {
            const user = await UsersModel.findOneAndUpdate(
                { username },
                { lastActive: GMT() }
            );

            if (!user) throw new Error("no account");

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid) throw new Error("no account");

            switch (user.status) {
                case UserStatusEnum.BANNED:
                    throw new Error("BANNED");

                case UserStatusEnum.CLOSED:
                    throw new Error("CLOSED");

                case UserStatusEnum.EXPIRE:
                    throw new Error("EXPIRE");
                default:
            }
            
            const token = createToken(user.id, user.tokenVersion);
            
            sendToken(res, token);

            return user;
        } catch (error) {
            throw error;
        }
    }
}
