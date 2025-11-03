// Variáveis globais do jogo (acessíveis pelas classes)
var canvas, c, gravidade;
var fundo, loja, jogador, inimigo;
var teclas, timerSet;
var animacaoId;

// Inicializa o canvas (sempre disponível)
canvas = document.querySelector('canvas') || document.getElementById('gameCanvas');
if (canvas) {
  c = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 576;
} else {
  console.error('Canvas não encontrado! Verifique se há um elemento <canvas> no HTML.');
}

// Define gravidade padrão (pode ser sobrescrita por níveis)
gravidade = 0.7;

// Função principal para inicializar o jogo com configurações de nível
function inicializarJogo(nivelConfig) {
  if (animacaoId) {
    cancelAnimationFrame(animacaoId);
  }

  canvas = document.getElementById('gameCanvas');
  c = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 576;
  c.fillRect(0, 0, canvas.width, canvas.height);

  gravidade = nivelConfig.gravidade;

  fundo = new Entidade({
    posicao: { x: 0, y: 0 },
    imagemSrc: nivelConfig.fundo
  });

  // Carrega loja/decoração (se existir no nível)
  if (nivelConfig.loja) {
    loja = new Entidade(nivelConfig.loja);
  } else {
    loja = null;
  }

  // Carrega configuração do personagem do jogador
  const configJogador = ConfigPersonagens[nivelConfig.jogador.personagem];
  jogador = new Jogador({
    posicao: nivelConfig.jogador.posicao,
    velocidade: { x: 0, y: 0 },
    ...configJogador
  });

  // Carrega configuração do inimigo
  const configInimigo = ConfigPersonagens[nivelConfig.inimigo.personagem];
  
  // Verifica se é Boss ou Inimigo normal
  if (nivelConfig.inimigo.tipo === "Boss") {
    inimigo = new Boss({
      posicao: nivelConfig.inimigo.posicao,
      velocidade: { x: 0, y: 0 },
      ...configInimigo
    });
  } else {
    inimigo = new Inimigo({
      posicao: nivelConfig.inimigo.posicao,
      velocidade: { x: 0, y: 0 },
      ...configInimigo
    });
  }

  // Inicializa controles
  teclas = {
    ArrowLeft: { pressionada: false },
    ArrowRight: { pressionada: false },
    ArrowUp: { pressionada: false },
    ArrowDown: { pressionada: false },
    w: { pressionada: false },
    d: { pressionada: false },
    a: { pressionada: false },
    s: { pressionada: false }
  };

  // Reseta barras de vida na UI
  document.getElementById('playerHealth').style.width = '100%';
  document.getElementById('enemyHealth').style.width = '100%';
  
  // Atualiza textos de vida
  if (typeof atualizarUIVida === "function") {
    atualizarUIVida(jogador, inimigo);
  }

  // Atualiza label do nível
  const nivelLabel = document.getElementById('nivelAtual');
  if (nivelLabel) {
    nivelLabel.textContent = `NÍVEL ${GameManager.nivelAtual}: ${nivelConfig.nome}`;
  }

  // Inicia timer com tempo específico do nível
  timerSet = temporizador(nivelConfig.tempo);

  // Remove event listeners anteriores
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  
  // Adiciona novos event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Inicia loop de animação
  animarPersonagens();
}

