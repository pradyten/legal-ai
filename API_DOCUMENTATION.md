# API Documentation

## Overview

The Legal AI Research Assistant provides a RESTful API built with FastAPI for interacting with the RAG-powered legal research system.

**Base URL (Development):** `http://localhost:8000`
**Base URL (Production):** `https://your-backend.com`

**Interactive Docs:** `http://localhost:8000/docs` (Swagger UI)
**Alternative Docs:** `http://localhost:8000/redoc` (ReDoc)

---

## Authentication

Currently, the API is **unauthenticated** for demonstration purposes. For production deployment, implement one of:

- **API Keys:** Header-based authentication
- **JWT Tokens:** OAuth 2.0 flow
- **Session Cookies:** For web-only access

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API is running and healthy.

**Request:**
```bash
curl http://localhost:8000/health
```

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2026-02-23T12:00:00Z",
  "version": "1.0.0"
}
```

**Use Cases:**
- Monitoring/health checks
- Deployment verification
- Load balancer health probes

---

### 2. Chat Endpoint

**POST** `/chat`

Send a legal research query and receive a citation-grounded answer.

#### Request Body

```typescript
interface ChatRequest {
  session_id: string;                    // UUID for conversation tracking
  message: string;                       // User's legal question
  conversation_history?: MessageHistory[]; // Previous messages (optional)
}

interface MessageHistory {
  role: "user" | "assistant";
  content: string;
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "What is contract consideration?",
    "conversation_history": []
  }'
```

**With Conversation History:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Can you give me an example?",
  "conversation_history": [
    {
      "role": "user",
      "content": "What is contract consideration?"
    },
    {
      "role": "assistant",
      "content": "Contract consideration is the value exchanged..."
    }
  ]
}
```

#### Response

```typescript
interface ChatResponse {
  answer: string;                    // Generated answer
  confidence: string;                // "high" | "medium" | "low" | "insufficient"
  confidence_score: number;          // 0.0 - 1.0
  citations: Citation[];             // Legal case citations
  retrieved_chunks: RetrievedChunk[]; // Source documents
  disclaimer: string;                // Legal disclaimer
  error?: string;                    // Error message (if any)
}

interface Citation {
  case_name: string;        // e.g., "Smith v. Jones Manufacturing Co."
  court: string;            // e.g., "Supreme Court of California"
  date: string;             // e.g., "2023-05-15"
  citation: string;         // e.g., "123 Cal.4th 456"
  url: string;              // CourtListener URL
  excerpt: string;          // Relevant quote from case
}

interface RetrievedChunk {
  text: string;             // Document chunk text
  metadata: {
    case_name: string;
    court: string;
    date: string;
    citation: string;
    score: number;          // Similarity score 0.0-1.0
  };
}
```

**Example Response:** `200 OK`
```json
{
  "answer": "Contract consideration is the value exchanged between parties in a legally binding agreement. Under California law, consideration must be something of legal value that induces the promise, such as money, property, services, or a promise to do or refrain from doing something. As established in Smith v. Jones Manufacturing Co., \"consideration is the price for which the promise is bought\" and must be present for a contract to be enforceable. The court emphasized that consideration can be nominal but cannot be past or illusory. This principle ensures mutuality of obligation and distinguishes enforceable contracts from mere gifts.",
  "confidence": "high",
  "confidence_score": 0.87,
  "citations": [
    {
      "case_name": "Smith v. Jones Manufacturing Co.",
      "court": "Supreme Court of California",
      "date": "2023-05-15",
      "citation": "123 Cal.4th 456",
      "url": "https://www.courtlistener.com/?q=Smith%20v.%20Jones",
      "excerpt": "Under California contract law, consideration is the price for which the promise is bought, and must be something of legal value that induces the promise. Consideration can be nominal but cannot be past or illusory."
    },
    {
      "case_name": "Anderson v. Pacific Industries",
      "court": "California Court of Appeal, First District",
      "date": "2022-11-03",
      "citation": "78 Cal.App.5th 234",
      "url": "https://www.courtlistener.com/?q=Anderson%20v.%20Pacific",
      "excerpt": "The court reaffirmed that adequate consideration requires mutuality of obligation. A promise unsupported by consideration is unenforceable as a mere gratuitous promise."
    }
  ],
  "retrieved_chunks": [
    {
      "text": "Under California contract law, consideration is the price for which the promise is bought, and must be something of legal value that induces the promise. Consideration can be nominal but cannot be past or illusory.",
      "metadata": {
        "case_name": "Smith v. Jones Manufacturing Co.",
        "court": "Supreme Court of California",
        "date": "2023-05-15",
        "citation": "123 Cal.4th 456",
        "score": 0.92
      }
    },
    {
      "text": "The court reaffirmed that adequate consideration requires mutuality of obligation. A promise unsupported by consideration is unenforceable as a mere gratuitous promise.",
      "metadata": {
        "case_name": "Anderson v. Pacific Industries",
        "court": "California Court of Appeal, First District",
        "date": "2022-11-03",
        "citation": "78 Cal.App.5th 234",
        "score": 0.85
      }
    }
  ],
  "disclaimer": "This information is for educational and research purposes only and does not constitute legal advice. Always consult a licensed attorney for specific legal matters."
}
```

