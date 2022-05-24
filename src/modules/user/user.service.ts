import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { MapperService } from '../../shared/mapper.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection, UpdateResult } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository( UserRepository )
    private readonly _userRepository: UserRepository,
    private readonly _mapperService: MapperService,
  ) { }


  async get( id: number ): Promise<UserDto> {
    if ( !id ) {
      throw new BadRequestException( 'Id must be sent' );
    }

    const userExists: User = await this._userRepository.findOne( id, {
      where: { status: 'ACTIVE' }
    } );

    if ( !userExists ) {
      throw new NotFoundException();
    }

    return this._mapperService.map<User, UserDto>( userExists, new UserDto() );
  }




  async getAll(): Promise<UserDto[]> {

    const users: User[] = await this._userRepository.find( {
      where: { status: 'ACTIVE' }
    } );

    return this._mapperService.mapCollection<User, UserDto>( users, new UserDto() );
  }



  async create( user: User ): Promise<UserDto> {
    const details = new UserDetails();
    user.details = details;

    const repo = await getConnection().getRepository( Role );
    const defaultRole = await repo.findOne( { where: { name: 'GENERAL' } } );
    user.roles = [ defaultRole ];

    const savedUser: User = await this._userRepository.save( user );
    return this._mapperService.map<User, UserDto>( savedUser, new UserDto() );
  }



  async update( id: number, user: User ): Promise<UserDto> {
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
      return this._mapperService.map<User, UserDto>( user, new UserDto() );
    } catch ( error ) {
      console.log( error );
      throw new InternalServerErrorException( error );
    }
  }



  async delete( id: number ): Promise<UserDto> {
    const userExists: User = await this._userRepository.findOne( id, {
      where: { status: 'ACTIVE' }
    } );

    if ( !userExists ) {
      throw new NotFoundException();
    }
    try {
      await this._userRepository.update( id, { status: 'INACTIVE' } );
      return this._mapperService.map<User, UserDto>( userExists, new UserDto() );
    } catch ( error ) {
      console.log( error );
      throw new InternalServerErrorException();
    }
  }
}
