import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/posts/post.entity';
import { User } from 'src/users/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateImageDto } from './dto/create-image-dto';
import { UpdateImageDto } from './dto/update-image-dto';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private imageRepo: Repository<Image>,
        @InjectRepository(Posts)
        private postRepo: Repository<Posts>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtServ: JwtService
    ){}
    async findOneById(id: number): Promise<Image>{
        return this.imageRepo.findOneById(id);
    }

    async deleteImage(id: number): Promise<DeleteResult>{
        return this.imageRepo.delete(id);
    }
    async createImage(id: number, createImgDto: CreateImageDto, token: string): Promise<Image[]>{
        const decodedToken = this.jwtServ.decode(token);
        const user = await this.userRepo.findOneById(decodedToken.userId);
        if(!user) throw new HttpException('There is no User', HttpStatus.BAD_REQUEST)
        const post = await this.postRepo.findOneBy({user: user});
        if (!post) throw new HttpException('There is no post', HttpStatus.BAD_REQUEST);
        if  (decodedToken.userId != post.user.id) throw new UnauthorizedException();
        let returnedImgs: Image[] = [];
        createImgDto.urls.forEach(async (url) => {
            const image = new Image();
            image.urlAddress = url;
            image.post = post;
            let returnedImg = await this.imageRepo.save(image);
            delete returnedImg.post;
            returnedImgs.push(returnedImg);
        })
        return returnedImgs;
    }
    async updateImg(id: number, updateImgDto: UpdateImageDto): Promise<UpdateResult>{
        const image = await this.imageRepo.findOneById(id);
        if(updateImgDto.url.length != 0){
            image.urlAddress = updateImgDto.url;
        }
        return this.imageRepo.update(id, image);
    }
}