#### Error Responses

**400 Bad Request** - Invalid request format
```json
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**500 Internal Server Error** - Server error
```json
{
  "answer": "I apologize, but I encountered an error processing your request.",
  "confidence": "insufficient",
  "confidence_score": 0.0,
  "citations": [],
  "retrieved_chunks": [],
  "disclaimer": "...",
  "error": "OpenAI API error: Rate limit exceeded"
}
```

---

## Request/Response Examples

### Example 1: Simple Query

**Request:**
```json
{
  "session_id": "test-session-123",
  "message": "What is premises liability?",
  "conversation_history": []
}
```

**Response:**
```json
{
  "answer": "Premises liability is a legal doctrine that holds property owners responsible for injuries occurring on their property due to unsafe conditions. Under California law, property owners owe varying degrees of duty based on the visitor's status: invitees (highest duty), licensees (moderate duty), and trespassers (limited duty)...",
  "confidence": "high",
  "confidence_score": 0.89,
  "citations": [
    {
      "case_name": "Rodriguez v. Cityplace Shopping Center",
      "court": "California Court of Appeal, Second District",
      "date": "2021-07-20",
      "citation": "65 Cal.App.5th 789",
      "url": "https://www.courtlistener.com/?q=Rodriguez%20v.%20Cityplace",
      "excerpt": "Property owners have a duty to maintain their premises in a reasonably safe condition and to warn of known hazards that are not obvious to visitors."
    }
  ],
  "retrieved_chunks": [...],
  "disclaimer": "..."
}
```

### Example 2: Follow-up Question

**Request:**
```json
{
  "session_id": "test-session-123",
  "message": "What are the defenses to premises liability?",
  "conversation_history": [
    {
      "role": "user",
      "content": "What is premises liability?"
    },
    {
      "role": "assistant",
      "content": "Premises liability is a legal doctrine that holds property owners responsible for injuries..."
    }
  ]
}
```

**Response:**
```json
{
  "answer": "Building on our previous discussion of premises liability, property owners have several common defenses. First, they may argue the plaintiff was a trespasser, thereby reducing the duty of care. Second, comparative negligence allows apportioning fault if the plaintiff contributed to their injury...",
  "confidence": "medium",
  "confidence_score": 0.68,
  "citations": [...],
  "retrieved_chunks": [...],
  "disclaimer": "..."
}
```

### Example 3: Low Confidence Query

**Request:**
```json
{
  "session_id": "test-session-123",
  "message": "What are the implications of quantum computing on contract law?",
  "conversation_history": []
}
```

**Response:**
```json
{
  "answer": "I apologize, but I have limited information in the available legal database regarding quantum computing's implications for contract law. This appears to be an emerging area of law that may not yet have established case precedents.",
  "confidence": "insufficient",
  "confidence_score": 0.15,
  "citations": [],
  "retrieved_chunks": [],
  "disclaimer": "..."
}
```

---

## Confidence Scoring

The API uses a **dual-layer confidence assessment**:

### 1. Retrieval Confidence (60% weight)

Based on vector similarity scores from Pinecone:

```python
avg_retrieval_score = mean([chunk.metadata.score for chunk in retrieved_chunks])
retrieval_confidence = avg_retrieval_score
```

### 2. LLM Self-Assessment (40% weight)

The LLM evaluates its own answer confidence:

```python
llm_confidence = extract_confidence_from_llm_response()
```

### Combined Score

```python
final_score = (0.6 * retrieval_confidence) + (0.4 * llm_confidence)
```

### Confidence Levels

```python
if final_score >= 0.75:
    confidence = "high"
elif final_score >= 0.50:
    confidence = "medium"
elif final_score >= 0.25:
    confidence = "low"
else:
    confidence = "insufficient"
```

**Interpretation:**
- **High (≥0.75):** Strong supporting evidence from multiple sources
- **Medium (≥0.50):** Moderate supporting evidence
- **Low (≥0.25):** Limited supporting evidence
- **Insufficient (<0.25):** Not enough evidence to support answer

---

## Rate Limiting

### Current Limits (Development)

No rate limiting is currently enforced.

### Recommended Production Limits

```python
# Per API key
- 100 requests per minute
- 1000 requests per hour
- 10000 requests per day

