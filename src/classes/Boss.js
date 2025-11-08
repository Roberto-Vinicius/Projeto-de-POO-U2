// REQUISITO: Herança - Classe 3 que herda
class Boss extends Inimigo {
  constructor(config) {
    const vidaMaximaBoss = config?.vidaMaxima ?? 200;
    super({ ...config, vidaMaxima: vidaMaximaBoss });

    // REQUISITO: Novo atributo da classe filha Boss
    this.vidaMaxima = vidaMaximaBoss;
    this.vida = this.vidaMaxima;
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
