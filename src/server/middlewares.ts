import pathResolver from '../helpers/pathResolver';
import { Router } from 'express';

const getMiddleWares = async () => {
  const paths = await pathResolver(__dirname + '/../middlewares', {
    includes: ['.middleware.js', '.middleware.ts'],
  });
  console.log(`Building middlewares`);
  const routers: Router[] = [];

  for (const item of paths) {
    if (item) {
      console.log(
        item
          .replace(/.*\/middlewares\//gi, './middlewares/')
          .replace('.js', '.ts'),
      );
      const { default: router } = await import(item);

      routers.push(router);
    }
  }
  console.log(`Success built ${paths.length} middlewares`);
  return routers;
};

export default getMiddleWares;
