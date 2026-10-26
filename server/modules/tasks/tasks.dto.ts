import { IsString, IsIn, IsBoolean, IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';
import type { CreateTaskRequest, UpdateTaskRequest, TaskPriority } from '@shared/api.interface';

export class CreateTaskDto implements CreateTaskRequest {
  @IsString()
  @Length(1, 255)
  title!: string;

  @IsString()
  @IsIn(['high', 'medium', 'low'])
  @Type(() => String)
  priority!: TaskPriority;
}

export class UpdateTaskDto implements UpdateTaskRequest {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @IsIn(['high', 'medium', 'low'])
  @Type(() => String)
  priority?: TaskPriority;
}
