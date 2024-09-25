import SupabaseConnector from '../connectors/supabase.connector';

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
    const supabaseFilePath = `${bucketFolder}/${userId}-${Date.now()}${fileName}`;
    return await this.supabaseConnector.getUploadUrl(supabaseFilePath);
  }
}

export default SupabaseService;
