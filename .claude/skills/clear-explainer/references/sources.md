# Sources: checking links and picking the best videos

A study page that sends someone to a dead link, the wrong video, or a made-up URL costs them
more than no link at all. Treat links as facts. Check them, and say how sure you are.

## Verification tiers (show one on every resource)

| Tier | Label on the page | Meaning |
|---|---|---|
| `source` | official page found | You opened the official page, or a search returned the official domain (arxiv.org, github.com/owner, the author's site, research.google, pinecone.io…). |
| `third` | confirmed by third party | The exact title and URL (or YouTube ID) appear in third-party listings, transcripts or course pages, but not on the official site. |
| `search` | not confirmed · search link | You couldn't confirm the exact URL. Link to a search for the exact title instead (`https://www.youtube.com/results?search_query=...`). |

Rules:
- **Never invent a URL, YouTube ID or timestamp.** An ID you "remember" is still `search` until a result shows it.
- If two sources disagree on a URL, use the one with more support, tier it `third`, and say so in the reply.
- Scraper or mirror sites (pages that copy video titles with a different ID format) confirm only that a video exists. They never confirm its URL.
- Put the check date on the page (`checked` field) and in the reply.

## How to check

1. Try a direct fetch first (WebFetch, or curl on the YouTube oEmbed endpoint
   `https://www.youtube.com/oembed?url=<video url>&format=json`, which returns the title and channel).
2. If the network blocks direct fetches, use web search with the exact title plus the channel name.
   Send several searches in the same turn.
3. Record the tier for each link as you go. Don't rely on memory at the end.

## Picking the best videos ("suggest the best YouTube links")

When the user lists resources, keep theirs first. Then add at most two more per topic, in this order:

1. **The primary author:** the paper's author giving a talk, or the library's maintainer (Tri Dao for FlashAttention).
2. **A from-scratch builder:** someone who codes the idea live (Karpathy, Umar Jamil, StatQuest for statistics).
3. **A visual explainer:** someone who animates the intuition (3Blue1Brown, a well-known university course such as Stanford CS336 or MIT 6.S191).

For each pick, the card says:
- **Watch order:** intuition first (visual), then code (builder), then depth (paper or author talk).
- **What to focus on:** the one part that matters for this topic, in one sentence.
- **What to skip:** only when you know the video's structure from a source (chapter list, transcript). Never guess timestamps.

Prefer: recent enough to match current practice, clear audio, code you can run, a paper you can cite.
Avoid: reaction videos, content farms, and uploads that copy someone else's lecture.

## Accuracy gate (facts, code, numbers)

Before you publish a study page:
1. **Run the code.** Run every snippet on the page when the language runtime exists here. If a library can't be installed
   (for example, PyTorch with no package index access), run an equivalent check with what you have (NumPy) and say on the page that the snippet itself was not run.
2. **Recompute the numbers.** Toy numbers come from one function in the page. Recompute one example in a separate script and compare.
3. **Check non-obvious claims** against the paper or official docs. List any claim you couldn't check in the reply. Don't present it as fact.
4. **Flag disputed points.** If experts disagree (for example, causes of a financial crisis), say "debated" and give both views in one line each.
