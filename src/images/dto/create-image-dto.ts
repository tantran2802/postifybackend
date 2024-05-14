import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateImageDto{
    @IsArray()
    @IsString({each: true})
    urls: string[];

}