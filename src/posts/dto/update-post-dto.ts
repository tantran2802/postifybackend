import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePostDto{
    @IsString()
    @IsOptional()
    content: string;

    @IsArray()
    @IsNumber({}, {each: true})
    images: number[]
}