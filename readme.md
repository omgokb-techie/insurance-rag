
# Insurance RAG Project

This project is designed to **scrape insurance data** from websites, process it using a **Retrieval-Augmented Generation (RAG)** system, and display the relevant data in a **JSON format**. The output is then rendered in a simple HTML table.

---

### **Features**
- **Web Scraping**: Extracts insurance-related data (such as Insurance Type, Product Name, Coverage, and Price) from a website.
- **RAG System**: Uses a RAG architecture to feed the scraped data into a **Language Model** (LLM) to extract the necessary information.
- **Vector Store**: Utilizes a vector database to store the embeddings of the scraped data for fast retrieval.
- **JSON Output**: Processes data into a structured JSON format that includes relevant insurance details.
- **Simple HTML Table**: Displays the extracted information in a user-friendly table format.

---

### **Technologies Used**
- **Web Scraping**: Custom scripts to extract insurance-related information from websites.
- **LangChain**: A framework for building LLM applications, used for text splitting, embedding, and vector storage.
- **Faiss**: A vector database that stores and retrieves embeddings of insurance-related data.
- **OpenAI**: Used to generate embeddings and process data with a language model.
- **Node.js**: Backend server that runs the scripts and serves the data.
- **HTML/CSS**: Simple frontend to display the processed data in a table format.

---

### **Folder Structure**

```
/INSURANCE-RAG
│
├── /backend/                 # Backend code for data processing
│   ├── chunk_embed.js        # Script to split and embed data, store it in 
│   ├── extract.js            # Script to extract text data from content
│   ├── query_llm.js        # Script to query the vector store 
│   ├── scraper.js        # Script to scrape the website and store content
│   └── server.js        # Script to run the backend server
│
├── /data/                    # Storage for scraped data and embeddings
│   ├── extracted_text/       # Folder containing raw extracted text from websites
│   ├── faiss_store/       # Folder containing faiss vector store
│   ├── pdfs/       # Folder containing downloaded .pdf files
│   └── raw_html/           # Folder containing raw html of the website
│
├── /frontend/                # Frontend to display data
│   └── index.html            # HTML file to display extracted data in a table
│
├── .gitignore                # Git ignore file to exclude unnecessary files
├── .env                      # Environment variables (API keys, etc.)
└── README.md                 # Project description and setup guide
```

---

### **Setup and Installation**

Follow these steps to get the project up and running:

1. **Clone the repository**:

```bash
git clone https://github.com/YOUR_USERNAME/insurance-rag-project.git
cd insurance-rag-project
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory and add the following keys:

```
OPENAI_API_KEY=your-openai-api-key
```

4. **Run the backend** to process the data and store it in the vector database:

```bash
cd backend
node scraper.js
node extract.js
node chunk_embed.js
node server.js
```

7. **Run the frontend** to display the processed data in a table format:

Open `frontend/index.html` in a browser to view the extracted data in a simple HTML table.

---

### **Usage**

- **Scraping**: To scrape data from websites, run the `scraper.js` script. 
- **Extracting**: To extract data from contents, run the `extract.js` script. 
- **Processing**: The `chunk_embed.js` script processes the scraped data, splits it into chunks, generates embeddings using OpenAI, and stores it in the fiass vector store.
- **Querying**: After processing, the data can be queried by the RAG system to extract and display information related to insurance products like:
  - Insurance Type
  - Product Name
  - Coverage
  - Price

The results will be displayed in the HTML table in the frontend.

---

### **Contributing**

Contributions are welcome! If you have suggestions or encounter issues, please feel free to create a pull request or submit an issue.

---

### **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
