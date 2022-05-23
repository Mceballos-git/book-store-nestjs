import { Module } from '@nestjs/common';
import { MapperService } from './mapper.service';


@Module( {
  imports: [],
  controllers: [],
  providers: [ MapperService ],
  exports: [ MapperService ]
} )

export class SharedModule {

}
