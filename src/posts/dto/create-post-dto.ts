import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto{
    @IsString()
    content: string;

    @IsArray()
    @IsString({each: true})
    images: string[];
}