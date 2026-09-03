---
title: '<span class="lang-pt">Estimando os parâmetros do motor de indução: comparando 3 metodologias</span><span class="lang-en">Estimating induction motor parameters: comparing 3 methodologies</span>'
date: 2026-09-03
categories:
  - "Máquinas Elétricas"
  - "Metodologia"
---

<span class="lang-pt">Este post é a base metodológica da [calculadora de parâmetros de motor de indução](/tools/im-calc-map/): a partir só dos dados de placa, ela estima os seis parâmetros do circuito equivalente por fase ($R_1$, $X_1$, $R_2$, $X_2$, $X_M$, $R_M$). Existem várias formas de fazer essa estimativa — aqui comparamos três, todas aplicadas ao mesmo motor de exemplo, em Julia (linguagem escolhida pela sintaxe limpa para números complexos e algoritmos iterativos).</span><span class="lang-en">This post is the methodological basis of the [induction motor parameter calculator](/tools/im-calc-map/): starting only from nameplate data, it estimates the six per-phase equivalent-circuit parameters ($R_1$, $X_1$, $R_2$, $X_2$, $X_M$, $R_M$). There is more than one way to do this estimation — here we compare three, all applied to the same example motor, in Julia (chosen for its clean complex-number syntax and its fit for iterative algorithms).</span>

<span class="lang-pt">**Método 1** é uma estimativa direta baseada no livro *Principal Laws and Methods in Electrical Machine Design*, de Juha Pyrhönen — sem iteração, só relações físicas diretas. **Método 2** é um algoritmo iterativo simplificado, que ajusta os parâmetros em três etapas até bater com os dados de placa; ele aproxima a metodologia usada em normas de ensaio, mas de forma simplificada, sem tabelas normativas de perdas. **Método 3** também é iterativo, mas parte de uma inicialização ancorada em tabelas normativas de proporção de perdas por potência (IEEE / de Almeida & Ferreira) — é o método que hoje roda por trás da calculadora.</span><span class="lang-en">**Method 1** is a direct estimate based on Juha Pyrhönen's book *Principal Laws and Methods in Electrical Machine Design* — no iteration, just direct physical relations. **Method 2** is a simplified iterative algorithm that adjusts the parameters in three stages until they match the nameplate; it approximates the methodology used in test standards, but in a simplified way, without normative loss tables. **Method 3** is also iterative, but starts from an initialization anchored in normative power-vs-loss-fraction tables (IEEE / de Almeida & Ferreira) — it is the method that actually powers the calculator today.</span>

## <span class="lang-pt">O motor de exemplo</span><span class="lang-en">The example motor</span>

<span class="lang-pt">Para comparar os três métodos lado a lado, usamos os mesmos dados de placa nos três: um motor de indução trifásico de 200 kW, 400 V, 50 Hz, 4 polos.</span><span class="lang-en">To compare the three methods side by side, we use the same nameplate data in all three: a 200 kW, 400 V, 50 Hz, 4-pole three-phase induction motor.</span>

```julia
using Printf

# ─── Dados de placa (nameplate) ───
const P_N_kW   = 200.0       # Potência nominal [kW]
const V_N      = 400.0       # Tensão nominal de linha [V]
const f_N      = 50.0        # Frequência nominal [Hz]
const polos    = 4           # Número de polos
const n_N      = 1485.0      # Rotação nominal [rpm]
const I_N      = 343.0       # Corrente nominal [A]
const η_N      = 0.95        # Rendimento nominal [pu]
const cos_φ_N  = 0.89        # Fator de potência nominal [pu]
const Ip_In    = 6.9         # Razão I_partida / I_nominal
const I_0      = 121.0       # Corrente a vazio [A] (usada só no Método 1)

# ─── Grandezas derivadas ───
V_ph  = V_N / √3                  # Tensão de fase [V]
ω_e   = 2π * f_N                  # Frequência angular elétrica [rad/s]
n_syn = 120.0 * f_N / polos       # Rotação síncrona [rpm]
s_N   = (n_syn - n_N) / n_syn     # Escorregamento nominal
φ_N   = acos(cos_φ_N)             # Ângulo do FP nominal [rad]
```

