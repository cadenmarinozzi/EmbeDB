const getSimilarity = require("compute-cosine-similarity");
const { createEmbedding } = require("../web/embedding");

class Memory {
  constructor(model) {
    this.memory = [];
    this.embeddingModel = model || "huggingface";
  }

  async createEmbedding(input, embeddingModel = this.embeddingModel) {
    return await createEmbedding(input, embeddingModel);
  }

  keyValueToString(key, value) {
    return `${key}:\n${value}`;
  }

  load(memoryData) {
    this.memory = memoryData;
  }

  async memorize({ key, value, embeddingModel }) {
    const input = this.keyValueToString(key, value);
    const embedding = await this.createEmbedding(input, embeddingModel);

    this.memory.push({
      key,
      value,
      embedding,
    });
  }

  async memorizeAll(inputs, embeddingModel) {
    const data = inputs.map(({ key, value }) =>
      this.keyValueToString(key, value)
    );

    const embeddings = await this.createEmbedding(data, embeddingModel);
    console.log(embeddings);

    embeddings.forEach((embedding, index) => {
      const { key, value } = inputs[index];

      this.memory.push({
        key,
        value,
        embedding,
      });
    });
  }

  async prune(targetIndex) {
    this.memory = this.memory.filter((_, index) => index !== targetIndex);
  }

  async recall(key, n = 1, embeddingModel) {
    const inputEmbedding = await this.createEmbedding(key, embeddingModel);

    const similarities = this.memory.map((memory, index) => {
      const { key, value, embedding } = memory;

      const similarity = getSimilarity(embedding, inputEmbedding);
      const prune = () => this.prune(index);

      return {
        key,
        value,
        similarity,
        prune,
      };
    });

    const sortedSimilarities = similarities.sort((a, b) => {
      return b.similarity - a.similarity;
    });

    return n === 1 ? sortedSimilarities[0] : sortedSimilarities.slice(0, n);
  }
}

module.exports = Memory;
