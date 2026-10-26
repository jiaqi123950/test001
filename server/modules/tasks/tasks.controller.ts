import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import type { Task, TaskListResponse, TaskPriority } from '@shared/api.interface';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query('priority') priority?: string): Promise<TaskListResponse> {
    const validPriority = (priority === 'high' || priority === 'medium' || priority === 'low')
      ? priority as TaskPriority
      : undefined;
    const items: Task[] = await this.tasksService.findAll(validPriority);
    return { items };
  }

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto.title, dto.priority);
  }

  @Patch(':id/toggle')
  async toggle(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<Task> {
    const isCompleted = dto.isCompleted !== undefined ? dto.isCompleted : false;
    return this.tasksService.toggleComplete(id, isCompleted);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.tasksService.remove(id);
    return { success: true };
  }
}
