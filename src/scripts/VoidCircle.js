

export class VoidCircle extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {

    super(scene, x, y, 'void');

    this.scene = scene;
    this.scene.add.existing(this);

    this.setOrigin(0.5);
    this.setDepth(5);
    this.setScrollFactor(0);

    this.setScale(0.1);
    this.setVisible(false);

    this.speed = 1.5;

    this.tween = this.scene.tweens.add({
      targets: this,
      scale: 1,
      // duration: () => { return this.speed * 1000 },
      duration: this.speed * 1000,
      ease: 'Linear'
    });
  }
}