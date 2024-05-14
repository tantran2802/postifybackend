import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { authConstants } from 'src/common/constants/auth.constants';
import { JWTStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [JwtModule.register({secret: authConstants.secret, signOptions: {expiresIn: '1h'}}),
UsersModule
],

  providers: [AuthService, JWTStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
