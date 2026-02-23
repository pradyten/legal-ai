# Legal AI - Data Ingestion

This directory contains the ingestion pipeline for loading legal documents into Pinecone.

## Setup

### 1. Get API Keys

**Pinecone (Free Tier):**
1. Sign up at https://www.pinecone.io/
2. Create a new project
3. Get your API key from the dashboard
4. Note your environment (e.g., `us-east-1-aws`)

**OpenAI:**
1. Sign up at https://platform.openai.com/
2. Go to API keys section
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Update Environment Variables

Edit `backend/.env` and replace the placeholder values:

```bash
OPENAI_API_KEY=sk-your-actual-openai-key-here
PINECONE_API_KEY=your-actual-pinecone-key-here
PINECONE_INDEX_NAME=legal-ai-index
PINECONE_ENVIRONMENT=us-east-1-aws  # Or your Pinecone environment
```

### 3. Run Ingestion

```bash
# Activate virtual environment
source venv/Scripts/activate  # Windows Git Bash
# or
source venv/bin/activate      # Linux/Mac

# Run ingestion script
python -m backend.ingestion.ingest
```

## What the Ingestion Does

1. **Loads** 30 synthetic legal cases from `mock_data.json`
2. **Chunks** documents into ~512-token chunks with 50-token overlap
3. **Generates** embeddings using OpenAI `text-embedding-3-small`
4. **Upserts** ~100-200 vectors to Pinecone with metadata

## Expected Output

```
Starting ingestion pipeline...
Creating/connecting to Pinecone index: legal-ai-index
Created index: legal-ai-index
Loading mock legal documents...
Loaded 30 documents
Chunking documents...
Created 150 chunks from 30 documents
Generating embeddings...
Generated 150 embeddings
Upserting to Pinecone...
Upserted batch of 100 vectors
Upserted final batch of 50 vectors
Ingestion complete!
Total vectors in index: 150
```

## Troubleshooting

- **`ValidationError: Field required`**: Check that your `.env` file is in the `backend/` directory and contains all required keys
- **`PineconeException`**: Verify your Pinecone API key and environment are correct
- **`OpenAIError`**: Verify your OpenAI API key is valid and has credits

## Cost Estimate

- **Pinecone Free Tier**: Supports up to 100K vectors (we use ~150)
- **OpenAI Embeddings**: ~$0.0001 per 1K tokens (~$0.02 for full ingestion)
