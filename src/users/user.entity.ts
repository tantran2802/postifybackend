import { Exclude } from "class-transformer";
import { Posts } from "src/posts/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;
    
    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    bubbles: number;

    @OneToMany(() => Posts, (post) => post.user, {eager: false})
    posts: Posts[];
}
