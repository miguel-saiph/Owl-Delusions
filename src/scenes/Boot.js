import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor(){
    super({key:'boot'});
  }
  preload(){
    this.load.json('generalAssets', './src/generalAssets.json').isReady();
    //this.load.image('mylogo', '../assets/images/loading-logo.png');
    //this.load.image('mylogo', `../assets/images/general/elemental_icons/${datos.getElement()}_icon.png`);
  }
  create(){
    this.scene.start('Preloader');
  }
}
 