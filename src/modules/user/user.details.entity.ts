import { status } from 'src/shared/entity-status.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity( 'user_details' )
export class UserDetails extends BaseEntity {
    @PrimaryGeneratedColumn( 'increment' )
    id: number;

    @Column( { type: 'varchar', length: 50, nullable: true } )
    name: string;

    @Column( { type: 'varchar', nullable: true } )
    lastname: string;

    @Column( { type: 'varchar', default: status.ACTIVE, length: 8 } )
    status: string;

    @CreateDateColumn( { type: 'timestamp', name: 'created_at', nullable: true } )
    createdAt: Date;

    @UpdateDateColumn( { type: 'timestamp', name: 'updated_at', nullable: true } )
    updatedAt: Date;
}