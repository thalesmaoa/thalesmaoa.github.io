---
title: '<span class="lang-pt">Falta de fase intermitente: O perigo invisível do borne frouxo</span><span class="lang-en">Intermittent Phase Loss: The Hidden Danger of Loose Terminals</span>'
date: 2026-07-30
categories: 
  - "Manutenção Industrial"
  - "Estudo de Caso"
---

## <span class="lang-pt">O sintoma: paradas intermitentes</span><span class="lang-en">The symptom: intermittent shutdowns</span>

<span class="lang-pt">Uma planta industrial de pequeno porte enfrentava **desligamentos intermitentes e sem padrão definido**. A equipe local classificava o problema como "falta de fase". As máquinas paravam, o time de manutenção buscava a causa, não encontrava, e a produção era retomada — até a próxima queda.</span><span class="lang-en">A small industrial plant was experiencing **intermittent shutdowns with no defined pattern**. The local team classified the issue as "phase loss." Machines would stop, the maintenance team searched for the cause, found nothing, and production resumed — until the next trip.</span>

<span class="lang-pt">Cada parada não programada representava prejuízo direto. E o pior: **sem causa identificada**, não havia plano de ação.</span><span class="lang-en">Each unplanned shutdown meant direct financial loss. Worse: **without an identified cause**, there was no action plan.</span>

<span class="lang-pt">Após diversas tentativas frustradas de diagnóstico interno, a equipe acionou a Cemig. Somente quando o técnico da concessionária foi até o local e abriu o painel do padrão de entrada é que o problema se tornou visível.</span><span class="lang-en">After several failed internal diagnosis attempts, the team called Cemig. Only when the utility technician arrived on site and opened the service entrance panel did the problem become visible.</span>

## <span class="lang-pt">Investigação e causa raiz</span><span class="lang-en">Investigation and root cause</span>

<span class="lang-pt">"Falta de fase" é um sintoma, não um diagnóstico. As causas possíveis incluem falha da concessionária, disjuntor desarmado, transformador com defeito ou mau contato no barramento.</span><span class="lang-en">"Phase loss" is a symptom, not a diagnosis. Possible causes include utility grid faults, tripped circuit breakers, transformer defects, or poor contact in the busbar.</span>

<span class="lang-pt">As duas primeiras hipóteses foram eliminadas por exclusão lógica:</span><span class="lang-en">The first two hypotheses were ruled out by logical exclusion:</span>

1. <span class="lang-pt">**Rede da Cemig:** a intermitência errática e a ausência de queixas de vizinhos tornavam essa hipótese improvável.</span><span class="lang-en">**Cemig grid:** the erratic intermittency and absence of complaints from neighboring consumers made this unlikely.</span>
2. <span class="lang-pt">**Disjuntores internos:** todos estavam armados e sem sinais de atuação recente.</span><span class="lang-en">**Internal circuit breakers:** all were engaged with no signs of recent tripping.</span>
3. <span class="lang-pt">**Barramento de entrada:** restava inspecionar o ponto entre o medidor e a carga principal.</span><span class="lang-en">**Service entrance busbar:** the remaining point to inspect was between the meter and the main load.</span>

<span class="lang-pt">A equipe abriu o painel do padrão da Cemig e encontrou o problema:</span><span class="lang-en">The team opened the utility panel and found the problem:</span>

<figure style="text-align: center;">

![](images/image.jpeg)

<figcaption>

<span class="lang-pt">Fig. 1 — Disjuntor derretido no padrão Cemig. O dano concentrado na base do borne indica aquecimento por conexão frouxa, não por sobrecarga generalizada.</span><span class="lang-en">Fig. 1 — Melted circuit breaker in the Cemig utility panel. Damage concentrated at the terminal base indicates heating from a loose connection, not general overload.</span>

</figcaption>

</figure>

