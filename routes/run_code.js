const router = require('express').Router();
const cuid = require('cuid');
const { create } = require('../lib/directoryCreate');
const { deleteFile } = require('../lib/deleteFiles');
const { javaCodeHandler } = require('../lib/javaCodeHandler');
const { cppCodeHandler } = require('../lib/cppCodeHandler');

router.post('/', async (req, res) => {
    try {
        const { code, lang, userName } = req.body;
        if (!code || !lang || !userName) {
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
            output = await javaCodeHandler(code, codeDir, userName, 1);
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
        console.log(output);
        return res.json({
            result : output.result
        });
    } catch (error) {
        console.error('An error occurred:', error);
        // Handle error
        return res.status(500).json({
            type: "error",
            error
        });
    }
});

module.exports = router;
