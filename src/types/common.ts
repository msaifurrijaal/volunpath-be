import { Application, Request, Response } from 'express';
import { ConfigProps } from '../config';
import { SupabaseClient } from '@supabase/supabase-js';
import SupabaseConnector from '../connectors/supabase.connector';

export interface AppServer<services = Services> extends Application {
  services: services;
  config: ConfigProps;
}

export interface BaseRequest<services = Services>
  extends Omit<Request<object, any, any, any, Record<string, any>>, 'Application'> {
  app: AppServer<services>;
}

export type BaseResponse<Data = any> = Response<{ message: string; data?: Data }>;

export interface JWTObject {
  id: number;
  roleId: number | null;
  type?: 'access_token' | 'refresh_token';
}

export interface ConnectorClients {
  supabase: SupabaseClient;
}

export interface Connectors {
  supabaseConnector: SupabaseConnector;
}

export interface Repositories {
  [key: string]: any;
}

export interface Services {
  [key: string]: any;
}
