import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository( UserRepository )
    private readonly _userRepository: UserRepository,
  ) { }


  async get( id: number ): Promise<User> {
    if ( !id ) {
      throw new BadRequestException( 'Id must be sent' );
    }

    const userExists: User = await this._userRepository.findOne( id, {
      where: { status: 'ACTIVE' }
    } );

    if ( !userExists ) {
      throw new NotFoundException();
    }

    return userExists;
  }




  async getAll(): Promise<User[]> {

    const users: User[] = await this._userRepository.find( {
      where: { status: 'ACTIVE' }
    } );

    return users;
  }



  async create( user: User ): Promise<User> {
    const details = new UserDetails();
    user.details = details;

    const repo = await getConnection().getRepository( Role );
    const defaultRole = await repo.findOne( { where: { name: 'GENERAL' } } );
    user.roles = [ defaultRole ];

    const savedUser: User = await this._userRepository.save( user );
    return savedUser;
  }



  async update( id: number, user: User ): Promise<User> {
    if ( !id ) {
      throw new BadRequestException( 'Id must be sent' );
    }

    const userExists: User = await this._userRepository.findOne( id, {
      where: { status: 'ACTIVE' }
    } );

    if ( !userExists ) {
      throw new NotFoundException();
    }

    try {
      await this._userRepository.update( id, user );
      return user;
    } catch ( error ) {
      console.log( error );
      throw new InternalServerErrorException( error );
    }
  }



  async delete( id: number ): Promise<User> {
    const userExists: User = await this._userRepository.findOne( id, {
      where: { status: 'ACTIVE' }
    } );

    if ( !userExists ) {
      throw new NotFoundException();
    }
    try {
      await this._userRepository.update( id, { status: 'INACTIVE' } );
      return userExists;
    } catch ( error ) {
      console.log( error );
      throw new InternalServerErrorException();
    }
  }
}
