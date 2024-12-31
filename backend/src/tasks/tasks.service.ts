import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        private usersService: UsersService,
    ) {}

    private async validateUser(userId: number) {
        try {
            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error validating user');
        }
    }

    async create(userId: number, createTaskDto: CreateTaskDto) {
        await this.validateUser(userId);
        try {
            const task = this.tasksRepository.create({
                ...createTaskDto,
                user: { id: userId }
            });
            return await this.tasksRepository.save(task);
        } catch (error) {
            throw new BadRequestException('Error creating task');
        }
    }

    async findAll(userId: number) {
        await this.validateUser(userId);
        try {
            return await this.tasksRepository.find({
                where: { user: { id: userId } },
                order: { createdAt: 'DESC' }
            });
        } catch (error) {
            throw new BadRequestException('Error fetching tasks');
        }
    }

    async findOne(userId: number, taskId: number) {
        await this.validateUser(userId);
        try {
            const task = await this.tasksRepository.findOne({
                where: { id: taskId, user: { id: userId } }
            });
            if (!task) {
                throw new NotFoundException(`Task with ID ${taskId} not found`);
            }
            return task;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error fetching task');
        }
    }

    async update(userId: number, taskId: number, updateTaskDto: UpdateTaskDto) {
        await this.validateUser(userId);
        try {
            const task = await this.findOne(userId, taskId);
            await this.tasksRepository.update(
                { id: taskId, user: { id: userId } },
                updateTaskDto
            );
            return this.findOne(userId, taskId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error updating task');
        }
    }

    async remove(userId: number, taskId: number) {
        await this.validateUser(userId);
        try {
            const task = await this.findOne(userId, taskId);
            await this.tasksRepository.remove(task);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error deleting task');
        }
    }
}
