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
  
  // Botão de reiniciar
  const restartButton = document.getElementById("restartButton");
  restartButton.onclick = () => {
    location.reload();
  };
}

function temporizador() {
  const tempo = document.getElementById("timer");
  let timer = 60;
  let timerSet;

  function contagem() {
    timerSet = setTimeout(contagem, 1000);
    
    if (timer > 0) {
      timer--;
      tempo.textContent = timer;
      
      // Alerta visual nos últimos 10 segundos
      if (timer <= 10) {
        tempo.style.color = "#ff6b6b";
        tempo.style.animation = "pulse 1s infinite";
      }
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
  
  if (playerHealthText) {
    playerHealthText.textContent = `${Math.max(0, jogador.vida)}%`;
  }
  
  if (enemyHealthText) {
    enemyHealthText.textContent = `${Math.max(0, inimigo.vida)}%`;
  }
}
