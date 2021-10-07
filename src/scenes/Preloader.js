export class Preloader extends Phaser.Scene {
  constructor() {
    super({
      key: "Preloader",
      files: [
        {type:'json',   key:'generalAssets',  url:'./generalAssets.json'}
      ]
    });
    this.loadingText = null;
    this.percentText = null;
    this.assetText = null;
    this.genAssetsJSON = null;
    this.progressBar = null;
    
  }

  init(data){
    // console.log(data);
    //this.load.json(data.key, data.url);
  }

  preload() {

    let { width, height } = this.sys.game.canvas;

    this.progressBar = this.add.graphics({fillStyle: { color: "0x000000" }});

    this.loadingText = this.make.text({
      x: width / 2,
      y: height / 2 + 150,
      text: '0%',
      style: {
          fontSize: '20px',
          fontFamily: 'Open Sans',
          fill: '#000000'
      }
    });
    this.loadingText.setOrigin(0.5, 0.5);

    this.genAssetsJSON = this.cache.json.get('generalAssets');
    this.loadAssets(this.genAssetsJSON);
    this.loadFont("RPGFont", "./src/assets/fonts/RPG-font.ttf");

    this.load.once('complete', function (){
      console.log("Terminó de cargar!");

        // Pasa a la siguiente escena
        setTimeout(function(){ 
          this.scene.start('MainScene'); 
        }.bind(this), 1000);
    }, this);

    this.load.on('progress', function (value) {
        
      // Llenado barra de progreso
      this.progressBar.clear();
      this.progressBar.fillStyle(0xe42523, 1);
      this.progressBar.fillRect((width/2)-250, height/2, 500 * value, 30);

      // Porcentaje de progreso
      this.loadingText.setText(parseInt(value * 100) + '%');

    }, this);
  }

  loadAssets(json){
    Object.keys(json).forEach(function(group){
      Object.keys(json[group]).forEach(function(key){
        let value = json[group][key];

        //carga los archivos según tipo
        if (group === 'atlas' || group === 'unityAtlas' || group === 'bitmapFont' || group === 'spritesheet' || group === 'multiatlas'){
           if (group === 'multiatlas') this.load.multiatlas(key, value[0], value[1]);
          if (group === 'spritesheet') this.load.spritesheet(key, value[0], { frameWidth: value[1].frameWidth, frameHeight: value[1].frameHeight});
          else this.load[group](key, value[0], value[2]); //el último valor es value[2] por la estructura del objeto json, value[1] se ocupa con las variables de posicion y tamaño del sprite
        }
        else if(group == 'audio'){
          const extension = value.slice(-3);
            if (extension === 'opus' && this.sys.game.device.audio.opus){
              this.load[group](key, value['opus']);
            }
            else if (extension === 'webm' && this.sys.game.device.audio.webm){
                this.load[group](key, value['webm']);
            }
            else if (extension === 'ogg' && this.sys.game.device.audio.ogg){
              this.load[group](key, value);
                
            }
            else if (extension === 'wav' && this.sys.game.device.audio.wav){
                this.load[group](key, value);
            }
            else if (extension === 'mp3' && this.sys.game.device.audio.mp3){
              this.load[group](key, value);
            }
        }
        else if (group === 'html'){
          this.load[group](key, value[0], value[1], value[2]);
        }
        else if (group === 'text'){
        }
        else if(group === 'sequence_animation'){
          let size = 1;
          let newKey = key;
          let newPath = value[0];
          //check for the quantity of zeros
          let pathArr = newPath.split("/");
          let nameArr = pathArr[pathArr.length-1].split("_");
          let numbArr = nameArr[nameArr.length-1].split(".");
          let fileExt = numbArr[1];
          let numbLength = numbArr[0].length;
          let extraZeros = 0; 
          if( numbLength > 1 ) { extraZeros = numbLength }
          while(size<=value[2].size){
            if(fileExt == 'svg'){
              this.load.svg(newKey, newPath, {width: value[1].width, height: value[1].height});
            }
            else{
              this.load.image(newKey, newPath);
            }
            size++;
            let zeros = ''
            let zeroLength = extraZeros - size.toString().length;
            for (let i = 0; i < zeroLength ;i++) {
              zeros = zeros + '0'
            }
            newKey = newKey.replace(size-1, size);
            newPath = newPath.replace(/_\d+/, '_' + zeros + size);
          }
        }
        else if (group === 'image'){
          let newPath = value[0];
          let pathArr = newPath.split(".");
          let fileExt = pathArr[pathArr.length - 1];
          if(fileExt == 'svg'){
            this.load.svg(key, value[0], {width: value[1].width, height: value[1].height});
          }
          else{
            this.load.image(key, value[0]);
          }
        }
        else {
          this.load[group](key, value[0]);
        }
      }, this);
    }, this);
  
  }

  loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
  }
}