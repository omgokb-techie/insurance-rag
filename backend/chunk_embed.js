// backend/chunk_embed.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { OpenAIEmbeddings } = require("@langchain/openai");

const rawText = fs.readFileSync('./data/extracted_text/combined.txt', 'utf-8');

(async () => {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });

    const chunks = await splitter.createDocuments([rawText]);
    console.log(`Created ${chunks.length} chunks`);

    const embeddings = new OpenAIEmbeddings();
    const directory = path.join(__dirname, '../data/faiss_store');

    // Ensure directory exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    console.log('Creating vector store...');
    const vectorstore = await FaissStore.fromDocuments(
      chunks,
      embeddings,
      {
        directory: directory
      }
    );

    // Save the vector store
    console.log('Saving vector store...');
    await vectorstore.save(directory);

    console.log("✅ Vector store created and saved with", chunks.length, "chunks");
  } catch (error) {
    console.error('Error creating vector store:', error);
    process.exit(1);
  }
})();
