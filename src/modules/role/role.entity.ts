
import { status } from 'src/shared/entity-status.enum';
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity( 'roles' )
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn( 'increment' )
    id: number;

    @Column( { type: 'varchar', length: 20, nullable: false } )
    name: string

    @Column( { type: "text", nullable: false } )
    description: string

    @ManyToMany( type => User, user => user.roles )
    @JoinColumn()
    users: User[]

    @Column( { type: 'varchar', default: status.ACTIVE, length: 8 } )
    status: string;

    @CreateDateColumn( { type: 'timestamp', name: 'created_at' } )
    createdAt: Date;

    @UpdateDateColumn( { type: 'timestamp', name: 'updated_at' } )
    updatedAt: Date;
}