---
title: 'Learning Exploration Policies with View-based Intrinsic Rewards'

# Authors
# If you created a profile for a user (e.g. the default `admin` user), write the username (folder name) here
# and it will be replaced with their full name and linked to their profile.
authors:
  - Yijie Guo
  - Yao Fu
  - admin
  - Honglak Lee

# Author notes (optional)
author_notes: 
  - Equal Contribution
  - Equal Contribution

date: '2022-10-08T00:00:00Z'
doi: ''

# Schedule page publish date (NOT publication's date).
publishDate: '2017-01-01T00:00:00Z'

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: In The Conference on Neural Information Processing Systems, Deep Reinforcement Learning Workshop, 2022
publication_short: In *NeurIPS* 2022 DRL Workshop

abstract: 'Efficient exploration in sparse-reward tasks is one of the biggest challenges in deep reinforcement learning. Common approaches introduce intrinsic rewards to motivate exploration. For example, visitation count and prediction-based curiosity utilize some measures of novelty to drive the agent to visit novel states in the environment. However, in partially-observable environments, these methods can easily be misled by relatively “novel” or noisy observations and get stuck around them. Motivated by humans’ exploration behavior of seeing around the environment to get information and avoid unnecessary actions, we consider enlarging the agent’s view area for efficient knowledge acquisition of the environment. In this work, we propose a novel intrinsic reward combining two components: the view-based bonus for ample view coverage and the classical count-based bonus for novel observation discovery. The resulting method, ViewX, achieves state-of-the-art performance on the 12 most challenging procedurally-generated tasks on MiniGrid. Additionally, ViewX efficiently learns an exploration policy in the task-agnostic setting, which generalizes well to unseen environments. When exploring new environments on MiniGrid and Habitat, our learned policy significantly outperforms the baselines in terms of scene coverage and extrinsic reward.'

# Summary. An optional shortened abstract.
summary: Intrinsic Reward Design, Reinforcement Learning, Sample Efficiency in Exploration

tags: ['Reinforcement Learning']

# Display this page in the Featured widget?
featured: false

# Custom links (uncomment lines below)
# links:
# - name: Custom Link
#   url: http://example.org

url_pdf: 'https://openreview.net/forum?id=C2_6qBhe5fH'
# url_poster: ''
# url_project: ''
# url_slides: ''
# url_source: ''
# url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# image:
#   caption: 'Image credit: Dalle-3'
#   focal_point: ''
#   preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
# projects:
#   - example

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
# slides: example
---
<!-- 
{{% callout note %}}
Click the _Cite_ button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the _Slides_ button to check out the example.
{{% /callout %}}

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://wowchemy.com/docs/content/writing-markdown-latex/). -->
