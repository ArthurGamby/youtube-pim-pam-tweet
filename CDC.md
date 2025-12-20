# 📋 Cahier des Charges - PimpAmTweet

## 🎯 Project Overview

**Project Name:** PimpAmTweet  
**Description:** A local single-page application that transforms draft tweets into polished, well-formatted tweets using a local LLM (Ollama).  
**Target Audience:** Developers following along the YouTube tutorial  
**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Ollama (gemma3:4b)

---

## 🏗️ Architecture Principles

- **Simplicity First:** MVP approach, minimal code
- **No Over-Engineering:** No Docker, no auth, no complex patterns
- **Clean Code:** Good file organization, components folder, best practices
- **Scalability Ready:** Code structure allows easy future enhancements
- **Local-First:** Everything runs on the local machine

---

## 📚 STEP 1: Basic Tweet Transformation

### Chapter 1.1: Project Setup Verification
**Goal:** Ensure the Next.js project is ready  
**Why:** We need a clean starting point with all dependencies working

**Baby Steps:**
1. Verify Next.js is running (`npm run dev`)
2. Clean up the default page.tsx
3. Create basic folder structure:
   ```
   app/
   ├── api/
   │   └── transform/
   │       └── route.ts
   ├── components/
   │   └── TweetTransformer.tsx
   ├── lib/
   │   └── ollama.ts
   ├── page.tsx
   ├── layout.tsx
   └── globals.css
   ```

**Checkpoint:** ✅ Empty page displays correctly

---

### Chapter 1.2: Create the UI Components
**Goal:** Build the basic interface with input and output areas  
**Why:** Users need a place to paste their draft tweet and see the result

**Baby Steps:**
1. Create `TweetTransformer.tsx` component with:
   - A textarea for the draft tweet input
   - A "Transform" button
   - A display area for the transformed tweet (below the input)
2. Add basic Tailwind styling
3. Import and use in `page.tsx`

**Checkpoint:** ✅ Can type in textarea and see button (no functionality yet)

---

### Chapter 1.3: Create the Ollama Integration
**Goal:** Set up communication with the local LLM  
**Why:** This is the core feature - transforming tweets via AI

**Baby Steps:**
1. Create `lib/ollama.ts` with a function to call Ollama API
2. Define the API endpoint: `http://localhost:11434/api/generate`
3. Create proper TypeScript types for request/response
4. Handle streaming response from Ollama

**Key Code Points:**
- Use `fetch` with POST method
- Model: `gemma3:4b`
- Handle the stream properly

**Checkpoint:** ✅ Can call Ollama from a test function

---

### Chapter 1.4: Create the API Route
**Goal:** Create a Next.js API route to handle transformation requests  
**Why:** Keeps LLM logic server-side, cleaner architecture, no CORS issues

**Baby Steps:**
1. Create `app/api/transform/route.ts`
2. Accept POST request with draft tweet
3. Call Ollama with a basic prompt
4. Return transformed tweet

**Basic Prompt Template:**
```
You are a tweet formatter. Take the following draft tweet and make it cleaner, 
more engaging, and well-formatted. Keep it under 280 characters.

Draft: {user_input}

Return only the improved tweet, nothing else.
```

**Checkpoint:** ✅ API route responds correctly (test with curl/Postman)

---

### Chapter 1.5: Connect Frontend to Backend
**Goal:** Wire everything together  
**Why:** Complete the basic flow from input to output

**Baby Steps:**
1. Add state management in `TweetTransformer.tsx` (useState)
2. Create async function to call `/api/transform`
3. Handle loading state
4. Display result in output area
5. Add basic error handling

**Checkpoint:** ✅ Full flow works: paste → click → see transformed tweet

---

## 📚 STEP 2: Context & Tone Customization

### Chapter 2.1: Design Context Feature
**Goal:** Allow users to set persistent context for their tweets  
**Why:** Different users have different styles (professional, casual, humorous, etc.)

**Baby Steps:**
1. Create `components/ContextSettings.tsx`
2. Add a collapsible/expandable section above the tweet input
3. Include a textarea for "About me / My style"
4. Store in localStorage for persistence

**Checkpoint:** ✅ Context input visible and saves to localStorage

---

### Chapter 2.2: Integrate Context in API
**Goal:** Include context in the LLM prompt  
**Why:** Personalized responses based on user preferences

**Baby Steps:**
1. Update API route to accept optional `context` parameter
2. Modify prompt template to include context:
   ```
   Context about the user: {context}
   
   Based on this context, improve the following draft tweet...
   ```
3. Update frontend to send context with request

**Checkpoint:** ✅ Transformed tweets reflect the user's style/context

---

### Chapter 2.3: Add Tone Presets
**Goal:** Quick tone selection buttons  
**Why:** Faster workflow for common use cases

**Baby Steps:**
1. Add preset buttons: Professional, Casual, Humorous, Inspirational
2. Clicking a preset auto-fills or appends to context
3. Style the buttons nicely

**Checkpoint:** ✅ Preset buttons work and influence output

---

## 📚 STEP 3: Tweet Filters & Options

### Chapter 3.1: Create Filter Options Component
**Goal:** Add configurable filters for tweet generation  
**Why:** More control over the output format

**Baby Steps:**
1. Create `components/FilterOptions.tsx`
2. Add UI controls:
   - Max characters slider (100-280)
   - Line count selector (1-4 lines)
   - Emoji toggle (yes/no/few)

**Checkpoint:** ✅ Filter UI displays correctly

---

