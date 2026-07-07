# Future / Out of Scope

Ideas deliberately deferred. Not committed work.

## Cut from initial plan (pull back if ahead of pace)

- Evaluation harness (retrieval recall / MRR) — biggest resume differentiator, restore first
- Hybrid retrieval (paragraph-reference override)
- Persisted chat history (reload past conversations)

## Deferred design notes

- Question→chunks link: to support answer-caching (match new question to a past one,
  reuse the chunks that answered it), the Questions table will eventually need to store
  which chunks were used. Out of scope until Phase 6.

  ## for later exploration

Phase 4: refactor inline /authcheck logic into reusable auth middleware (next-based gate)

## End of project deployment

- replace all supabase edge functions with prod url and key and deploy to supabase cloud
- replace websocket access token param with a header/cookie
