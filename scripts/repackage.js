const fs = require("fs-extra");
const colors = require("./cli-colors");
const stylesSource = __dirname + '/../projects/n7-boilerplate-lib/src/lib/styles';
const stylesDest = __dirname + '/../dist/n7-boilerplate-lib/styles';
const distSource = __dirname + '/../dist/n7-boilerplate-lib';
const repkg = __dirname + '/../dist/repkg';

// copy build files
// -------------------------------------------------------------------->
let copy$ = [];
// styles files
copy$.push(fs.copy(stylesSource, stylesDest));

// folder controls
[stylesSource].forEach(folder => {
  if (!fs.existsSync(folder)) {
    throw Error(`folder does not exists: ${folder}`);
  }
});

Promise.all(copy$)
  .then(() => {
    console.log(`${colors.BFGBLUE}%s\x1b[0m`, `Building linkable '@n7-frontend/boilerplate'`);
    console.log(`${colors.BFGBLUE}%s\x1b[0m`, `Copying /styles/ folder to n7-boilerplate-lib`);
    return fs.copy(distSource, repkg)
  })
  .then(() => {
    console.log(`${colors.FGGREEN}%s\x1b[0m`, `Dist repackaged successfully!`);
    console.log(`${colors.FGGREEN}%s\x1b[0m`, `- from:\t${distSource}`);
    console.log(`${colors.FGGREEN}%s\x1b[0m`, `- to:\t${repkg}\n`);
    console.log(`${colors.FGGREEN}%s\x1b[0m`, `You can now use @n7-frontend/boilerplate via 'npm link'`);
  }).catch(err => console.log(err));