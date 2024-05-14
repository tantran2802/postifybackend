import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { User } from './users/user.entity';
import { Posts } from './posts/post.entity';
import { PostsController } from './posts/posts.controller';
import { ImagesModule } from './images/images.module';
import { Image } from './images/image.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './common/constants/auth.constants';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    database: 'education',
    host: 'localhost',
    port: 5432,
    username: 'company',
    entities: [User, Posts, Image],
    // schema
    synchronize: true

  }),
  UsersModule,
  PostsModule,
AuthModule,
/* JwtModule.register({secret: authConstants.secret, 
  signOptions: {expiresIn: '1d'}
}
  ) */
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
