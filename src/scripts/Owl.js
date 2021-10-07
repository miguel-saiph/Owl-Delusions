export class Owl extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {

    super(scene, x, y, 'owl');

    this.scene = scene;
    this.scene.add.existing(this);

    this.setOrigin(0.5);
    this.setDepth(5);
    this.setScrollFactor(0);
    this.setInteractive();
    
    this.setScale(0.1);
    // this.setVisible(false);
    this.tweenSpeed = 1;
    this.correct = false;

    this.hoot = this.scene.sound.add('owl_hoot', { volume: 0.8 });

    this.on('pointerdown', (pointer, obj) => {
      if (!this.scene.canClick) return;

      const intersects = Phaser.Geom.Intersects.CircleToRectangle(
        new Phaser.Geom.Circle(this.scene.void.x, this.scene.void.y, this.scene.void.displayWidth/2),
        new Phaser.Geom.Rectangle(this.x, this.y, this.displayWidth, this.displayHeight)
      );

      if (!intersects) return;

      if (!this.correct) {
        this.scene.events.emit('owldestroyed');
        this.destroy();
        return;
      }

      this.tween.play();
      this.mask = null;
      this.scene.events.emit('owlclicked');
      this.hoot.play();
      // console.log(obj);
      // console.log(pointer);
      // this.destroy();

    }, this);

    this.tween = this.scene.tweens.add({
      targets: this,
      scale: 3,
      duration: this.tweenSpeed * 1000,
      ease: 'Linear',
      paused: true,
      yoyo: true,
      callbackScope: this,
      onComplete: () => {
        this.scene.events.emit('owlfound');
        this.destroy();
      }
    });
  }
}