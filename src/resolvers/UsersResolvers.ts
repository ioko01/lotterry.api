import { AppContext } from "./../models/AppContext";
import { Ctx, Query, Resolver } from "type-graphql";
import { UsersEntity, UsersModel } from "../entities/UsersEntity";
import { checkUserStatus } from "../handlers/UserHandler";

@Resolver()
export class UsersResolvers {
    @Query(() => UsersEntity, { nullable: true })
    async me(@Ctx() { req }: AppContext): Promise<UsersEntity | null> {
        try {
            const user = await UsersModel.findById(req.UID);
            if (!user) throw new Error("please login");

            checkUserStatus(user.id);

            return user;
        } catch (error) {
            throw error;
        }
    }
}
