# User Guide - Legal AI Research Assistant

Welcome to the Legal AI Research Assistant! This guide will help you get the most out of your legal research experience.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Asking Questions](#asking-questions)
4. [Understanding Results](#understanding-results)
5. [Advanced Features](#advanced-features)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Best Practices](#best-practices)
8. [Limitations](#limitations)
9. [FAQs](#faqs)

---

## Getting Started

### What is Legal AI Research Assistant?

The Legal AI Research Assistant is an AI-powered tool that helps you research U.S. case law by:
- **Answering legal questions** with citations from actual court cases
- **Providing confidence scores** to indicate reliability
- **Showing source documents** used to generate answers
- **Maintaining conversation context** for follow-up questions

**Important:** This tool is for educational and research purposes only. It does not constitute legal advice. Always consult a licensed attorney for legal matters.

### Accessing the Application

**Development:** http://localhost:3000
**Production:** https://your-domain.com

---

## Interface Overview

The application uses a **split-panel interface** designed for desktop use:

```
┌─────────────────────────────────────────────────────┐
│  [🔱] Legal AI Research Assistant      [🌙] [💬]  │ ← Header
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   Chat Panel (60%)   │   Source Viewer (40%)        │
│                      │                              │
│   Your questions     │   Citations & Sources        │
│   AI responses       │   Retrieved documents        │
│   Input field        │   Match scores               │
│                      │                              │
│   [Type question...] │                              │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
```

### Header

- **Logo & Title:** Application branding
- **Export Button:** Download conversation history
- **Clear Button:** Reset conversation
- **Theme Toggle:** Switch between light/dark mode

### Chat Panel (Left Side)

- **Empty State:** Shows example questions when starting
- **Messages:** Your questions and AI responses
- **Confidence Badges:** Visual indicators of answer reliability
- **Input Field:** Type your legal questions here
- **Character Counter:** Shows remaining characters (2000 max)
- **Send Button:** Submit your question

### Source Viewer (Right Side)

- **Citations:** Formal legal case citations with metadata
- **Retrieved Sources:** Document chunks used to generate answer
- **Match Scores:** Relevance percentages for each source

---

## Asking Questions

### How to Ask a Question

1. **Click in the input field** at the bottom of the chat panel
2. **Type your legal question** (up to 2000 characters)
3. **Press Enter** or click **Send** button

**Example:**
```
What is contract consideration?
```

### Question Types

#### 1. Definitional Questions

Ask about legal concepts, doctrines, or terms.

**Examples:**
- "What is premises liability?"
- "Define adverse possession"
- "Explain the Fourth Amendment exclusionary rule"

#### 2. Procedural Questions

Ask about legal processes or requirements.

**Examples:**
- "What are the elements of negligence?"
- "What is required to establish adverse possession?"
- "What are defenses to breach of contract?"

#### 3. Comparative Questions

Ask about differences between legal concepts.

**Examples:**
- "What's the difference between assault and battery?"
- "How does a licensee differ from an invitee?"
- "Distinguish between civil and criminal negligence"

#### 4. Follow-up Questions

Build on previous answers in the conversation.

**Examples:**
- "Can you give me an example?"
- "What are the exceptions to this rule?"
- "How does this apply in California specifically?"

---

## Understanding Results

### AI Response Structure

Each AI response contains:

```
┌─────────────────────────────────────────┐
│ [Assistant's Answer]                    │
│                                         │
│ A detailed explanation of your          │
│ question, grounded in case law...       │
│                                         │
│ [🟢 High Confidence]  3 citations       │
│ 12:34 PM                                │
└─────────────────────────────────────────┘
```

**Components:**
- **Answer Text:** Detailed explanation of your question
- **Confidence Badge:** Visual indicator of reliability (see below)
- **Citation Count:** Number of supporting cases
- **Timestamp:** When the response was generated

### Confidence Scores

The AI provides confidence scores based on available evidence:

| Badge | Meaning | Interpretation |
|-------|---------|---------------|
| 🟢 **High Confidence** | Strong supporting evidence from multiple sources | Highly reliable answer backed by clear case law |
| 🟡 **Medium Confidence** | Moderate supporting evidence | Reasonable answer with some support |
| 🟠 **Low Confidence** | Limited supporting evidence | Weak support, verify independently |
| ⚪ **Insufficient** | Not enough evidence | Unable to provide reliable answer |

**Tooltip:** Hover over the confidence badge to see detailed information.

---

### Citations

When you click on an AI response, citations appear in the right panel:

```
┌─────────────────────────────────────────┐
│ [📄] 1. Smith v. Jones Manufacturing     │
│      123 Cal.4th 456               [📋] │
├─────────────────────────────────────────┤
│ Supreme Court of California             │
│ 2023-05-15                              │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ "Under California contract law,     │ │
│ │ consideration is the price for      │ │
│ │ which the promise is bought..."     │ │
│ │ [Show more]                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [View on CourtListener →]              │
└─────────────────────────────────────────┘
```

**Citation Information:**
- **Case Name:** Full name of the legal case
- **Citation Number:** Official case citation
- **Court:** Jurisdiction that decided the case
- **Date:** When the case was decided
- **Excerpt:** Relevant quote from the case
- **Link:** External link to full case text

**Actions:**
- **Copy Button (📋):** Copy citation to clipboard
- **Show more/less:** Expand/collapse long excerpts
- **View on CourtListener:** Open full case in new tab

---

### Retrieved Sources

Below citations, you'll see the actual document chunks used:

```
┌─────────────────────────────────────────┐
│ Retrieved Sources (5)                   │
├─────────────────────────────────────────┤
│ 1. Smith v. Jones Manufacturing         │
│    123 Cal.4th 456              [92% ✓] │
│                                         │
│    Supreme Court of California          │
│    2023-05-15                           │
│                                         │
│    "Under California contract law..."   │
└─────────────────────────────────────────┘
```

**Match Score Interpretation:**
- **≥80% (Green):** Highly relevant to your question
- **≥60% (Amber):** Moderately relevant
- **<60% (Gray):** Less relevant but included

---

## Advanced Features

### 1. Export Conversation

Save your research for later reference.

**How to Export:**
1. Click **Export** button in header
2. Choose format:
   - **Text File (.txt):** Human-readable format with timestamps
   - **JSON File (.json):** Structured data with full metadata

**Use Cases:**
- Save research for later review
- Share conversation with colleagues
- Include in legal memorandums
- Create research archives

---

### 2. Clear Conversation

Start a fresh conversation while preserving the current one.

**How to Clear:**
1. Click **Clear** button in header
2. Confirm the action in the dialog
3. All messages are removed (cannot be undone)

**Tips:**
- Export conversation before clearing if you want to save it
- Clearing generates a new session ID
- Previous conversations are not stored on the server

---

### 3. Dark Mode

Reduce eye strain with dark theme.

**How to Toggle:**
- Click moon/sun icon in header (🌙/☀️)
- Or use keyboard shortcut: `Ctrl+D` (Windows) or `Cmd+D` (Mac)

**Features:**
- Preference saved in browser
- Smooth color transitions
- Optimized contrast for readability

---

### 4. Copy to Clipboard

Quickly copy messages or citations.

**How to Copy:**
- **Messages:** Hover over any message → Click copy button
- **Citations:** Click copy button on citation card

**What Gets Copied:**
- Messages: Full text content
- Citations: Formatted citation (case name, citation, court, date)

---

### 5. Scroll to Bottom

Quickly return to latest messages when scrolled up.

**How it Works:**
- Floating button appears when scrolled >200px from bottom
- Click to smoothly scroll to latest message
- Auto-hides when at bottom

---

## Keyboard Shortcuts

Boost your productivity with keyboard shortcuts:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+K` / `Cmd+K` | Focus Input | Jump to question input field |
| `Ctrl+D` / `Cmd+D` | Toggle Theme | Switch light/dark mode |
| `Ctrl+/` / `Cmd+/` | Show Help | Display keyboard shortcuts |
| `Enter` | Send Message | Submit your question |
| `Escape` | Close Dialog | Close open dialogs/modals |

**Viewing Shortcuts:**
- Press `Ctrl+/` (Windows) or `Cmd+/` (Mac)
- View complete list with descriptions

---

## Best Practices

### Effective Question Asking

#### ✅ Do This:

**Be Specific:**
```
❌ "Tell me about contracts"
✅ "What is contract consideration under California law?"
```

**Ask One Thing at a Time:**
```
❌ "What is negligence, breach of contract, and premises liability?"
✅ "What are the elements of negligence?"
   → Follow up: "What is premises liability?"
```

**Provide Context:**
```
❌ "What about exceptions?"
✅ "What are exceptions to the Fourth Amendment exclusionary rule?"
```

**Use Legal Terminology:**
```
❌ "When can I sue my neighbor for their tree?"
✅ "What is the doctrine of private nuisance?"
```

#### ❌ Avoid This:

- Asking for specific legal advice about your situation
- Questions about non-U.S. law (database contains U.S. cases only)
- Very broad or vague questions
- Multiple unrelated questions in one message
- Asking for predictions about case outcomes

---

### Follow-up Questions

Build on previous answers for deeper research:

**Example Conversation:**
```
You: "What is adverse possession?"

AI: [Explains adverse possession with 4 elements]

You: "Can you explain the 'hostile possession' element in more detail?"

AI: [Detailed explanation of hostile possession]

You: "Are there any exceptions to this requirement?"

AI: [Explains exceptions]
```

**Benefits:**
- AI remembers context from previous messages
- More targeted and relevant answers
- Build comprehensive understanding of topics

---

### Verifying Information

**Always Cross-Check:**
1. **Read Citations:** Click "View on CourtListener" links
2. **Check Dates:** Ensure cases are current (law may have changed)
3. **Verify Jurisdiction:** Confirm cases apply to your jurisdiction
4. **Consult Experts:** Use this tool as a starting point, not endpoint

**Red Flags:**
- ⚠️ Low or insufficient confidence scores
- ⚠️ Very old cases (>50 years without newer citations)
- ⚠️ Conflicting information across sources

---

## Limitations

### What This Tool CAN Do:

✅ Explain legal concepts and doctrines
✅ Provide case law citations
✅ Answer questions about U.S. law
✅ Maintain conversation context
✅ Assess confidence in answers

### What This Tool CANNOT Do:

❌ Provide legal advice for your specific situation
❌ Predict case outcomes
❌ Research non-U.S. law
❌ Access real-time or very recent cases
❌ Replace consultation with a licensed attorney

### Known Limitations:

**Data Coverage:**
- Currently limited to synthetic demonstration data (30 cases)
- For production, integrate CourtListener or Casetext databases
- May not have very recent cases or niche legal areas

**Confidence Scoring:**
- AI-generated, not lawyer-verified
- Should be used as a guide, not absolute truth
- Low confidence doesn't mean answer is wrong, just uncertain

**Conversation Memory:**
- Limited to current session only
- Cleared when you refresh page or clear chat
- No persistent conversation history

---

## FAQs

### General Questions

**Q: Is this tool free to use?**
A: Yes for development/demo. Production deployment may have costs.

**Q: Can I use this for my legal case?**
A: This tool is for research and education only. Always consult a licensed attorney for legal matters.

**Q: How current is the legal data?**
A: Currently uses demonstration data. Production would integrate real-time legal databases.

**Q: What jurisdictions are covered?**
A: Currently U.S. case law. Specific states depend on database contents.

### Using the Tool

**Q: Why is my question showing low confidence?**
A: The system couldn't find strong supporting evidence in the database. Try:
- Rephrasing your question
- Using more specific legal terms
- Breaking complex questions into simpler parts

**Q: Can I save my conversations?**
A: Yes! Use the Export button to download as text or JSON file.

**Q: How do I cite these cases in my work?**
A: Use the formal citations provided (e.g., "123 Cal.4th 456"). Click copy button on citation cards.

**Q: Why aren't there citations for my question?**
A: The AI couldn't find relevant cases, or the question is outside the database scope.

### Technical Questions

**Q: What AI model powers this?**
A: OpenAI GPT-4o for answer generation, with Pinecone vector search for retrieval.

**Q: Is my conversation private?**
A: Conversations are not stored on the server. Export to save locally.

**Q: Can I access this on mobile?**
A: The interface is optimized for desktop. Mobile support may be added in future.

**Q: Why is it sometimes slow?**
A: Response time depends on:
- API latency (OpenAI, Pinecone)
- Question complexity
- Server load

---

## Getting Help

### If You Encounter Issues:

1. **Check your question:** Is it specific and clear?
2. **Try rephrasing:** Use different legal terminology
3. **Clear and retry:** Click Clear button and start fresh
4. **Check connection:** Ensure backend is running (development)

### Contact Support:

- **GitHub Issues:** https://github.com/yourusername/legal-ai/issues
- **Email:** support@yourdomain.com
- **Documentation:** See README.md and other guides

---

## Tips & Tricks

### Research Workflow

**Step 1: Start Broad**
```
"What is premises liability?"
```

**Step 2: Narrow Down**
```
"What are the duties owed to different types of visitors?"
```

**Step 3: Get Specific**
```
"How do California courts determine if someone is an invitee vs. licensee?"
```

**Step 4: Explore Edge Cases**
```
"Are there exceptions to landowner liability for trespassers?"
```

### Organizing Research

1. **Use Export Regularly:** Save conversations after completing a topic
2. **Name Files Clearly:** `contract-consideration-research-2026-02-23.txt`
3. **Take Notes:** Copy important citations to your research document
4. **Create Summaries:** After research session, summarize key findings

### Maximizing Accuracy

- Cross-reference multiple sources
- Check citation dates for recency
- Look for patterns across multiple cases
- Note jurisdiction differences
- Verify on official legal databases

---

## Conclusion

The Legal AI Research Assistant is a powerful tool for legal research, but it works best when used as part of a comprehensive research strategy. Combine it with traditional legal research methods, expert consultation, and critical thinking for best results.

**Remember:** This tool provides information, not legal advice. Always consult with a licensed attorney for legal matters specific to your situation.

---

## Glossary

**Citation:** Official reference to a legal case (e.g., "123 Cal.4th 456")

**Confidence Score:** AI's assessment of answer reliability based on available evidence

**CourtListener:** Free legal database with millions of court opinions

**RAG (Retrieval-Augmented Generation):** AI technique that grounds answers in retrieved documents

**Session:** Single conversation instance with unique ID

**Vector Search:** Semantic search using mathematical embeddings

---

**Last Updated:** 2026-02-23
**Version:** 1.0.0

**Legal Disclaimer:** This application is for educational and informational purposes only and does not constitute legal advice, legal representation, or legal services. No attorney-client relationship is created through use of this application. Always consult with a licensed attorney admitted to practice in your jurisdiction for legal advice specific to your situation.
