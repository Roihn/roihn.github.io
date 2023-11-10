---
title: 'Towards A Holistic Landscape of Situated Theory of Mind in Large Language Models'
summary: Responsible for designing and implementing all ten tasks on minigrid; Actively Contributed to test LLM's understanding on situated theory of mind, unveiling its lack of ability to correctly reason the theory of mind

tags:
  - Theory of mind
  - Embodied AI
  - Large Language Models

date: '2023-10-30T00:00:00Z'

# Optional external URL for project (replaces project detail page).
external_link: ''

image:
  caption: Ten tasks designed in Minigrid
  focal_point: Smart

links:
  - icon: twitter
    icon_pack: fab
    name: Post
    url: https://twitter.com/ziqiao_ma/status/1719394746043449417
url_code: 'https://github.com/Mars-tin/awesome-theory-of-mind'
url_pdf: 'https://arxiv.org/abs/2310.19619'
url_dataset: 'https://huggingface.co/datasets/sled-umich/2D-ATOMS'
# url_slides: 'https://docs.google.com/presentation/d/1PgG45U45wTWKXgFVN1IPiZrsEcgLCOFvL7zn7PNy6lI/edit?usp=sharing'
# url_video: ''

# Slides (optional).
#   Associate this project with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
# slides: example

publication: tom
---
Large Language Models (LLMs) have generated considerable interest and debate regarding their potential emergence of Theory of Mind (ToM). Several recent inquiries reveal a lack of robust ToM in these models and pose a pressing demand to develop new benchmarks, as current ones primarily focus on different aspects of ToM and are prone to shortcuts and data leakage. In this position paper, we seek to answer two road-blocking questions: (1) How can we taxonomize a holistic landscape of machine ToM? (2) What is a more effective evaluation protocol for machine ToM? Following psychological studies, we taxonomize machine ToM into 7 mental state categories and delineate existing benchmarks to identify under-explored aspects of ToM. We argue for a holistic and situated evaluation of ToM to break ToM into individual components and treat LLMs as an agent who is physically situated in environments and socially situated in interactions with humans. Such situated evaluation provides a more comprehensive assessment of mental states and potentially mitigates the risk of shortcuts and data leakage. We further present a pilot study in a grid world setup as a proof of concept. We hope this position paper can facilitate future research to integrate ToM with LLMs and offer an intuitive means for researchers to better position their work in the landscape of ToM.