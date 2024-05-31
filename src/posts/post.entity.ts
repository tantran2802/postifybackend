import { Image } from "src/images/image.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('posts')
export class Posts {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.posts)
    user: User

    @Column()
    content: string;

    @OneToMany(() => Image, (image) => image.post, {eager: true, cascade: ['update']})
    images: Image[];

    @Column({ type: "timestamptz",
    //  default: () => "CURRENT_TIMESTAMP" 
    })
    createdDate: Date;
}
