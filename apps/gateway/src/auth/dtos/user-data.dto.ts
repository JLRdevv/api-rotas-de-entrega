import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class userDataDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
