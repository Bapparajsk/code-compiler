const { exec } = require('child_process');
const { spawn } = require('child_process');
const cuid = require('cuid');
const util = require('util');
const { createFiles } = require('./writeFiles');
const path = require("path");

const execPromise = util.promisify(exec);
const spawnPromise = util.promisify(spawn);

const cppCodeHandler = async (code, input, codeDir, userName, timeLimitInSeconds, spaceLimitInMB) => {
    try {
        const tempDir = path.join(__dirname, '..', `temp/${userName}`);
        const fileName = cuid.slug();
        await createFiles(code, input, codeDir, userName, `${fileName}.cpp`);

        // Compile C++ code
        const { stdout: compileOutput, stderr: compileError } = await execPromise(`cd ${tempDir}/${codeDir}/ && g++ ${fileName}.cpp -o output.exe`);
        if (compileError) {
            return compileError;
        }
        console.log('cpp code compiled:');

        // Execute C++ code with time and space limits
        let executionTime = 0;
        let executionSpace = 0;
        let output = '';

        await new Promise((resolve, reject) => {
            const executionStartTime = Date.now();
            const childProcess = spawn(`cd ${tempDir}/${codeDir}/ && output.exe`, [], { shell: true });

            // console.log("childProcess :- ", childProcess);
            // Listen for stdout
            childProcess.stdout.on('data', (data) => {
                output += data.toString();
                executionTime = Date.now() - executionStartTime;
            });

            childProcess.stdout.on('end', () => {
                resolve();
            })

            // Listen for stderr
            childProcess.stderr.on('data', (data) => {
                reject(`Error: ${data}`)
                console.error(`Error: }`);
            });

            // Listen for exit
            childProcess.on('exit', (code) => {
                console.log(`Child process exited with code `);
                reject(`Child process exited with code ${code}`)
                executionTime = Date.now() - executionStartTime;
                if (executionTime > timeLimitInSeconds * 1000) {
                    reject('Execution time exceeded the time limit.')
                    console.log('Execution time exceeded the time limit.');
                    // Handle time limit exceeded
                }
                if (executionSpace > spaceLimitInMB * 1024 * 1024) {
                    reject('Execution time exceeded the time limit.')
                    console.log('Execution space exceeded the space limit.');
                    // Handle space limit exceeded
                }
            });

            // Send input to the child process
            childProcess.stdin.write(input);
            childProcess.stdin.end();
        })
        console.log(output);
        return { result: output, error: null }; // Return both result and null error
    } catch (error) {
        console.error('Error executing c++ code:');
        return { result: null, error: error }; // Return both result and null error
    }
}

module.exports = { cppCodeHandler };