<span class="lang-pt">O disjuntor apresentava **fusão localizada** no borne de entrada. A carbonização e deformação do termoplástico estavam restritas ao ponto de conexão do cabo de fase, enquanto a parte superior do componente preservava sua estrutura. Esse padrão de dano **exclui sobrecarga** e aponta diretamente para **alta resistência de contato em um único terminal**.</span><span class="lang-en">The circuit breaker showed **localized melting** at the input terminal. Carbonization and thermoplastic deformation were confined to the phase conductor connection point, while the upper portion of the component retained its structure. This damage pattern **rules out overload** and points directly to **high contact resistance at a single terminal**.</span>

## <span class="lang-pt">A física do problema: conexão frouxa = calor</span><span class="lang-en">The physics: loose connection = heat</span>

<span class="lang-pt">O mecanismo é a **Lei de Joule**: uma resistência elétrica percorrida por corrente dissipa potência na forma de calor.</span><span class="lang-en">The mechanism is **Joule's Law**: an electrical resistance carrying current dissipates power as heat.</span>

**P = R × I²**

<span class="lang-pt">Quando o parafuso do borne não recebe o torque correto, a área de contato entre o condutor e o terminal se reduz. Essa **interface parcial** comporta-se como uma resistência concentrada.</span><span class="lang-en">When the terminal screw does not receive proper torque, the contact area between conductor and terminal shrinks. This **partial interface** behaves as a concentrated resistance.</span>

<span class="lang-pt">Exemplo prático: uma resistência de contato de apenas **0,1 ohm** em um circuito de 100 A dissipa **1.000 watts** localizados. Equivale a manter um aquecedor ligado dentro do painel.</span><span class="lang-en">Practical example: a contact resistance of just **0.1 ohm** in a 100 A circuit dissipates **1,000 watts** at that single point. That's equivalent to running a space heater inside your panel.</span>

<span class="lang-pt">O processo é progressivo:</span><span class="lang-en">The process is progressive:</span>

1. <span class="lang-pt">**Conexão frouxa** → resistência de contato elevada.</span><span class="lang-en">**Loose connection** → high contact resistance.</span>
2. <span class="lang-pt">**Aquecimento** → dilatação térmica.</span><span class="lang-en">**Heating** → thermal expansion.</span>
3. <span class="lang-pt">**Ciclos de dilatação e contração** → afrouxamento adicional.</span><span class="lang-en">**Cyclic expansion and contraction** → further loosening.</span>
4. <span class="lang-pt">**Oxidação acelerada** pelo calor → aumento da resistência.</span><span class="lang-en">**Heat-accelerated oxidation** → increased resistance.</span>
5. <span class="lang-pt">**Degradação do isolante** → carbonização e fusão do componente.</span><span class="lang-en">**Insulator degradation** → carbonization and component melting.</span>

<span class="lang-pt">O ciclo se autorrealimenta. Sem intervenção, o resultado é o da foto.</span><span class="lang-en">The cycle is self-reinforcing. Without intervention, the result is what the photo shows.</span>

## <span class="lang-pt">Causa raiz: falha de execução</span><span class="lang-en">Root cause: execution failure</span>

<span class="lang-pt">O problema não estava no componente, no projeto ou na rede. **Estava na instalação.**</span><span class="lang-en">The problem was not the component, the design, or the grid. **It was the installation.**</span>

<span class="lang-pt">O técnico que instalou o disjuntor cometeu duas falhas:</span><span class="lang-en">The technician who installed the circuit breaker made two mistakes:</span>

- <span class="lang-pt">**Torque inadequado no borne.** Cada disjuntor tem uma especificação de torque nominal (tipicamente entre 1,5 e 4,0 N·m para modelos de média potência). Apertar "no feeling" — prática comum no chão de fábrica — não garante a pressão de contato necessária.</span><span class="lang-en">**Inadequate terminal torque.** Every circuit breaker has a rated torque specification (typically 1.5 to 4.0 N·m for medium-power models). Tightening "by feel" — common practice on the factory floor — does not guarantee the required contact pressure.</span>
- <span class="lang-pt">**Ausência do teste de tração.** Após apertar o borne, puxar o cabo para verificar a fixação elimina a falsa sensação de aperto. Cabos com isolação presa parcialmente sob o terminal são uma causa frequente de conexões frouxas que passam despercebidas.</span><span class="lang-en">**Skipping the pull test.** After tightening the terminal, pulling the cable to verify the connection eliminates the false sense of tightness. Cables with insulation partially trapped under the terminal are a frequent cause of unnoticed loose connections.</span>

