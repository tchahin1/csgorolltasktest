import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
} from '@nrwl/devkit';
import { camelCase, startCase } from 'lodash';
import { GeneratorOptions } from './schema';
import { moduleGenerator } from '@nrwl/nest';

export default async function (tree: Tree, schema: GeneratorOptions) {
  await moduleGenerator(tree, {
    name: schema.name,
    project: 'api',
    directory: 'modules',
    skipImport: false,
  });

  // tree.delete(
  //   `./packages/api/src/modules/${schema.name}/${schema.name}.module.ts`
  // );
  generateFiles(
    tree, // the virtual file system
    joinPathFragments(__dirname, './files'), // path to the file templates
    `./packages/api/src/modules/${schema.name}`, // destination path of the files
    {
      ...schema,
      tmpl: '',
      startCase: (s: string) => startCase(s).replace(/\s/g, ''),
      camelCase,
    }, // config object to replace variable in file templates
  );

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
