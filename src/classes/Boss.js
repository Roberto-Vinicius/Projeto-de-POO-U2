// REQUISITO: Herança - Classe 3 que herda
class Boss extends Inimigo {
  constructor(config) {
    super(config);
    
    // REQUISITO: Novo atributo da classe filha Boss
    this.vidaMaxima = 200;
    this.vida = 200;
    this.danoAumentado = 1.5;
  }

  // REQUISITO: Polimorfismo - Sobrescrita de método 3
  atacar() {
    this.trocarSprite("ataque1");
    this.estaAtacando = true;
  }

  atualizar() {
    super.atualizar();
  }
}