### Chapter 3.2: Integrate Filters in API
**Goal:** Pass filters to LLM prompt  
**Why:** LLM needs instructions to respect filters

**Baby Steps:**
1. Update API route to accept filter parameters
2. Dynamically build prompt based on filters:
   ```
   Rules:
   - Maximum {maxChars} characters
   - Use {emojiMode} emojis
   - Format in {lineCount} lines maximum
   ```
3. Update frontend to send filters

**Checkpoint:** ✅ Filters affect the generated output

---

### Chapter 3.3: Add Copy to Clipboard
**Goal:** One-click copy of transformed tweet  
**Why:** Essential UX for a tweet tool

**Baby Steps:**
1. Add copy button next to transformed tweet
2. Implement clipboard API
3. Show success feedback (toast or icon change)

**Checkpoint:** ✅ Can copy transformed tweet with one click

---

## 📚 STEP 4: UI Enhancement

### Chapter 4.1: Design System Setup
**Goal:** Define colors, typography, spacing  
**Why:** Consistent, polished look

**Baby Steps:**
1. Choose a color palette (decide during recording)
2. Update `globals.css` with CSS variables
3. Select fonts (Google Fonts or system)

**Checkpoint:** ✅ Design tokens defined

---

### Chapter 4.2: Component Styling
**Goal:** Apply design to all components  
**Why:** Professional appearance

**Baby Steps:**
1. Style the main container/card
2. Style textareas and buttons
3. Add hover/focus states
4. Add subtle animations/transitions

**Checkpoint:** ✅ App looks polished

---

### Chapter 4.3: Responsive Design
**Goal:** Works on all screen sizes  
**Why:** Usability on different devices

**Baby Steps:**
1. Test on mobile viewport
2. Adjust layout for smaller screens
3. Ensure touch-friendly button sizes

**Checkpoint:** ✅ Works on mobile and desktop

---

### Chapter 4.4: Loading & Error States
**Goal:** Proper visual feedback  
**Why:** Users need to know what's happening

**Baby Steps:**
1. Add loading spinner/skeleton during API call
2. Style error messages
3. Add empty state for output area

**Checkpoint:** ✅ All states have proper visuals

---

## 📚 STEP 5: Save for Later with Prisma

### Chapter 5.1: Prisma Setup
**Goal:** Set up SQLite database with Prisma  
**Why:** Persist saved tweets locally

**Baby Steps:**
1. Install Prisma: `npm install prisma @prisma/client`
2. Initialize: `npx prisma init --datasource-provider sqlite`
3. Create schema:
   ```prisma
   model SavedTweet {
     id          String   @id @default(cuid())
     original    String
     transformed String
     context     String?
     createdAt   DateTime @default(now())
   }
   ```
4. Generate client: `npx prisma generate`
5. Run migration: `npx prisma migrate dev --name init`

**Checkpoint:** ✅ Database file created, Prisma client ready

---

### Chapter 5.2: Create Save API
**Goal:** API endpoint to save tweets  
**Why:** Backend logic for persistence

**Baby Steps:**
1. Create `lib/prisma.ts` (Prisma client singleton)
2. Create `app/api/tweets/route.ts`
3. Implement POST (save) and GET (list) endpoints

**Checkpoint:** ✅ Can save and retrieve via API

---

### Chapter 5.3: Saved Tweets UI
**Goal:** Display and manage saved tweets  
**Why:** Users need to access their history

**Baby Steps:**
1. Create `components/SavedTweets.tsx`
2. Add "Save" button on transformed tweets
3. Display list of saved tweets
4. Add delete functionality

**Checkpoint:** ✅ Full save/view/delete flow works

---

### Chapter 5.4: Final Polish
**Goal:** Clean up and final touches  
**Why:** Production-ready feel

**Baby Steps:**
1. Add loading states for saved tweets
2. Add confirmation for delete
3. Test all features together
4. Review code for any cleanup

**Checkpoint:** ✅ App is complete and polished

---

## 📁 Final Project Structure

```
pimpamtweet/
├── app/
│   ├── api/
│   │   ├── transform/
│   │   │   └── route.ts      # Tweet transformation endpoint
│   │   └── tweets/
│   │       └── route.ts      # Save/load tweets endpoint
│   ├── components/
│   │   ├── TweetTransformer.tsx
│   │   ├── ContextSettings.tsx
│   │   ├── FilterOptions.tsx
│   │   ├── SavedTweets.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Textarea.tsx
│   ├── lib/
│   │   ├── ollama.ts         # Ollama API helper
│   │   └── prisma.ts         # Prisma client
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── prisma/
│   └── schema.prisma
└── package.json
```

---

## ⚠️ Important Notes

1. **Ollama must be running** before starting the app
2. **No environment variables** needed (local-only app)
3. **SQLite database** stored in `prisma/dev.db`
4. Each step builds on previous - never break existing functionality
5. Test after each baby step before moving forward

---

## 🎬 YouTube Chapter Markers (Suggested)

- 0:00 - Introduction & Project Overview
- X:XX - Step 1.1: Project Setup
- X:XX - Step 1.2: Building the UI
- X:XX - Step 1.3: Ollama Integration
- X:XX - Step 1.4: API Route
- X:XX - Step 1.5: Connecting Everything
- (continue for all chapters...)

---

## 🚀 Getting Started

```bash
# Make sure Ollama is running
ollama serve

# In another terminal, verify the model
curl http://localhost:11434/api/tags

# Start the Next.js app
npm run dev
```

Ready to start with Step 1.1! 🎉

