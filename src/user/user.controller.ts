import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {User} from './user.interface';
import {UserService} from './user.service';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    createUser(@Body() user: User) {
        return this.userService.create(user)
    }

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
