---
name: traduzir
description: Tradução de conteúdo do site bilíngue (PT/EN). Use quando o usuário pedir para traduzir, adicionar inglês, ou criar versão EN de qualquer página, post ou conteúdo do site.
metadata:
  type: project
---

# Sistema Bilíngue do Site

O site (thalesmaia.com) é bilíngue português/inglês. O idioma padrão é português; o inglês é ativado por uma classe CSS no `<html>`.

## Como funciona

### CSS (styles.css)
```css
/* Quando NÃO tem lang-en, esconde elementos .lang-en */
html:not(.lang-en) .lang-en { display: none; }
/* Quando TEM lang-en, esconde elementos .lang-pt */
html.lang-en .lang-pt       { display: none; }
```

Ou seja: elementos com classe `lang-pt` são visíveis por padrão; elementos com classe `lang-en` só aparecem quando `<html>` tem a classe `lang-en`.

### Detecção de idioma e toggle
Arquivo: `files/includes/_lang-toggle.html`

Fluxo:
1. Verifica `localStorage` (chave `site-lang`)
2. Se não há preferência salva, detecta `navigator.language`
3. Se for `pt-*` → português (default, sem classe)
4. Se for `en-*` ou qualquer outro → adiciona classe `lang-en` ao `<html>`
5. O botão PT/EN é inserido dinamicamente na navbar direita
6. Ao clicar, alterna a classe `lang-en` e salva em `localStorage`

### Inclusão no build
Em `_quarto.yml`:
```yaml
format:
  html:
    include-after-body: "files/includes/_lang-toggle.html"
```

O script é inlineado em **todas** as páginas HTML geradas pelo Quarto.

## Como traduzir conteúdo

### Texto corrido
Envolver cada idioma em `<span>` com a classe correspondente:
```html
<span class="lang-pt">Texto em português.</span>
<span class="lang-en">Text in English.</span>
```

### Títulos de seção (h2, h3, etc.)
```html
## <span class="lang-pt">Título em português</span><span class="lang-en">Title in English</span>
```

### Legendas de figuras
```html
<figcaption>
<span class="lang-pt">Fig. 1 — Descrição em português.</span>
<span class="lang-en">Fig. 1 — Description in English.</span>
</figcaption>
```

### Itens de lista
```html
<li><span class="lang-pt">Item em português.</span><span class="lang-en">Item in English.</span></li>
```

### Título do post (YAML frontmatter)

**Funciona** com a mesma abordagem de `<span>`, mas com uma ressalva:

```yaml
title: '<span class="lang-pt">Título em português</span><span class="lang-en">Title in English</span>'
```

**O que funciona nativamente:**
- ✅ `<h1 class="title">` na página do post — os `<span>` são preservados, CSS controla visibilidade
- ✅ Títulos nas listagens (blog, news) — mesmo comportamento

**O que quebra:**
- ❌ `<title>` (aba do navegador) — os textos dos dois idiomas aparecem concatenados
- ❌ `<meta og:title>` e `<meta twitter:title>` — mesmo problema

**Solução:** o script em `_lang-toggle.html` inclui uma função `applyTitleTranslation()` que corrige `<title>` e OG tags lendo o texto correto do `<h1>` da página. Essa função é chamada no carregamento e a cada toggle de idioma.

**⚠️ Atenção com filtros `exclude`/`include` baseados em `title:`:** quando um título é traduzido, qualquer filtro que dê match pelo título precisa ser atualizado com a string completa (incluindo os `<span>`), pois o Quarto faz match exato. O formato `title: ["string1", "string2"]` é um atalho para múltiplos matches:
```yaml
exclude:
  title:
    - '<span class="lang-pt">Indústria</span><span class="lang-en">Industry</span>'
    - '<span class="lang-pt">Projetos de P&D</span><span class="lang-en">R&D Projects</span>'
```

## Arquivos importantes

| Arquivo | Função |
|---------|--------|
| `files/includes/_lang-toggle.html` | Script de detecção + toggle + tradução de títulos |
| `styles.css` | Regras CSS de visibilidade `.lang-pt`/`.lang-en` |
| `_quarto.yml` | Config do site, inclui o toggle via `include-after-body` |
| `pages/` | Fontes Markdown/qmd (editáveis) |
| `docs/` | HTML gerado (não editar manualmente — é sobrescrito pelo build) |

## Fluxo de trabalho

1. Editar os arquivos fonte em `pages/` (`.md` ou `.qmd`)
2. Rodar o build do Quarto para gerar os HTML em `docs/`
3. Se for uma correção urgente no script de idioma, editar TAMBÉM os HTML em `docs/` (porque eles têm o script inlineado)

**Cuidado**: mudanças em `files/includes/_lang-toggle.html` só afetam novas builds. Para correções imediatas, os HTMLs em `docs/` precisam ser atualizados manualmente.
