// REQUISITO: Herança - Classe 1 que herda
class Jogador extends Entidade {
  // REQUISITO: 3 atributos private em classes distintas (Classe 2)
  #stamina;

  constructor({
    posicao,
    velocidade,
    imagemSrc,
    escala = 1,
    framesMax = 1,
    deslocamento = { x: 0, y: 0 },
    sprites,
    caixaAtaque = { deslocamento: {}, largura: undefined, altura: undefined }
  }) {
    // REQUISITO: Uso do super() - Chamada 1
    super({ posicao, imagemSrc, escala, framesMax, deslocamento });
    
    // REQUISITO: Novo atributo da classe filha Jogador
    this.#stamina = 100;
    
    this.velocidade = velocidade;
    this.ultimaTecla = null;
    this.sprites = sprites;
    this.morto = false;
    this.movimentoBloqueado = false;
    this.numeroJogador = 1;

    for (const sprite in this.sprites) {
      sprites[sprite].imagem = new Image();
      sprites[sprite].imagem.src = sprites[sprite].imagemSrc;
    }

    this.caixaAtaque = {
      posicao: {
        x: this.posicao.x,
        y: this.posicao.y
      },
      deslocamento: caixaAtaque.deslocamento,
      largura: caixaAtaque.largura,
      altura: caixaAtaque.altura
    };

    this.framesParaSegurar = 4;
  }

  get stamina() {
    return this.#stamina;
  }

  set stamina(valor) {
    this.#stamina = Math.max(0, Math.min(100, valor));
  }

  atualizar() {
    this.desenhar();
    if (!this.morto) {
      this.animarFrames();
    }

    this.caixaAtaque.posicao.x = this.posicao.x + this.caixaAtaque.deslocamento.x;
    this.caixaAtaque.posicao.y = this.posicao.y + this.caixaAtaque.deslocamento.y;
    
    this.posicao.x += this.velocidade.x;
    this.posicao.y += this.velocidade.y;

    if (this.posicao.y + this.altura + this.velocidade.y >= canvas.height - 190) {
      this.velocidade.y = 0;
      this.posicao.y = 236.6;
    } else {
      this.velocidade.y += gravidade;
    }

    if (this.#stamina < 100 && !this.estaAtacando) {
      this.#stamina += 0.5;
    }
  }

  // REQUISITO: Polimorfismo - Sobrescrita de método 1
  atacar() {
    if (this.#stamina >= 20) {
      this.trocarSprite("ataque1");
      this.estaAtacando = true;
      this.#stamina -= 20;
    }
  }

  receberDano() {
    if (this.vida <= 0) {
      this.trocarSprite("morte");
      this.movimentoBloqueado = true;
    } else {
      this.trocarSprite("receberGolpe");
      this.movimentoBloqueado = false;
    }
  }

  trocarSprite(sprite) {
    if (this.imagem === this.sprites.morte.imagem) {
      if (this.frameAtual === this.sprites.morte.framesMax - 1) {
        this.morto = true;
      }
      return;
    }

    if (
      this.imagem === this.sprites.ataque1.imagem &&
      this.frameAtual < this.sprites.ataque1.framesMax - 1
    ) {
      return;
    }

    if (
      this.imagem === this.sprites.receberGolpe.imagem &&
      this.frameAtual < this.sprites.receberGolpe.framesMax - 1
    ) {
      return;
    }

    switch (sprite) {
      case "parado":
        if (this.imagem !== this.sprites.parado.imagem) {
          this.imagem = this.sprites.parado.imagem;
          this.framesMax = this.sprites.parado.framesMax;
          this.frameAtual = 0;
        }
        break;
      case "correr":
        if (this.imagem !== this.sprites.correr.imagem) {
          this.imagem = this.sprites.correr.imagem;
          this.framesMax = this.sprites.correr.framesMax;
          this.frameAtual = 0;
        }
        break;
      case "pular":
        if (this.imagem !== this.sprites.pular.imagem) {
          this.imagem = this.sprites.pular.imagem;
          this.framesMax = this.sprites.pular.framesMax;
          this.frameAtual = 0;
        }
        break;
      case "cair":
        if (this.imagem !== this.sprites.cair.imagem) {
          this.imagem = this.sprites.cair.imagem;
          this.framesMax = this.sprites.cair.framesMax;
          this.frameAtual = 0;
        }
        break;
      case "ataque1":
        if (this.imagem !== this.sprites.ataque1.imagem) {
          this.imagem = this.sprites.ataque1.imagem;
          this.framesMax = this.sprites.ataque1.framesMax;
          this.frameAtual = 0;
        }
        break;
      case "receberGolpe":
        if (this.imagem !== this.sprites.receberGolpe.imagem) {
          this.imagem = this.sprites.receberGolpe.imagem;
          this.framesMax = this.sprites.receberGolpe.framesMax;
          this.frameAtual = 0;
        }
        break;
      case "morte":
        if (this.imagem !== this.sprites.morte.imagem) {
          this.imagem = this.sprites.morte.imagem;
          this.framesMax = this.sprites.morte.framesMax;
          this.frameAtual = 0;
        }
        break;
    }
  }
}