```
Tensão de fase nominal:     V_ph  = 230.94 V
Rotação síncrona:           n_syn = 1500 rpm
Escorregamento nominal:     s_N   = 0.0100 (1.00%)
Freq. angular elétrica:     ω_e   = 314.159 rad/s
```

<span class="lang-pt">E a mesma função resolve o circuito equivalente por fase nos três métodos — dado um conjunto de parâmetros e o escorregamento, ela devolve corrente, potência de entrada, potência mecânica desenvolvida, rendimento e fator de potência:</span><span class="lang-en">And the same function solves the per-phase equivalent circuit in all three methods — given a set of parameters and the slip, it returns current, input power, developed mechanical power, efficiency, and power factor:</span>

```julia
function solve_circuit(R₁, X₁, R₂, X₂, R_M, X_M, s; V₁::Float64=1.0)
    Z₂ = complex(R₂ / s, X₂)
    Z_M = R_M > 1e-9 ? (R_M * 1im * X_M) / (R_M + 1im * X_M) : 1im * X_M
    Z_par = (Z_M * Z₂) / (Z_M + Z₂)
    Z_eq = complex(R₁, X₁) + Z_par

    i₁ = complex(V₁, 0.0) / Z_eq
    i₂ = i₁ * Z_M / (Z_M + Z₂)

    P_in  = real(complex(V₁, 0.0) * conj(i₁))
    P_mec = abs2(i₂) * R₂ * (1.0 - s) / s   # potência mecânica DESENVOLVIDA (entreferro)

    return (; i₁_mag = abs(i₁), P_in, P_mec, η = P_mec / P_in, fp = cos(angle(i₁)))
end
```

