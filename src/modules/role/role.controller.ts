import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { UpdateResult } from 'typeorm';

@Controller( 'roles' )
export class RoleController {
  constructor( private readonly _roleService: RoleService ) { }


  @Get( ':id' )
  async getRole( @Param( 'id', ParseIntPipe ) id: number ): Promise<Role> {
    const role = await this._roleService.get( id );
    return role;
  }

  @Get()
  async getRoles(): Promise<Role[]> {
    const roles = await this._roleService.getAll();
    return roles;
  }

  @Post()
  async createRole( @Body() role: Role ): Promise<Role> {
    const createdRole = await this._roleService.create( role );
    return createdRole;
  }

  @Put( ':id' )
  async updateRole( @Param( 'id', ParseIntPipe ) id: number, @Body() role: Role ): Promise<Role> {
    const updatedRole = await this._roleService.update( id, role );
    return updatedRole;
  }

  @Delete( ':id' )
  async deleteRole( @Param( 'id', ParseIntPipe ) id: number ): Promise<Role> {
    const deletedRole = await this._roleService.delete( id );
    return deletedRole;
  }
}
