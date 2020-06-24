/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const colors = require('./cli-colors');

const libSource = `${__dirname}/../dist/n7-boilerplate-lib/`;
const buildDest = `${__dirname}/../../n7-frontend-boilerplate-dist/`;
const packageJson = `${__dirname}/../package.json`;

// copy build files
// -------------------------------------------------------------------->
const copy$ = [];
// dist files
copy$.push(fs.copy(libSource, buildDest));

// folder controls
[libSource, buildDest].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    throw Error(`folder does not exists: ${folder}`);
  }
});

Promise.all(copy$)
  .then(() => {
    console.log(`${colors.FGCYAN}%s\x1b[0m`, 'dist folder copied\n');

    // version info
    fs.readJson(packageJson).then((json) => {
    // current version
      console.log(`${colors.FGCYAN}%s\x1b[0m`, `Is this the correct version ${json.version}?`);

      // update procedure
      console.log(`${colors.FGCYAN}%s\x1b[0m`, 'If you want to update it, first you must change the package.json file version key: "version": "<version_number>"');
      console.log(`${colors.FGCYAN}%s\x1b[0m`, 'Then remember to update repo version tag:\n');
      console.log(`${colors.FGGREEN}%s\x1b[0m`, `git tag -a v${json.version} -m'version v${json.version}'`);
      console.log(`${colors.FGGREEN}%s\x1b[0m`, 'git push --tags\n');
      console.log(`${colors.FGCYAN}%s\x1b[0m`, 'Then on n7-frontend-boilerplate-dist repo:\n');
      console.log(`${colors.FGGREEN}%s\x1b[0m`, 'cd ../n7-frontend-boilerplate-dist');
      console.log(`${colors.FGGREEN}%s\x1b[0m`, 'git add .');
      console.log(`${colors.FGGREEN}%s\x1b[0m`, `git commit -m'dist updated to version v${json.version}'`);
      console.log(`${colors.FGGREEN}%s\x1b[0m`, 'git push');
      console.log(`${colors.FGGREEN}%s\x1b[0m`, `git tag -a v${json.version} -m'version v${json.version}'`);
      console.log(`${colors.FGGREEN}%s\x1b[0m`, 'git push --tags');
    }).catch((err) => { console.error(err); });
  }).catch((err) => console.log(err));
