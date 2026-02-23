# Legal AI Research Assistant

A production-grade RAG (Retrieval-Augmented Generation) powered legal research assistant that provides citation-grounded answers to questions about U.S. case law.

## Features

- 🔍 **Semantic Search**: Vector-based retrieval of relevant legal cases from Pinecone
- 🎯 **Citation Grounding**: Every answer is backed by specific case citations
- 📊 **Confidence Scoring**: Dual-layer confidence assessment (retrieval + LLM self-assessment)
- 💬 **Conversation Memory**: Multi-turn conversations with context retention
- 🔄 **LLM Fallback**: Automatic failover between OpenAI and Mistral providers
- 🎨 **Modern UI**: Split-panel interface showing chat and source citations

## Architecture

```
User Query → LangGraph Chain → Response
  ├─ Query Rewriting (multi-turn context)
  ├─ Pinecone Retrieval (top-5 semantic search)
  ├─ Retrieval Confidence Assessment
  ├─ LLM Generation (GPT-4o with citation grounding)
  └─ LLM Self-Assessment
```

## Tech Stack

### Backend
- **Framework**: FastAPI
- **RAG Orchestration**: LangGraph + LangChain
- **Vector Database**: Pinecone
- **LLMs**: OpenAI GPT-4o (primary), Mistral (fallback)
- **Embeddings**: OpenAI text-embedding-3-small
- **Python**: 3.13

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Project Structure

```
legal-ai/
├── backend/
│   ├── ingestion/          # Data loading pipeline
│   │   ├── mock_data.json  # 30 synthetic legal cases
│   │   ├── chunker.py      # Text splitting logic
│   │   └── ingest.py       # Pinecone upload script
│   ├── services/           # Core business logic
│   │   ├── llm_provider.py # Abstract LLM interface
│   │   ├── retriever.py    # Pinecone wrapper
│   │   ├── confidence.py   # Confidence scoring
│   │   └── rag_pipeline.py # LangGraph chain ⭐
│   ├── routes/             # API endpoints
│   │   ├── health.py       # Health check
│   │   └── chat.py         # Main chat endpoint ⭐
│   ├── prompts/
│   │   └── system_prompt.txt # LLM instructions
│   ├── config.py           # Environment configuration
│   └── main.py             # FastAPI app
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Main page ⭐
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ChatPanel.tsx   # Chat interface ⭐
│   │   ├── MessageBubble.tsx
│   │   ├── SourceViewer.tsx
│   │   ├── CitationCard.tsx
│   │   └── ConfidenceBadge.tsx
│   ├── lib/
│   │   └── api.ts          # API client
│   └── types/
│       └── index.ts        # TypeScript interfaces
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API key
- Pinecone account (free tier)
- Optional: Mistral API key (for fallback)

### 1. Backend Setup

```bash
# Navigate to project root
cd legal-ai

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash
# or
source venv/bin/activate      # Linux/Mac

# Install dependencies
pip install -r backend/requirements.txt

# Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys:
#   OPENAI_API_KEY=sk-...
#   PINECONE_API_KEY=...
#   PINECONE_INDEX_NAME=legal-ai-index
```

### 2. Ingest Data into Pinecone

```bash
# Run the ingestion pipeline (creates ~150 vectors from 30 cases)
python -m backend.ingestion.ingest
```

Expected output:
```
Created index: legal-ai-index
Loaded 30 documents
Created 150 chunks
Generated 150 embeddings
Upserted 150 vectors
Total vectors in index: 150
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local if backend is not on localhost:8000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd legal-ai
source venv/Scripts/activate
python -m uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:** http://localhost:3000

## API Documentation

### POST /chat

Request:
```json
{
  "session_id": "uuid-string",
  "message": "What is contract consideration?",
  "conversation_history": [
    {"role": "user", "content": "previous question"},
    {"role": "assistant", "content": "previous answer"}
  ]
}
```

