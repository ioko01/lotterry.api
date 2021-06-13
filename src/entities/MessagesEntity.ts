import { Field, ObjectType } from "type-graphql";

@ObjectType({ description: "Message" })
export class MessagesEntity {
    @Field()
    message!: string;
}
