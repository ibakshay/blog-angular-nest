import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UserModule} from './user/user.module';
import {getConnectionOptions} from 'typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgresuser',
      password: 'password',
      database: 'postgresdb',
      entities: [ 'dist/**/*.entity{.ts,.js}' ],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10,
      autoLoadEntities: true,
    }),
    UserModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule { }
