import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('users/:userId/tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() createTaskDto: CreateTaskDto
    ) {
        return this.tasksService.create(userId, createTaskDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Param('userId', ParseIntPipe) userId: number) {
        return this.tasksService.findAll(userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.tasksService.findOne(userId, id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        return this.tasksService.update(userId, id, updateTaskDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.tasksService.remove(userId, id);
    }
}
