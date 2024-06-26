import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import { CreateImageDto } from 'src/images/dto/create-image-dto';
import { UpdateImageDto } from 'src/images/dto/update-image-dto';
import { Image } from 'src/images/image.entity';
import { ImagesService } from 'src/images/images.service';
import { UpdateResult } from 'typeorm';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { Posts } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService,
        private imageService: ImagesService){}
    @Post()
    @UseGuards(JwtAuthGuard)
    createPost(@Req() req,
        @Body()createPostDto: CreatePostDto): Promise<Posts>{
        const token = req.headers.authorization.split(' ')[1];
        return this.postService.create(token, createPostDto);
    }
    @Get('search')
    findPostByContent(@Query('keyword')keyword: string): Promise<Posts[]>{
        try {
            return this.postService.findContentByKeyword(keyword);
        }catch(e) {
            throw e;
        }
    }
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    updatePost(@Req()req, @Param('id', ParseIntPipe)id: number,
    @Body()updatePostDto: UpdatePostDto): Promise<UpdateResult>
    {
        const token = req.headers.authorization.split(' ')[1];
        return this.postService.update(id, updatePostDto, token);
    }
    @Get('user')
    @UseGuards(JwtAuthGuard)
    findPostsByUser(@Query('option')option: number, @Req()req): Promise<Posts[]>{
        const token = req.headers.authorization.split(' ')[1];
        return this.postService.findPostsByUserId(token, option);
    }
    @Post(':id/images')
    @UseGuards(JwtAuthGuard)
    createImg(
        @Req()req,
        @Param('id', ParseIntPipe)id: number,
        @Body()imageDto: CreateImageDto): Promise<Image[]>{
            const token = req.headers.authorization.split(' ')[1];
            return this.imageService.createImage(id, imageDto, token);
    }

    @Put(':id/images/:imageId')
    @UseGuards(JwtAuthGuard)
    updateImg(@Req() req, 
            @Param('id', ParseIntPipe)id: number,
            @Param('imageId', ParseIntPipe)imageId: number,
            @Body()imageDto: UpdateImageDto): Promise<UpdateResult>{
                const token = req.headers.authorization.split(' ')[1];
                return this.postService.updateImagesViaPostId(id, imageId, imageDto, token);
    }
    @Get(':id/images/:imageId')
    @UseGuards(JwtAuthGuard)
    findImageViaPostIdAndImageId(@Req() req, 
    @Param('id', ParseIntPipe)id: number,
    @Param('imageId', ParseIntPipe)imageId: number,
    @Body()imageDto: UpdateImageDto): Promise<Image>{
        const token = req.headers.authorization.split(' ')[1];
        return this.postService.findImageViaPostIdAndImageId(id, imageId, imageDto, token);
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)limit: number = 10
        ): Promise<Pagination<Posts>>
        {
            try{
                limit = limit > 100 ? 100 : limit;
                return this.postService.paginates({page, limit})
            }catch(e) {
                throw new HttpException("Forbidden", HttpStatus.FORBIDDEN, {cause: e})
            }
        }
    @Get('all')
    findAllPosts(): Promise<Posts[]>{
        return this.postService.findAllPosts();
    }
    @Get(':id')
    findPostById(@Param('id')id: number): Promise<Posts>{
        return this.postService.findPostById(id);
    }
}