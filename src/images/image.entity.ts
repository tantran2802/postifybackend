import { Posts } from "src/posts/post.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('images')
export class Image{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    urlAddress: string;

    @ManyToOne(() => Posts, (post) => post.images, {eager: false, cascade: ['update']})
    post: Posts;
    
}