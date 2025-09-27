import {
    IsEmail,
    IsString,
    IsNotEmpty,
    IsStrongPassword,
} from 'class-validator';

export class userDataDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;
}
