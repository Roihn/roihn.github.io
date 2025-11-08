---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Hi This is Run Peng 彭润. You can call me Run or Roihn. I am a second-year Ph.D. candidate in Computer Science and Engineering, advised by professor [Joyce Chai](https://web.eecs.umich.edu/~chaijy/). My primary research focus is to bridge the gap between humans and AI agents. 

Agents need to be able to perceive, to reason, and to interact with the world and humans. I'm thrilled to explore agent behaviors, human behaviors, and human-AI interaction when humans are cosituated with the agents. From cognitive perspective, as we figure out the commonalities and distinctions between human and agent behaviors, I believe we can unlock new insights into the nature of understanding itself, ultimately guiding us toward the development of more general AI agents.


# 🔥 News
- *2025.09*: &nbsp;😊 I will be the student poster chair for this year's [Michigan AI Symposium](https://ai.engin.umich.edu/events/2025-ai-symposium/). Please consider to [register](https://umich-ssc.jotform.com/251556695236971) and bring your [poster](https://forms.gle/ZKa6DCGHgjGbFRyd8) there!
- *2025.07*: &nbsp;🎉 Two papers are accepted at CoLM 2025! Papers have been released!
- *2025.06*: &nbsp;🎉 I successfully passed the qualification exam and became a Ph.D. candidate!
- *2024.12*: &nbsp;❓ My photo occasionally appeared in [CSE 2024 Annual Report](https://cse-report.engin.umich.edu/?utm_source=alumni+enews&utm_medium=email&utm_campaign=annual_report) of Umich. (?)
- *2024.10*: &nbsp;🎉 One paper accepted at EMNLP 2024 findings! See you at Miami!
- *2024.09*: &nbsp;🎉 I will continue working with Professor [Joyce Chai](https://web.eecs.umich.edu/~chaijy/) at [SLED](https://sled.eecs.umich.edu/) lab as a Ph.D. student!

# 📝 Publications 

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">ICML 2025 MAS Workshop</div><img src='images/einstein.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Communication and Verification in LLM Agents towards Collaboration under Information Asymmetry](https://arxiv.org/abs/2510.25595)

**Run Peng**\*, Ziqiao Ma\*, Amy Pang, Sikai Li, Zhang Xi-Jia, Yingzhuo Yu, Cristian-Paul Bara, Joyce Chai

\[[**Paper**](https://arxiv.org/abs/2510.25595)\] \[[**Code**](https://github.com/Roihn/EinsteinPuzzles/)\] \[[**Dataset**](https://huggingface.co/datasets/Roihn/Einstein-Puzzles-Data)\] \[[**Checkpoint**](https://huggingface.co/Roihn/Einstein-Puzzles-Model)\]
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">Preprint</div><img src='images/boundary.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[LLM-Based Social Simulations Require a Boundary](https://arxiv.org/pdf/2506.19806)

Zengqing Wu, **Run Peng**, Takayuki Ito, Chuan Xiao

\[[**Paper**](https://arxiv.org/pdf/2506.19806)\]
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">CoLM 2025</div><img src='images/basis.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Bootstrapping Visual Assistant Development with Situated Interaction Simulation](https://openreview.net/pdf?id=S4nTXotasR)

Yichi Zhang, **Run Peng**, Lingyun Wu, Yinpei Dai, Xuweiyi Chen, Qiaozi Gao, Joyce Chai1

\[[**Paper**](https://openreview.net/pdf?id=S4nTXotasR)\] \[[**Demo**](https://colm-basis.github.io/)\] 
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">CoLM 2025</div><img src='images/pragmatics.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Vision-Language Models Are Not Pragmatically Competent in Referring Expression Generation](https://arxiv.org/abs/2504.16060)

Ziqiao Ma, Jing Ding, Xuejun Zhang, Dezhi Luo, Jiahe Ding, Sihan Xu, Yuchen Huang, **Run Peng**, Joyce Chai

\[[**Project**](https://vlm-reg.github.io/)\] \[[**Paper**](https://arxiv.org/abs/2504.16060)\] \[[**Code**](https://github.com/Mars-tin/pixrefer)\] \[[**RefOI Dataset**](https://huggingface.co/datasets/Seed42Lab/RefOI)\] \[[**RefOI-TLHF Dataset**](https://huggingface.co/datasets/Seed42Lab/RefOI-TLHF)\]
</div>
</div>


<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">EMNLP 2023 Findings</div><img src='images/tom.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Towards A Holistic Landscape of Situated Theory of Mind in Large Language Models](https://aclanthology.org/2023.findings-emnlp.72/)

Ziqiao Ma, Jacob Sansom, **Run Peng**, Joyce Chai

\[[**Paper**](https://aclanthology.org/2023.findings-emnlp.72/)\] \[[**Dataset**](https://huggingface.co/datasets/sled-umich/2D-ATOMS)\] \[[**Survey**](https://github.com/Mars-tin/awesome-theory-of-mind)\]
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">ICRA 2024</div><img src='images/icra.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Think, Act, and Ask: Open-World Interactive Personalized Robot Navigation](https://arxiv.org/pdf/2310.07968)

Yinpei Dai, **Run Peng**, Sikai Li, Joyce Chai

\[[**Paper**](https://arxiv.org/pdf/2310.07968)\] \[[**Code**](https://github.com/sled-group/navchat)\] \[[**Video**](https://www.youtube.com/watch?v=rN5S8QIhhQc&ab_channel=UMichSLEDLab)\] 
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">ICML 2023</div><img src='images/gobi.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Go Beyond Imagination: Maximizing Episodic Reachability with World Models](https://dl.acm.org/doi/abs/10.5555/3618408.3618827)

Yao Fu, **Run Peng**, Honglak Lee

\[[**Paper**](https://dl.acm.org/doi/abs/10.5555/3618408.3618827)\] \[[**Code**](https://github.com/wowchemy/wowchemy-hugo-themes)\]
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">EMNLP 2024 Findings</div><img src='images/shall_we_team_up.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Shall We Team Up: Exploring Spontaneous Cooperation of Competing LLM Agents](https://aclanthology.org/2024.findings-emnlp.297/)

Zengqing Wu\*, **Run Peng**\*, Shuyuan Zheng, Qianying Liu, Xu Han, Brian I. Kwon, Makoto Onizuka, Shaojie Tang, Chuan Xiao

\[[**Project**](https://shallweteamup.github.io/)\] \[[**Paper**](https://aclanthology.org/2024.findings-emnlp.297/)\] \[[**Code**](https://github.com/wuzengqing001225/SABM_ShallWeTeamUp)\] 
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div class="image-wrapper"><div class="badge">Preprint</div><img src='images/sabm.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">
[Smart Agent-Based Modeling: On the Use of Large Language Models in Computer Simulations](https://arxiv.org/abs/2311.06330)

Zengqing Wu, **Run Peng**, Xu Han, Shuyuan Zheng, Yixin Zhang, Chuan Xiao

\[[**Paper**](https://arxiv.org/abs/2311.06330)\] \[[**Code**](https://github.com/Roihn/SABM)\] 
</div>
</div>

[Learning Exploration Policies with View-based Intrinsic Rewards](https://openreview.net/forum?id=C2_6qBhe5fH), Yijie Guo\*, Yao Fu\*, **Run Peng**, Honglak Lee, **In *NeurIPS* 2022 DRL Workshop**


# 📖 Educations
- *Now*, Ph.D. in Computer Science & Engineering, University of Michigan
- *2024*, MSE in Computer Science & Engineering, University of Michigan
- *2022*, BSE in Computer Science & Engineering, University of Michigan

# 💻 Internships & Research Experience
- *2023.09 - 2023.12*, LG AI Research, Ann Arbor. Mentored by [Lajanugen Logeswaran](https://lajanugen.github.io/) and [Sungryull Sohn](https://sites.google.com/view/sungryull).
- *2021.10 - 2023.08*, Lee Lab, University of Michigan. Advised by professor [Honglak Lee](https://web.eecs.umich.edu/~honglak/), mentored by [Yijie Guo](https://www.guoyijie.me/) and Violet Yao Fu.
- *2022.12 - Now*, SLED Lab, University of Michigan.

# 👔 Service
- **Paper Review:**
  - Conference: (AI) NeurIPS, ICLR, ICML, AISTATS (NLP) ARR, EMNLP, NAACL, COLM, (HCI) HRI, CHI
  - Journal: Journal of Simulation

- **Social Activity:**
  - Poster Student Co-Chair, Michigan AI symposium 2025
  - Explore Grad Studies Volunteer, University of Michigan

<div style="display: flex;  align-items: flex-start;">
    <div style="width: 300px; height: 150px;">
        <script type="text/javascript" id="clustrmaps" src="//cdn.clustrmaps.com/map_v2.js?cl=4c4a4a&w=480&t=n&d=S6mUm81Mbw79SnVatHFAmi6pmv5FYjbSRmKSCuKu2Aw&co=b7b7b7&cmo=53ecff&cmn=ff5353&ct=989898"></script>
    </div>
</div>

<br><br>
