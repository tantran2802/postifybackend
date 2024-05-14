import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/images/image.entity';
import { ImagesModule } from 'src/images/images.module';
import { User } from 'src/users/user.entity';
import { Posts } from './post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [JwtModule,TypeOrmModule.forFeature([Posts, User, Image]),
ImagesModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}
