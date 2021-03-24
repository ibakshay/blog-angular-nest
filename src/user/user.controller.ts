import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import {User} from './user.interface';
import {UserService} from './user.service';

@Controller('users ')
export class UserController {

    constructor(private userService: UserService) { }
    @Post()
    create(@Body() user: User): Observable<User | Object> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        )
    }

    @hasRoles('Admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('')
    findAllUsers() {
        return this.userService.findAll()
    }

    @Get(':id')
    findOneUser(@Param('id') id: string) {
        return this.userService.findOne(+id)
    }


    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteOne(+id)
    }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() user: User) {
        return this.userService.updateOne(+id, user)
    }
}
