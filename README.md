# Super Samurai 🥋⚔️

Jogo de luta 2D desenvolvido em JavaScript puro com canvas HTML5, utilizando Programação Orientada a Objetos. Projeto final da disciplina de **Programação Orientada a Objetos** da **UFRN**.

**Desenvolvedor:** Roberto Vinicius Dantas Batista

## 📋 Sobre o Projeto

Super Samurai é um jogo de combate 2D que apresenta:
- Sistema de classes orientado a objetos (`Entidade`, `Jogador`, `Inimigo`, `Boss`)
- Sprites animadas para todas as ações dos lutadores
- Barras de vida dinâmicas com animações suaves
- Sistema de menu completo com navegação entre telas
- Trilha sonora em loop com controle de ativação/desativação
- Persistência de preferências do jogador
- Timer de rodada com alertas visuais
- Suporte para partidas 1v1 locais (mesmo teclado)

## 🚀 Como executar

1. Faça o download ou clone o repositório para a sua máquina.
2. Abra a pasta do projeto no VS Code (ou editor de sua preferência).
3. Sirva os arquivos através de um servidor local para evitar bloqueios de CORS ao carregar sprites.

### Opção 1 — Extensão Live Server (VS Code)

1. Instale a extensão **Live Server**.
2. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
3. O jogo abrirá automaticamente no navegador padrão.

### Opção 2 — Servidor estático via Node.js

1. Certifique-se de ter Node.js instalado.
2. Dentro da pasta do projeto, execute:

```bash
npx http-server
```

3. Acesse o endereço informado no terminal (por padrão `http://localhost:8080`).

### Opção 3 — Servidor com Python 3

```bash
python3 -m http.server 5500
```

Em seguida, abra `http://localhost:5500` no navegador.

## ✨ Funcionalidades Implementadas

### Sistema de Jogo
- ⚔️ Combate 2D fluido com sprites animadas para cada ação
- 🎯 Detecção de colisão precisa com hitboxes personalizadas
- 💚 Barras de vida dinâmicas com indicadores percentuais
- ⏱️ Timer de rodada com alerta visual nos últimos 10 segundos
- 🏆 Telas de resultado e Game Over com estatísticas
- 🔄 Sistema de reinício rápido e retorno ao menu

### Menu e Navegação
- 🎮 Menu principal com botões estilizados
- ⚙️ Página de opções com controle de música e exibição de comandos
- 🎬 Página de créditos dedicada
- 🔊 Trilha sonora em loop com persistência de preferências
- 💾 LocalStorage para salvar configurações do jogador

### Arquitetura POO
- 📦 Hierarquia de classes (`Entidade` → `Jogador`/`Inimigo` → `Boss`)
- 🔒 Atributos privados com encapsulamento
- 🎨 Métodos getter/setter para controle de estado
- 🛠️ Métodos estáticos para utilitários compartilhados
- ♻️ Reutilização de código através de herança

## 🎮 Como jogar

### Objetivo

Reduza a barra de vida do oponente a 0 antes que o tempo acabe. Se o cronômetro chegar a zero, vence quem tiver mais vida restante.

### Controles do Jogador 1 (Samurai)

- **Setas `←` / `→`**: mover para esquerda/direita
- **Seta `↑`**: pular (apenas no chão)
- **Seta `↓`**: atacar

### Controles do Jogador 2 (Kenji)

- **Teclas `A` / `D`**: mover para esquerda/direita
- **Tecla `W`**: pular (apenas no chão)
- **Tecla `S`**: atacar

### 💡 Dicas

- Observe a orientação dos personagens — os ataques são direcionais
- Mantenha-se atento às barras de vida e ao cronômetro
- Use saltos estratégicos para esquivar-se de ataques
- Contra o Boss, os ataques causam menos dano e ele tem mais vida

## 📁 Estrutura do projeto

