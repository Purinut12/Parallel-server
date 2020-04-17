import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers(){
        return this.userService.getAllUsers();
    }

    /*@Post()
    async createNewUser(@Body() createUserDto: CreateUserDto){
        return this.userService.createUser(createUserDto);
    }*/

    @Post('login')
    async login(@Body() createUserDto: CreateUserDto){
        return this.userService.login(createUserDto);
    }
}
