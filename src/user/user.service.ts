import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllUsers(){
        return this.userRepository.find();
    }

    async createUser(createUserDto: CreateUserDto){
        createUserDto.createdTime = new Date();
        return this.userRepository.save(createUserDto);
    }
}
