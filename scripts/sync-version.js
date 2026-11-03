/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const path = require('path');

const PKG_VERSION = process.env.npm_package_version;
const packages = ['common', 'muruca', 'arianna', 'dataviz'];

const rootPkgPath = path.join(path.dirname(fs.realpathSync(__filename)), '../package.json');
const rootPkg = require(rootPkgPath);
const rootDeps = { ...rootPkg.dependencies, ...rootPkg.devDependencies };

const pkgUpdate$ = packages.map((pkg) => {
  const pkgPath = path.join(path.dirname(fs.realpathSync(__filename)), `../projects/n7-boilerplate-${pkg}/package.json`);
  const pkgFile = require(pkgPath);

  // update version
  pkgFile.version = PKG_VERSION;

  // sync dep versions from root — any dep declared in a sub-package that also
  // exists in the root is kept in lockstep to prevent published/installed drift
  ['dependencies', 'peerDependencies'].forEach((section) => {
    if (!pkgFile[section]) return;
    Object.keys(pkgFile[section]).forEach((dep) => {
      if (rootDeps[dep]) {
        pkgFile[section][dep] = rootDeps[dep];
      }
    });
  });

  return fs.writeJson(pkgPath, pkgFile, {
    spaces: 2
  });
});

Promise.all(pkgUpdate$)
  .then(() => {
    console.log(`${packages.join(', ')} packages version updated to ${PKG_VERSION}`);
  })
  .catch((err) => {
    console.warn(`${packages.join(', ')} packages version update error`, err);
  });
