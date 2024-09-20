import { lstatSync, readdir } from 'fs';
import path from 'path';

const readFiles = async (dirname: string) => {
  let paths: string[] = [];
  const filenames = await promiseReadDir(dirname);
  for (const item of filenames) {
    const newPath = path.join(dirname, item);
    const type = lstatSync(newPath);
    if (type.isFile()) {
      paths.push(newPath);
    }
    if (type.isDirectory()) {
      paths = [...paths, ...(await readFiles(newPath))];
    }
  }

  return paths;
};

const promiseReadDir = (dirname: string) =>
  new Promise<string[]>((resolve) => {
    readdir(dirname, function (err, filenames) {
      if (err) {
        return;
      }
      resolve(filenames);
    });
  });

const shouldBeOk = (
  file: string,
  { includes, excludes }: { includes: string[]; excludes?: string[] },
) => {
  if (!includes) return false;
  let result = false;
  includes.forEach((e) => {
    if (file.endsWith(e)) result = true;
  });
  if (!result) return false;

  excludes?.forEach((e) => {
    if (file.endsWith(e)) {
      result = false;
    }
  });

  return result;
};

export default async function pathResolver(
  dirname: string,
  { includes, excludes }: { includes: string[]; excludes?: string[] },
) {
  const files = await readFiles(dirname);
  return files
    .map((e) => {
      if (shouldBeOk(e, { includes: includes, excludes: excludes })) {
        return e;
      }
    })
    .filter((item) => item);
}
