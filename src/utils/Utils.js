const TEMPO_PADRAO = 60;
const CAMINHO_TRILHA_TEMA = "assets/songs/temaSong.mp3";
const CHAVE_PREFERENCIA_MUSICA = "superSamurai.musicaHabilitada";

const obterPreferenciaMusica = () => {
  try {
    const valor = localStorage.getItem(CHAVE_PREFERENCIA_MUSICA);
    if (valor === null) return true;
    return valor !== "false";
  } catch (erro) {
    console.warn("Não foi possível acessar o localStorage para preferências de música:", erro);
    return true;
  }
};

const salvarPreferenciaMusica = (habilitada) => {
  try {
    localStorage.setItem(CHAVE_PREFERENCIA_MUSICA, habilitada ? "true" : "false");
  } catch (erro) {
    console.warn("Não foi possível salvar preferência de música:", erro);
  }
};

const TrilhaTema = (() => {
  const audio = new Audio(CAMINHO_TRILHA_TEMA);
  audio.loop = true;
  const volumePadrao = 0.4;
  audio.volume = volumePadrao;

  let habilitada = obterPreferenciaMusica();

  const tentarReproduzir = () => {
    if (!habilitada) {
      audio.pause();
      return;
    }

    audio.play();
  };

  const atualizarVolume = (valor) => {
    const volumeNormalizado = Math.max(0, Math.min(1, Number(valor)));
    if (Number.isFinite(volumeNormalizado)) {
      audio.volume = volumeNormalizado;
    }
  };

  if (!habilitada) {
    audio.pause();
  }

  return {
    tocar() {
      if (!habilitada) {
        audio.pause();
        return;
      }

      if (audio.paused) {
        audio.currentTime = 0;
      }
      tentarReproduzir();
    },
    pausar() {
      audio.pause();
    },
    parar() {
      audio.pause();
      audio.currentTime = 0;
    },
    habilitar() {
      habilitada = true;
      salvarPreferenciaMusica(true);
      atualizarVolume(volumePadrao);
      this.tocar();
    },
    desabilitar() {
      habilitada = false;
      salvarPreferenciaMusica(false);
      audio.pause();
      audio.currentTime = 0;
    },
    forcarTocar() {
      habilitada = true;
      salvarPreferenciaMusica(true);
      atualizarVolume(volumePadrao);
      audio.currentTime = 0;
      tentarReproduzir();
    },
    alternar() {
      if (habilitada) {
        this.desabilitar();
      } else {
        this.habilitar();
      }
    },
    estaHabilitada() {
      return habilitada;
    },
    definirVolume(valor) {
      atualizarVolume(valor);
    }
  };
})();

function colisaoJogador({ rec1, rec2 }) {
  return Entidade.verificarColisao({ rec1, rec2 });
}

function obterVencedor({ jogador, inimigo, timerSet }) {
  clearTimeout(timerSet);
  
  const resultScreen = document.getElementById("result");
  const resultText = resultScreen.querySelector(".result-text");
  
  if (jogador.vida === inimigo.vida) {
    resultText.textContent = "EMPATE!";
  } else if (jogador.vida > inimigo.vida) {
    resultText.textContent = "Samurai X VENCE!";
  } else {
    resultText.textContent = "Kenji VENCE!";
  }
  
  resultScreen.style.display = "flex";
  
  const restartButton = document.getElementById("restartButton");
  restartButton.onclick = () => {
    location.reload();
  };
}

function temporizador(duracao = TEMPO_PADRAO) {
  const tempo = document.getElementById("timer");
  let timer = Math.max(0, parseInt(duracao, 10) || 0);
  let timerSet;

  const atualizarDisplay = (valor) => {
    if (!tempo) return;

    tempo.textContent = valor;

    if (valor <= 10) {
      tempo.style.color = "#ff6b6b";
      tempo.style.animation = "pulse 1s infinite";
    } else {
      tempo.style.color = "#fff";
      tempo.style.animation = "none";
    }
  };

  atualizarDisplay(timer);

  function contagem() {
    timerSet = setTimeout(contagem, 1000);

    if (timer > 0) {
      timer--;
      atualizarDisplay(timer);
    }

    if (timer === 0) {
      obterVencedor({ jogador, inimigo, timerSet });
    }
  }

  contagem();
  return timerSet;
}

// Atualizar percentual de vida na UI
function atualizarUIVida(jogador, inimigo) {
  const playerHealthText = document.querySelector(".player-health-text");
  const enemyHealthText = document.querySelector(".enemy-health-text");

  const calcularPercentual = (entidade) => {
    if (!entidade) return 0;
    const vidaAtual = Math.max(0, entidade.vida);
    const vidaMaxima = entidade.vidaMaxima > 0 ? entidade.vidaMaxima : 100;
    const percentual = (vidaAtual / vidaMaxima) * 100;
    return Math.max(0, Math.min(100, Math.round(percentual)));
  };
  
  if (playerHealthText) {
    playerHealthText.textContent = `${calcularPercentual(jogador)}%`;
  }
  
  if (enemyHealthText) {
    enemyHealthText.textContent = `${calcularPercentual(inimigo)}%`;
  }
}
