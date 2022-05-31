import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';
import { Not, UpdateResult } from 'typeorm';
import { status } from 'src/shared/entity-status.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository( RoleRepository )
    private readonly _roleRepository: RoleRepository,
  ) { }


  async get( id: number ): Promise<Role> {
    if ( !id ) {
      throw new BadRequestException( 'id must be sent' );
    }

    const role: Role = await this._roleRepository.findOne( id, {
      where: { status: status.ACTIVE }
    } );

    if ( !role ) {
      throw new NotFoundException();
    }

    return role;
  }

  async getAll(): Promise<Role[]> {

    const roles: Role[] = await this._roleRepository.find( {
      where: { status: status.ACTIVE }
    } );

    return roles;
  }

  async create( role: Role ): Promise<Role> {
    try {
      const savedRole: Role = await this._roleRepository.save( role );
      return savedRole;
    } catch ( error ) {
      console.log( error );
      throw new InternalServerErrorException( error );
    }
  }

  async update( id: number, role: Role ): Promise<Role> {
    try {
      const updatedRole = await this._roleRepository.update( id, role );
      if ( updatedRole.affected < 1 ) {
        throw new NotFoundException();
      }
      return role;
    } catch ( error ) {
      console.log( error );
      throw new InternalServerErrorException( error );
    }
  }

  async delete( id: number ): Promise<Role> {

    const roleExists: Role = await this._roleRepository.findOne( id, {
      where: { status: status.ACTIVE }
    } );

    if ( !roleExists ) {
      throw new NotFoundException();
    }
    try {
      await this._roleRepository.update( id, { status: status.INACTIVE } );
      return roleExists
    } catch ( error ) {
      console.log( error );
      throw new InternalServerErrorException( error );
    }
  }
}
