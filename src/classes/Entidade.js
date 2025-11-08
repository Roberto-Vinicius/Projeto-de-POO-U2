class Entidade {
  // REQUISITO: 3 atributos private em classes distintas (Classe 1)
  #vida;
  #velocidade;
  #estaAtacando;

  constructor({ posicao, imagemSrc, escala = 1, framesMax = 1, deslocamento = { x: 0, y: 0 }, vidaMaxima = 100 }) {
    this.posicao = posicao;
    this.altura = 150;
    this.largura = 50;
    this.imagem = new Image();
    this.imagem.src = imagemSrc;
    this.escala = escala;
    this.framesMax = framesMax;
    this.deslocamento = deslocamento;
    this.frameAtual = 0;
    this.framesDecorridos = 0;
    this.framesParaSegurar = 6;
    
    this.vidaMaxima = Math.max(0, vidaMaxima);
    this.#vida = this.vidaMaxima;
    this.#velocidade = { x: 0, y: 0 };
    this.#estaAtacando = false;

    this.viradoParaDireita = true;
  }

  // REQUISITO: 3 pares de métodos get() e set() (Par 1)
  get vida() {
    return this.#vida;
  }

  set vida(valor) {
    const limiteSuperior = typeof this.vidaMaxima === 'number' && this.vidaMaxima > 0 ? this.vidaMaxima : 100;
    this.#vida = Math.max(0, Math.min(limiteSuperior, valor));
  }

  // REQUISITO: 3 pares de métodos get() e set() (Par 2)
  get velocidade() {
    return this.#velocidade;
  }

  set velocidade(valor) {
    this.#velocidade = valor;
  }

  // REQUISITO: 3 pares de métodos get() e set() (Par 3)
  get estaAtacando() {
    return this.#estaAtacando;
  }

  set estaAtacando(valor) {
    this.#estaAtacando = valor;
  }

  // REQUISITO: Método estático 1
  static validarPosicao(posicao) {
    return posicao && 
           typeof posicao.x === 'number' && 
           typeof posicao.y === 'number' &&
           posicao.x >= 0 && posicao.y >= 0;
  }

  // REQUISITO: Método estático 2
  static calcularDistancia(entidade1, entidade2) {
    const dx = entidade1.posicao.x - entidade2.posicao.x;
    const dy = entidade1.posicao.y - entidade2.posicao.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // REQUISITO: Método estático 3
  static verificarColisao({ rec1, rec2 }) {
    return (
      rec1.caixaAtaque.posicao.x + rec1.caixaAtaque.largura >= rec2.posicao.x &&
      rec1.posicao.x <= rec2.caixaAtaque.posicao.x + rec2.caixaAtaque.largura &&
      rec1.posicao.y + rec1.caixaAtaque.altura >= rec2.posicao.y
    );
  }

  // REQUISITO: Método estático 4
  static limitarNoBounds(entidade, canvasWidth) {
    if (entidade.posicao.x < 0) {
      entidade.posicao.x = 0;
    }
    if (entidade.posicao.x + entidade.largura > canvasWidth) {
      entidade.posicao.x = canvasWidth - entidade.largura;
    }
  }

  desenhar() {

    c.save(); 
    
    if (!this.viradoParaDireita) {
      c.translate(this.posicao.x + this.largura / 2, 0);
      c.scale(-1, 1);
      c.translate(-(this.posicao.x + this.largura / 2), 0);
    }

    c.drawImage(
      this.imagem,
      this.frameAtual * (this.imagem.width / this.framesMax),
      0,
      this.imagem.width / this.framesMax,
      this.imagem.height,
      this.posicao.x - this.deslocamento.x,
      this.posicao.y - this.deslocamento.y,
      (this.imagem.width / this.framesMax) * this.escala,
      this.imagem.height * this.escala
    );

    c.restore(); 
  }

  animarFrames() {
    this.framesDecorridos++;
    if (this.framesDecorridos % this.framesParaSegurar === 0) {
      if (this.frameAtual < this.framesMax - 1) {
        this.frameAtual++;
      } else {
        this.frameAtual = 0;
      }
    }
  }

  atualizar() {
    this.desenhar();
    this.animarFrames();
  }
}
