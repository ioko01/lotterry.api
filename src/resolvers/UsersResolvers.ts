import { isAuthorization } from "./../handlers/AuthHandler";
import { AppContext } from "./../models/AppContext";
import { Ctx, Query, Resolver } from "type-graphql";
import { UsersEntity } from "../entities/UsersEntity";
import { isAuthenticated } from "../handlers/AuthHandler";
import { UserRolesEnum } from "../models/User";

@Resolver()
export class UsersResolvers {
    @Query(() => UsersEntity, { nullable: true })
    async me(@Ctx() { req }: AppContext): Promise<UsersEntity | null> {
        try {
            const user = await isAuthenticated(req.UID, req.tokenVersion);
            await isAuthorization(user, [
                UserRolesEnum.SUPER_ADMIN,
                UserRolesEnum.ADMIN,
                UserRolesEnum.AGENT,
                UserRolesEnum.EMPLOYEE,
            ]);

            return user;
        } catch (error) {
            throw error;
        }
    }
}
