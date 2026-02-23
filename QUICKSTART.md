# Quick Start Guide

This guide will get you running the Legal AI Research Assistant in under 10 minutes.

## Step 1: Get API Keys (5 minutes)

### Pinecone (Free)
1. Go to https://www.pinecone.io/
2. Sign up for free account
3. Create new project
4. Copy API key from dashboard
5. Note your environment (e.g., `us-east-1-aws`)

### OpenAI
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)

## Step 2: Configure Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Edit .env (use any text editor)
# Replace these values:
#   OPENAI_API_KEY=sk-YOUR-KEY-HERE
#   PINECONE_API_KEY=YOUR-KEY-HERE
#   PINECONE_INDEX_NAME=legal-ai-index
#   PINECONE_ENVIRONMENT=us-east-1-aws
```

## Step 3: Install Backend (1 minute)

```bash
# From project root
cd ..

# Create virtual environment
python -m venv venv

# Activate it
source venv/Scripts/activate  # Windows Git Bash
# OR
source venv/bin/activate      # Linux/Mac

# Install dependencies
pip install -r backend/requirements.txt
```

## Step 4: Ingest Data (1 minute)

```bash
# Run ingestion pipeline
python -m backend.ingestion.ingest
```

You should see:
```
Loaded 30 documents
Created 150 chunks
Generated 150 embeddings
Upserted 150 vectors
```

## Step 5: Install Frontend (1 minute)

```bash
cd frontend
npm install
```

## Step 6: Run the App (30 seconds)

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd legal-ai
source venv/Scripts/activate
python -m uvicorn backend.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd legal-ai/frontend
npm run dev
```

## Step 7: Use the App!

1. Open http://localhost:3000
2. Ask: "What is contract consideration?"
3. Watch the AI retrieve cases and provide a cited answer
4. Check the citations panel on the right
5. Try a follow-up: "Can you give me an example?"

## Sample Questions

- "What is contract consideration?"
- "Explain the Fourth Amendment exclusionary rule"
- "What is premises liability?"
- "What are landmark Fourth Amendment cases?"
- "Explain adverse possession"

## Troubleshooting

### "Module not found" errors
```bash
# Make sure virtual environment is activated
source venv/Scripts/activate
pip install -r backend/requirements.txt
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend can't connect to Pinecone
- Double-check API key in `backend/.env`
- Verify environment name (us-east-1-aws, etc.)
- Make sure you ran the ingestion script

### No answers showing up
- Check backend is running (Terminal 1)
- Check frontend is running (Terminal 2)
- Open browser console (F12) for errors
- Verify API_URL in `frontend/.env.local`

## Next Steps

- Deploy to production (see README.md)
- Add real CourtListener data
- Customize confidence thresholds
- Build additional features

## Getting Help

- Check README.md for detailed documentation
- Review backend logs in Terminal 1
- Check frontend console (F12 in browser)
- Verify all API keys are correct

---

**That's it! You should now have a working legal AI assistant.**