<span class="lang-pt">Ambos os procedimentos constam em manuais de fabricantes, na NR-10 e na NBR 5410. A falha foi de **disciplina operacional**, não de competência técnica.</span><span class="lang-en">Both procedures are in manufacturer manuals, NR-10, and NBR 5410 standards. The failure was one of **operational discipline**, not technical competence.</span>

<span class="lang-pt">**Esse modo de falha não é exclusivo de painéis de concessionária.** O mesmo problema já foi observado em sistemas de geração fotovoltaica: conexões CC frouxas em string boxes e inversores, onde correntes contínuas elevadas (tipicamente 10 a 15 A por string) aceleram ainda mais a degradação térmica. Em sistemas fotovoltaicos, o risco é duplo — além da parada de geração, há o perigo real de arco elétrico em CC, que não se autoextingue como em CA. O princípio é idêntico, a consequência é a mesma, e a prevenção também.</span><span class="lang-en">**This failure mode is not exclusive to utility panels.** The same problem has been observed in photovoltaic generation systems: loose DC connections in string boxes and inverters, where high continuous currents (typically 10 to 15 A per string) accelerate thermal degradation even further. In PV systems, the risk is twofold — beyond generation downtime, there is a real danger of DC arcing, which does not self-extinguish as AC does. The principle is identical, the consequence is the same, and the prevention is no different.</span>

## <span class="lang-pt">Três ações para sua equipe</span><span class="lang-en">Three actions for your team</span>

1. <span class="lang-pt">**Torquímetro calibrado como ferramenta obrigatória.** O custo do instrumento é insignificante comparado ao prejuízo de uma parada não programada ou de um painel incendiado.</span><span class="lang-en">**Calibrated torque wrench as a mandatory tool.** The cost of the instrument is negligible compared to the losses from an unplanned shutdown or a panel fire.</span>
2. <span class="lang-pt">**Teste de tração no checklist da Ordem de Serviço.** Se o campo existe no papel, ele é cobrado. Se é cobrado, é executado.</span><span class="lang-en">**Pull test on the work order checklist.** If the field exists on paper, it gets enforced. If it's enforced, it gets done.</span>
3. <span class="lang-pt">**Termografia periódica nos painéis.** Uma câmera termográfica detecta pontos quentes meses antes da falha. O disjuntor deste caso acusaria um delta de temperatura no borne semanas antes de se degradar completamente.</span><span class="lang-en">**Periodic thermographic inspection of panels.** A thermal camera detects hot spots months before failure. The circuit breaker in this case would have shown a temperature delta at the terminal weeks before complete degradation.</span>

## <span class="lang-pt">Conclusão</span><span class="lang-en">Conclusion</span>

<span class="lang-pt">O disjuntor da foto não falhou por defeito de fabricação. Falhou por **um procedimento que levaria menos de 60 segundos para ser executado corretamente**. É esse minuto que separa uma planta estável de uma que opera apagando incêndios.</span><span class="lang-en">The circuit breaker in the photo did not fail due to a manufacturing defect. It failed because of **a procedure that would take less than 60 seconds to execute correctly**. That single minute is what separates a stable plant from one that lives by putting out fires.</span>

<span class="lang-pt">**Manutenção de excelência não é complexa. É executar o básico com precisão.**</span><span class="lang-en">**Maintenance excellence is not complex. It's about executing the basics with precision.**</span>

---

<span class="lang-pt">*Caso real de consultoria em manutenção industrial. Nomes e localização omitidos por confidencialidade.*</span><span class="lang-en">*Real case study from industrial maintenance consultancy. Names and location withheld for confidentiality.*</span>

<!--Include social share buttons-->

{{< include /files/includes/_socialshare.qmd >}}
