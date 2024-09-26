import { z } from 'zod';
import SupabaseConnector from '../connectors/supabase.connector';
import { Error400 } from '../errors/http.errors';

export class SupabaseService {
  name = 'supabaseService';
  supabaseConnector: SupabaseConnector;

  constructor(ctx: { connectors: { supabaseConnector: SupabaseConnector } }) {
    this.supabaseConnector = ctx.connectors.supabaseConnector;
  }

  async getUploadUrl({
    userId,
    bucketFolder,
    fileName,
  }: {
    userId: string;
    bucketFolder: string;
    fileName: string;
  }) {
    const schema = z.object({
      userId: z.string(),
      bucketFolder: z.string(),
      fileName: z.string(),
    });

    const parsedData = schema.safeParse({ userId, bucketFolder, fileName });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const supabaseFilePath = `${bucketFolder}/${userId}-${Date.now()}${fileName}`;
    return await this.supabaseConnector.getUploadUrl(supabaseFilePath);
  }
}

export default SupabaseService;
