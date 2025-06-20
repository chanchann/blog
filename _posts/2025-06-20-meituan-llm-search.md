---
layout: post
title: "Meituan - LLM search"
author: "chanchan"
categories: journal
tags: [business thinking]
image: mountains.jpg
toc: true
---

Large language models (LLMs) are advanced AI systems capable of understanding and generating human-like text, enabling sophisticated natural language processing (NLP) tasks. For Meituan, a leading Chinese super-app for lifestyle services, LLMs enhance AI search capabilities across its ecosystem, which includes food delivery, in-store services, ride-sharing, and more. Specific applications include:

1. **Conversational Search and User Interaction**:
   - LLMs power conversational interfaces, such as Meituan’s AI companion “Wow” (developed by the GN06 team post-Light Year acquisition), enabling users to search for restaurants, dishes, or services using natural language queries (e.g., “Find me a spicy noodle place nearby open after 10 PM”).
   - These models process complex, context-aware queries, interpreting user intent and preferences to deliver precise results, improving over traditional keyword-based search.

2. **Personalized Recommendations**:
   - LLMs enhance Meituan’s recommendation systems, like the Embedded Interactive Recommender System (EIRS), by analyzing user queries, reviews, and behavioral data to suggest highly relevant merchants or products. For example, LLMs can parse nuanced user preferences (e.g., “healthy vegan options”) and integrate them with location and historical data.
   - They enable dynamic, real-time adjustments to recommendations, increasing click-through and conversion rates, as seen with EIRS’s 132% improvement in A/B tests.

3. **Content Generation and Enrichment**:
   - LLMs generate enriched content for Meituan’s Dianping platform, such as summarized restaurant reviews or dish descriptions, making search results more informative and engaging.
   - They can create marketing content for merchants, like personalized promotions or social media posts, enhancing merchant-user interactions.

4. **Customer Support Automation**:
   - LLMs drive AI-powered chatbots for customer support, handling queries about orders, refunds, or delivery status. This reduces operational costs and improves response times.
   - They can interpret diverse user inputs, including slang or ambiguous queries, ensuring robust support across Meituan’s multilingual user base.

5. **Merchant Analytics and Insights**:
   - LLMs process unstructured data (e.g., customer reviews, feedback) to provide merchants with actionable insights, such as sentiment analysis or trending preferences, improving their offerings and search visibility.

---

### Significance of LLMs in Meituan’s AI Search

1. **Enhanced User Experience**:
   - LLMs enable intuitive, conversational search, making Meituan’s platform more accessible and user-friendly, especially for less tech-savvy users in lower-tier cities.
   - By integrating with Dianping’s review ecosystem, LLMs provide detailed, dish-level recommendations, addressing user demand for reliable and specific information.

2. **Operational Efficiency**:
   - Automated customer support and content generation reduce reliance on human agents, lowering costs in Meituan’s high-volume, low-margin businesses like food delivery.
   - LLMs streamline merchant analytics, enabling faster decision-making and operational adjustments.

3. **Competitive Differentiation**:
   - Meituan’s investment in LLMs (e.g., through Light Year and the GN06 team) positions it to compete with tech giants like Alibaba and ByteDance, who are also advancing AI-driven search.
   - Conversational search and personalized recommendations strengthen Meituan’s super-app model, offering a seamless experience across services that rivals fragmented Western platforms (e.g., DoorDash, Yelp).

---

### Limitations of LLMs in Meituan’s AI Search

1. **Data and Content Constraints**:
   - LLMs require vast, high-quality datasets for training and fine-tuning. Meituan’s merchant pool, while large, is smaller than that of broader e-commerce platforms like Alibaba, potentially limiting recommendation diversity and search result novelty.
   - User-generated content (e.g., reviews) may contain noise or bias, which can degrade LLM performance if not properly filtered.

2. **Computational Costs and Scalability**:
   - Training and deploying LLMs demand significant computational resources, increasing Meituan’s total cost of ownership (TCO). For instance, generative AI models require high-performance GPUs (e.g., NVIDIA A100), which are subject to U.S. export controls, posing supply chain risks.
   - Real-time inference for conversational search is resource-intensive, potentially causing latency issues under high user demand.

3. **Regulatory and Ethical Challenges**:
   - China’s stringent data privacy laws (e.g., Personal Information Protection Law) limit how Meituan can use consumer data for LLM training, requiring robust compliance measures.
   - Ethical concerns, such as biased outputs or over-reliance on algorithmic recommendations, could harm user trust, especially if LLMs inadvertently prioritize certain merchants due to commercial agreements.

4. **Market and Competitive Pressures**:
   - Meituan faces competition from Douyin and Alibaba, whose LLMs (e.g., ByteDance’s Doubao) are tailored for broader e-commerce and content ecosystems, potentially outpacing Meituan’s narrower focus on lifestyle services.
   - The food delivery market’s 14.5% YoY growth in Q4 2024 indicates saturation, limiting the impact of LLM-driven search improvements in this segment.

