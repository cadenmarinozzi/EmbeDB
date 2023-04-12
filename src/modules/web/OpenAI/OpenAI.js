const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

async function createEmbedding(input) {
  const { data } = await openai.createEmbedding({
    input,
    model: "text-embedding-ada-002",
    wait_for_model: true,
  });

  return data.data[0].embedding;
}

module.exports = {
  createEmbedding,
};
