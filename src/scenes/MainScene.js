import { Fullscreen } from '../scripts/Fullscreen';
import * as Utils from '../scripts/Utils'

import BlurPostFX from '../scripts/pipelines/BlurPostFX.js';
import BendWavesPostFX from '../scripts/pipelines/BendWavesPostFX.js';
import PixelatedFX from '../scripts/pipelines/PixelatedFX.js';
import PlasmaPost2FX from '../scripts/pipelines/PlasmaPost2FX.js';

import { VoidCircle } from '../scripts/VoidCircle';
import { Owl } from '../scripts/Owl';

export class MainScene extends Phaser.Scene {

  constructor() {
    super({ key: "MainScene" });

    this.cameraScroll = { x: -1, y: -1 };
    this.owlsAmount = { min: 3, max: 6 };
    this.scaleRange = { min: 0.2, max: 0.6 };
    this.owls = [];
    this.canClick = true;
    this.maxPatterns = 30;
    this.usedPatterns = [];
    this.stageCounter = 0;
    this.maxScrollSpeed = 3;
    this.minScrollSpeed = 0;
    this.onTutorial = true;
  }

  init() {
  }

  create() {

    let { width, height } = this.sys.game.canvas;
    this.myCam = this.cameras.main;

    this.scene.launch('HUDScene');
    this.HUD = this.scene.get('HUDScene');
    this.HUD.mainScene = this;

    this.bgMusic = this.sound.add('bg_music', { volume: 0.7, loop: true });
    this.bgMusic.play();

    this.pattern = this.add.tileSprite(0, 0, width, height, "pattern_1").setOrigin(0, 0).setScrollFactor(0);

    this.bg = this.add.image(width / 2, height / 2, 'background').setDepth(5).setScrollFactor(0);

    this.void = new VoidCircle(this, -500, -100);

    // this.owl.mask = new Phaser.Display.Masks.BitmapMask(this, this.void);
    // this.owl2.mask = new Phaser.Display.Masks.BitmapMask(this, this.void);
    this.bg.mask = new Phaser.Display.Masks.BitmapMask(this, this.void);

    this.input.on('pointerdown', function (pointer, objects) {
      if (!this.canClick) return;

      if (this.onTutorial) {
        this.HUD.nextTutorial();
        this.owls[0].x = pointer.x;
        this.owls[0].y = pointer.y;
        this.owls[0].correct = true;
      }

      this.void.x = pointer.x;
      this.void.y = pointer.y;
      this.void.setDepth(5);
      this.void.setVisible(true);
      this.void.tween.restart();
      // this.resetPattern();

    }, this);

    this.events.on('owlclicked', () => {
      this.canClick = false;
    });

    this.events.on('owlfound', () => {
      this.canClick = true;
      this.void.x = -500;
      this.resetPattern();
      this.setOwls(width, height);
      if (this.onTutorial) {
        this.HUD.nextTutorial();
      }
    });

    this.setOwls(width, height);

    this.events.on('owldestroyed', () => { this.HUD.updateOwlsCounter(--this.HUD.owlsCounter) });

    this.events.on('tutorialfinished', () => { this.onTutorial = false; });

  }

  update() {

    // Camera scroll (+ = left, - = right)
    this.myCam.scrollX += this.cameraScroll.x;
    this.myCam.scrollY += this.cameraScroll.y;

    // scroll the texture of the tilesprites proportionally to the camera scroll
    this.pattern.tilePositionX = this.myCam.scrollX * .3;
    this.pattern.tilePositionY = this.myCam.scrollY * .3;
  }

  setOwls(width, height) {

    if (this.owls.length > 0) {
      this.owls.forEach(owl => {
        owl.destroy();
      });
      this.owls = [];
    }

    const amount = Phaser.Math.Between(this.owlsAmount.min, this.owlsAmount.max);

    for (let i = 0; i < amount; i++) {
      let posX, posY;
      posX = Phaser.Math.Between(width * .1, width * .9);
      posY = Phaser.Math.Between(height * .1, height * .9);

      const owl = new Owl(this, posX, posY);
      const scale = Phaser.Math.FloatBetween(this.scaleRange.min, this.scaleRange.max);
      owl.setScale(scale);
      owl.mask = new Phaser.Display.Masks.BitmapMask(this, this.void);
      this.owls.push(owl);
    }
    this.owls[Phaser.Math.Between(0, this.owls.length - 1)].correct = true;

    this.HUD.updateOwlsCounter(this.owls.length);

  }

  resetPattern() {
    // Reset the pattern array if already has all the possible patterns
    if (this.usedPatterns.length >= this.maxPatterns) this.usedPatterns = [];

    // Creates a new pattern name that didn't got chosen before
    // and that is differente to the last pattern
    let patternName;
    do
      patternName = `pattern_${Phaser.Math.Between(1, this.maxPatterns)}`;
    while (this.usedPatterns.find(p => p === patternName) || this.usedPatterns[this.usedPatterns.length - 1] === patternName);

    this.pattern.setTexture(patternName);
    this.usedPatterns.push(patternName);

    let scrollSpeedX, scrollSpeedY;
    do {
      scrollSpeedX = Phaser.Math.FloatBetween(-this.maxScrollSpeed, this.maxScrollSpeed);
      scrollSpeedY = Phaser.Math.FloatBetween(-this.maxScrollSpeed, this.maxScrollSpeed);
    } while (scrollSpeedX > this.minScrollSpeed && scrollSpeedY > this.minScrollSpeed);
    this.cameraScroll.x = scrollSpeedX;
    this.cameraScroll.y = scrollSpeedY;

    this.nextStage();
  }

  nextStage() {
    this.stageCounter++;

    switch (this.stageCounter) {
      case 2:
        this.minScrollSpeed = 1;
        // this.void.speed = 1.3;
        break;
      case 4:
        this.myCam.setPostPipeline(PlasmaPost2FX);
        break;
      case 7:
        this.myCam.resetPipeline(true);
        this.myCam.setPostPipeline(BlurPostFX);
        // this.void.speed = 1;
        this.maxScrollSpeed = 2;
        this.minScrollSpeed = 0;
        break;
      case 8:
        this.myCam.resetPipeline(true);
        this.myCam.setPostPipeline(PixelatedFX);
        break;
      case 10:
        this.myCam.resetPipeline(true);
        this.myCam.setPostPipeline(BendWavesPostFX);
        // this.void.speed = 0.8;
      break;
      case 12:
        this.myCam.resetPipeline(true);
        this.maxScrollSpeed = 3;
        this.minScrollSpeed = 1;
        this.owlsAmount.min = 1;
        this.owlsAmount.max = 2;
      break;
      case 14:
        // this.void.speed = 0.5;
        this.owlsAmount.min = 1;
        this.owlsAmount.max = 1;
      break;
      default:
        break;
    }
  }
}

// 
// 
// https://opengameart.org/content/seamless-pattern-pack-1

