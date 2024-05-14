import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}
    @Post()
    createUser(@Body()createUserDto: CreateUserDto): Promise<User>{
        try{
        return this.userService.create(createUserDto);
        }catch (e){
            throw e;
        }
    }
    /* @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe)id: number,
        @Body() updateUserDto: UpdateUserDto, @Req()req): Promise<UpdateResult>{
            console.log(req.user);
            return this.userService.updateUser(id, updateUserDto);
    } */
/*     @Get(':id')
    @UseGuards(JwtAuthGuard)
    findUser(@Param('id', ParseIntPipe)id: number): Promise<User>{
        return this.userService.findUserById(id);
    } */
    
}
