import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNumber()
    readonly bubbles: number;
    
    @IsArray()
    @IsNumber({}, {each: true})
    readonly posts: number[];
}