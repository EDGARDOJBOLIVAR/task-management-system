import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TasksService } from '../tasks/tasks.service';
import { PaginationOptions, PaginatedResponse } from '../common/interfaces/pagination.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => TasksService))
    private tasksService: TasksService,
    private dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // Código PostgreSQL para violación de unique
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResponse<User>> {
    const [items, total] = await this.usersRepository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' }
    });

    return {
      items,
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit)
    };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    try {
      await this.usersRepository.update(id, updateUserDto);
      return await this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findOne(id);
      
      // Primero eliminar todas las tareas
      await this.tasksService.removeAllUserTasks(id);
      
      // Luego eliminar el usuario
      await this.usersRepository.remove(user);
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}