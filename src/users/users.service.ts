import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs'
import { Posts } from 'src/posts/post.entity';
import { UpdateUserDto } from './dto/update-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Posts)
        private postRepo: Repository<Posts>,
        private jwtServ: JwtService

    ){}
    async create(createUserDto: CreateUserDto): Promise<User>{
        const salt = await bcrypt.genSalt();
        var user = new User();
        user.password = await bcrypt.hash(createUserDto.password, salt);
        user.bubbles = 0;
        const email = await this.userRepo.findOneBy({email: createUserDto.email});
        if (email !== null){
            throw new HttpException('Email already existed!', HttpStatus.BAD_REQUEST);
        }
        user.email = createUserDto.email;
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.posts = await this.postRepo.findByIds(createUserDto.posts);
        user = await this.userRepo.save(user);
        delete user.password;
        return user;
    }
    async updateUser(token: string, updateUserDto: UpdateUserDto): Promise<UpdateResult>{
        const tokenGot = await this.jwtServ.decode(token);
        const user = await this.userRepo.findOneById(tokenGot.userId);
        if(!user) throw new HttpException('User does not exist!', HttpStatus.BAD_REQUEST);
        if(updateUserDto.firstName.length != 0){
            user.firstName = updateUserDto.firstName;
        }
        if(updateUserDto.lastName.length != 0){
            user.lastName = updateUserDto.lastName;
        }
        if(updateUserDto.password.length != 0){
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(updateUserDto.password, salt);
        }
        if(updateUserDto.email.length != 0){
            if (this.userRepo.findOneBy({email: updateUserDto.email}) == null){
                user.email = updateUserDto.email;
            }else throw new HttpException('Email already existed!', HttpStatus.BAD_REQUEST);
        }
        const updateUserReturn = await this.userRepo.update(tokenGot.userId, user);
        return updateUserReturn;
    }
    async findUserByToken(token: string): Promise<User>{
        const tokenObtained = await this.jwtServ.decode(token);
        const user = this.userRepo.findOneById(tokenObtained.userId);
        if(!user) throw new HttpException('User does not exist!', HttpStatus.BAD_REQUEST);
        delete (await (user)).password;
        return user;
    };
    async findUserByEmail(email: string): Promise<User>{
        const user = await this.userRepo.findOneBy({email: email});
        if(!user){
            throw new HttpException('Email does not existed!', HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}
