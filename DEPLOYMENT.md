# Deployment Guide

This guide covers deploying the Legal AI Research Assistant to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup (Pinecone)](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Considerations](#security-considerations)
8. [Cost Optimization](#cost-optimization)

---

## Pre-Deployment Checklist

### Prerequisites

- [ ] GitHub repository with latest code
- [ ] OpenAI API key with billing enabled
- [ ] Pinecone account with index created
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (provided by platform or Let's Encrypt)

### Code Verification

```bash
# Run tests
cd backend
pytest

cd ../frontend
npm run build  # Verify build succeeds

# Check for secrets in code
git secrets --scan

# Verify environment files are gitignored
git ls-files | grep ".env"  # Should return nothing
```

### Performance Testing

```bash
# Backend load test
ab -n 100 -c 10 http://localhost:8000/health

# Frontend build size
npm run build
ls -lh frontend/.next/static/chunks/
```

---

## Backend Deployment

### Option 1: Railway (Recommended)

**Pros:** Simple deployment, automatic HTTPS, good free tier
**Cons:** Limited free tier, less control than VPS

#### Steps:

1. **Create Railway Account**
   - Visit https://railway.app/
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `legal-ai` repository

3. **Configure Service**
   ```yaml
   # railway.toml (create in project root)
   [build]
   builder = "nixpacks"
   buildCommand = "pip install -r backend/requirements.txt"

   [deploy]
   startCommand = "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"
   healthcheckPath = "/health"
   healthcheckTimeout = 100
   restartPolicyType = "on_failure"
   restartPolicyMaxRetries = 10
   ```

4. **Set Environment Variables**

   In Railway dashboard, add:
   ```
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=...
   PINECONE_INDEX_NAME=legal-ai-index
   PINECONE_ENVIRONMENT=us-east-1-aws
   MISTRAL_API_KEY=...  # Optional

   # Confidence scoring (optional, uses defaults if not set)
   RETRIEVAL_CONFIDENCE_WEIGHT=0.6
   LLM_CONFIDENCE_WEIGHT=0.4
   HIGH_CONFIDENCE_THRESHOLD=0.75
   MEDIUM_CONFIDENCE_THRESHOLD=0.50

   # RAG parameters (optional)
   TOP_K_CHUNKS=5
   CHUNK_SIZE=512
   CHUNK_OVERLAP=50
   ```

5. **Deploy**
   - Railway auto-deploys on push to `main` branch
   - Get deployment URL: `https://your-app.up.railway.app`

6. **Verify Deployment**
   ```bash
   curl https://your-app.up.railway.app/health
   ```

---

### Option 2: Render

**Pros:** Great free tier, easy setup, managed SSL
**Cons:** Slower cold starts on free tier

#### Steps:

1. **Create Render Account**
   - Visit https://render.com/
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select `legal-ai` repo

3. **Configure Service**
   ```
   Name: legal-ai-backend
   Environment: Python 3
   Build Command: pip install -r backend/requirements.txt
   Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables**
   - Same as Railway (see above)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build (~3-5 minutes)
   - Get URL: `https://legal-ai-backend.onrender.com`

---

### Option 3: Google Cloud Run

**Pros:** Serverless, scales to zero, cost-effective
**Cons:** More complex setup, requires Docker

#### Steps:

1. **Create Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM python:3.13-slim

   WORKDIR /app

   # Install dependencies
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   # Copy application
   COPY . .

   # Expose port
   ENV PORT 8080
   EXPOSE 8080

   # Run application
   CMD uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

2. **Build and Push**
   ```bash
   # Enable Cloud Run API
   gcloud services enable run.googleapis.com

   # Build image
   gcloud builds submit --tag gcr.io/PROJECT_ID/legal-ai-backend

   # Deploy
   gcloud run deploy legal-ai-backend \
     --image gcr.io/PROJECT_ID/legal-ai-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars OPENAI_API_KEY=sk-...,PINECONE_API_KEY=...
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

**Pros:** Optimized for Next.js, automatic previews, edge network
**Cons:** None for this use case

#### Steps:

1. **Create Vercel Account**
   - Visit https://vercel.com/
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import `legal-ai` repository

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (~2-3 minutes)
   - Get URL: `https://legal-ai.vercel.app`

6. **Custom Domain (Optional)**
   - Settings → Domains
   - Add custom domain
   - Update DNS records (Vercel provides instructions)

---

### Option 2: Netlify

**Pros:** Simple deployment, great DX
**Cons:** Slightly slower than Vercel for Next.js

#### Steps:

1. **Create Netlify Account**
   - Visit https://netlify.com/
   - Sign in with GitHub

2. **Create New Site**
   - "Add new site" → "Import an existing project"
   - Choose GitHub → Select `legal-ai` repo

3. **Configure Build**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/.next
   ```

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com
   ```

5. **Deploy**
   - Click "Deploy site"
   - Get URL: `https://random-name.netlify.app`

---

## Database Setup (Pinecone)

### Production Index

1. **Create Production Index**
   ```python
   # Use separate index for production
   PINECONE_INDEX_NAME=legal-ai-prod

   # Higher performance tier (if needed)
   # Standard tier: Free up to 100K vectors
   # Premium tier: Higher QPS, lower latency
   ```

2. **Ingest Data**
   ```bash
   # From local machine or CI/CD pipeline
   python -m backend.ingestion.ingest
   ```

3. **Verify Vectors**
   ```python
   import pinecone
   pinecone.init(api_key="...", environment="...")
   index = pinecone.Index("legal-ai-prod")
   print(index.describe_index_stats())
   # Should show: total_vector_count: 150
   ```

4. **Monitor Usage**
   - Pinecone Dashboard → Index → Metrics
   - Track: Queries/sec, Latency, Upsert rate

---

## Environment Configuration

### Backend Environment Variables

**Required:**
```bash
OPENAI_API_KEY=sk-...                     # OpenAI API key
PINECONE_API_KEY=pcb_...                  # Pinecone API key
PINECONE_INDEX_NAME=legal-ai-prod         # Index name
PINECONE_ENVIRONMENT=us-east-1-aws        # Pinecone environment
```

**Optional:**
```bash
MISTRAL_API_KEY=...                       # Fallback LLM
RETRIEVAL_CONFIDENCE_WEIGHT=0.6
LLM_CONFIDENCE_WEIGHT=0.4
HIGH_CONFIDENCE_THRESHOLD=0.75
MEDIUM_CONFIDENCE_THRESHOLD=0.50
TOP_K_CHUNKS=5
CHUNK_SIZE=512
CHUNK_OVERLAP=50
LOG_LEVEL=INFO                            # DEBUG|INFO|WARNING|ERROR
```

### Frontend Environment Variables

**Required:**
```bash
NEXT_PUBLIC_API_URL=https://your-backend.com
```

**Optional:**
```bash
NEXT_PUBLIC_ANALYTICS_ID=...              # Google Analytics, etc.
NEXT_PUBLIC_ENVIRONMENT=production        # For feature flags
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.13'
      - name: Install dependencies
        run: pip install -r backend/requirements.txt
      - name: Run tests
        run: pytest backend/

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway CLI deployment
          railway up

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          # Vercel auto-deploys on push
          echo "Vercel handles deployment"
```

---

## Monitoring & Logging

### Application Monitoring

**Recommended Tools:**
- **Sentry:** Error tracking and performance monitoring
- **Datadog:** APM and infrastructure monitoring
- **New Relic:** Full-stack observability

**Setup (Sentry Example):**

1. **Install Sentry SDK**
   ```bash
   pip install sentry-sdk[fastapi]
   ```

2. **Configure in main.py**
   ```python
   import sentry_sdk
   from sentry_sdk.integrations.fastapi import FastApiIntegration

   sentry_sdk.init(
       dsn="https://...@sentry.io/...",
       integrations=[FastApiIntegration()],
       traces_sample_rate=1.0,
       environment="production"
   )
   ```

### Logging

**Structured Logging:**
```python
import logging
import json

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Log important events
logger.info("Query processed", extra={
    "session_id": session_id,
    "confidence": confidence_score,
    "num_citations": len(citations)
})
```

**Log Aggregation:**
- Railway/Render: Built-in log viewer
- Cloud providers: CloudWatch, Stackdriver
- Third-party: Logtail, Papertrail

---

## Security Considerations

### API Security

1. **Add Authentication**
   ```python
   from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

   security = HTTPBearer()

   @app.post("/chat")
   async def chat(
       request: ChatRequest,
       credentials: HTTPAuthorizationCredentials = Depends(security)
   ):
       # Verify API key
       if credentials.credentials != os.getenv("API_KEY"):
           raise HTTPException(status_code=401)
       # ... rest of endpoint
   ```

2. **Rate Limiting**
   ```python
   from slowapi import Limiter, _rate_limit_exceeded_handler
   from slowapi.util import get_remote_address

   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter

   @app.post("/chat")
   @limiter.limit("10/minute")
   async def chat(request: Request, ...):
       # Endpoint logic
   ```

3. **CORS Configuration**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],  # Specific domain
       allow_credentials=True,
       allow_methods=["POST", "GET"],
       allow_headers=["*"],
   )
   ```

### Secret Management

**Use Platform Secrets:**
- Railway: Environment Variables
- Vercel: Environment Variables (encrypted)
- GCP: Secret Manager
- AWS: Secrets Manager

**Never commit:**
- `.env` files
- API keys
- Private keys
- Certificates

### HTTPS/SSL

- **Automatic:** Vercel, Netlify, Railway provide free SSL
- **Custom:** Let's Encrypt for self-hosted
- **Always redirect HTTP → HTTPS**

---

## Cost Optimization

### Backend Costs

**Railway Free Tier:**
- $5/month credit
- ~550 hours uptime
- **Cost:** $0 (within free tier)

**Paid Plan:**
- $5/month base + usage
- ~$10-20/month for light traffic

### API Costs

**OpenAI GPT-4o:**
- Input: $2.50 / 1M tokens
- Output: $10.00 / 1M tokens
- **Est. cost:** $0.025/query × 100 queries = $2.50/month

**Pinecone:**
- Free tier: 100K vectors, 1 index
- **Cost:** $0

**Total Monthly Cost (100 queries):** ~$2.50

### Optimization Strategies

1. **Semantic Caching**
   ```python
   # Cache common queries to avoid LLM calls
   from functools import lru_cache

   @lru_cache(maxsize=100)
   def get_cached_answer(query_hash):
       # Return cached answer if exists
       pass
   ```

2. **Model Selection**
   ```python
   # Use GPT-4o-mini for simpler queries
   if is_simple_query(message):
       model = "gpt-4o-mini"  # 60% cheaper
   else:
       model = "gpt-4o"
   ```

3. **Lazy Loading**
   - Load chunks only when needed
   - Paginate citation results
   - Stream responses

---

## Health Checks

### Endpoint Monitoring

```python
@app.get("/health")
async def health_check():
    checks = {
        "api": "healthy",
        "pinecone": await check_pinecone(),
        "openai": await check_openai(),
    }

    if all(v == "healthy" for v in checks.values()):
        return {"status": "healthy", "checks": checks}
    else:
        raise HTTPException(status_code=503, detail=checks)
```

### Uptime Monitoring

**Tools:**
- **UptimeRobot:** Free, simple monitoring
- **Pingdom:** Advanced monitoring with alerts
- **StatusPage:** Public status page for users

**Setup:**
- Monitor: `/health` endpoint
- Frequency: Every 5 minutes
- Alerts: Email, Slack, SMS

---

## Rollback Strategy

### Quick Rollback (Vercel)

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Quick Rollback (Railway)

```bash
# Railway dashboard → Deployments → Select previous → Redeploy
```

### Database Rollback

```bash
# Re-run ingestion with previous data
python -m backend.ingestion.ingest --data-version v1.0
```

---

## Post-Deployment Checklist

- [ ] Health endpoint returns 200
- [ ] Frontend connects to backend
- [ ] Sample queries work end-to-end
- [ ] SSL certificate is valid
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Logs accessible
- [ ] API keys rotated (if needed)
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking (optional)

---

## Troubleshooting

### Backend Issues

**"Module not found"**
```bash
# Verify requirements.txt is complete
pip freeze > backend/requirements.txt
```

**"Pinecone connection failed"**
- Check API key and environment name
- Verify index exists
- Check network/firewall rules

**"OpenAI rate limit"**
- Upgrade OpenAI tier
- Implement request queuing
- Add retry logic with exponential backoff

### Frontend Issues

**"Failed to fetch"**
- Check CORS configuration
- Verify API URL environment variable
- Check network tab in browser DevTools

**"Build failed"**
```bash
# Clear cache and rebuild
rm -rf frontend/.next frontend/node_modules
npm install
npm run build
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review error logs
- Check API usage/costs
- Monitor performance metrics

**Monthly:**
- Update dependencies
- Review security advisories
- Analyze user feedback

**Quarterly:**
- Rotate API keys
- Review and optimize costs
- Update documentation

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app/
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Pinecone Docs:** https://docs.pinecone.io/
- **OpenAI Docs:** https://platform.openai.com/docs

---

**Last Updated:** 2026-02-23
**Version:** 1.0.0
