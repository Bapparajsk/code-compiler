const path = require('path');
const { spawn } = require('child_process');
const { createFiles, jsFileCreate } = require('./writeFiles');

const javaCodeHandler = async (code, codeDir, userName, timeLimitInSeconds) => {
    const tempDir = path.join(__dirname, '..', `temp/${userName}`);
    let error;
    try {
        await createFiles(code,  codeDir, userName,"Main.java");
        const javacProcess = spawn('javac', ['Main.java'], { cwd: `${tempDir}/${codeDir}/` });

        const compilationPromise = new Promise((resolve, reject) => {
            let compilationError = '';
            const timeout = setTimeout(() => {
                javacProcess.kill();
                reject({ error: 'Time Limit Exceeded' });
            }, timeLimitInSeconds * 1000);

            javacProcess.stdout.on('data', (data) => {
                compilationError += data.toString();
            });

            javacProcess.stderr.on('data', (data) => {
                compilationError += data.toString();
            });

            javacProcess.on('close', (code) => {
                clearTimeout(timeout);
                if (code !== 0) {
                    reject({ error: 'Compilation Error', compilationError });
                } else {
                    resolve();
                }
            });
        });

        await compilationPromise;

        console.log('Java code compiled successfully');

        const javaProcess = spawn('java', ['Main'], { cwd: `${tempDir}/${codeDir}/`, stdio: ['pipe', 'pipe', 'pipe'] });

        // javaProcess.stdin.write(input);
        javaProcess.stdin.end();

        let output = '';
        let error = '';

        const executionPromise = new Promise((resolve, reject) => {
            javaProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            javaProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            javaProcess.on('close', (code) => {
                if (code !== 0) {
                    reject({ error: 'Runtime Error', errorMessage: error });
                } else {
                    resolve(output);
                }
            });
        });

        const executionTimeoutPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                javaProcess.kill();
                reject({ error: 'Time Limit Exceeded' });
            }, timeLimitInSeconds * 1000);

            // Handle the case where the timeout promise is rejected
            new Promise((resolve) => resolve(timeout)).catch((err) => {
                javaProcess.kill();
                error = err;
                reject(err);
            });
        });

        // Race between execution promise and timeout promise
        const result = await Promise.race([executionPromise, executionTimeoutPromise]);

        clearTimeout(executionTimeoutPromise);
        // console.log('Java code executed successfully:', result);
        return { result, error: null }; // Return both result and null error
    } catch (err) {
        console.error('Error executing Java code:', err);
        error = err;
        throw err; // Re-throw error to be caught by the outer catch block
    }
}

module.exports = { javaCodeHandler };