// Função de animação principal
function animarPersonagens() {
  animacaoId = window.requestAnimationFrame(animarPersonagens);
  
  // Limpa canvas
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  // Desenha elementos na ordem correta
  fundo.atualizar();
  
  if (loja) {
    loja.atualizar();
  }
  
  jogador.atualizar();
  inimigo.atualizar();

  // Limita personagens dentro do canvas
  Entidade.limitarNoBounds(jogador, canvas.width);
  Entidade.limitarNoBounds(inimigo, canvas.width);
  
  // Reseta velocidade horizontal
  jogador.velocidade.x = 0;
  inimigo.velocidade.x = 0;

  // Controles do Jogador 1
  if (!jogador.movimentoBloqueado) {
    if (teclas.ArrowLeft.pressionada && jogador.ultimaTecla === "ArrowLeft") {
      jogador.velocidade.x = -4;
      jogador.trocarSprite("correr");
      jogador.viradoParaDireita = false;
    } else if (teclas.ArrowRight.pressionada && jogador.ultimaTecla === "ArrowRight") {
      jogador.velocidade.x = 4;
      jogador.trocarSprite("correr");
      jogador.viradoParaDireita = true;
    } else if (jogador.velocidade.y < 0) {
      jogador.trocarSprite("pular");
    } else if (jogador.velocidade.y > 0) {
      jogador.trocarSprite("cair");
    } else {
      jogador.trocarSprite("parado");
    }
  }

  // Controles do Jogador 2 (Inimigo)
  if (!inimigo.movimentoBloqueado) {
    if (teclas.a.pressionada && inimigo.ultimaTecla === "a") {
      inimigo.velocidade.x = -4;
      inimigo.trocarSprite("correr");
      inimigo.viradoParaDireita = true;
    } else if (teclas.d.pressionada && inimigo.ultimaTecla === "d") {
      inimigo.velocidade.x = 4;
      inimigo.trocarSprite("correr");
      inimigo.viradoParaDireita = false;
    } else if (inimigo.velocidade.y < 0) {
      inimigo.trocarSprite("pular");
    } else if (inimigo.velocidade.y > 0) {
      inimigo.trocarSprite("cair");
    } else {
      inimigo.trocarSprite("parado");
    }
  }

  // Detecção de colisão - Jogador ataca Inimigo
  if (
    colisaoJogador({ rec1: jogador, rec2: inimigo }) &&
    jogador.estaAtacando &&
    jogador.frameAtual === 4
  ) {
    jogador.estaAtacando = false;
    
    // Dano especial se for Boss
    const dano = inimigo instanceof Boss ? 5 : 10;
    inimigo.vida -= dano;
    inimigo.receberDano();
    
    gsap.to("#enemyHealth", {
      width: inimigo.vida + "%"
    });

    // Atualiza UI de vida
    if (typeof atualizarUIVida === "function") {
      atualizarUIVida(jogador, inimigo);
    }
  }

  if (jogador.estaAtacando && jogador.frameAtual === 4) {
    jogador.estaAtacando = false;
  }

  // Detecção de colisão - Inimigo ataca Jogador
  if (
    colisaoJogador({ rec1: inimigo, rec2: jogador }) &&
    inimigo.estaAtacando &&
    inimigo.frameAtual === 2
  ) {
    inimigo.estaAtacando = false;
    
    // Dano aumentado se for Boss
    const dano = inimigo instanceof Boss ? 15 : 10;
    jogador.vida -= dano;
    jogador.receberDano();
    
    gsap.to("#playerHealth", {
      width: jogador.vida + "%"
    });

    // Atualiza UI de vida
    if (typeof atualizarUIVida === "function") {
      atualizarUIVida(jogador, inimigo);
    }
  }

  if (inimigo.estaAtacando && inimigo.frameAtual === 2) {
    inimigo.estaAtacando = false;
  }

  if (inimigo.vida <= 0 || jogador.vida <= 0) {
    obterVencedor({ jogador, inimigo, timerSet });
  }
}

function handleKeyDown(event) {
  const tecla = event.key;

  // Controles Jogador 1
  if (!jogador.movimentoBloqueado) {
    switch (tecla) {
      case "ArrowRight":
        teclas.ArrowRight.pressionada = true;
        jogador.ultimaTecla = "ArrowRight";
        break;
      case "ArrowLeft":
        teclas.ArrowLeft.pressionada = true;
        jogador.ultimaTecla = "ArrowLeft";
        break;
      case "ArrowUp":
        if (jogador.velocidade.y === 0) {
          jogador.velocidade.y = -15;
        }
        break;
      case "ArrowDown":
        // Faz jogador olhar para o inimigo ao atacar
        // if (jogador.posicao.x < inimigo.posicao.x) {
        //   jogador.viradoParaDireita = true;
        // } else {
        //   jogador.viradoParaDireita = false;
        // }
        jogador.atacar();
        break;
    }
  }

  // Controles Jogador 2 (Inimigo)
  if (!inimigo.movimentoBloqueado) {
    switch (tecla) {
      case "d":
        teclas.d.pressionada = true;
        inimigo.ultimaTecla = "d";
        break;
      case "a":
        teclas.a.pressionada = true;
        inimigo.ultimaTecla = "a";
        break;
      case "w":
        if (inimigo.velocidade.y === 0) {
          inimigo.velocidade.y = -15;
        }
        break;
      case "s":
        // if (inimigo.posicao.x < jogador.posicao.x) {
        //   inimigo.viradoParaDireita = true;
        // } else {
        //   inimigo.viradoParaDireita = false;
        // }
        inimigo.atacar();
        break;
    }
  }
}

