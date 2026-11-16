/* Catalog for the LLM Fundamentals hub. Links checked by web search on 2026-11-16.
   tier: "source" = official site or repo appeared in search results;
         "third"  = title and URL confirmed only through third-party listings;
         "search" = exact URL not confirmed, so the link is a search. */
(function () {
  const yt = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  CE.setCatalog({
    storeKey: "llm-fundamentals",
    title: "LLM Fundamentals",
    short: "LLM Fundamentals",
    lede: "Your 10-topic research list in four phases. Open a built topic to study it, then come back here to see what is done and which flashcards are due.",
    footer: "Links checked by web search on 16 Nov 2026. Direct page checks were blocked in this environment, so “official page found” means the official site appeared in search results. Progress stays in this browser only.",
    mapHtml: `<span class="eyebrow">How the topics feed each other</span>
<figure><div class="scroll wide"><svg class="diagram" viewBox="0 0 900 250" role="img" aria-label="Phase 1 training feeds the transformer core; the core feeds fine-tuning and inference systems.">
<defs><marker id="hub-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>
<g font-size="12">
<text class="s-muted t-mono" x="20" y="22" font-size="11">PHASE 1 · LEARN</text>
<rect class="s-box" x="20" y="34" width="170" height="40" rx="8"/><text class="s-fg" x="105" y="59" text-anchor="middle">1 · Backpropagation</text>
<rect class="s-box" x="20" y="90" width="170" height="40" rx="8"/><text class="s-fg" x="105" y="115" text-anchor="middle">2 · AdamW</text>
<text class="s-muted t-mono" x="250" y="22" font-size="11">PHASE 2 · CORE</text>
<rect class="s-box" x="250" y="34" width="170" height="40" rx="8"/><text class="s-fg" x="335" y="59" text-anchor="middle">4 · BPE tokenizer</text>
<rect class="s-hi" x="250" y="90" width="170" height="40" rx="8"/><text class="s-fg" x="335" y="115" text-anchor="middle" font-weight="600">3 · Self-attention</text>
<text class="s-muted t-mono" x="480" y="22" font-size="11">PHASE 3 · ADAPT &amp; ALIGN</text>
<rect class="s-box" x="480" y="34" width="170" height="40" rx="8"/><text class="s-fg" x="565" y="59" text-anchor="middle">5 · LoRA</text>
<rect class="s-box" x="480" y="90" width="170" height="40" rx="8"/><text class="s-fg" x="565" y="115" text-anchor="middle">6 · PPO (RLHF)</text>
<rect class="s-box" x="480" y="146" width="170" height="40" rx="8"/><text class="s-fg" x="565" y="171" text-anchor="middle">7 · DPO</text>
<text class="s-muted t-mono" x="710" y="22" font-size="11">PHASE 4 · SERVE</text>
<rect class="s-box" x="710" y="34" width="170" height="40" rx="8"/><text class="s-fg" x="795" y="59" text-anchor="middle">8 · FlashAttention</text>
<rect class="s-box" x="710" y="90" width="170" height="40" rx="8"/><text class="s-fg" x="795" y="115" text-anchor="middle">9 · Speculative decoding</text>
<rect class="s-hi" x="710" y="146" width="170" height="40" rx="8"/><text class="s-fg" x="795" y="171" text-anchor="middle" font-weight="600">10 · HNSW</text>
</g>
<g fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#hub-ar)">
<path d="M190 54 C 220 54, 220 104, 248 104"/><path d="M190 110 L 248 110"/>
<path d="M335 74 L 335 88"/>
<path d="M420 104 C 450 104, 450 54, 478 54"/><path d="M420 110 L 478 110"/>
<path d="M565 130 L 565 144"/>
<path d="M420 116 C 600 116, 640 40, 708 54"/>
<path d="M420 122 C 560 230, 640 120, 708 110"/>
</g>
<g font-size="11" class="s-muted">
<text x="196" y="44">gradients</text><text x="196" y="128">updates</text>
<text x="341" y="85">token ids</text>
<text x="428" y="64">adapts W_Q, W_V</text>
<text x="571" y="141">drops reward model</text>
<text x="600" y="76">same math, faster</text>
<text x="560" y="218">small + big model</text>
<text x="716" y="210">retrieval for RAG: works on embeddings, not inside the model</text>
</g></svg></div>
<figcaption>Arrows show what one topic gives the next. Highlighted topics have full study pages.</figcaption></figure>`,
    phases: [
      { name: "Phase 1 · How models learn", topics: [
        { num: 1, id: "backprop", title: "Backpropagation", blurb: "The chain rule, applied backward through a computation graph, gives the gradient of the loss for every weight.", resources: [
          { title: "Karpathy · building micrograd", url: "https://www.youtube.com/watch?v=VMj-3S1tku0", tier: "third" },
          { title: "3Blue1Brown · Backpropagation calculus (Ch 4)", url: "https://www.3blue1brown.com/lessons/backpropagation-calculus", tier: "source" },
          { title: "Zero to Hero repo", url: "https://github.com/karpathy/nn-zero-to-hero", tier: "source" } ] },
        { num: 2, id: "adamw", title: "AdamW", blurb: "Adam with weight decay applied to the weights directly, not added to the gradient.", resources: [
          { title: "Karpathy · Let's reproduce GPT-2 (124M)", url: "https://www.youtube.com/watch?v=l8pRSuU81PU", tier: "third" },
          { title: "Paper · Loshchilov & Hutter", url: "https://arxiv.org/abs/1711.05101", tier: "source" } ] } ] },
      { name: "Phase 2 · Transformer core", topics: [
        { num: 3, id: "self-attention", title: "Self-Attention", blurb: "Each token compares its query with every key and takes a weighted mix of the values.", resources: [
          { title: "3Blue1Brown · Attention (Ch 6)", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc", tier: "third" },
          { title: "Karpathy · Let's build GPT", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", tier: "third" } ] },
        { num: 4, id: "bpe", title: "BPE Tokenization", blurb: "Repeatedly merge the most frequent pair of bytes into a new vocabulary entry.", resources: [
          { title: "Karpathy · Let's build the GPT Tokenizer", url: "https://www.youtube.com/watch?v=zduSFxRajkE", tier: "third" },
          { title: "karpathy/minbpe", url: "https://github.com/karpathy/minbpe", tier: "source" } ] } ] },
      { name: "Phase 3 · Fine-tuning & alignment", topics: [
        { num: 5, id: "lora", title: "LoRA", blurb: "Freeze the base weights and train two small matrices whose product is the update.", resources: [
          { title: "Umar Jamil · LoRA explained + PyTorch", url: "https://www.youtube.com/watch?v=PXWYUTMt-AU", tier: "third" },
          { title: "Paper · Hu et al. 2021", url: "https://arxiv.org/abs/2106.09685", tier: "source" } ] },
        { num: 6, id: "ppo", title: "PPO (RLHF)", blurb: "Train against a reward model with updates clipped so the policy can't move too far per step.", resources: [
          { title: "Umar Jamil · RLHF explained with math + PyTorch", url: yt("Umar Jamil Reinforcement Learning from Human Feedback explained with math derivations and the PyTorch code"), tier: "search" },
          { title: "Paper · Schulman et al. 2017 (PPO)", url: "https://arxiv.org/abs/1707.06347", tier: "source" } ] },
        { num: 7, id: "dpo", title: "DPO", blurb: "Skip the reward model: train directly on preferred-vs-rejected pairs.", resources: [
          { title: "Umar Jamil · DPO explained (Bradley-Terry, math)", url: yt("Umar Jamil Direct Preference Optimization DPO explained Bradley-Terry model"), tier: "search" },
          { title: "Paper · Rafailov et al. 2023", url: "https://arxiv.org/abs/2305.18290", tier: "third" } ] } ] },
      { name: "Phase 4 · Inference & systems", topics: [
        { num: 8, id: "flashattention", title: "FlashAttention", blurb: "Compute exact attention in tiles held in fast on-chip SRAM, so the full T × T matrix never goes to slow GPU memory.", resources: [
          { title: "Tri Dao · Stanford MLSys #67", url: yt("FlashAttention Tri Dao Stanford MLSys #67"), tier: "search" },
          { title: "Umar Jamil · Flash Attention in Triton", url: "https://www.youtube.com/watch?v=zy8ChVd_oTM", tier: "third" },
          { title: "Paper · Dao et al. 2022", url: "https://arxiv.org/abs/2205.14135", tier: "source" } ] },
        { num: 9, id: "speculative", title: "Speculative Decoding", blurb: "A small draft model guesses several tokens; the big model checks them all in one pass, with the same output distribution.", resources: [
          { title: "Google Research · Looking back at speculative decoding", url: "https://research.google/blog/looking-back-at-speculative-decoding/", tier: "source" },
          { title: "Paper · Leviathan et al. 2023", url: "https://arxiv.org/abs/2211.17192", tier: "source" } ] },
        { num: 10, id: "hnsw", title: "HNSW", blurb: "A layered graph: search greedily from a sparse top layer down to the dense bottom layer to find near neighbors fast.", resources: [
          { title: "Pinecone · HNSW guide (with Faiss)", url: "https://www.pinecone.io/learn/series/faiss/hnsw/", tier: "source" },
          { title: "Paper · Malkov & Yashunin", url: "https://arxiv.org/abs/1603.09320", tier: "source" } ] } ] }
    ]
  });
})();
