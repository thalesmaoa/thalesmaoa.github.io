---
title: '<span class="lang-pt">MagFEM: elementos finitos magnéticos 2D direto no navegador</span><span class="lang-en">MagFEM: 2D magnetic finite elements right in the browser</span>'
date: 2026-09-27
image: images/capa-magfem.jpg
categories:
  - "Máquinas Elétricas"
  - "Elementos Finitos"
  - "Ferramentas"
---

<span class="lang-pt">Há alguns meses publiquei aqui uma série sobre como projetar um [núcleo EI de transformador em 2D](../20260429%20-%20Designing%20a%202D%20transformer%20core%20freecad%20to%20elmerfem%20integration%20part1/) usando FreeCAD, ElmerFEM e ParaView. Funciona, mas são três programas, conversões de arquivo no meio do caminho e uma boa dose de paciência com o arquivo `.sif`. Para quem só quer desenhar um indutor ou um transformador e ver o fluxo, é atrito demais.</span><span class="lang-en">A few months ago I published a series here on how to design a [2D EI transformer core](../20260429%20-%20Designing%20a%202D%20transformer%20core%20freecad%20to%20elmerfem%20integration%20part1/) using FreeCAD, ElmerFEM and ParaView. It works, but it takes three programs, file conversions along the way and a good deal of patience with the `.sif` file. For someone who just wants to draw an inductor or a transformer and look at the flux, that is too much friction.</span>

<span class="lang-pt">Foi daí que nasceu o **MagFEM**: um programa de elementos finitos magnéticos 2D, planar e axissimétrico, que roda inteiro no navegador. O núcleo numérico é C++ compilado para WebAssembly, então não há instalação, servidor nem login — os projetos ficam na sua máquina, como no draw.io.</span><span class="lang-en">That is where **MagFEM** came from: a 2D magnetic finite element program, planar and axisymmetric, that runs entirely in the browser. The numerical core is C++ compiled to WebAssembly, so there is no installation, no server and no login — your projects stay on your machine, as in draw.io.</span>

## <span class="lang-pt">Tutorial 1: do desenho à simulação</span><span class="lang-en">Tutorial 1: from drawing to simulation</span>

<span class="lang-pt">O primeiro vídeo tutorial refaz o mesmo núcleo EI da série antiga, agora do começo ao fim dentro do MagFEM: desenho, materiais, bobinas, malha, solução magnetostática e visualização do resultado.</span><span class="lang-en">The first video tutorial (in Portuguese) rebuilds the same EI core from the old series, now start to finish inside MagFEM: drawing, materials, coils, mesh, magnetostatic solution and result visualization.</span>

{{< video https://youtu.be/qfYtEC5cs0A >}}

## <span class="lang-pt">O que ele faz</span><span class="lang-en">What it does</span>

- <span class="lang-pt">**CAD paramétrico** no estilo do Onshape: linhas, arcos, círculos e retângulos, restrições geométricas, cotas com unidades e expressões ligadas a variáveis, offset, espelhamento e padrões. Importa DXF e SVG.</span><span class="lang-en">**Parametric CAD** in the style of Onshape: lines, arcs, circles and rectangles, geometric constraints, dimensions with units and expressions bound to variables, offset, mirror and patterns. Imports DXF and SVG.</span>
- <span class="lang-pt">**Pré-processamento**: regiões detectadas automaticamente, curvas B-H, a biblioteca de materiais do FEMM 4.2 (245 materiais), chapas laminadas, fio da bobina (AWG, redondo ou retangular) e condições de contorno como no FEMM.</span><span class="lang-en">**Pre-processing**: automatic region detection, B-H curves, the FEMM 4.2 material library (245 materials), laminated sheets, coil wire (AWG, round or rectangular) and FEMM-style boundary conditions.</span>
- <span class="lang-pt">**Malha** com o Tangle, o mesmo gerador do FEMM, compilado para WebAssembly.</span><span class="lang-en">**Meshing** with Tangle, the same mesher used by FEMM, compiled to WebAssembly.</span>
- <span class="lang-pt">**Solver** magnetostático não linear (Newton-Raphson), transitório com correntes parasitas, AC harmônico com perdas no ferro e nos condutores (incluindo efeito pelicular e de proximidade), e acoplamento **campo + circuito** com um editor de esquemático.</span><span class="lang-en">**Solver**: nonlinear magnetostatic (Newton-Raphson), transient with eddy currents, harmonic AC with iron and conductor losses (including skin and proximity effects), and **field + circuit** coupling with a schematic editor.</span>
- <span class="lang-pt">**Resultados** em abas, no estilo do ParaView: mapas de |B|, |H|, A e J, linhas de fluxo, gráficos sobre uma linha, integrais, tabelas de circuito (λ, L, R, perdas) e sinais no tempo.</span><span class="lang-en">**Results** in tabs, ParaView style: |B|, |H|, A and J maps, flux lines, plots over a line, integrals, circuit tables (λ, L, R, losses) and signals over time.</span>
- <span class="lang-pt">**Automação**: toda ação vira um comando de uma API no estilo Python, e o botão "Exportar código" gera um script que reconstrói o modelo. Uma ponte local conecta scripts em Python, Matlab/Octave ou Julia ao modelo aberto no navegador — base para otimização.</span><span class="lang-en">**Automation**: every action becomes a command in a Python-like API, and "Export code" writes a script that rebuilds the model. A local bridge connects Python, Matlab/Octave or Julia scripts to the model open in the browser — the basis for optimization.</span>

<span class="lang-pt">O solver foi validado contra soluções analíticas, e a formulação numérica está descrita na documentação.</span><span class="lang-en">The solver was validated against analytical solutions, and the numerical formulation is described in the documentation.</span>

## <span class="lang-pt">Para onde vai</span><span class="lang-en">Where it is going</span>

<span class="lang-pt">O foco agora são as **máquinas elétricas estáticas** — indutores, transformadores e atuadores —, com ênfase em acoplamento de circuito e simulação transitória. Em seguida vêm força e térmica, para simular dispositivos como contatores, e por fim as **máquinas rotativas**, com entreferro móvel.</span><span class="lang-en">The current focus is on **non-rotating electrical machines** — inductors, transformers and actuators — with emphasis on circuit coupling and transient simulation. Force and thermal come next, to simulate devices such as contactors, and finally **rotating machines**, with a moving air gap.</span>

<span class="lang-pt">O MagFEM ainda está em desenvolvimento. Se encontrar um bug, abra uma *issue* no GitHub — há um link direto na barra de status do próprio programa.</span><span class="lang-en">MagFEM is still under development. If you find a bug, open an issue on GitHub — there is a direct link in the app's status bar.</span>

- <span class="lang-pt">**Acesse:** [MagFEM](/tools/magfem-web/)</span><span class="lang-en">**Open:** [MagFEM](/tools/magfem-web/)</span>
- <span class="lang-pt">**Código-fonte (MIT):** [github.com/thalesmaoa/magfem](https://github.com/thalesmaoa/magfem)</span><span class="lang-en">**Source code (MIT):** [github.com/thalesmaoa/magfem](https://github.com/thalesmaoa/magfem)</span>
