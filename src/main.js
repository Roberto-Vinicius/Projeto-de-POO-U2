var canvas, c, gravidade;
var fundo, loja, jogador, inimigo;
var teclas, timerSet;
var animacaoId;

function inicializarJogo(nivelConfig) {
  if (animacaoId) {
    cancelAnimationFrame(animacaoId);
  }

  // Configura o canvas
  canvas = document.getElementById('gameCanvas');
  c = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 576;
  c.fillRect(0, 0, canvas.width, canvas.height);

  gravidade = nivelConfig.gravidade;

  // Cria entidades do jogo cenario, jogador e inimigo
  fundo = new Entidade({
    posicao: { x: 0, y: 0 },
    imagemSrc: nivelConfig.fundo
  });

  // Cria a loja, se houver
  if (nivelConfig.loja) {
    loja = new Entidade(nivelConfig.loja);
  } else {
    loja = null;
  }

  // Inicia o personagem e pega as configurações
  const configJogador = ConfigPersonagens[nivelConfig.jogador.personagem];
  jogador = new Jogador({
    posicao: nivelConfig.jogador.posicao,
    velocidade: { x: 0, y: 0 },
    ...configJogador
  });

  // pega o template do inimigo e cria o inimigo
  const configInimigo = ConfigPersonagens[nivelConfig.inimigo.personagem];
  
  // Verifica se é Boss ou Inimigo comum
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

  // Define a direção inicial dos personagens
  if (jogador && inimigo) {
    jogador.viradoParaDireita = jogador.posicao.x <= inimigo.posicao.x;
    inimigo.viradoParaDireita = inimigo.posicao.x >= jogador.posicao.x;
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

  document.getElementById('playerHealth').style.width = '100%';
  document.getElementById('enemyHealth').style.width = '100%';
  
  // Atualiza UI de vida
  if (typeof atualizarUIVida === "function") {
    atualizarUIVida(jogador, inimigo);
  }

  timerSet = temporizador(nivelConfig.tempo);

  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  animarPersonagens();
}

function animarPersonagens() {
  animacaoId = window.requestAnimationFrame(animarPersonagens);
  
  // Limpa o canvas a cada frame
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  fundo.atualizar();
  if (loja) {
    loja.atualizar();
  }
  
  jogador.atualizar();
  inimigo.atualizar();

  // Limita os personagens dentro dos limites do canvas
  Entidade.limitarNoBounds(jogador, canvas.width);
  Entidade.limitarNoBounds(inimigo, canvas.width);
  
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
    
    const percentualVidaInimigo = inimigo.vidaMaxima > 0 ? (inimigo.vida / inimigo.vidaMaxima) * 100 : 0;
    gsap.to("#enemyHealth", {
      width: `${Math.max(0, Math.min(100, percentualVidaInimigo))}%`
    });

    // Atualiza UI de vida
    if (typeof atualizarUIVida === "function") {
      atualizarUIVida(jogador, inimigo);
    }
  }

  if (jogador.estaAtacando && jogador.frameAtual === 4) {
    jogador.estaAtacando = false;
  }

  // Uso caixas retangulares para ver se os personagens se acertaram
  if (
    colisaoJogador({ rec1: inimigo, rec2: jogador }) &&
    inimigo.estaAtacando &&
    inimigo.frameAtual === 2
  ) {
    inimigo.estaAtacando = false;
    
    const dano = inimigo instanceof Boss ? 15 : 10;
    jogador.vida -= dano;
    jogador.receberDano();
    
    const percentualVidaJogador = jogador.vidaMaxima > 0 ? (jogador.vida / jogador.vidaMaxima) * 100 : 0;
    gsap.to("#playerHealth", {
      width: `${Math.max(0, Math.min(100, percentualVidaJogador))}%`
    });

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
    
    if (typeof TrilhaTema !== 'undefined') {
      TrilhaTema.tocar();
    }

    // Configura personagens disponíveis
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

    const telaAbertura = document.getElementById('telaAbertura');
    const gameScreen = document.getElementById('gameScreen');
    
    if (telaAbertura) telaAbertura.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'block';
  }
  
  // Passa os dados para incializar o jogo
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

  if (typeof menuManager === 'undefined') {
    const botaoIniciar = document.getElementById('botaoIniciar');

    if (botaoIniciar && !botaoIniciar.dataset.fallback) {
      botaoIniciar.dataset.fallback = 'true';
      botaoIniciar.addEventListener('click', () => {
        telaAbertura.style.display = 'none';
        gameContainer.style.display = 'block';
        iniciarJogoStandalone();
      });
    }
  }
}
