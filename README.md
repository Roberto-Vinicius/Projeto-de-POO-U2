# Jogo de Arena 2D

Projeto em JavaScript puro com canvas para um combate rápido entre um samurai, inimigos e um chefe.

## Como executar

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

## Funcionalidades principais

- Combate 2D responsivo com sprites animadas para todas as ações dos lutadores.
- Sistema de classes orientado a objetos (`Entidade`, `Jogador`, `Inimigo`, `Boss`) para reaproveitar lógica e animações.
- Barras de vida dinâmicas e indicadores numéricos atualizados em tempo real.
- Timer de rodada com alerta visual nos últimos segundos e tela de resultado com reinício rápido.
- Suporte a partidas 1v1 no mesmo teclado e configuração automática de níveis stand-alone.

## Como jogar

### Objetivo

Reduza a barra de vida do oponente a 0 antes que o tempo acabe. Se o cronômetro chegar a zero, vence quem tiver mais vida restante.

### Comandos do Jogador 1 (Samurai X)

- `←` / `→`: mover para a esquerda ou direita.
- `↑`: pular (só funciona se estiver no chão).
- `↓`: atacar. Cada ataque consome 20 de stamina e causa 10 de dano.

### Comandos do Jogador 2 (Kenji/Boss)

- `A` / `D`: mover para a esquerda ou direita.
- `W`: pular (só funciona se estiver no chão).
- `S`: atacar. Os ataques de inimigos comuns causam 10 de dano e chefes causam 15.

### Dicas rápidas

- A stamina do Samurai X se regenera quando não está atacando; planeje seus golpes para não ficar vulnerável.
- Fique atento à barra de vida e ao cronômetro — use o tempo a seu favor.
- Na partida contra o Boss, o adversário possui 200 de vida e recebe menos dano por golpe.

## Estrutura do projeto

- `index.html`: carrega o canvas, HUD e scripts do jogo.
- `style.css`: estilos do HUD, barras de vida e layout.
- `src/main.js`: loop principal, controle de input e carregamento de níveis.
- `src/classes/`: contém `Entidade`, `Jogador`, `Inimigo` e `Boss`.
- `src/utils/Utils.js`: temporizador, detecção de colisão, atualização da UI e lógica de vitória.
- `assets/`: sprites dos personagens, cenários e elementos decorativos.

## Próximos passos sugeridos

- Acrescentar sons de impacto, trilha sonora e feedbacks visuais adicionais.
- Implementar novos golpes, defesa e variações de combo.
- Criar sistema de fases com múltiplos cenários e chefes encadeados.
