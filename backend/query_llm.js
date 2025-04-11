require('dotenv').config();
const path = require('path');
const { OpenAIEmbeddings } = require("@langchain/openai");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { ChatOpenAI } = require("@langchain/openai");

const llm = new ChatOpenAI({ temperature: 0 });

async function queryInsuranceData(query) {
  const store = await FaissStore.load(
    path.join(__dirname, '../data/faiss_store'),
    new OpenAIEmbeddings()
  );

  const docs = await store.similaritySearch(query, 3);
  const context = docs.map(d => d.pageContent).join("\n\n");

  const prompt = `
You are a helpful assistant that extracts structured insurance data from documents.
From the following content:

${context}

Extract and return JSON:
[{ "InsuranceType": "", "InsuranceProductName": "", "InsuranceCoverage": "", "InsurancePrice": "", "InsuranceService": "" }]
  `;

  const response = await llm.call([{ role: "user", content: prompt }]);
  return response.content;
}

module.exports = { queryInsuranceData };
