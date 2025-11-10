class MenuManager {
  constructor() {
    this.telaAbertura = null;
    this.gameScreen = null;
    this.telaGameOver = null;
    this.telaResultado = null;
    this.tempoInicio = 0;
    this.danoTotal = 0;
  }

  // REQUISITO: Inicializa o sistema de menu
  inicializar() {
    this.telaAbertura = document.getElementById('telaAbertura');
    this.gameScreen = document.getElementById('gameScreen');
    this.telaGameOver = document.getElementById('telaGameOver');
    this.telaResultado = document.getElementById('result');

    this.configurarBotoes();
    this.configurarTeclado();
    this.inicializarAudioTema();

    console.log('MenuManager inicializado com sucesso!');
  }

  // REQUISITO: Configura todos os botões do menu
  configurarBotoes() {
    const botaoIniciar = document.getElementById('botaoIniciar');
    if (botaoIniciar) {
      botaoIniciar.addEventListener('click', () => this.iniciarJogo());
    }

    const botaoOpcoes = document.getElementById('botaoOpcoes');
    if (botaoOpcoes) {
      botaoOpcoes.addEventListener('click', () => this.abrirOpcoes());
    }

    const botaoCreditos = document.getElementById('botaoCreditos');
    if (botaoCreditos) {
      botaoCreditos.addEventListener('click', () => this.mostrarCreditos());
    }

    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
      restartButton.addEventListener('click', () => this.reiniciarJogo());
    }

    const voltarMenuButton = document.getElementById('voltarMenuButton');
    const voltarMenuGameOver = document.getElementById('voltarMenuGameOver');
    
    if (voltarMenuButton) {
      voltarMenuButton.addEventListener('click', () => this.voltarMenu());
    }
    
    if (voltarMenuGameOver) {
      voltarMenuGameOver.addEventListener('click', () => this.voltarMenu());
    }

    const tentarNovamenteButton = document.getElementById('tentarNovamenteButton');
    if (tentarNovamenteButton) {
      tentarNovamenteButton.addEventListener('click', () => this.reiniciarJogo());
    }
  }

  inicializarAudioTema() {
    if (typeof TrilhaTema === 'undefined') {
      return;
    }

    const tentarTocar = () => {
      TrilhaTema.tocar();
    };

    tentarTocar();
    document.addEventListener('click', tentarTocar, { once: true });
    document.addEventListener('keydown', tentarTocar, { once: true });
  }

  // REQUISITO: Configura controles de teclado
  configurarTeclado() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.telaAbertura && 
          this.telaAbertura.style.display !== 'none') {
        this.iniciarJogo();
      }

      // ESC volta ao menu durante o jogo
      if (e.key === 'Escape' && this.gameScreen && 
          this.gameScreen.style.display !== 'none') {
        this.pausarJogo();
      }
    });
  }

  // REQUISITO: Função para iniciar o jogo
  iniciarJogo() {
    console.log('Iniciando jogo...');
    
    if (typeof TrilhaTema !== 'undefined') {
      if (typeof TrilhaTema.forcarTocar === 'function') {
        TrilhaTema.forcarTocar();
      } else {
        TrilhaTema.tocar();
      }
    }

    if (this.telaAbertura) {
      this.telaAbertura.style.display = 'none';
    }

    if (this.gameScreen) {
      this.gameScreen.style.display = 'block';
    }

    this.tempoInicio = Date.now();
    this.danoTotal = 0;

    if (typeof iniciarJogoStandalone === 'function') {
      iniciarJogoStandalone();
    } else {
      console.error('Função iniciarJogoStandalone não encontrada!');
    }
  }

  // REQUISITO: Função para voltar ao menu principal
  voltarMenu() {
    console.log('Voltando ao menu...');

    if (typeof animacaoId !== 'undefined' && animacaoId) {
      cancelAnimationFrame(animacaoId);
    }

    if (typeof timerSet !== 'undefined' && timerSet) {
      clearTimeout(timerSet);
    }

    if (this.gameScreen) {
      this.gameScreen.style.display = 'none';
    }
    
    if (this.telaResultado) {
      this.telaResultado.style.display = 'none';
    }
    
    if (this.telaGameOver) {
      this.telaGameOver.style.display = 'none';
    }

    if (this.telaAbertura) {
      this.telaAbertura.style.display = 'flex';
    }

    this.limparCanvas();
  }

  reiniciarJogo() {
    console.log('Reiniciando jogo...');
    
    if (this.telaResultado) {
      this.telaResultado.style.display = 'none';
    }
    
    if (this.telaGameOver) {
      this.telaGameOver.style.display = 'none';
    }

    location.reload();
  }

  pausarJogo() {
    if (confirm('Deseja pausar o jogo e voltar ao menu?')) {
      this.voltarMenu();
    }
  }

  // REQUISITO: Mostra tela de Game Over
  mostrarGameOver(jogador, inimigo) {
    console.log('Mostrando Game Over...');

    if (!this.telaGameOver) {
      console.error('Tela de Game Over não encontrada!');
      return;
    }

    const tempoSobrevivido = Math.floor((Date.now() - this.tempoInicio) / 1000);
    const vidaMaximaInimigo = inimigo?.vidaMaxima > 0 ? inimigo.vidaMaxima : 100;
    const danoCausado = Math.max(0, Math.round(vidaMaximaInimigo - inimigo.vida));

    const mensagemGameOver = document.getElementById('mensagemGameOver');
    const tempoSobrevividoSpan = document.getElementById('tempoSobrevivido');
    const danoCausadoSpan = document.getElementById('danoCausado');

    if (mensagemGameOver) {
      if (jogador.vida <= 0) {
        mensagemGameOver.textContent = 'Você foi derrotado!';
      } else {
        mensagemGameOver.textContent = 'O tempo acabou!';
      }
    }

    if (tempoSobrevividoSpan) {
      tempoSobrevividoSpan.textContent = `${tempoSobrevivido}s`;
    }

    if (danoCausadoSpan) {
      danoCausadoSpan.textContent = danoCausado;
    }

    this.telaGameOver.style.display = 'flex';
  }

  abrirOpcoes() {
    window.location.href = 'src/pages/opcoes.htm';
  }

  mostrarCreditos() {
    window.location.href = 'src/pages/creditos.html';
  }

  limparCanvas() {
    if (typeof canvas !== 'undefined' && typeof c !== 'undefined') {
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = '#000';
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  registrarDano(quantidade) {
    this.danoTotal += quantidade;
  }
}

const menuManager = new MenuManager();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    menuManager.inicializar();
  });
} else {
  menuManager.inicializar();
}
