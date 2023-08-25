class PostRebuildPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('PostRebuildPlugin', (stats) => {
            if (!stats.hasErrors()) {
                const exec = require('child_process').exec;
                exec('cp -r ../src/node ../dist/', (err, stdout, stderr) => {
                    if (err) {
                        console.error('Error executing the script:', err);
                    }
                    console.log(stdout);
                    console.error(stderr);
                });
            }
        });
    }
}

module.exports = PostRebuildPlugin;
