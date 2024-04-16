const router = require('express').Router();
const cuid = require('cuid');
const { create } = require('../lib/directoryCreate');
const { deleteFile } = require('../lib/deleteFiles');
const { javaCodeHandler } = require('../lib/javaCodeHandler');
const { cppCodeHandler } = require('../lib/cppCodeHandler');
const {getCode, margeCode} = require("../lib/template");

router.post('/', async (req, res) => {
    try {
        const { code, lang, userName, userCode, subProblem, subSolution } = req.body;
        if (!code || !lang || !userName || !userCode || !subProblem || !subSolution) {
            return  res.status(400).json({
                type: "error",
                error: "isEmpty is inputs"
            });
        }

        // Delete folder
        await deleteFile(`./temp/${userName}`);
        await create('./temp');
        await create(`./temp/${userName}`);
        const codeDir = cuid.slug();

        // Compile and execute codes
        let output;
        if (lang === "java") {
            let n = subSolution.length;

            for (let i = 0; i < n; i++) {
                const Code = getCode(margeCode(code, subProblem[i]).split('\n'), userCode);
                output = await javaCodeHandler(Code, codeDir, userName, 1);

                if (output.result === null) {
                    console.log(output.result);
                    // Handle error
                    return res.status(500).json({
                        type: "error",
                        error: output.error,
                        message: 'code error',
                        subProblemNumber: i,
                    });
                }

                output.result = output.result.toString().replaceAll(/\r\n/g, "");
                if (output.result !== subSolution[i].toString()) {
                    console.log(output.result);
                    console.log(subSolution[i]);
                    return res.status(500).json({
                        type: "error",
                        message: 'your code is wrong',
                        output: output.result,
                        subProblemNumber: i,
                    });
                }
            }
        } else if(lang === 'c' || lang === "c++") {
            output = await cppCodeHandler(code, input, codeDir, userName, 1, 100);
        } else {
            return  res.status(400).json({
                type: "error",
                error: "invalid language",
                language: lang
            });
        }

        if (output.result === null) {
            // Handle error
            res.status(500).json({
                type: "error",
                error: output.error
            });
            return;
        }
        return res.json({
            result : output.result
        });
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({
            type: "error",
            error
        });
    }
});

module.exports = router;
