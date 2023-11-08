---
title: "Go Beyond Imagination: Maximizing Episodic Reachability with World Models"
authors:
- Yao Fu
- admin
- Honglak Lee

date: "2023-08-25T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ['paper-conference']

# Publication name and optional abbreviated publication name.
publication: "In the 40th International Conference on Machine Learning"
publication_short: "In *ICML 2023*, Poster"

abstract: Efficient exploration is a challenging topic in reinforcement learning, especially for sparse reward tasks. To deal with the reward sparsity, people commonly apply intrinsic rewards to motivate agents to explore the state space efficiently. In this paper, we introduce a new intrinsic reward design called GoBI - Go Beyond Imagination, which combines the traditional lifelong novelty motivation with an episodic intrinsic reward that is designed to maximize the stepwise reachability expansion. More specifically, we apply learned world models to generate predicted future states with random actions. States with more unique predictions that are not in episodic memory are assigned high intrinsic rewards. Our method greatly outperforms previous state-of-the-art methods on 12 of the most challenging Minigrid navigation tasks and improves the sample efficiency on locomotion tasks from DeepMind Control Suite.

# Summary. An optional shortened abstract.
summary: Intrinsic Reward Design, Reinforcement Learning, Sample Efficiency in Exploration

tags:
- Minigrid
- Deepmind Control Suite
featured: false

# links:
# - name: ""
#   url: ""
url_pdf: https://arxiv.org/pdf/2308.13661
# url_code: 'https://github.com/wowchemy/wowchemy-hugo-themes'
# url_dataset: ''
# url_poster: ''
# url_project: ''
# url_slides: ''
# url_source: ''
# url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  # caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
# projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
# slides: example
---

<!-- {{% callout note %}}
Click the *Cite* button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://wowchemy.com/docs/content/writing-markdown-latex/). -->
