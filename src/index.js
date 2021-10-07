console.log(`I'm a silly entry point`);

// npm run dev
// npm run build
// npm run start
import 'phaser';

import { Preloader } from './scenes/Preloader';
import { MainScene } from './scenes/mainScene';
import { Boot } from './scenes/Boot';
import { HUDScene } from './scenes/HUDScene';

import BlurPostFX from './scripts/pipelines/BlurPostFX.js';
import BendWavesPostFX from './scripts/pipelines/BendWavesPostFX.js';
import PixelatedFX from './scripts/pipelines/PixelatedFX.js';
import PlasmaPost2FX from './scripts/pipelines/PlasmaPost2FX.js';

const gameConfig = {
  scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: 'phaser-example',
		width: window.innerWidth * window.devicePixelRatio,
		height: window.innerHeight * window.devicePixelRatio
	},
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [Boot, Preloader, MainScene, HUDScene],
  pipeline: { BlurPostFX, BendWavesPostFX, PixelatedFX, PlasmaPost2FX }
};

const game = new Phaser.Game(gameConfig);