Response:
```json
{
  "answer": "Contract consideration requires...",
  "confidence": "high",
  "confidence_score": 0.85,
  "citations": [
    {
      "case_name": "Smith v. Jones Manufacturing Co.",
      "court": "Supreme Court of California",
      "date": "2023-05-15",
      "citation": "123 Cal.4th 456",
      "url": "https://www.courtlistener.com/?q=...",
      "excerpt": "Under California contract law..."
    }
  ],
  "retrieved_chunks": [...],
  "disclaimer": "This information is for educational purposes only..."
}
```

Interactive docs: http://localhost:8000/docs

## Sample Queries

Try these questions to test the system:

1. **Contract Law**: "What is contract consideration?"
2. **Constitutional Law**: "Explain the Fourth Amendment exclusionary rule"
3. **Tort Law**: "What is premises liability?"
4. **Employment Law**: "What is wrongful termination discrimination?"
5. **Follow-up**: Ask "Can you give me another example?" after any answer

## Configuration

### Confidence Thresholds

Edit `backend/.env`:
```bash
RETRIEVAL_CONFIDENCE_WEIGHT=0.6  # Weight for vector similarity score
LLM_CONFIDENCE_WEIGHT=0.4        # Weight for LLM self-assessment
HIGH_CONFIDENCE_THRESHOLD=0.75   # Threshold for "high" confidence
MEDIUM_CONFIDENCE_THRESHOLD=0.50 # Threshold for "medium" confidence
```

### RAG Parameters

```bash
TOP_K_CHUNKS=5        # Number of documents to retrieve
CHUNK_SIZE=512        # Token size per chunk
CHUNK_OVERLAP=50      # Overlapping tokens between chunks
```

## Development

### Adding Real Data

Replace mock data with CourtListener dataset:

1. Download bulk data from https://www.courtlistener.com/api/bulk-data/
2. Update `backend/ingestion/ingest.py` to parse CourtListener format
3. Re-run ingestion: `python -m backend.ingestion.ingest`

### Testing

```bash
# Backend API test
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "What is negligence?"
  }'

# Health check
curl http://localhost:8000/health
```

### Deployment

**Backend (Railway/Render):**
1. Connect GitHub repo
2. Set environment variables
3. Deploy from `main` branch

**Frontend (Vercel):**
1. Connect GitHub repo
2. Set `NEXT_PUBLIC_API_URL` to backend URL
3. Auto-deploy from `main` branch

## Cost Estimates

- **Pinecone**: Free (up to 100K vectors, we use ~150)
- **OpenAI Embeddings**: ~$0.02 per full ingestion (150 chunks × $0.0001/1K tokens)
- **OpenAI GPT-4o**: ~$0.015 per query (5K input + 1K output tokens)
- **Monthly (100 queries)**: ~$1.50

## Troubleshooting

### "Validation Error: Field required"
- Check `backend/.env` exists and contains all required keys
- Verify the .env file is in the `backend/` directory

### "Pinecone connection failed"
- Verify PINECONE_API_KEY is correct
- Check PINECONE_ENVIRONMENT matches your Pinecone region
- Ensure index was created via ingestion script

### Frontend can't connect to backend
- Check CORS settings in `backend/main.py`
- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Ensure backend is running on the correct port

### "No vectors in index"
- Run the ingestion script: `python -m backend.ingestion.ingest`
- Check Pinecone dashboard to verify vectors were uploaded

## Features Roadmap

- [ ] User authentication and session persistence
- [ ] Export chat history to PDF
- [ ] Advanced filtering (by court, date range, topic)
- [ ] Real-time streaming responses
- [ ] Semantic caching for common queries
- [ ] Integration with CourtListener API for real-time case updates
- [ ] Multi-language support
- [ ] Voice input/output

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Acknowledgments

- Mock legal data synthesized for demonstration purposes
- Built with LangChain/LangGraph framework
- Powered by OpenAI and Pinecone

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/legal-ai/issues
- Email: your.email@example.com

---

**Disclaimer**: This tool is for educational and research purposes only. It does not constitute legal advice. Always consult a licensed attorney for legal matters.
