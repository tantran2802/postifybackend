import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { User } from './users/user.entity';
import { Posts } from './posts/post.entity';
import { Image } from './images/image.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    entities: [User, Posts, Image],
    // schema
    synchronize: true,
    ssl: {
      rejectUnauthorized: false, // Change to true in production with a valid CA
      // Example of adding CA, key, and cert:
      // ca: fs.readFileSync('path/to/server-ca.pem').toString(),
      // key: fs.readFileSync('path/to/client-key.pem').toString(),
      // cert: fs.readFileSync('path/to/client-cert.pem').toString(),
    }

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
