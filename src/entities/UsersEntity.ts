import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";
import { ArgsType, Field, ID, InputType, ObjectType } from "type-graphql";
import {
    ChildID,
    ParentID,
    User,
    UserRolesEnum,
    UserStatusEnum,
} from "../models/User";

@ObjectType({ description: "ChildIDObject" })
@InputType("ChildIDInput")
export class ChildIDEntity implements ChildID {
    @Field(() => [ID], { nullable: true })
    @prop({ type: Schema.Types.ObjectId })
    ADMID?: string[];

    @Field(() => [ID], { nullable: true })
    @prop({ type: Schema.Types.ObjectId })
    AGEID?: string[];

    @Field(() => [ID], { nullable: true })
    @prop({ type: Schema.Types.ObjectId })
    EMPID?: string[];
}

@ObjectType({ description: "ParentIDObject" })
@InputType("ParentIDInput")
export class ParentIDEntity implements ParentID {
    @Field(() => [ID], { nullable: true })
    @prop({ type: Schema.Types.ObjectId })
    SADMID?: string[];

    @Field(() => [ID], { nullable: true })
    @prop({ type: Schema.Types.ObjectId })
    ADMID?: string[];

    @Field(() => [ID], { nullable: true })
    @prop({ type: Schema.Types.ObjectId })
    AGEID?: string[];
}

@ObjectType({ description: "User" })
@modelOptions({ options: { customName: "Users", allowMixed: 0 } })
@ArgsType()
export class UsersEntity implements User {
    @Field(() => ID)
    id!: string;

    @Field()
    @prop({ required: true, trim: true, unique: true })
    username!: string;

    @prop({ required: true })
    password!: string;

    @Field()
    @prop({ required: true, trim: true })
    firstname!: string;

    @Field()
    @prop({ required: true, trim: true })
    lastname!: string;

    @Field({ nullable: true })
    @prop({ trim: true })
    tagname?: string;

    @Field(() => ChildIDEntity, { nullable: true })
    @prop()
    child?: ChildIDEntity;

    @Field(() => ParentIDEntity, { nullable: true })
    @prop()
    parent?: ParentIDEntity;

    @Field()
    @prop({
        required: true,
        type: String,
        enum: UserRolesEnum,
        default: UserRolesEnum.EMPLOYEE,
    })
    role!: UserRolesEnum;

    @Field()
    @prop({
        required: true,
        type: String,
        enum: UserStatusEnum,
        default: UserStatusEnum.REGULAR,
    })
    status!: UserStatusEnum;

    @prop()
    resetPasswordToken?: string;

    @prop()
    resetPasswordTokenExpiry?: number;

    @prop({ default: 0, required: true })
    tokenVersion!: number;

    @Field(() => Date)
    @prop({ required: true })
    createAt!: Date;

    @Field(() => Date)
    @prop({ required: true })
    updateAt!: Date;

    @Field(() => Date, { nullable: true })
    @prop()
    lastActive?: Date;
}

export const UsersModel = getModelForClass(UsersEntity);
