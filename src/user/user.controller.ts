import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { User, UserRole } from './user.interface';
import {UserService} from './user.service';

@Controller('users')
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


    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

        if (username === null || username === undefined) {
            return this.userService.paginate({ page: +page, limit: +limit, route: 'http://localhost:3000/api/users' });
        } //else {
        //     return this.userService.paginateFilterByUsername(
        //         { page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' },
        //         { username }
        //     )
        // }
    }

    @hasRoles(UserRole.ADMIN)
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

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(+id, user)
    }
}
