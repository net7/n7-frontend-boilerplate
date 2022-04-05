/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const path = require('path');

const PKG_VERSION = process.env.npm_package_version;
const packages = ['common', 'muruca', 'arianna', 'dataviz'];

const pkgUpdate$ = packages.map((pkg) => {
  const pkgPath = path.join(path.dirname(fs.realpathSync(__filename)), `../projects/n7-boilerplate-${pkg}/package.json`);
  const pkgFile = require(pkgPath);

  // update version
  pkgFile.version = PKG_VERSION;
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
