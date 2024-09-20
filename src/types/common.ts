import { Application, Request, Response } from 'express';
import { ConfigProps } from '../config';

export interface AppServer<services = Services> extends Application {
  services: services;
  config: ConfigProps;
}

export interface BaseRequest<services = Services>
  extends Omit<
    Request<object, any, any, any, Record<string, any>>,
    'Application'
  > {
  app: AppServer<services>;
}

export interface BaseResponse<Data = any>
  extends Response<{ message: string; data?: Data }> {}

export interface JWTObject {
  id: number;
  roleId: number | null;
  type?: 'access_token' | 'refresh_token';
}

export interface Repositories {}

export interface Services {}
