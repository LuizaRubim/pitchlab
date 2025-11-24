---
title: Ideia inicial de projeto
---

# Pitchlab - Treinamento de Pitch em Realidade Virtual

## 1. Qual área e tema vocês irão desenvolver o projeto?

O projeto será desenvolvido na área de jogos de apresentação e gamificação, com foco em criar uma experiência imersiva em realidade virtual (VR) para treinar habilidades de pitch e comunicação.


## 2. Por que escolheram o tema/problema/oportunidade?

&emsp;Muitas pessoas, especialmente iniciantes, sentem dificuldade em estruturar e apresentar suas ideias de forma clara, confiante e objetiva. Um ambiente gamificado reduz a ansiedade, torna o processo mais dinâmico e cria um espaço seguro para errar, repetir, testar e evoluir. Escolhemos esse tema porque identificamos uma oportunidade clara de tornar o aprendizado sobre pitch mais envolvente e prático. 
&emsp;Além disso, a solução pode ajudar novos alunos do Inteli e iniciantes em apresentações a desenvolverem habilidades essenciais desde cedo, de uma maneira mais intuitiva do que métodos tradicionais de treino.
Uma boa apresentação envolve muitas configurações: tom de voz, ansiedade do momento, decorar a fala, pressão do público e mais. Para simular uma experiência dessa com tanta profundidade, enxergamos a realidade virtual como uma solução, utilizando-se de objetos 3D e técnicas de imersão que tragam uma experiência próxima à realidade, de forma gamificada e interativa. 

## 3. Estado da arte (apresentar um projeto/protótipo na mesma área do tema escolhido),indicando (2.1) que aspectos e características de cada projeto podem ser aproveitados no trabalho de vocês e (2.2) quais as fragilidades e pontos de melhora dos projetos analisados. É essencial que ao menos um integrante do grupo tenha de fato vivido a experiência e não apenas assistido um vídeo (ver Gravity VR, Anvio).

&emsp;Para compor o estado da arte do projeto, analisamos experiências existentes na área de jogos imersivos e gamificação aplicados à realização de atividades e entretenimento, com foco especial em ambientes de realidade virtual que simulam situações de performance. Entre os projetos estudados, destacam-se o Job Simulator, que é um jogo de realidade virtual para diversas plataformas como PlayStation e Meta Quest. Na descrição do próprio jogo, “os jogadores podem reviver os dias de glória do trabalho simulando as entradas de ser um chef gourmet, um funcionário de escritório, um funcionário de loja de conveniência e muito mais”. É possível receber tarefas e ser testado em situações de performance, de uma forma gamificada e interativa, onde os objetos 3D, áudios e ambientes influenciam na experiência dos usuários. Apesar do grupo não ter vivido a experiência, vimos vídeos de pessoas jogando o jogo para chegar a essa conclusão.

&emsp;Outro destaque analisado foi o Museas, um aplicativo de realidade virtual para o Apple Vision Pro, onde é possível aprender sobre obras de arte e pintores famosos como se estivesse em um museu virtual. O que mais chamou a atenção foi a mistura de uma interface gráfica intuitiva para navegar entre as obras de arte com a mão, assim como também áudios espaciais que realçam a experiência. Um integrante do grupo viveu essa experiência e compartilhou com o restante.

&emsp;Do Job Simulator, podemos aproveitar especialmente a interação intuitiva com objetos 3D, o uso de tarefas gamificadas e ambientes imersivos que influenciam o comportamento do usuário. Esses elementos mostram caminhos para tornar o treino de pitch mais dinâmico e engajador. Já no Museas, destacam-se a navegação natural por gestos e o uso de áudio espacial, que elevam a sensação de presença e realismo, recursos que podem enriquecer a experiência do nosso aplicativo ao permitir uma interação mais fluida, principalmente na hora de escolher opções de treino, adicionar apresentação e observar métricas.

&emsp;Em relação às fragilidades, observamos que o Job Simulator, por ter um estilo mais cartunesco, reduz o realismo necessário para situações de apresentação e carece de análises reais de desempenho, personalização e métricas objetivas. Já o Museas, embora tecnicamente avançado, oferece uma experiência mais contemplativa do que interativa, possuindo pouca gamificação e depende de hardware de alto custo, o que limita sua acessibilidade. 

## 4. Quais ações e verbos estarão envolvidos na experiência proposta? Listem desde verbos mais abstratos, como “descobrir”, “reconhecer”, “afirmar” até ações mais práticas e concretas, como “andar”, “pular”, “visualizar”, “transportar”. Das ações identificadas, indiquem entre uma e três mais importantes, definidoras da experiência.

### Lista de verbos (abstratos e concretos)
- Descobrir novas abordagens de apresentação
- Reconhecer erros, acertos e evolução
- Afirma sua postura e confiança diante da plateia
- Comunicar ideias de forma clara
- Apresentar o pitch com naturalidade
- Explicar conceitos do projeto
- Ouvir feedback do sistema ou instrutor virtual
- Andar pelo palco virtual
- Visualizar slides, anotações ou elementos de apoio
- Interagir com objetos, público virtual ou interface


### Três ações mais importantes (núcleo da experiência):
- Reconhecer feedback e melhorar (aprendizagem contínua)
- Comunicar (clareza e assertividade)
- Interagir (simulação do real)


## 5. Com base nos verbos selecionados, apresentar possíveis requisitos funcionais e não funcionais.

### Requisitos funcionais
O ambiente de realidade virtual deve permitir que o usuário realize seu pitch como se estivesse em um palco real.
A aplicação deve oferecer diferentes cenários, como auditório, sala de aula, banca avaliadora, etc.
O sistema deve permitir que o usuário simule movimentos naturais, incluindo andar, virar-se para a plateia e interagir com elementos do ambiente.
A solução deve oferecer feedback (ex.: tempo de fala, postura, ritmo, volume).
A aplicação deve incluir um modo de treino e um modo de apresentação final.


### Requisitos não funcionais
O carregamento do ambiente VR deve ser concluído em até 15 segundos após a seleção.
A interface deve ser intuitiva, permitindo que um novo usuário inicie a experiência completa em menos de 2 minutos.
Toda a aplicação deve ser totalmente compatível com o Meta Quest, utilizando seus recursos nativos de rastreamento de mãos, controladores e passthrough AR.
A experiência deve ser estável, oferecendo mínimo de latência para evitar desconforto.


## 6. Quais as funções e tarefas necessários para realizar o projeto (por exemplo, roteiro,modelagem de espaço, programação, testagem etc.)? Quais são os aspectos mais difíceis e os mais fáceis? Como o grupo pretende se dividir para endereçá-las?

### Principais tarefas
- Roteirização da experiência: definir fluxo, narrativa, momentos de desafio e feedback.
- Modelagem 3D do espaço: criação de palco, plateia, cenários alternativos, objetos de apoio.
- Design de interface em VR/AR: menus, HUD, indicadores, elementos interativos.
- Programação: lógica do jogo, movimentação, detecção de postura, coleta de métricas.
- Integração com Meta Quest: rastreamento de movimento, realidade aumentada, controles.
- Testagem com usuários reais: melhorias baseadas em conforto, usabilidade e clareza.
- Ajustes de performance: otimização gráfica e de latência.
- Implementar um feedback automático preciso (volume, postura, clareza da fala).
- Criar uma experiência que não gere desconforto ou náusea.
- Ajustar a movimentação para ser natural dentro das limitações físicas de cada usuário.
- Criar cenários básicos em 3D.
- Desenvolver menus simples e fluxos de navegação.
- Criar o roteiro da apresentação.
