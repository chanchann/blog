---
layout: post
title: "Meituan - AI search"
author: "chanchan"
categories: journal
tags: [business thinking]
image: mountains.jpg
toc: true
---

Meituan, a leading Chinese e-commerce platform for lifestyle services, leverages AI search technologies to enhance its super-app ecosystem, which spans food delivery, ride-sharing, travel booking, merchant analytics, and more. AI search applications at Meituan primarily focus on improving user experience, operational efficiency, and business scalability. Specific applications include:

1. **Personalized Recommendations**:
   - Meituan employs AI-driven recommendation systems, such as the Embedded Interactive Recommender System (EIRS), to dynamically infer user intentions based on click behaviors and deliver tailored suggestions on its app homepage. For instance, the “Guess You Like” section uses AI to recommend merchants or dishes based on user preferences, enhancing novelty and variety.[](https://dl.acm.org/doi/10.1145/3539618.3591830)[](https://www.researchgate.net/publication/381445609_AI-based_Transformation_and_Reflections_on_the_Big_Data_Push_Mechanism_of_Traditional_Food_Delivery_Industry_-_Taking_Meituan_as_an_Example)
   - These systems analyze vast amounts of data (e.g., user behavior, location, and merchant data) to provide real-time, context-aware recommendations, improving user engagement and conversion rates.

2. **Merchant and Consumer Interaction Optimization**:
   - AI search facilitates precise matching between users and merchants, particularly in food delivery and in-store services. It optimizes merchant-food interaction by recommending items based on user preferences and historical data, boosting order volumes.[](https://www.researchgate.net/publication/381445609_AI-based_Transformation_and_Reflections_on_the_Big_Data_Push_Mechanism_of_Traditional_Food_Delivery_Industry_-_Taking_Meituan_as_an_Example)
   - For merchants, AI-driven analytics provide insights into customer behavior, enabling targeted marketing and operational improvements.

3. **Logistics and Delivery Optimization**:
   - AI search enhances Meituan’s logistics network by optimizing delivery routes and schedules. The “Super Brain” AI system integrates data on time, location, weather, and traffic to improve last-mile delivery efficiency, reducing costs and delivery times.[](https://news.cgtn.com/news/2020-10-17/Meituan-s-AI-shop-takes-the-retail-experience-to-the-next-level-UEJeijjNh6/index.html)
   - Autonomous delivery vehicles (AGVs) and unmanned distribution robots rely on AI search for navigation and decision-making, further streamlining operations.[](https://en.wikipedia.org/wiki/Meituan)[](https://news.cgtn.com/news/2020-10-17/Meituan-s-AI-shop-takes-the-retail-experience-to-the-next-level-UEJeijjNh6/index.html)

4. **Generative AI and Emerging Applications**:
   - Meituan is investing in generative AI, as seen with its acquisition of Light Year and the development of the AI companion “Wow” under the GN06 team. These efforts aim to explore innovative AI-driven services, such as conversational search or AI-assisted customer support.[](https://www.reuters.com/markets/deals/chinas-meituan-buy-ai-firm-light-year-co-founder-2023-06-29/)[](https://www.scmp.com/tech/big-tech/article/3285620/meituan-co-founder-wang-huiwen-returns-lead-ai-push-after-hiatus-report-says)
   - Vision AI, powered by technologies like Intel® Xeon® Scalable processors, supports applications such as site selection, marketing personalization, and image-based search for menus or products.[](https://www.intel.com/content/www/us/en/customer-spotlight/stories/meituan-vision-ai-customer-story.html)[](https://aiexpert.network/case-study-meituans-journey-in-elevating-ai-performance-and-scalability/)

---

### Significance of Meituan’s AI Search Applications

1. **Enhanced User Experience**:
   - AI search enables Meituan to deliver highly personalized and real-time recommendations, improving customer satisfaction and retention. For example, EIRS increased click-through and conversion rates by 132% in A/B tests, directly impacting gross merchandise volume (GMV).[](https://dl.acm.org/doi/10.1145/3539618.3591830)
   - By integrating reviews from its Dianping platform, Meituan offers detailed, dish-level insights, addressing the demand for reliable reviews that competitors like DoorDash face challenges with due to conflicts of interest.[](https://www.deciphr.ai/podcast/meituan)

2. **Operational Efficiency**:
   - AI search optimizes Meituan’s logistics and delivery operations, reducing costs by up to 70% through dynamic scaling and model optimization (e.g., converting FP32 to BF16 for vision AI). This is critical for maintaining profitability in a high-volume, low-margin industry like food delivery.[](https://www.intel.com/content/www/us/en/customer-spotlight/stories/meituan-vision-ai-customer-story.html)
   - The use of AI in community group buying (e.g., Meituan Select) and quick commerce (e.g., Shangou) expands market reach into lower-tier cities, tapping into growing consumer bases.[](https://kr-asia.com/meituans-next-act-ai-bets-global-reach-and-a-retooled-business-model)[](https://en.wikipedia.org/wiki/Meituan)

3. **Competitive Advantage**:
   - Meituan’s AI-driven super-app model, combining services like food delivery, ride-sharing, and travel booking, positions it as a leader in China’s online-to-offline (O2O) economy. This integrated approach contrasts with fragmented Western services (e.g., Uber, DoorDash, Yelp), giving Meituan a unique edge.[](https://www.deciphr.ai/podcast/meituan)
   - Investments in generative AI and vision AI signal Meituan’s ambition to stay ahead in the global AI race, especially as it competes with rivals like Alibaba, Tencent, and Douyin.[](https://www.nbr.org/publication/chinas-generative-ai-ecosystem-in-2024-rising-investment-and-expectations/)[](https://www.reuters.com/markets/deals/chinas-meituan-buy-ai-firm-light-year-co-founder-2023-06-29/)

4. **Economic and Social Impact**:
   - Meituan’s AI initiatives contribute to China’s broader goal of becoming a global AI leader by 2030, supported by its vast consumer data and collaboration with tech giants like Intel and NVIDIA.[](https://emerj.com/ai-in-china-recent-history-strengths-and-weaknesses-of-the-ecosystem/)[](https://medium.com/nvidia-merlin/optimizing-meituans-machine-learning-platform-an-interview-with-jun-huang-7e046143131f)
   - By modernizing retail and logistics, Meituan drives economic growth in lower-tier cities and rural areas, aligning with China’s wealth diffusion trends.[](https://www.deciphr.ai/podcast/meituan)

---

### Limitations of Meituan’s AI Search Applications

1. **Data and Content Constraints**:
   - Meituan’s recommendation system is limited by a smaller pool of candidate merchants compared to larger e-commerce platforms like Alibaba. This can lead to repetitive recommendations, reducing user novelty and engagement.[](https://www.researchgate.net/publication/381445609_AI-based_Transformation_and_Reflections_on_the_Big_Data_Push_Mechanism_of_Traditional_Food_Delivery_Industry_-_Taking_Meituan_as_an_Example)
   - The reliance on user data raises privacy concerns, especially as China’s regulatory environment tightens around data security and consumer rights.[](https://merics.org/en/report/lofty-principles-conflicting-incentives-ai-ethics-and-governance-china)

2. **Scalability and Cost Challenges**:
   - The increasing complexity of AI models creates performance bottlenecks, as seen with TensorFlow’s memory resource wastage and scalability issues. These require significant infrastructure investments, raising total cost of ownership (TCO).[](https://aiexpert.network/case-study-meituans-journey-in-elevating-ai-performance-and-scalability/)
   - While Meituan has optimized costs through partnerships (e.g., Intel’s AMX for vision AI), the high computational demands of generative AI and large-scale models remain a challenge, especially under U.S. export controls on advanced GPUs.[](https://www.nbr.org/publication/chinas-generative-ai-ecosystem-in-2024-rising-investment-and-expectations/)

3. **Regulatory and Ethical Risks**:
   - Meituan’s algorithms have faced scrutiny for monopolistic practices, such as exclusive cooperation agreements with merchants, leading to a $530 million antitrust fine in 2021.[](https://www.asianometry.com/p/meituan-explained)[](https://carnegieendowment.org/posts/2022/11/how-food-delivery-workers-shaped-chinese-algorithm-regulations?lang=en)
   - Ethical concerns, including algorithm-driven labor exploitation (e.g., unrealistic delivery time windows forcing drivers to speed), highlight gaps between AI ethics principles and practical implementation in China.[](https://merics.org/en/report/lofty-principles-conflicting-incentives-ai-ethics-and-governance-china)[](https://carnegieendowment.org/posts/2022/11/how-food-delivery-workers-shaped-chinese-algorithm-regulations?lang=en)

4. **Market Saturation and Competition**:
   - The food delivery market, Meituan’s core segment, has plateaued, with only 14.5% YoY growth in Q4 2024, indicating limited room for expansion. Resources are shifting to in-store services, which face fierce competition from Douyin and others.[](https://kr-asia.com/meituans-next-act-ai-bets-global-reach-and-a-retooled-business-model)
   - Emerging AI applications like Shenqiangshou have underperformed, suggesting challenges in scaling new initiatives.[](https://kr-asia.com/meituans-next-act-ai-bets-global-reach-and-a-retooled-business-model)

---

### Commercial Considerations

1. **Revenue Diversification**:
   - Meituan’s AI search investments aim to diversify revenue beyond food delivery, which is nearing saturation. By integrating in-store services (e.g., “God membership” for brick-and-mortar merchants) and quick commerce (e.g., Shangou), Meituan boosts commission income (up 23.88% in Q4 2024) and taps into new markets like lower-tier cities.[](https://kr-asia.com/meituans-next-act-ai-bets-global-reach-and-a-retooled-business-model)[](https://en.wikipedia.org/wiki/Meituan)
   - Generative AI ventures, such as the AI companion “Wow,” could open new revenue streams through subscription models or premium services, though their commercial viability remains unproven.[](https://www.scmp.com/tech/big-tech/article/3285620/meituan-co-founder-wang-huiwen-returns-lead-ai-push-after-hiatus-report-says)

2. **Cost Efficiency and Scalability**:
   - AI-driven cost reductions (e.g., 70% savings in vision AI services) are critical for maintaining profitability in a competitive market. Meituan’s partnerships with Intel and NVIDIA optimize hardware costs, but long-term reliance on foreign technology poses risks under geopolitical constraints.[](https://www.intel.com/content/www/us/en/customer-spotlight/stories/meituan-vision-ai-customer-story.html)[](https://medium.com/nvidia-merlin/optimizing-meituans-machine-learning-platform-an-interview-with-jun-huang-7e046143131f)
   - Community group buying and bulk purchasing models (e.g., Meituan Select) leverage AI to reduce costs through economies of scale, positioning Meituan ahead of competitors like Pinduoduo.[](https://en.wikipedia.org/wiki/Meituan)

3. **Market Expansion and Global Ambitions**:
   - Meituan’s AI push supports its expansion into lower-tier cities and rural areas, capitalizing on China’s growing middle class and smartphone penetration.[](https://www.deciphr.ai/podcast/meituan)
   - The company’s “all-in” AI strategy and overseas push (e.g., exploring global markets) aim to counter domestic saturation, though regulatory and cultural barriers may limit success abroad.[](https://kr-asia.com/meituans-next-act-ai-bets-global-reach-and-a-retooled-business-model)

4. **Competitive Positioning**:
   - Meituan’s dominance in food delivery (70% market share) relies on AI to maintain its edge against rivals like Ele.me and Douyin. However, the shift to in-store services requires competing on advertising revenue, where growth (17.74% in Q4 2024) lags behind commissions.[](https://kr-asia.com/meituans-next-act-ai-bets-global-reach-and-a-retooled-business-model)
   - Investments in generative AI startups (e.g., Light Year) and collaborations with hyperscalers like Alibaba Cloud position Meituan to compete in China’s AI ecosystem, though it trails pure AI players like Baichuan AI.[](https://www.nbr.org/publication/chinas-generative-ai-ecosystem-in-2024-rising-investment-and-expectations/)[](https://www.reuters.com/markets/deals/chinas-meituan-buy-ai-firm-light-year-co-founder-2023-06-29/)

---

### Technical Considerations

1. **Infrastructure Optimization**:
   - Meituan’s AI search relies on advanced hardware, such as Intel® Xeon® Scalable processors and NVIDIA A100 GPUs, to handle large-scale recommendation and vision AI tasks. These improve inference performance by 3.38–4.13x for vision models and support distributed training with billions of parameters.[](https://www.intel.com/content/www/us/en/customer-spotlight/stories/meituan-vision-ai-customer-story.html)[](https://medium.com/nvidia-merlin/optimizing-meituans-machine-learning-platform-an-interview-with-jun-huang-7e046143131f)
   - The dual augmented twin-tower model enhances recommendation accuracy by mitigating information interaction gaps, but its complexity demands robust infrastructure.[](https://www.researchgate.net/publication/381445609_AI-based_Transformation_and_Reflections_on_the_Big_Data_Push_Mechanism_of_Traditional_Food_Delivery_Industry_-_Taking_Meituan_as_an_Example)

2. **Algorithmic Innovation**:
   - Meituan’s use of TensorFlow for model training and distributed computing is versatile but faces scalability issues, prompting re-architecture efforts with Intel’s support.[](https://aiexpert.network/case-study-meituans-journey-in-elevating-ai-performance-and-scalability/)
   - The EIRS system dynamically adjusts recommendations based on real-time user behavior, but its effectiveness is constrained by the limited merchant pool, requiring continuous algorithmic refinement.[](https://dl.acm.org/doi/10.1145/3539618.3591830)

3. **Data and Compute Challenges**:
   - Meituan benefits from China’s vast consumer data, a key strength for AI training. However, U.S. export controls on GPUs (e.g., NVIDIA A100) limit access to cutting-edge compute, pushing Meituan to explore alternatives like Huawei’s Ascend 910B, which lag in hardware-software synergy.[](https://www.nbr.org/publication/chinas-generative-ai-ecosystem-in-2024-rising-investment-and-expectations/)[](https://datainnovation.org/2019/08/who-is-winning-the-ai-race-china-the-eu-or-the-united-states/)
   - Privacy regulations and public scrutiny require Meituan to balance data utilization with ethical considerations, complicating AI deployment.[](https://merics.org/en/report/lofty-principles-conflicting-incentives-ai-ethics-and-governance-china)

4. **AI Talent and Ecosystem**:
   - Meituan’s robust AI team, bolstered by acquisitions like Light Year and leadership from figures like Wang Huiwen, drives innovation. However, China’s AI talent pool, while growing, faces competition from U.S. firms attracting global expertise.[](https://datainnovation.org/2019/08/who-is-winning-the-ai-race-china-the-eu-or-the-united-states/)[](https://www.scmp.com/tech/big-tech/article/3285620/meituan-co-founder-wang-huiwen-returns-lead-ai-push-after-hiatus-report-says)
   - Collaboration with academia and industry (e.g., Intel, NVIDIA) accelerates development, but Meituan must navigate China’s closed-loop AI ecosystem, which may limit open-source contributions.[](https://emerj.com/ai-in-china-recent-history-strengths-and-weaknesses-of-the-ecosystem/)[](https://www.chinatalk.media/p/where-does-china-stand-in-the-ai)

---

### Conclusion

Meituan’s AI search applications enhance its super-app ecosystem by delivering personalized recommendations, optimizing logistics, and exploring generative AI opportunities. These efforts strengthen user engagement, operational efficiency, and market expansion, positioning Meituan as a leader in China’s O2O economy. However, limitations such as data constraints, scalability issues, regulatory risks, and market saturation pose challenges. Commercially, Meituan focuses on revenue diversification and cost efficiency, while technically, it invests in infrastructure, algorithms, and talent to stay competitive. Despite these strengths, Meituan must address ethical concerns, navigate geopolitical tech restrictions, and innovate continuously to maintain its edge in a rapidly evolving AI landscape.

