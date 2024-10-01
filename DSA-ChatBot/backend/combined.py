import pandas as pd
import torch
from transformers import BertTokenizer, BertForQuestionAnswering
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from googlesearch import search

def get_answer(query):
    print("answering")
    new_question_text = query
    # Load dataset from CSV file
    dataset = pd.read_csv('dataset.csv')
    
    # Extract questions and answers from the dataset
    questions = dataset['question'].tolist()
    answers = dataset['answer'].tolist()

    # Load pre-trained BERT model for question-answering
    bert_model_name = 'bert-large-uncased-whole-word-masking-finetuned-squad'
    tokenizer = BertTokenizer.from_pretrained(bert_model_name)
    model = BertForQuestionAnswering.from_pretrained(bert_model_name)

    # Load pre-trained sentence transformer model for semantic similarity
    sentence_model = SentenceTransformer('paraphrase-distilroberta-base-v1')

    # Semantic similarity scoring with BERT embeddings
    bert_embeddings = tokenizer(new_question_text, questions, return_tensors='pt', padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**bert_embeddings)
        answer_start_scores, answer_end_scores = outputs.start_logits, outputs.end_logits
        start_index = torch.argmax(answer_start_scores)
        end_index = torch.argmax(answer_end_scores) + 1
        bert_similarity_scores = (start_index + end_index) / 2

    # Semantic similarity scoring with Sentence Transformer
    question_embeddings = sentence_model.encode([new_question_text] + questions)
    new_question_embedding = question_embeddings[0]
    existing_question_embeddings = question_embeddings[1:]
    semantic_similarity_scores = np.dot(new_question_embedding, existing_question_embeddings.T) / (np.linalg.norm(new_question_embedding) * np.linalg.norm(existing_question_embeddings, axis=1))

    # TF-IDF similarity scoring
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform([new_question_text] + questions)
    tfidf_similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

    # Combine similarity scores
    combined_similarity_scores = (
        0.3 * bert_similarity_scores +
        0.6 * semantic_similarity_scores +
        0.1 * tfidf_similarity_scores 
    )

    # Find the index of the most similar question
    most_similar_index = np.argmax(combined_similarity_scores)
    most_similar_question = questions[most_similar_index]

    # Semantic similarity threshold
    semantic_similarity_threshold = 0.7

    # Semantic similarity scoring with the most similar question
    semantic_similarity = cosine_similarity([new_question_embedding], [existing_question_embeddings[most_similar_index]])[0][0]

    if semantic_similarity < semantic_similarity_threshold:
        # If the question is beyond the scope, offer a Google search option
        for url in search(new_question_text, num=5, stop=5, pause=2):
            print(url)
            msg = "The question is beyond my scope, please feel free to refer the below link\n" + url
            return msg
    else:
        corresponding_answer = answers[most_similar_index]
        print("Most similar question (using combined approach):", most_similar_question)
        print("Corresponding answer:", corresponding_answer)
        return corresponding_answer


