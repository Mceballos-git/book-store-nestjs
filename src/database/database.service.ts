import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../config/config.keys';
import { ConnectionOptions } from 'typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
  TypeOrmModule.forRootAsync( {
    imports: [ ConfigModule ],
    inject: [ ConfigService ],
    async useFactory( config: ConfigService ) {
      return {
        // ssl: true,
        synchronize: true,
        type: 'postgres',
        host: config.get( Configuration.HOST ),
        port: 5444,
        database: config.get( Configuration.DATABASE ),
        username: Configuration.USERNAME,
        password: Configuration.PASSWORD,
        entities: [ __dirname + '/../**/*.entity{.ts,.js}' ],
        migrations: [ __dirname + '/migrations/*{.ts,.js}' ]
      } as ConnectionOptions;
    }
  } )
]