function handleKeyUp(event) {
  const tecla = event.key;

  switch (tecla) {
    case "ArrowRight":
      teclas.ArrowRight.pressionada = false;
      break;
    case "ArrowLeft":
      teclas.ArrowLeft.pressionada = false;
      break;
    case "d":
      teclas.d.pressionada = false;
      break;
    case "a":
      teclas.a.pressionada = false;
      break;
  }
}

function iniciarJogoStandalone() {
  if (typeof GameManager === 'undefined') {
    console.log("Modo Standalone - Configurando jogo direto...");
    
    window.ConfigPersonagens = {
      samuraiX: {
        imagemSrc: "../assets/characters/samuraiX/Idle.png",
        framesMax: 8,
        escala: 2,
        deslocamento: { x: 165, y: 0 },
        sprites: {
          parado: { imagemSrc: "../assets/characters/samuraiX/Idle.png", framesMax: 8 },
          correr: { imagemSrc: "../assets/characters/samuraiX/Run.png", framesMax: 8 },
          pular: { imagemSrc: "../assets/characters/samuraiX/Jump.png", framesMax: 2 },
          cair: { imagemSrc: "../assets/characters/samuraiX/Fall.png", framesMax: 2 },
          ataque1: { imagemSrc: "../assets/characters/samuraiX/Attack1.png", framesMax: 6 },
          receberGolpe: { imagemSrc: "../assets/characters/samuraiX/Take Hit.png", framesMax: 4 },
          morte: { imagemSrc: "../assets/characters/samuraiX/Death.png", framesMax: 6 }
        },
        caixaAtaque: { deslocamento: { x: 60, y: 160 }, largura: 120, altura: 40 }
      },
      kenji: {
        imagemSrc: "../assets/characters/inimigos/kenji/Idle.png",
        framesMax: 4,
        escala: 2,
        deslocamento: { x: 160, y: 14 },
        sprites: {
          parado: { imagemSrc: "../assets/characters/inimigos/kenji/Idle.png", framesMax: 4 },
          correr: { imagemSrc: "../assets/characters/inimigos/kenji/Run.png", framesMax: 8 },
          pular: { imagemSrc: "../assets/characters/inimigos/kenji/Jump.png", framesMax: 2 },
          cair: { imagemSrc: "../assets/characters/inimigos/kenji/Fall.png", framesMax: 2 },
          ataque1: { imagemSrc: "../assets/characters/inimigos/kenji/Attack1.png", framesMax: 4 },
          receberGolpe: { imagemSrc: "../assets/characters/inimigos/kenji/Take hit.png", framesMax: 3 },
          morte: { imagemSrc: "../assets/characters/inimigos/kenji/Death.png", framesMax: 7 }
        },
        caixaAtaque: { deslocamento: { x: -100, y: 160 }, largura: 120, altura: 40 }
      }
    };

    // Esconde elementos de menu se existirem
    const menuInicial = document.getElementById('menuInicial');
    const gameScreen = document.getElementById('gameScreen');
    
    if (menuInicial) menuInicial.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'block';
  }
  
  const nivelPadrao = {
    nome: "Teste",
    fundo: "../assets/background/cenario1.png",
    loja: null,
    jogador: {
      posicao: { x: 0, y: 0 },
      personagem: "samuraiX"
    },
    inimigo: {
      posicao: { x: 950, y: 0 },
      personagem: "kenji",
      tipo: "Inimigo"
    },
    tempo: 60,
    gravidade: 0.7
  };
  
  inicializarJogo(nivelPadrao);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

function inicializar() {
  const menuInicial = document.getElementById('menuInicial');
  const gameScreen = document.getElementById('gameScreen');
  
  if (!menuInicial || typeof GameManager === 'undefined') {
    console.log('Iniciando em modo standalone...');
    
    if (gameScreen) {
      gameScreen.style.display = 'block';
    }
    
    iniciarJogoStandalone();
  } else {
    console.log('Sistema de menu detectado. Aguardando ação do usuário...');
  }
}
