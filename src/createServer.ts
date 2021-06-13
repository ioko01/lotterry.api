import { createSuperAdmin } from "./handlers/UserHandler";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UsersModel } from "./entities/UsersEntity";
import { createToken, sendToken, verifyToken } from "./handlers/TokenHandler";
import { AppContext } from "./models/AppContext";
import { AuthResolvers } from "./resolvers/AuthResolvers";
import { UsersResolvers } from "./resolvers/UsersResolvers";

const { COOKIE_NAME } = process.env;

export default async () => {
    const schema = await buildSchema({
        resolvers: [UsersResolvers, AuthResolvers],
        emitSchemaFile: { path: "./src/schema.graphql" },
        validate: false,
    });

    return new ApolloServer({
        schema,
        context: async ({ req, res }: AppContext) => {
            const token = req.cookies[COOKIE_NAME!];
            try {
                createSuperAdmin();
                if (token) {
                    const decodedToken = verifyToken(token) as {
                        UID: string;
                        tokenVersion: number;
                        iat: number;
                        exp: number;
                    } | null;

                    if (decodedToken) {
                        req.UID = decodedToken.UID;
                        req.tokenVersion = decodedToken.tokenVersion;
                        const user = await UsersModel.findById(req.UID);
                        if (user) {
                            //Check token version
                            if (user.tokenVersion === req.tokenVersion) {
                                user.tokenVersion = user.tokenVersion + 1;
                                const updateUser = await user.save();

                                if (updateUser) {
                                    const token = createToken(
                                        updateUser.id,
                                        updateUser.tokenVersion
                                    );

                                    req.tokenVersion = updateUser.tokenVersion;

                                    sendToken(res, token);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                req.UID = undefined;
                req.tokenVersion = undefined;
            }
            return { req, res };
        },
    });
};
