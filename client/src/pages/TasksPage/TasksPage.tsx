import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { tasksApi } from '@/api';
import type { Task, TaskPriority } from '@shared/api.interface';

const priorityLabels: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const priorityBadgeVariant: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700 border border-red-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

type FilterType = 'all' | TaskPriority;

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const priorityParam = filter === 'all' ? undefined : filter;
      const data = await tasksApi.getTasks(priorityParam);
      setTasks(data);
    } catch {
      // 错误已在 api 层记录
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setAdding(true);
    try {
      await tasksApi.createTask({ title: title.trim(), priority });
      setTitle('');
      setPriority('medium');
      loadTasks();
    } catch {
      // 错误已在 api 层记录
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: string, currentCompleted: boolean) => {
    try {
      await tasksApi.toggleTask(id, !currentCompleted);
      loadTasks();
    } catch {
      // 错误已在 api 层记录
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      loadTasks();
    } catch {
      // 错误已在 api 层记录
    }
  };

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">
              智能任务管理
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              高效管理你的每日任务
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-6">
              <Input
                placeholder="输入任务标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                }}
                className="flex-1"
              />
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as TaskPriority)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} disabled={adding || !title.trim()}>
                <Plus className="w-4 h-4" />
                添加
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-500">筛选：</span>
              <div className="flex gap-1">
                {filterOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={filter === opt.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(opt.value)}
                    className="text-xs"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {loading && (
                <div className="text-center text-slate-400 py-8">
                  加载中...
                </div>
              )}
              {!loading && tasks.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  暂无任务，添加一个吧！
                </div>
              )}
              {!loading && tasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <button
                    onClick={() => handleToggle(task.id, task.isCompleted)}
                    className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={task.isCompleted ? '标记为未完成' : '标记为已完成'}
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      task.isCompleted
                        ? 'line-through text-slate-400'
                        : 'text-slate-700'
                    }`}
                  >
                    {task.title}
                  </span>
                  <Badge
                    className={`${priorityBadgeVariant[task.priority]} font-medium`}
                  >
                    {priorityLabels[task.priority]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                    aria-label="删除任务"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksPage;
