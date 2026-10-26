import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    this.client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      const { error } = await this.client.from('tasks').select('id').limit(1);
      if (error) {
        this.logger.warn(
          `Supabase tasks 表访问异常: ${error.message}。` +
          '请在 Supabase Dashboard 的 SQL Editor 中执行建表语句。',
        );
      } else {
        this.logger.log('Supabase tasks 表连接正常');
      }
    } catch (error) {
      this.logger.error(`Supabase 连接失败: ${error}`);
    }
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
