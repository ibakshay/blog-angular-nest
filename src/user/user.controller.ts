import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import {User} from './user.interface';
import {UserService} from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    createUser(@Body() user: User) {
        return this.userService.create(user).pipe()
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