---

### Commercial Considerations for Future Development

1. **Revenue Growth and Diversification**:
   - LLMs can drive revenue by enhancing in-store services (e.g., “God membership” for brick-and-mortar merchants), which saw 23.88% commission growth in Q4 2024. Conversational search could boost user engagement in these high-margin areas.
   - New LLM-powered services, like subscription-based AI assistants or premium recommendation features, could create additional revenue streams, though their commercial success is unproven.
   - Meituan’s expansion into lower-tier cities and rural areas, supported by LLM-driven localization (e.g., dialect-aware search), aligns with China’s wealth diffusion trends, tapping into growing consumer bases.

2. **Cost Management**:
   - Optimizing LLM deployment (e.g., using Intel® AMX for efficient inference or converting models to BF16) is critical to reducing costs, as seen with Meituan’s 70% savings in vision AI services. Similar optimizations for LLMs could improve profitability.
   - Partnerships with cloud providers like Alibaba Cloud or hardware vendors (e.g., Intel, NVIDIA) mitigate infrastructure costs, but reliance on foreign tech remains a vulnerability under geopolitical restrictions.

3. **Global and Competitive Strategy**:
   - Meituan’s “all-in” AI strategy, including LLMs, supports its overseas ambitions, though cultural and regulatory barriers (e.g., GDPR in Europe) may limit LLM-driven search applications abroad.
   - Competing with Douyin’s short-video-driven commerce requires Meituan to leverage LLMs for innovative formats, such as AI-generated video ads or interactive search experiences.

---

### Technical Considerations for Future Development

1. **Model Optimization and Scalability**:
   - Meituan must address LLM scalability issues, similar to its TensorFlow challenges in vision AI, by adopting frameworks like PyTorch or custom solutions for distributed training. This is critical for handling billions of parameters in real-time search.
   - Techniques like model pruning, quantization, or knowledge distillation can reduce LLM inference costs, enabling deployment on edge devices (e.g., Meituan’s delivery robots).

2. **Data Ecosystem and Privacy**:
   - Meituan’s vast consumer data is a strength, but LLMs require continuous fine-tuning with high-quality, domain-specific data (e.g., food and service reviews). Investments in data cleaning and augmentation are essential.
   - Privacy-preserving techniques, such as federated learning or differential privacy, can address regulatory concerns while maintaining LLM performance.

3. **Hardware and Compute Access**:
   - U.S. export controls on GPUs (e.g., NVIDIA A100, H100) push Meituan to explore domestic alternatives like Huawei’s Ascend 910B. However, these lag in performance and ecosystem support, requiring significant R&D to bridge the gap.
   - Collaboration with Intel for optimized inference (e.g., AMX on Xeon processors) supports cost-effective LLM deployment, but Meituan must diversify hardware partnerships to mitigate risks.

4. **Innovation and Talent**:
   - Meituan’s AI team, bolstered by acquisitions like Light Year and leadership from Wang Huiwen, drives LLM innovation. However, competition for AI talent in China is fierce, with U.S. firms attracting global expertise.
   - Open-source contributions and academic partnerships can accelerate LLM development, but China’s closed-loop AI ecosystem may limit collaboration compared to global counterparts.

---

### Future Development Outlook

1. **Commercial Outlook**:
   - LLMs will play a pivotal role in Meituan’s shift from food delivery to a broader lifestyle services platform, particularly in in-store services and quick commerce (e.g., Shangou). Conversational search and AI assistants could drive user retention and higher-margin revenue.
   - Meituan may explore LLM-based monetization models, such as premium AI features or merchant-focused analytics subscriptions, to offset market saturation in core segments.
   - Global expansion will depend on adapting LLMs to diverse linguistic and cultural contexts, a challenge given Meituan’s China-centric focus.

2. **Technical Outlook**:
   - Advances in model compression and efficient inference will enable Meituan to deploy LLMs at scale, supporting real-time conversational search across millions of users.
   - Integration with multimodal AI (e.g., combining LLMs with vision AI for image-based search) will enhance Meituan’s offerings, such as visual menu exploration or AR-based restaurant previews.
   - Meituan must invest in domestic AI hardware and software ecosystems to reduce reliance on foreign tech, ensuring resilience against geopolitical disruptions.

---

### Conclusion

LLMs empower Meituan’s AI search by enabling conversational interfaces, personalized recommendations, content generation, and automated customer support, driving user engagement and operational efficiency. However, limitations like data constraints, high computational costs, regulatory risks, and competition pose challenges. Commercially, LLMs support revenue diversification and market expansion, while technically, Meituan must optimize models, secure compute resources, and innovate within China’s AI ecosystem. Future success depends on balancing cost, scalability, and ethical considerations while leveraging LLMs to differentiate in a competitive landscape. 