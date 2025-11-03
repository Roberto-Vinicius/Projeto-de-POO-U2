// REQUISITO: Herança - Classe 2 que herda
class Inimigo extends Entidade {
  // REQUISITO: 3 atributos private em classes distintas (Classe 3)
  #agressividade;

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
    // REQUISITO: Uso do super() - Chamada 2
    super({ posicao, imagemSrc, escala, framesMax, deslocamento });
    
    // REQUISITO: Novo atributo da classe filha Inimigo
    this.#agressividade = 0.5;
    
    this.velocidade = velocidade;
    this.ultimaTecla = null;
    this.sprites = sprites;
    this.morto = false;
    this.movimentoBloqueado = false;
    this.numeroJogador = 2;

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

  get agressividade() {
    return this.#agressividade;
  }

  set agressividade(valor) {
    this.#agressividade = Math.max(0, Math.min(1, valor));
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
  }

  // REQUISITO: Polimorfismo - Sobrescrita de método 2
  receberDano() {
    // REQUISITO: Uso do super() - Chamada 3
    if (this.vida <= 0) {
      this.trocarSprite("morte");
      this.movimentoBloqueado = true;
    } else {
      this.trocarSprite("receberGolpe");
      this.movimentoBloqueado = false;
    }
    this.#agressividade = Math.min(1, this.#agressividade + 0.1);
  }

  atacar() {
    this.trocarSprite("ataque1");
    this.estaAtacando = true;
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
