// REQUISITO: Sistema de Menu e Navegação entre Telas
// Arquivo: src/utils/Menu.js

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
    // Captura elementos do DOM
    this.telaAbertura = document.getElementById('telaAbertura');
    this.gameScreen = document.getElementById('gameScreen');
    this.telaGameOver = document.getElementById('telaGameOver');
    this.telaResultado = document.getElementById('result');

    // Configura event listeners
    this.configurarBotoes();
    this.configurarTeclado();

    console.log('MenuManager inicializado com sucesso!');
  }

  // REQUISITO: Configura todos os botões do menu
  configurarBotoes() {
    // Botão Iniciar Jogo
    const botaoIniciar = document.getElementById('botaoIniciar');
    if (botaoIniciar) {
      botaoIniciar.addEventListener('click', () => this.iniciarJogo());
    }

    // Botão Opções
    const botaoOpcoes = document.getElementById('botaoOpcoes');
    if (botaoOpcoes) {
      botaoOpcoes.addEventListener('click', () => this.abrirOpcoes());
    }

    // Botão Créditos
    const botaoCreditos = document.getElementById('botaoCreditos');
    if (botaoCreditos) {
      botaoCreditos.addEventListener('click', () => this.mostrarCreditos());
    }

    // Botão Jogar Novamente
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
      restartButton.addEventListener('click', () => this.reiniciarJogo());
    }

    // Botões Voltar ao Menu
    const voltarMenuButton = document.getElementById('voltarMenuButton');
    const voltarMenuGameOver = document.getElementById('voltarMenuGameOver');
    
    if (voltarMenuButton) {
      voltarMenuButton.addEventListener('click', () => this.voltarMenu());
    }
    
    if (voltarMenuGameOver) {
      voltarMenuGameOver.addEventListener('click', () => this.voltarMenu());
    }

    // Botão Tentar Novamente (Game Over)
    const tentarNovamenteButton = document.getElementById('tentarNovamenteButton');
    if (tentarNovamenteButton) {
      tentarNovamenteButton.addEventListener('click', () => this.reiniciarJogo());
    }
  }

  // REQUISITO: Configura controles de teclado
  configurarTeclado() {
    document.addEventListener('keydown', (e) => {
      // ENTER inicia o jogo na tela de abertura
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
    
    // Esconde tela de abertura
    if (this.telaAbertura) {
      this.telaAbertura.style.display = 'none';
    }

    // Mostra tela do jogo
    if (this.gameScreen) {
      this.gameScreen.style.display = 'block';
    }

    // Reseta estatísticas
    this.tempoInicio = Date.now();
    this.danoTotal = 0;

    // Chama função de inicialização do jogo principal
    if (typeof iniciarJogoStandalone === 'function') {
      iniciarJogoStandalone();
    } else {
      console.error('Função iniciarJogoStandalone não encontrada!');
    }
  }

  // REQUISITO: Função para voltar ao menu principal
  voltarMenu() {
    console.log('Voltando ao menu...');

    // Para a animação do jogo
    if (typeof animacaoId !== 'undefined' && animacaoId) {
      cancelAnimationFrame(animacaoId);
    }

    // Para o timer
    if (typeof timerSet !== 'undefined' && timerSet) {
      clearTimeout(timerSet);
    }

    // Esconde todas as telas de jogo
    if (this.gameScreen) {
      this.gameScreen.style.display = 'none';
    }
    
    if (this.telaResultado) {
      this.telaResultado.style.display = 'none';
    }
    
    if (this.telaGameOver) {
      this.telaGameOver.style.display = 'none';
    }

    // Mostra tela de abertura
    if (this.telaAbertura) {
      this.telaAbertura.style.display = 'flex';
    }

    // Reseta o canvas
    this.limparCanvas();
  }

  // REQUISITO: Reinicia o jogo completamente
  reiniciarJogo() {
    console.log('Reiniciando jogo...');
    
    // Esconde telas de resultado
    if (this.telaResultado) {
      this.telaResultado.style.display = 'none';
    }
    
    if (this.telaGameOver) {
      this.telaGameOver.style.display = 'none';
    }

    // Recarrega a página para garantir reset completo
    location.reload();
  }

  // REQUISITO: Pausa o jogo
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

    // Calcula estatísticas
    const tempoSobrevivido = Math.floor((Date.now() - this.tempoInicio) / 1000);
    const danoCausado = 100 - inimigo.vida;

    // Atualiza conteúdo
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

    // Mostra tela
    this.telaGameOver.style.display = 'flex';
  }

  // Abre menu de opções
  abrirOpcoes() {
    alert('Menu de Opções\n\nControles:\n- Jogador 1: Setas (↑-↓-←-→)\n- Jogador 2: W-A-S-D\n\nConfigurações em desenvolvimento!');
  }

  // Mostra créditos
  mostrarCreditos() {
    alert('SUPER SAMURAI\n\nDesenvolvido por: Roberto Vinicius\nProjeto: POO em JavaScript\nAno: 2025\n\nObrigado por jogar!');
  }

  // Limpa o canvas
  limparCanvas() {
    if (typeof canvas !== 'undefined' && typeof c !== 'undefined') {
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = '#000';
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Registra dano para estatísticas
  registrarDano(quantidade) {
    this.danoTotal += quantidade;
  }
}

// Instância global do MenuManager
const menuManager = new MenuManager();

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    menuManager.inicializar();
  });
} else {
  menuManager.inicializar();
}
