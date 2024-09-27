import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigProps } from '../config';
import { Error500 } from '../errors/http.errors';

export class SupabaseConnector {
  name = 'supabaseConnector';
  supabase: SupabaseClient;
  bucketName: string;

  constructor(ctx: { clients: { supabase: SupabaseClient }; config: ConfigProps }) {
    this.supabase = ctx.clients.supabase;
    this.bucketName = ctx.config.supabase.bucketName;
  }

  async getUploadUrl(filePath: string) {
    console.log('filePath', filePath);
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Error creating presigned URL:', error);
      throw new Error500({ message: 'Error creating presigned URL' });
    }

    return {
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
    };
  }

  async deleteFile(path: string) {
    const { error } = await this.supabase.storage.from(this.bucketName).remove([path]);
    if (error) {
      console.error('Error deleting file:', error);
      throw new Error500({ message: 'Error deleting file' });
    }
  }
}

export default SupabaseConnector;
