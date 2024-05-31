import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from 'src/users/dto/update-user-dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { UpdateResult } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './jwt-guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UsersService){}
    @Post('login')
    login(@Body()loginDto: LoginDto): Promise<{accessToken: string}> {
        return this.authService.login(loginDto);
    }
    @Get('users')
    @UseGuards(JwtAuthGuard)
    findUser(@Req()req): Promise<User>{
        const token = req.headers.authorization.split(' ')[1];
        return this.userService.findUserByToken(token);
    }
    @Put('users')
    @UseGuards(JwtAuthGuard)
    update(@Body() updateUserDto: UpdateUserDto, @Req()req): Promise<UpdateResult>{
            const token = req.headers.authorization.split(' ')[1];
            return this.userService.updateUser(token, updateUserDto);
    }
    @Put('valid')
    checkValidToken(@Req() req): Promise<{valid: string}>{
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.checkValidToken(token);
    }
}
