import { forwardRef, Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import { RolesGuard } from './guards/roles-guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {expiresIn: '200s'}
            })
        })
    ],
    providers: [ AuthService, RolesGuard, JwtAuthGuard, JwtStrategy ],
    controllers: [ AuthController ],
    exports: [ AuthService ]
})
export class AuthModule {

}