```
jogo/
├── index.html                 # Página principal com canvas e HUD
├── style.css                  # Estilos do menu, HUD e elementos visuais
├── README.md                  # Este arquivo
├── assets/
│   ├── background/           # Cenários e imagens de fundo
│   ├── characters/           # Sprites dos personagens
│   │   ├── samuraiX/        # Animações do protagonista
│   │   └── inimigos/        # Animações dos adversários
│   └── songs/               # Trilha sonora
└── src/
    ├── main.js              # Loop principal e controle de input
    ├── classes/
    │   ├── Entidade.js      # Classe base com atributos e métodos compartilhados
    │   ├── Jogador.js       # Classe especializada para o jogador
    │   ├── Inimigo.js       # Classe especializada para inimigos
    │   └── Boss.js          # Classe especializada para chefes
    ├── pages/
    │   ├── opcoes.htm       # Página de configurações
    │   └── creditos.html    # Página de créditos
    └── utils/
        ├── Menu.js          # Gerenciador de navegação entre telas
        └── Utils.js         # Funções auxiliares (timer, colisão, UI, música)
```

## 🎯 Requisitos de POO Implementados

- ✅ **Herança**: Hierarquia `Entidade` → `Jogador`/`Inimigo` → `Boss`
- ✅ **Encapsulamento**: Atributos privados (`#vida`, `#velocidade`, `#estaAtacando`)
- ✅ **Getters/Setters**: Controle de acesso com validação
- ✅ **Métodos Estáticos**: Utilitários compartilhados (`verificarColisao`, `limitarNoBounds`)
- ✅ **Polimorfismo**: Sobrescrita de métodos nas subclasses
- ✅ **Abstração**: Separação de responsabilidades em módulos

## 🔮 Atualizações Futuras

Este projeto continuará sendo desenvolvido com as seguintes funcionalidades planejadas:

### Sistema de Níveis
- 🗺️ Múltiplos estágios com progressão de dificuldade
- 🎭 Novos personagens jogáveis e adversários
- 🏞️ Cenários variados com elementos interativos
- 📈 Sistema de pontuação e ranking

### Mecânicas de Combate
- 🛡️ Sistema de defesa e bloqueio
- ⚡ Golpes especiais e combos
- 💥 Efeitos visuais aprimorados (partículas, shake, slow-motion)
- 🎯 Power-ups e itens coletáveis

### Aprimoramentos Técnicos
- 🔊 Efeitos sonoros para ações (golpes, pulos, danos)
- 💾 Sistema de save/load de progresso
- 🎨 Melhorias visuais e animações adicionais
- 📱 Responsividade para diferentes resoluções
- 🌐 Modo multiplayer online (WebSocket)

### Interface e UX
- 📊 Tutorial interativo para novos jogadores
- 🏆 Sistema de conquistas
- ⚙️ Mais opções de customização (dificuldade, volume individual)
- 🎨 Skins alternativas para personagens

**Status**: Em desenvolvimento ativo 🚧

## 🛠️ Tecnologias Utilizadas

- **HTML5 Canvas** — Renderização 2D
- **JavaScript ES6+** — Lógica do jogo e POO
- **CSS3** — Estilização e animações
- **GSAP** — Animações suaves das barras de vida
- **LocalStorage API** — Persistência de dados

## 📝 Notas de Desenvolvimento

### Conceitos de POO Aplicados

1. **Classes e Objetos**: Toda entidade do jogo é uma instância de classe
2. **Herança**: Reaproveitamento de código através da cadeia de herança
3. **Encapsulamento**: Proteção de atributos críticos com modificadores privados
4. **Polimorfismo**: Métodos sobrescritos para comportamentos específicos
5. **Abstração**: Separação clara entre lógica de jogo, renderização e UI

### Boas Práticas Implementadas

- 📐 Separação de responsabilidades (MVC-like)
- 🔄 Ciclo de vida claro dos objetos
- 🎨 Código modular e reutilizável
- 📖 Nomenclatura descritiva e comentários explicativos
- ⚡ Otimização de performance (requestAnimationFrame)

## 👨‍💻 Autor

**Roberto Vinicius Dantas Batista**
- Curso: [Seu curso]
- Instituição: Universidade Federal do Rio Grande do Norte (UFRN)
- Disciplina: Programação Orientada a Objetos

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso de Programação Orientada a Objetos.

---

**Super Samurai** © 2025 — Desenvolvido com ⚔️ e ☕
