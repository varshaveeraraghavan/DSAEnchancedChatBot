# DSAChatBot

DSA - Enhanced Document Chat Assistant

# Docbot PDF Chatbot Readme

## Description

Docbot is a sophisticated chatbot application designed to assist users in extracting valuable information from uploaded PDF documents. Users can upload PDF files, chat with the AI chatbot to ask questions or seek information related to the document, and receive well-informed responses. This readme provides an overview of the Docbot PDF Chatbot, including its features and the technology stack used.

## Features

- **PDF Upload**: Users can upload PDF documents for analysis and conversation with the AI chatbot.

- **AI Chatbot**: Engage in a chat conversation with the AI chatbot to ask questions or discuss the content of the PDF.

- **Document Analysis**: The chatbot creates chunks and embeddings to analyze the document and understand its content.

- **Similarity Search**: Utilize Langchain for similarity search to find related content within the document.

- **ChromaDB Integration**: Store vector searches in ChromaDB for efficient retrieval of similar content.

## Tech Stack

### Frontend

- **React**: The user interface of Docbot is built using React, offering a modern and responsive design.

### Backend

- **Python Flask**: The server-side logic of the chatbot is implemented using Flask, a micro web framework for Python.

### Packages and Technologies

- **Langchain**: Langchain is used for creating embeddings and performing similarity searches.

- **OpenAI**: OpenAI's ChatGPT model 3.5 powers the chatbot, offering natural language understanding and generation capabilities.

- **Embeddings**: Embeddings are generated to analyze and represent the content of the PDF.

- **PyPDF**: PyPDF is used for parsing and extracting text from PDF documents.

### Database

- **ChromaDB**: ChromaDB is integrated to store vector searches for efficient retrieval and similarity searching.

## Usage

1. Open the DoctBot PDF Chatbot in your web browser.

2. Upload a PDF document for analysis and conversation.

3. Engage in a chat conversation with the AI chatbot to ask questions or discuss the content of the PDF.

4. The chatbot will analyze the document, create embeddings, and perform similarity searches to provide informed responses.

5. Store vector searches in ChromaDB for efficient retrieval of similar content in the future.

6. Use DocBot to unlock valuable insights from your PDF documents.

## Setting Up the Project

### Initial Setup (First-Time Only)

#### Terminal 1:

```bash
cd DSA-ChatBot
cd backend
pip install -r requirements.txt

```

#### Terminal 2:

```bash
cd DSA-ChatBot
cd frontend
npm install
```

### Steps to run app:

#### Terminal 1:

```bash
cd backend
python dsaapp.py
```

#### Terminal 2

```bash
cd backend
python docapp.py
```

#### Terminal 3

```bash
cd frontend
npm start
```
