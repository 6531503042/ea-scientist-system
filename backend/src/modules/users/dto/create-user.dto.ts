import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, MinLength } from 'class-validator';

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer',
}

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
