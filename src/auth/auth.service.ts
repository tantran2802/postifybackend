import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';
import { Payload } from './types';
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ){}
    async login(loginDto: LoginDto): Promise<{accessToken: string}>{
        const user = await this.userService.findUserByEmail(loginDto.email);
        const passwordMatched = await bcrypt.compare(
            loginDto.password,
            user.password
            
        );
        if (passwordMatched){
            delete user.password;
            const payload: Payload = {
                email: user.email,
                userId: user.id
            }
            return {accessToken: this.jwtService.sign(payload)}
        }else throw new UnauthorizedException('Password does not match!')
    }
    async checkValidToken(token: string): Promise<{valid: string}>{
        // const decodedToken = await this.jwtService.decode(token);
        // console.log(decodedToken);
        try {
            // Verify the token and check its expiration
            const decoded = await this.jwtService.verify(token);
            return {valid: 'Valid'};
          } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {valid: 'TokenExpiredError'}
            //   throw new UnauthorizedException('Token has expired');
            } else {
                return {valid: 'Invalid token'}
            //   throw new UnauthorizedException('Invalid token');
            }
        }
    }
}
