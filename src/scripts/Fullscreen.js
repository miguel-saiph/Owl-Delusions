
export class Fullscreen extends Phaser.GameObjects.Sprite {
  
  constructor(scene, x, y, key, type) {

  	super(scene, x, y, key);

  	this.scene = scene;
    this.scene.add.existing(this);
    this.setData("type", type);

    this.setInteractive({ useHandCursor: true  });

    this.on('pointerup', function (pointer) {
      if (this.scene.game.scale.isFullscreen) {
        this.scene.game.scale.stopFullscreen();
        } else {
        this.scene.game.scale.startFullscreen();
      }
    });

    // click = this.scene.sound.add('click');
    
  }
  
}