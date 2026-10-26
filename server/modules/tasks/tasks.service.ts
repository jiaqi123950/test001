import { Injectable, NotFoundException } from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.service';
import type { Task, TaskPriority } from '@shared/api.interface';

const priorityToZh: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const priorityFromZh: Record<string, TaskPriority> = {
  高: 'high',
  中: 'medium',
  低: 'low',
};

interface SupabaseTaskRow {
  id: number | string;
  title: string;
  priority: string;
  completed: boolean;
  created_at: string;
}

function mapRow(row: SupabaseTaskRow): Task {
  return {
    id: String(row.id),
    title: row.title,
    priority: priorityFromZh[row.priority] ?? 'medium',
    isCompleted: row.completed,
    createdAt: row.created_at,
  };
}

@Injectable()
export class TasksService {
  private readonly table = 'tasks';

  constructor(private readonly supabase: SupabaseService) {}

  async findAll(priority?: TaskPriority): Promise<Task[]> {
    const client = this.supabase.getClient();
    let query = client
      .from(this.table)
      .select('id, title, priority, completed, created_at')
      .order('created_at', { ascending: false });

    if (priority) {
      query = query.eq('priority', priorityToZh[priority]);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询任务失败: ${error.message}`);
    }

    return (data as SupabaseTaskRow[]).map(mapRow);
  }

  async create(title: string, priority: TaskPriority): Promise<Task> {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from(this.table)
      .insert({ title, priority: priorityToZh[priority], completed: false })
      .select('id, title, priority, completed, created_at')
      .single();

    if (error) {
      throw new Error(`创建任务失败: ${error.message}`);
    }

    return mapRow(data as SupabaseTaskRow);
  }

  async toggleComplete(id: string, isCompleted: boolean): Promise<Task> {
    const client = this.supabase.getClient();

    const numericId = Number(id);
    const filter = Number.isNaN(numericId) ? { id } : { id: numericId };

    const { data, error } = await client
      .from(this.table)
      .update({ completed: isCompleted })
      .eq('id', filter.id)
      .select('id, title, priority, completed, created_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('任务不存在');
      }
      throw new Error(`更新任务失败: ${error.message}`);
    }

    return mapRow(data as SupabaseTaskRow);
  }

  async remove(id: string): Promise<void> {
    const client = this.supabase.getClient();

    const numericId = Number(id);
    const filterId = Number.isNaN(numericId) ? id : numericId;

    const { error, count } = await client
      .from(this.table)
      .delete({ count: 'exact' })
      .eq('id', filterId);

    if (error) {
      throw new Error(`删除任务失败: ${error.message}`);
    }

    if (count === 0) {
      throw new NotFoundException('任务不存在');
    }
  }
}
