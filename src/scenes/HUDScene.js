import { Scene } from 'phaser';

export class HUDScene extends Scene {
  constructor(){
    super({key:'HUDScene'});

    this.owlsCounter = 0;
    this.instructionTexts = [
      'Click anywhere to see behind the illusion',
      'Click on the owls until you find the real one'
    ];
    this.tutorialStep = 0;
    this.mainScene = null;
  }

  create(){

    let { width, height } = this.sys.game.canvas;

    this.owlsCounterText = this.add.text(width*.02, height*.03, this.owlsCounter, { fontFamily: 'RPGFont', color: '#FFF', fontSize: 20 * height/768 }).setScrollFactor(0);
    this.owlsCounterText.setShadow(2, 2, '#000000', 2, true, true);

    this.instructionText = this.add.text(width*.02, height*.9, this.instructionTexts[0], { fontFamily: 'RPGFont', color: '#FFF', fontSize: 10 * height/768, align: 'center' }).setScrollFactor(0);
    this.instructionText.setShadow(2, 2, '#000000', 2, true, true);
  
  }

  updateOwlsCounter(number) {
    this.owlsCounter = number;
    if (this.owlsCounterText) this.owlsCounterText.text = this.owlsCounter;
  }

  nextTutorial() {
    this.tutorialStep++;
    if (this.tutorialStep >= this.instructionTexts.length) {
      this.instructionText.destroy();
      this.mainScene.events.emit('tutorialfinished');
    } else {
      this.instructionText.text = this.instructionTexts[this.tutorialStep];
    }
  }
}
 