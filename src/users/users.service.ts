import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Role } from '../public/enums/role.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject('Devices_MICROSERVICE') private readonly clientDevice: ClientProxy,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }

  async removeUserAndDevices(id: number) {
    const userToDelete = await this.findOne(id);
    await this.userRepository.delete(userToDelete);

    const data = await firstValueFrom(
      this.clientDevice.send('delete_devices', { userId: id }),
    );

    console.log('Deleted devices------>', data);
  }

  async create(createUserDto: CreateUserDto) {
    const userToCreate = { ...createUserDto, role: Role.User };
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const newPassword = await bcrypt.hash(createUserDto.password, salt);
    const userWithHashedPassword = { ...userToCreate, password: newPassword };
    return this.userRepository.save(userWithHashedPassword);
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const saltOrRounds = 10;
      const salt = await bcrypt.genSalt(saltOrRounds);
      const newPassword = await bcrypt.hash(updateUserDto.password, salt);
      const userWithHashedPassword = {
        ...updateUserDto,
        password: newPassword,
      };
      await this.userRepository.update(id, userWithHashedPassword);
    } else {
      await this.userRepository.update(id, updateUserDto);
    }

    return this.findOne(id);
  }
}
