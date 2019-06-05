import fs from 'fs';
import { spawn, exec } from 'child_process';
import trash from 'trash';

fs.writeFileSync('reset.log', '');

// let results = [];
const cleaningProcess = spawn('git', [
  'clean',
  '-xdf',
  '-n',
  '--exclude=".vscode"',
  '--exclude=".idea"',
]);

cleaningProcess.stdout.on('data', data => {
  if (data && data.toString()) {
    const l = data
      .toString()
      .split(/\n/)
      .forEach(i => {
        const [, uri] = i.match(/Would remove (.*)$/) || [];

        if (uri) {
          trash(uri);
        }
      });
  }
  fs.appendFile('reset.log', data, err => {
    if (err) {
      throw err;
    }
  });
});
cleaningProcess.on('exit', code => {
  if (code === 0) {
    console.log('all went well, files are being trashed now');
  } else {
    console.error(code);
  }
});
