import { Query, Resolver } from "type-graphql";
import { UsersEntity } from "../entities/UsersEntity";

@Resolver()
export class UsersResolvers {
    @Query(() => UsersEntity, { nullable: true })
    async me(): Promise<UsersEntity | null> {
        try {
            return null;
        } catch (error) {
            throw error;
        }
    }
}
