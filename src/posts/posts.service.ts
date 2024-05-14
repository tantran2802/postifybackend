import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Image } from 'src/images/image.entity';
import { User } from 'src/users/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { Posts } from './post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Posts)
        private postRepo: Repository<Posts>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Image)
        private imgRepo: Repository<Image>,
        private jwtServ: JwtService
    ){}
    async create(token: string, createPostDto: CreatePostDto): Promise<Posts>{
        const decodedToken = this.jwtServ.decode(token);
        const user = await this.userRepo.findOneById(decodedToken.userId);
        const post = new Posts();
        if(!user){
            throw new HttpException('User does not exist!', HttpStatus.BAD_REQUEST);
        }else {post.user = user;}
        post.content = createPostDto.content;
        post.createdDate = new Date();
        if (createPostDto.images.length != 0){
            const images: Image[] = [];
            // const images: Image[] = await this.imgRepo.findByIds(createPostDto.images);
            for (let i = 0; i < createPostDto.images.length; i++){
                const image = new Image();
                image.urlAddress = createPostDto.images[i]
                
                images.push(await this.imgRepo.save(image));
            }
            post.images = images;
        }
        const returnPost = await this.postRepo.save(post);
        delete returnPost.user
        return returnPost;
    }
    async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult>{
        const post = await this.postRepo.findOneById(id);
        if(updatePostDto.content.length != 0){
            post.content = updatePostDto.content;
        }
        if(updatePostDto.images.length != 0){
            const images = await this.imgRepo.findByIds(updatePostDto.images);
            post.images.push(...images);
        }
        return this.postRepo.update(id, post);
    }
    async findContentByKeyword(keyword: string): Promise<Posts[]>{
        const posts: Posts[] = await this.postRepo.createQueryBuilder('p')
        .where('p.content LIKE :content', { content: `%${keyword}%` }).setFindOptions({
            loadEagerRelations: true,
          })
      .getMany();
        if(posts.length > 0) return posts
        else throw new HttpException("There is no any post!", HttpStatus.BAD_REQUEST);
    }
    async paginates(options: IPaginationOptions): Promise<Pagination<Posts>>{
        const queryBuilder = this.postRepo.createQueryBuilder('p');
        queryBuilder.setFindOptions({
            loadEagerRelations: true,
          }).orderBy('p.content', "DESC");
        return paginate<Posts>(queryBuilder, options);
    }
    async findPostsByUserId(token: string, option: number): Promise<Posts[]>{
        const decodedToken = this.jwtServ.decode(token);
        const posts = await this.postRepo.findBy({user: decodedToken.userId});
        if(posts.length == 0) throw new HttpException('There is no post', HttpStatus.BAD_REQUEST);
        else if (option == 0) return posts;
        else {
            return posts.filter((post) => post.id == option)
        }
    }
    async findAllPosts(): Promise<Posts[]>{
        return this.postRepo.find();
    }
}
