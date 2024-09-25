import { PrismaClient } from '@prisma/client';
import config, { ConfigProps } from '../config';
import { ConnectorClients, Connectors, Repositories, Services } from '../types/common';
import pathResolver from '../helpers/pathResolver';
import dbConnection from '../factories/dbConnection';
import supabaseConnection from '../factories/supabaseConnection';

const _populateRepositories = async (
  db: PrismaClient,
  config: ConfigProps,
): Promise<Repositories> => {
  const paths = await pathResolver(__dirname + '/../repositories', {
    includes: ['.repository.js', '.repository.ts'],
  });
  console.log(`\nBuilding repositories`);

  let repositories = {} as Repositories;

  for (const item of paths) {
    if (item) {
      console.log(item.replace(/.*\/repositories\//gi, './repositories/').replace('.js', '.ts'));
      const { default: RepositoryClass } = await import(item);

      const repositoryClass = new RepositoryClass(db, config);

      repositories = {
        ...repositories,
        [repositoryClass.name]: repositoryClass,
      };
    }
  }
  console.log(`Success built ${paths.length} repositories`);

  return repositories;
};

const _populateConnectors = async (
  clients: ConnectorClients,
  config: ConfigProps,
): Promise<Connectors> => {
  const paths = await pathResolver(__dirname + '/../connectors', {
    includes: ['.connector.js', '.connector.ts'],
  });
  console.log(`\nBuilding connectors`);

  let connectors = {} as Connectors;
  for (const item of paths) {
    if (item) {
      console.log(item.replace(/.*\/connectors\//gi, './connectors/').replace('.js', '.ts'));
      const { default: ConnectorClass } = await import(item);

      const connectorClass = new ConnectorClass({ clients, config });

      connectors = {
        ...connectors,
        [connectorClass.name]: connectorClass,
      };
    }
  }

  console.log(`Success built ${paths.length} connectors`);

  return connectors;
};

const _populateServices = async (ctx: {
  repositories: Repositories;
  connectors: Connectors;
  config: ConfigProps;
}): Promise<Services> => {
  const paths = await pathResolver(__dirname + '/../services', {
    includes: ['.service.js', '.service.ts'],
  });
  console.log(`\nBuilding services`);

  let services = {} as Services;
  for (const item of paths) {
    if (item) {
      console.log(item.replace(/.*\/services\//gi, './services/').replace('.js', '.ts'));
      const { default: ServiceClass } = await import(item);
      const serviceClass = new ServiceClass(ctx);

      services = {
        ...services,
        [serviceClass.name]: serviceClass,
      };
    }
  }

  console.log(`Success built ${paths.length} services`);

  return services;
};

const createService = async () => {
  const connectorClient: ConnectorClients = {
    supabase: await supabaseConnection(),
  };
  const postgresSql = await dbConnection();
  const repositories = await _populateRepositories(postgresSql, config);
  const connectors = await _populateConnectors(connectorClient, config);

  const context = {
    repositories,
    connectors,
    config,
  };

  return await _populateServices(context);
};

export default createService;
