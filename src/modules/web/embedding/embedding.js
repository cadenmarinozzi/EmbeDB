const axios = require("axios");
const openai = require("../OpenAI");
const resnet50 = require("../Resnet50");

async function createHuggingfaceEmbedding(
  input,
  model = "sentence-transformers/all-MiniLM-L6-v2"
) {
  const { data } = await axios.post(
    `https://api-inference.huggingface.co/pipeline/feature-extraction/${model}`,
    { inputs: input },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
      },
    }
  );

  return data;
}

async function createOpenAIEmbedding(input) {
  return await openai.createEmbedding(input);
}

async function createResnet50Embedding(input) {
  return await resnet50.createEmbedding(input);
}

async function createEmbedding(input, model) {
  switch (model) {
    case "huggingface":
      return await createHuggingfaceEmbedding(input);

    case "openai":
      return await createOpenAIEmbedding(input);

    case "resnet50":
      return await createResnet50Embedding(input);

    default:
      throw new Error("Invalid model");
  }
}

module.exports = {
  createEmbedding,
};
