# Thales Maia — Personal Website

This is the repository for my personal/academic website: **[thalesmaia.com](https://thalesmaia.com)**.

## About the site

The site gathers my research, publications, projects, technical blog posts, and teaching information. I'm a researcher, engineer, and R&D professional working at the intersection of academic research and industrial innovation.

## Fork

This site is a **fork** of the excellent **[Quarto Academic Website](https://github.com/dr-gang-he/quarto-academic-website-template)** template created by Dr. Gang He. The original template has been heavily adapted to fit my needs — translation to Portuguese, section restructuring, custom styling, and integration with my own content. I'm very grateful to Dr. Gang He for his contribution to the community.

## Structure

- **`index.qmd`** — home page with academic profile and links
- **`pages/pesquisa/`** — projects, publications, and scientific output
- **`pages/blog/`** — technical articles and tutorials
- **`pages/news/`** — news and updates
- **`files/`** — images, PDFs, CV, and includes

## How to render locally

1. Install [Quarto](https://quarto.org/docs/get-started/)
2. Install the Python dependency (optional, for generating the publication list):
   ```bash
   pip install openpyxl
   ```
3. Render the site:
   ```bash
   quarto render
   ```
4. The generated site will be in the `docs/` folder, ready to be published via GitHub Pages.

## Publishing

The site is published automatically via **GitHub Pages** from the `docs/` directory on the `main` branch.

---

Built with [Quarto](https://quarto.org/) · Original template by [Dr. Gang He](https://drganghe.github.io/)