# Per IP (if unauthenticated)
- 10 requests per minute
- 100 requests per hour
```

**Implementation:** Use middleware like `slowapi` or cloud provider rate limiting.

---

## Error Handling

### Standard Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Request processed successfully |
| 400 | Bad Request | Missing required field |
| 422 | Validation Error | Invalid field type |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | LLM provider error |
| 503 | Service Unavailable | Pinecone connection failed |

### Error Response Format

```json
{
  "detail": "Error message",
  "error_type": "ValidationError",
  "timestamp": "2026-02-23T12:00:00Z"
}
```

---

## CORS Configuration

### Allowed Origins (Development)

```python
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
```

### Production Configuration

```python
origins = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

**Security:** Never use `origins = ["*"]` in production.

---

## Conversation Management

### Session Lifecycle

1. **Client generates UUID:** `session_id = uuidv4()`
2. **First message:** Sent with empty `conversation_history`
3. **Subsequent messages:** Include all previous messages
4. **Clear chat:** Generate new `session_id`

### Conversation History Format

**Always include both user and assistant messages:**

```json
{
  "conversation_history": [
    {"role": "user", "content": "First question"},
    {"role": "assistant", "content": "First answer"},
    {"role": "user", "content": "Follow-up question"},
    {"role": "assistant", "content": "Follow-up answer"}
  ]
}
```

**Note:** The backend does not store conversation history. Clients must maintain and send the full history with each request.

---

## Performance Metrics

### Typical Response Times

| Operation | Average | P95 | P99 |
|-----------|---------|-----|-----|
| Query Rewrite | 500ms | 800ms | 1.2s |
| Vector Retrieval | 200ms | 300ms | 500ms |
| LLM Generation | 2s | 4s | 6s |
| **Total** | **2.7s** | **5.1s** | **7.7s** |

### Token Usage (per query)

| Component | Avg Tokens | Cost (GPT-4o) |
|-----------|------------|---------------|
| Input (context + query) | 2000 | $0.010 |
| Output (answer) | 500 | $0.015 |
| **Total** | **2500** | **$0.025** |

**Cost Estimation (100 queries/month):** ~$2.50

---

## Best Practices

### 1. Session Management

```typescript
// ✅ Good: Persistent session ID
const [sessionId] = useState(() => uuidv4());

// ❌ Bad: New session ID every render
const sessionId = uuidv4();
```

### 2. Conversation History

```typescript
// ✅ Good: Include full history
const history = messages.map(msg => ({
  role: msg.role,
  content: msg.content
}));

// ❌ Bad: Only include last message
const history = [messages[messages.length - 1]];
```

### 3. Error Handling

```typescript
// ✅ Good: Graceful degradation
try {
  const response = await sendMessage(request);
  if (response.error) {
    toast.error(response.error);
  }
} catch (err) {
  toast.error('Connection failed. Please try again.');
}

// ❌ Bad: Silent failure
const response = await sendMessage(request);
```

### 4. Loading States

```typescript
// ✅ Good: Show loading indicator
setIsLoading(true);
try {
  const response = await sendMessage(request);
  setMessages([...messages, response]);
} finally {
  setIsLoading(false);
}
```

---

## Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:8000/health

# Simple query
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-123",
    "message": "What is negligence?"
  }'

# With conversation history
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "session_id": "test-123",
  "message": "Can you give an example?",
  "conversation_history": [
    {"role": "user", "content": "What is negligence?"},
    {"role": "assistant", "content": "Negligence is..."}
  ]
}
EOF
```

### Automated Testing

```python
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_chat_endpoint():
    payload = {
        "session_id": "test-session",
        "message": "What is contract consideration?",
        "conversation_history": []
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "confidence" in data
    assert "citations" in data
```

---

## Changelog

### v1.0.0 (2026-02-23)
- Initial API release
- POST /chat endpoint
- GET /health endpoint
- Dual-layer confidence scoring
- Citation grounding
- Conversation memory

---

## Future Enhancements

### Planned Features
- [ ] Streaming responses (Server-Sent Events)
- [ ] Semantic caching for common queries
- [ ] Advanced filtering (by court, date, topic)
- [ ] Citation export formats (Bluebook, etc.)
- [ ] User authentication & API keys
- [ ] WebSocket support for real-time updates

---

## Support

- **Documentation:** https://github.com/yourusername/legal-ai
- **Issues:** https://github.com/yourusername/legal-ai/issues
- **Email:** support@yourdomain.com

---

**Disclaimer:** This API provides educational information only and does not constitute legal advice. Always consult a licensed attorney for legal matters.
