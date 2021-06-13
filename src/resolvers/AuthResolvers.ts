import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UsersEntity, UsersModel } from "../entities/UsersEntity";
import { AppContext } from "../models/AppContext";
import { GMT } from "../utils/time";
import bcrypt from "bcrypt";
import { UserStatusEnum } from "../models/User";
import { createToken, sendToken } from "../handlers/TokenHandler";
import { MessagesEntity } from "../entities/MessagesEntity";
import { checkUserStatus } from "../handlers/UserHandler";

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

            checkUserStatus(user.id);

            const token = createToken(user.id, user.tokenVersion);

            sendToken(res, token);

            return user;
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => MessagesEntity, { nullable: true })
    async signout(
        @Ctx() { req, res }: AppContext
    ): Promise<MessagesEntity | null> {
        try {
            const user = await UsersModel.findById(req.UID);
            if (!user) return null;

            user.tokenVersion = user.tokenVersion + 1;
            await user.save();

            res.clearCookie(process.env.COOKIE_NAME!);
            return { message: "logout" };
        } catch (error) {
            throw error;
        }
    }
}