<span class="lang-pt">Um detalhe físico importante, que retomamos no Método 3: `P_mec` aqui é a potência mecânica **desenvolvida** no entreferro (potência de entreferro menos as perdas Joule no rotor) — ainda não é a potência de **eixo** que a placa informa, porque falta descontar as perdas por atrito, ventilação e as perdas suplementares (*stray load*), que não são representadas pelos elementos do circuito.</span><span class="lang-en">One important physical detail, which we revisit in Method 3: `P_mec` here is the mechanical power **developed** in the air gap (air-gap power minus the rotor's Joule losses) — it is not yet the **shaft** power the nameplate reports, because friction, windage, and stray-load losses still need to be subtracted, and none of those are represented by the circuit elements.</span>

## <span class="lang-pt">Método 1 — Estimativa direta (Pyrhönen)</span><span class="lang-en">Method 1 — Direct estimate (Pyrhönen)</span>

<span class="lang-pt">Em vez de iterar, este método estima cada parâmetro diretamente a partir de considerações físicas: a indutância do estator vem do ensaio a vazio ($I_0$), a indutância de curto-circuito vem da razão de corrente de partida, a resistência do rotor é aproximada pelo escorregamento nominal, e a resistência de magnetização fecha o balanço de perdas.</span><span class="lang-en">Instead of iterating, this method estimates each parameter directly from physical considerations: the stator inductance comes from the no-load test ($I_0$), the short-circuit inductance comes from the starting-current ratio, the rotor resistance is approximated by the rated slip, and the magnetizing resistance closes the loss balance.</span>

```julia
# Passo 1: base de indutância
Ψ_b = √2 * V_ph / ω_e
Î_N = √2 * I_N
L_b = Ψ_b / Î_N                      # L_b = 2.143 mH

# Passo 2: indutância do estator, via corrente a vazio (97% magnetizante, 3% dispersão)
L_s  = V_ph / (I_0 * ω_e)            # L_s = 6.075 mH
l_m_pu    = (0.97 * L_s) / L_b       # l_m,pu  = 2.7497 pu
l_sσ_pu_1 = (0.03 * L_s) / L_b       # (usado só como referência do ensaio a vazio)

# Passo 3: indutância de curto-circuito ≈ 1/(I_partida/I_nominal), dividida 50:50
l_k_pu   = 1.0 / Ip_In                # l_k,pu = 0.1449 pu
l_sσ_pu  = l_k_pu / 2.0                # 0.0725 pu
l_rσ_pu  = l_k_pu / 2.0                # 0.0725 pu

# Passo 4: resistências — r_r ≈ s_N, r_s por regra prática ≈ 0.01 pu
r_r_pu = s_N                           # 0.0100 pu
r_s_pu = 0.01                          # 0.0100 pu

# Passo 5: balanço de perdas fecha R_M (5% de perdas totais, 0.5% suplementares fixo)
P_perdas_tot_pu = 1.0 - η_N            # 5.0%
P_ferro_pu = P_perdas_tot_pu - r_s_pu - r_r_pu - 0.005   # 2.5%
R_M_pu = 1.0^2 / P_ferro_pu             # 40.00 pu
```

```
--- Comparação com Dados Nominais ---
P_mec : 180.7 kW (Placa: 200 kW) -> Erro: -9.66%
|i₁|  : 306.6 A  (Placa: 343 A)  -> Erro: -10.61%
η     : 95.42 %  (Placa: 95.0 %) -> Erro: +0.44%
cos φ : 0.8914   (Placa: 0.89)   -> Erro: +0.15%
```

<span class="lang-pt">O rendimento e o fator de potência ficam muito próximos da placa, mas a corrente e a potência mecânica erram por mais de 9%. Isso é esperado: o Método 1 é uma estimativa rápida, útil para um primeiro chute ou para ganhar intuição física — não para bater precisamente com os dados nominais.</span><span class="lang-en">Efficiency and power factor land very close to the nameplate, but current and mechanical power miss by more than 9%. That's expected: Method 1 is a quick estimate, useful as a first guess or to build physical intuition — not to precisely match the rated values.</span>

## <span class="lang-pt">Método 2 — Algoritmo iterativo simplificado</span><span class="lang-en">Method 2 — Simplified iterative algorithm</span>

<span class="lang-pt">Aqui trocamos a estimativa direta por um algoritmo de três etapas: cada etapa ajusta um subconjunto dos parâmetros por ganho proporcional, até que a grandeza correspondente bata com a placa dentro da tolerância.</span><span class="lang-en">Here we trade the direct estimate for a three-stage algorithm: each stage nudges a subset of the parameters by proportional gain until the corresponding quantity matches the nameplate within tolerance.</span>

```julia
# Chute inicial (sem tabela normativa — só regras de bolso)
R₂ = s_N; R₁ = R₂
X_sum = 1.0 / Ip_In
X₁ = X_sum / 2.0; X₂ = X_sum / 2.0
X_M = 1.0 / ((I_N / i_B) * sin(φ_N))   # i_B = base de corrente (P_N / (3·V_ph))
R_M = 20.0

# Etapa 1: ajusta R₂ até a potência mecânica desenvolvida bater 1.0 pu (±2%)
# Etapa 2: ajusta X_M, X₁, X₂, R_M até |i₁| e fp baterem a placa (±1.5%)
# Etapa 3: ajusta R₁ até η bater a placa (±2%)
```

```
--- Comparação com Dados Nominais ---
P_mec : 196.5 kW (Placa: 200 kW) -> Erro: -1.77%
|i₁|  : 343.0 A  (Placa: 343 A)  -> Erro: +0.00%
η     : 95.23 %  (Placa: 95.0 %) -> Erro: +0.25%
cos φ : 0.8681   (Placa: 0.89)   -> Erro: -2.46%
```

<span class="lang-pt">O ajuste iterativo reduz bastante o erro de potência e corrente frente ao Método 1. Mas repare: a Etapa 1 mira a potência mecânica **desenvolvida** contra 1.0 pu, e a Etapa 3 mira o rendimento **desenvolvido** (P_mec/P_in) contra η_N — sem descontar perdas mecânicas em nenhum momento, porque este método não tem de onde tirar essa proporção (não usa tabela normativa). Na prática, isso empurra parte do erro para o fator de potência (-2.46%).</span><span class="lang-en">The iterative adjustment cuts the power and current error substantially compared with Method 1. But notice: Stage 1 targets the **developed** mechanical power against 1.0 pu, and Stage 3 targets the **developed** efficiency (P_mec/P_in) against η_N — without ever subtracting mechanical losses, because this method has no table to draw that proportion from. In practice, that pushes part of the error onto the power factor (-2.46%).</span>

## <span class="lang-pt">Método 3 — Inicialização normativa IEEE/NEMA + refino iterativo</span><span class="lang-en">Method 3 — IEEE/NEMA normative initialization + iterative refinement</span>

<span class="lang-pt">É o método que a calculadora usa. Ele parte de uma tabela de proporção de perdas por potência nominal — lida da Figura 2 de A. T. de Almeida, F. J. T. E. Ferreira e J. A. C. Fong, *"Standards for Efficiency of Electric Motors"*, IEEE Industry Applications Magazine, 2011 — que separa as perdas totais em cinco frações: cobre do estator ($f_s$), cobre do rotor ($f_r$), perdas suplementares/*stray load* ($f_{stray}$), núcleo ($f_c$) e atrito+ventilação ($f_{fw}$).</span><span class="lang-en">This is the method the calculator uses. It starts from a loss-proportion-by-rated-power table — read off Figure 2 of A. T. de Almeida, F. J. T. E. Ferreira, and J. A. C. Fong, *"Standards for Efficiency of Electric Motors,"* IEEE Industry Applications Magazine, 2011 — which splits total losses into five fractions: stator copper ($f_s$), rotor copper ($f_r$), stray-load losses ($f_{stray}$), core ($f_c$), and friction + windage ($f_{fw}$).</span>

```julia
# Frações de perda por potência nominal (interpoladas linearmente na tabela — ver ref/valores.csv)
f_s, f_r, f_stray, f_c, f_fw = obter_fracoes_perdas(P_N_kW)   # 0.2556, 0.2300, 0.1344, 0.2556, 0.1244
f_mech = f_fw + f_stray              # fração do total de perdas que é mecânica — 0.2589

P_loss_pu = 1.0/η_N - 1.0            # perdas totais, em pu da potência de EIXO — 0.0526 pu
K_r = f_s / f_r                      # 1.1111 — razão de perdas Cu estator/rotor

R₂ = s_N                             # 0.0100 pu
R₁ = K_r * s_N                       # 0.0111 pu  (não é mais ≈ R₂ "no chute": vem da proporção real)
R_M = 1.0 / (f_c * P_loss_pu)        # 74.35 pu

X_σ = 1.0 / Ip_In
X₁ = 0.4 * X_σ                       # divisão NEMA Design B: 40% estator
X₂ = 0.6 * X_σ                       # 60% rotor
X_M = 1.0 / ((I_N / i_B) * sin(φ_N))
```

<span class="lang-pt">A diferença estrutural em relação ao Método 2 está exatamente aqui: como agora sabemos, pela tabela, qual fração das perdas totais é mecânica ($f_{mech}=f_{fw}+f_{stray}$), conseguimos calcular os alvos corretos de convergência — não contra o valor de placa puro, mas contra a potência e a eficiência **eletromagnéticas** (o que o circuito de fato representa, sem atrito, ventilação ou perdas suplementares).</span><span class="lang-en">The structural difference from Method 2 is exactly here: since we now know, from the table, what fraction of total losses is mechanical ($f_{mech}=f_{fw}+f_{stray}$), we can compute the correct convergence targets — not against the raw nameplate value, but against the **electromagnetic** power and efficiency (what the circuit actually represents, without friction, windage, or stray-load losses).</span>

```julia
# Potência eletromagnética que o circuito precisa entregar (sempre MAIOR que a de placa, porque
# uma fatia dela ainda vira atrito/ventilação/stray antes de chegar ao eixo):
P_mec_alvo_pu = 1.0 + f_mech * P_loss_pu          # 1.0136 pu (202.7 kW)

# Eficiência eletromagnética alvo (também maior que η_N, pelo mesmo motivo):
η_alvo = η_N + f_mech * (1.0 - η_N)               # 0.9629 (96.29%)

# Etapa 1: ajusta R₂ até a potência ELETROMAGNÉTICA bater P_mec_alvo_pu (±2%).

# Etapa 2: ajusta X_M, X₁, X₂ até |i₁| e fp baterem a placa (±1.5%). Diferente do Método 2,
#          R_M NÃO participa mais dessa etapa — uma análise de sensibilidade mostra que R_M tem
#          efeito quase nulo sobre fp nessa faixa de valores (é X_M quem realmente move os dois).
X_M *= 1.0 + (i₁ - i₁_alvo) * 0.30 + (cos_φ_N - fp) * 0.60

# Etapa 3b: ajusta R₁ e R_M em conjunto até a eficiência ELETROMAGNÉTICA bater η_alvo (±2%).
```

```
--- Comparação com Dados Nominais (alvo eletromagnético) ---
P_mec : 200.9 kW (Alvo: 202.7 kW) -> Erro: -0.90%
|i₁|  : 342.9 A  (Placa: 343 A)   -> Erro: -0.02%
η     : 96.34 %  (Alvo: 96.29 %) -> Erro: +0.05%
cos φ : 0.8777   (Placa: 0.89)    -> Erro: -1.39%
```

<span class="lang-pt">Todas as quatro grandezas ficam dentro da tolerância de 2%. Note que a coluna "alvo" de P_mec e η não é mais o valor de placa: é o valor de placa ajustado pela fração mecânica — o circuito nunca vai "ver" atrito, ventilação ou perdas suplementares, então cobrar dele o valor de placa puro é pedir uma coisa que ele estrutural­mente não modela. O fator de potência, que nos Métodos 1 e 2 sobra como o erro residual, aqui fecha em -1.39% porque $X_M$ passa a responder tanto à corrente quanto ao próprio fp — nos Métodos 1 e 2, essa alavanca não existe.</span><span class="lang-en">All four quantities land within the 2% tolerance. Note that the "target" column for P_mec and η is no longer the raw nameplate value: it's the nameplate value adjusted by the mechanical fraction — the circuit never "sees" friction, windage, or stray-load losses, so holding it to the raw nameplate figure is asking it to model something it structurally doesn't. Power factor, which is left as the residual error in Methods 1 and 2, closes to -1.39% here because $X_M$ now responds to both current and power factor directly — that lever doesn't exist in Methods 1 and 2.</span>

## <span class="lang-pt">Comparação</span><span class="lang-en">Comparison</span>

<span class="lang-pt">Parâmetros do circuito equivalente, em unidades do SI, para o motor de exemplo de 200 kW:</span><span class="lang-en">Equivalent-circuit parameters, in SI units, for the 200 kW example motor:</span>

| <span class="lang-pt">Parâmetro</span><span class="lang-en">Parameter</span> | <span class="lang-pt">Método 1</span><span class="lang-en">Method 1</span> | <span class="lang-pt">Método 2</span><span class="lang-en">Method 2</span> | <span class="lang-pt">Método 3</span><span class="lang-en">Method 3</span> |
|:--|--:|--:|--:|
| R₁ (Ω) | 0.0080 | 0.0080 | 0.0089 |
| R₂ (Ω) | 0.0080 | 0.0071 | 0.0071 |
| X₁ (mH) | 0.1845 | 0.2070 | 0.1521 |
| X₂ (mH) | 0.1845 | 0.2070 | 0.2282 |
| X_M (mH) | 7.0020 | 5.9109 | 6.0760 |
| R_M (Ω) | 32.00 | 28.42 | 59.48 |

<span class="lang-pt">Erro percentual contra os dados nominais (Método 3 contra o alvo eletromagnético, os demais contra a placa direto):</span><span class="lang-en">Percent error against rated data (Method 3 against the electromagnetic target, the others directly against the nameplate):</span>

| <span class="lang-pt">Grandeza</span><span class="lang-en">Quantity</span> | <span class="lang-pt">Método 1</span><span class="lang-en">Method 1</span> | <span class="lang-pt">Método 2</span><span class="lang-en">Method 2</span> | <span class="lang-pt">Método 3</span><span class="lang-en">Method 3</span> |
|:--|--:|--:|--:|
| P_mec | -9.66% | -1.77% | -0.90% |
| I₁ | -10.61% | 0.00% | -0.02% |
| η | +0.44% | +0.25% | +0.05% |
| cos φ | +0.15% | -2.46% | -1.39% |

## <span class="lang-pt">Discussão e conclusão</span><span class="lang-en">Discussion and conclusion</span>

<span class="lang-pt">Os três métodos resolvem o mesmo circuito equivalente, mas partem de premissas diferentes. O Método 1 é rápido e dá intuição física, mas exige a corrente a vazio ($I_0$) — um dado que raramente está disponível numa placa comum — e erra bastante em corrente e potência. O Método 2 dispensa esse dado e converge bem em corrente e potência, mas ajusta R₁/R_M contra a eficiência **eletromagnética** do circuito como se fosse igual à eficiência de placa, sem separar as perdas mecânicas — o que empurra o erro para o fator de potência, e não tem como corrigir, pois R_M sozinho tem efeito fraco sobre fp.</span><span class="lang-en">All three methods solve the same equivalent circuit, but start from different premises. Method 1 is fast and gives physical intuition, but requires the no-load current ($I_0$) — a value rarely available on an ordinary nameplate — and misses badly on current and power. Method 2 drops that requirement and converges well on current and power, but adjusts R₁/R_M against the circuit's **electromagnetic** efficiency as if it equaled the nameplate efficiency, without separating out mechanical losses — which pushes the error onto power factor, with no way to fix it, since R_M alone has weak leverage over fp.</span>

<span class="lang-pt">O Método 3 resolve os dois pontos. Primeiro, ao herdar uma proporção de perdas mecânicas de uma referência normativa (mesmo sem um ensaio de perdas dedicado), ele sabe que o circuito precisa mirar numa potência e numa eficiência **eletromagnéticas**, sempre um pouco acima do valor de placa — não o valor de placa puro. Segundo, ele troca a alavanca de fator de potência: em vez de forçar $R_M$ (que mal influencia fp nessa faixa — chegamos a testar $R_M \to \infty$ e o ganho foi quase nulo), ele deixa $X_M$ responder tanto à corrente quanto ao fp, já que $X_M$ tem forte influência sobre os dois ao mesmo tempo. O resultado é o único dos três métodos com todas as quatro grandezas dentro de ±2% — e, junto com não precisar de $I_0$, é por isso que ele roda por trás da calculadora.</span><span class="lang-en">Method 3 fixes both points. First, by inheriting a mechanical-loss proportion from a normative reference (even without a dedicated loss test), it knows the circuit must target an **electromagnetic** power and efficiency, always somewhat above the nameplate value — not the raw nameplate value. Second, it swaps the power-factor lever: instead of forcing $R_M$ (which barely moves fp in this range — we even tested $R_M \to \infty$ and the gain was nearly zero), it lets $X_M$ respond to both current and fp, since $X_M$ has strong leverage over both at once. The result is the only one of the three methods with all four quantities within ±2% — that, together with not needing $I_0$, is why it runs behind the calculator.</span>

<span class="lang-pt">Uma observação final: as bases usadas em pu diferem entre métodos (o Método 1 usa base de indutância via fluxo concatenado; os Métodos 2 e 3 usam base de potência no eixo), então os valores em pu não são diretamente comparáveis entre si — a comparação correta é sempre em unidades do SI (Ω, mH), como na tabela acima.</span><span class="lang-en">One final note: the per-unit bases differ between methods (Method 1 uses a flux-linkage-derived inductance base; Methods 2 and 3 use a shaft-power base), so the per-unit values are not directly comparable across methods — the correct comparison is always in SI units (Ω, mH), as in the table above.</span>

## <span class="lang-pt">Referências</span><span class="lang-en">References</span>

1. J. Pyrhönen, T. Jokinen, V. Hrabovcová, *Design of Rotating Electrical Machines* (also published as *Principal Laws and Methods in Electrical Machine Design*), Example 1.11.
2. A. T. de Almeida, F. J. T. E. Ferreira, J. A. C. Fong, "Standards for Efficiency of Electric Motors," *IEEE Industry Applications Magazine*, Jan/Feb 2011.
3. F. J. T. E. Ferreira, A. T. de Almeida, "Method for Estimating Motor Loading and Efficiency," *IEEE Transactions on Industry Applications*, 2006.
4. IEEE Std 112-2017, *Standard Test Procedure for Polyphase Induction Motors and Generators*.
5. NEMA MG 1-2016, *Motors and Generators*.
