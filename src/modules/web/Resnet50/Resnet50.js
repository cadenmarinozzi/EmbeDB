const spawn = require("child_process").spawn;

function createEmbedding(input) {
  try {
    return new Promise((resolve, reject) => {
      let pythonProcess;

      if (Array.isArray(input)) {
        pythonProcess = spawn("python3", [
          "models/resnet50img2vec.py",
          JSON.stringify(input),
          true,
        ]);
      } else {
        pythonProcess = spawn("python3", ["models/resnet50img2vec.py", input]);
      }

      let jsonData = "";

      pythonProcess.stdout.on("data", (data) => {
        const dataJson = data.toString().replaceAll("\n", "");

        jsonData += dataJson;
      });

      pythonProcess.stderr.on("data", (data) => {
        reject(data.toString());
      });

      // Wait for the process to exit
      pythonProcess.on("close", (code) => {
        resolve(JSON.parse(jsonData));
      });
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  createEmbedding,
};
