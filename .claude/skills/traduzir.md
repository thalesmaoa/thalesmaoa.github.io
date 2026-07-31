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
| `files/includes/_lang-toggle.html` | Script de detecção + toggle + tradução de títulos + tradução dinâmica da UI do Quarto |
| `styles.css` | Regras CSS de visibilidade `.lang-pt`/`.lang-en` |
| `_quarto.yml` | Config do site, inclui o toggle via `include-after-body` |
| `pages/` | Fontes Markdown/qmd (editáveis) |
| `docs/` | HTML gerado (não editar manualmente — é sobrescrito pelo build) |

## Tradução dinâmica da UI do Quarto

O Quarto gera vários textos de interface com base no `lang: pt` do `_quarto.yml`. Esses textos **não** passam pelo sistema de `<span>` e precisam ser traduzidos via JavaScript no `_lang-toggle.html`.

### Textos traduzidos dinamicamente

| Texto PT | EN | Local |
|----------|-----|-------|
| `Categorias` | `Categories` | Título da seção de categorias |
| `Tudo` | `All` | Filtro "todas as categorias" |
| `Ordenar por` | `Sort by` | Dropdown de ordenação |
| `Data - Mais velho` | `Date - Oldest` | Opção de ordenação |
| `Data - O mais novo` | `Date - Newest` | Opção de ordenação |
| `Autor` | `Author` | Opção de ordenação |
| `Nenhum item correspondente` | `No matching items` | Estado vazio do filtro |
| `Nenhum resultado` | `No results` | Busca sem resultados |
| `Filtro` | `Filter` | Placeholder do campo de filtro |
| `Alternar de navegação` | `Toggle navigation` | Aria-label da navbar |
| `Data de Publicação` | `Publication Date` | Cabeçalho de metadados |
| `Nesta página` | `On this page` | TOC sidebar |
| `Procurar` | `Search` | Placeholder da busca (via config JSON) |

### Datas

As datas são geradas pelo Quarto em dois formatos e precisam de tratamento especial:

| Formato | Exemplo PT | Exemplo EN |
|---------|-----------|-----------|
| Abreviado (listagens) | `30 de jul. de 2026` | `Jul 30, 2026` |
| Por extenso (detalhe) | `30 de julho de 2026` | `July 30, 2026` |

A função `ptDateToEn()` usa regex para detectar o formato e converter usando arrays de meses.

### Categorias

**NÃO é possível** colocar `<span>` no frontmatter YAML do Quarto — o HTML é escapado. Exemplo do que **não funciona**:
```yaml
categories:
  - "<span class='lang-pt'>Estudo de Caso</span><span class='lang-en'>Case Study</span>"
```

A solução é JavaScript: a função `injectCategorySpans()` encontra elementos `.quarto-category`, `.listing-category` e `.category[data-category]`, e injeta os spans no runtime. O mapa de tradução fica em `CAT_PT_TO_EN`:

```javascript
var CAT_PT_TO_EN = {
  'Estudo de Caso': 'Case Study',
  'Manutenção Industrial': 'Industrial Maintenance',
  'Defesa': 'Defense',
  'Evento': 'Event',
  'Notícias': 'News'
};
```

Para adicionar novas categorias traduzíveis, basta adicionar entradas nesse mapa.

### Estrutura do script de tradução

O `_lang-toggle.html` executa em duas etapas:

1. **Síncrona** (antes do `DOMContentLoaded`): patch do config JSON da busca e correção do `<html lang>`
2. **Assíncrona** (após `DOMContentLoaded` + 150ms): tradução da UI de listagem e injeção de spans nas categorias

Ao clicar no toggle PT/EN, `translateListingUI(lang)` é chamada novamente para inverter textos (datas, cabeçalhos). As categorias usam spans e o CSS controla a visibilidade — não precisam de nova chamada.

### Armadilhas comuns

- **Nunca remover uma função que ainda é usada** — se `replaceDirectText` for removida, `translateListingUI` quebra e **tudo** para de funcionar (datas, cabeçalhos, tudo)
- **Não usar text replacement + span injection no mesmo elemento** — conflito: o replace de texto roda antes do inject de spans, e o inject encontra o texto já traduzido
- **Cuidado com o mapa reverso (EN→PT)** — ele é gerado automaticamente invertendo `UI_PT_TO_EN`. Se duas chaves PT mapeiam para o mesmo valor EN, a segunda sobrescreve a primeira no mapa reverso. Para entradas adicionais só no sentido EN→PT, adicione diretamente em `UI_EN_TO_PT` após a construção do mapa reverso
- **Datas têm dois formatos**: o regex precisa testar o formato abreviado (`\w{3}\.`) antes do formato por extenso (`\w+`), senão captura errado

## Fluxo de trabalho

1. Editar os arquivos fonte em `pages/` (`.md` ou `.qmd`)
2. Rodar o build do Quarto para gerar os HTML em `docs/`
3. Se for uma correção urgente no script de idioma, editar TAMBÉM os HTML em `docs/` (porque eles têm o script inlineado)

**Cuidado**: mudanças em `files/includes/_lang-toggle.html` só afetam novas builds. Para correções imediatas, os HTMLs em `docs/` precisam ser atualizados manualmente.
