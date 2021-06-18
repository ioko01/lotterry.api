import bcrypt from "bcrypt";
import { isAuthorization } from "./../handlers/AuthHandler";
import { AppContext } from "./../models/AppContext";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UsersEntity, UsersModel } from "../entities/UsersEntity";
import { isAuthenticated } from "../handlers/AuthHandler";
import { UserRoles, UserRolesEnum } from "../models/User";
import { validatePassword, validateUsername } from "../utils/validate";
import { DocumentType } from "@typegoose/typegoose";
import { GMT } from "../utils/time";

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

    @Mutation(() => UsersEntity, { nullable: true })
    async createUser(
        @Ctx() { req }: AppContext,
        @Arg("username") username: string,
        @Arg("password") password: string,
        @Arg("firstname") firstname: string,
        @Arg("lastname") lastname: string,
        @Arg("tagname", { nullable: true }) tagname: string,
        @Arg("role") role: UserRoles
    ) {
        if (!username) throw new Error("username is not empty");
        if (!password) throw new Error("password is not empty");
        if (!firstname) throw new Error("firstname is not empty");
        if (!lastname) throw new Error("lastname is not empty");
        if (!role) throw new Error("role is not empty");

        const isValidateUsername = validateUsername(username);
        if (!isValidateUsername) throw new Error("username invalid");

        const isValidatePassword = validatePassword(password);
        if (!isValidatePassword) throw new Error("password invalid");

        const user = await isAuthenticated(req.UID, req.tokenVersion);
        await isAuthorization(user, [UserRolesEnum.SUPER_ADMIN]);

        const findUser = await UsersModel.findOne({ username });

        if (findUser) throw new Error("this user is used");

        const hashedPassword = await bcrypt.hash(password, 10);

        let parent = {};

        if (user.role === ("SUPER_ADMIN" as UserRoles))
            parent = { "parent.SADMID": req.UID };

        if (user.role === ("ADMIN" as UserRoles))
            parent = { "parent.ADMID": req.UID };

        const newUser = await UsersModel.create({
            username,
            password: hashedPassword,
            firstname,
            lastname,
            tagname,
            role,
            parent,
            createAt: GMT(),
            updateAt: GMT(),
        } as DocumentType<UsersEntity>);

        await newUser.save();

        let child = {};

        if (newUser.role === ("ADMIN" as UserRoles))
            child = { "child.ADMID": newUser.id };

        if (newUser.role === ("AGENT" as UserRoles))
            child = { "child.AGEID": newUser.id };

        if (newUser.role === ("EMPLOYEE" as UserRoles))
            child = { "child.EMPID": newUser.id };

        await UsersModel.updateMany(
            { _id: req.UID },
            { $push: child },
            { new: true }
        );

        return newUser;
    }
}
