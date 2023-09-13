// original author: https://zwbetz.com/create-react-app-show-current-git-branch-and-commit-hash-from-any-os/

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const execSyncWrapper = (command) => {
    let stdout = null;
    try {
        stdout = execSync(command).toString().trim();
    } catch (error) {
        console.error(error);
    }
    return stdout;
};

const main = () => {
    const gitBranch = execSyncWrapper('git rev-parse --abbrev-ref HEAD');
    //let gitCommitHash = execSyncWrapper('git rev-parse --short=7 HEAD');
    // gitTag := <current tag> | <most recent tag>-<commits since tag>-<current hash>
    const gitTag = execSyncWrapper('git describe --tags');
    let label = gitBranch + '-' + gitTag;
    if (gitBranch == 'main') {
        label = gitTag;
    }

    const obj = {
        // gitBranch,
        // gitCommitHash,
        gitTag: label,
    };

    const filePath = path.resolve('lib', 'generatedGitInfo.json');
    const fileContents = JSON.stringify(obj, null, 2);

    fs.writeFileSync(filePath, fileContents);
    //console.log(`Wrote the following contents to ${filePath}\n${fileContents}`);
    console.info(`Updated git version label to ${label}`);
};

main();
