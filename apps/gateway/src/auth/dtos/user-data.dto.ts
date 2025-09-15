import { IsEmail, IsString, IsEmpty } from "class-validator"

export class userDataDto {
    @IsEmail()
    @IsEmpty()
    email: string

    @IsEmpty()
    @IsString()
    password: string
}