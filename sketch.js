// the link to your model provided by Teachable Machine export panel
const URL1 = "https://teachablemachine.withgoogle.com/models/Bm0ZEiLrk/";
let model1, webcam1, ctx1, labelContainer1, maxPredictions1;
let botao1;
let sons_passaros = [];

let somAtual = 0;
let volume_atual = 1;

let xEllipse=150;
let yEllipse=100;


let backgroundMode=0;

let analyzer;

var xBird=300;
var yBird=300;

async function init() {
        if(document.getElementById("botao1").innerHTML=="Parar de Reger") {
           document.getElementById("botao1").innerHTML = "Reger a Osquestra"
           location.reload();
        }else {
          document.getElementById("botao1").innerHTML = "Parar de Reger"  
          const modelURL = URL1 + "model.json";
          const metadataURL = URL1 + "metadata.json";

          // load the model and metadata
          // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
          // Note: the pose library adds a tmPose object to your window (window.tmPose)
          model1 = await tmPose.load(modelURL, metadataURL);
          maxPredictions1 = model1.getTotalClasses();

          // Convenience function to setup a webcam
          const size = 200;
          const flip = true; // whether to flip the webcam
          webcam1 = new tmPose.Webcam(size, size, flip); // width, height, flip
          await webcam1.setup(); // request access to the webcam
          await webcam1.play();
          window.requestAnimationFrame(loop1);

          // append/get elements to the DOM
          const canvas = document.getElementById("canvas1");
          canvas.width = size; canvas.height = size;
          ctx1 = canvas.getContext("2d");
          labelContainer1 = document.getElementById("label-container1");
          document.getElementById("botao1").innerHTML = "Parar de Reger"

          for (let i = 0; i < maxPredictions1; i++) { // and class labels
              labelContainer1.appendChild(document.createElement("div"));
          }
        }
    }

async function loop1(timestamp) {
        webcam1.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop1);
    }
 async function predict() {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element
        const { pose, posenetOutput } = await model1.estimatePose(webcam1.canvas);
        // Prediction 2: run input through teachable machine classification model
        const prediction = await model1.predict(posenetOutput);

        for (let i = 0; i < maxPredictions1; i++) {
          /*  const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
           labelContainer1.childNodes[i].innerHTML = classPrediction;*/
          if(prediction[i].className=="cabecadireita" && prediction[i].probability.toFixed(2)==1.0) {
            xEllipse+=5;
            if(xEllipse>=0 && xEllipse<50 && somAtual!=0){
                let somAnterior = somAtual;
                somAtual=0;
                trocarSom(somAnterior);
            }
            if(xEllipse>=50 && xEllipse<100 && somAtual!=1){
                let somAnterior = somAtual;
                somAtual=1;
                trocarSom(somAnterior);
            }
            if(xEllipse>=100 && xEllipse<150 && somAtual!=2){
                let somAnterior = somAtual;
                somAtual=2;
                trocarSom(somAnterior);
            }
            if(xEllipse>=150 && xEllipse<200 && somAtual!=3){
                let somAnterior = somAtual;
                somAtual=3;
                trocarSom(somAnterior);
            }
            if(xEllipse>=200 && xEllipse<250 && somAtual!=4){
                let somAnterior = somAtual;
                somAtual=4;
                trocarSom(somAnterior);
            }
            if(xEllipse>=250 && xEllipse<300 && somAtual!=5){
                let somAnterior = somAtual;
                somAtual=5;
                trocarSom(somAnterior);
            }
            console.log("indo para direita:"+somAtual)
          }
          if(prediction[i].className=="cabesquerda" && prediction[i].probability.toFixed(2)==1.0) {
            xEllipse-=5;
            if(xEllipse>=0 && xEllipse<50 && somAtual!=0){
                let somAnterior = somAtual;
                somAtual=0;
                trocarSom(somAnterior);
            }
            if(xEllipse>=50 && xEllipse<100 && somAtual!=1){
                let somAnterior = somAtual;
                somAtual=1;
                trocarSom(somAnterior);
            }
            if(xEllipse>=100 && xEllipse<150 && somAtual!=2){
                let somAnterior = somAtual;
                somAtual=2;
                trocarSom(somAnterior);
            }
            if(xEllipse>=150 && xEllipse<200 && somAtual!=3){
                let somAnterior = somAtual;
                somAtual=3;
                trocarSom(somAnterior);
            }
            if(xEllipse>=200 && xEllipse<250 && somAtual!=4){
                let somAnterior = somAtual;
                somAtual=4;
                trocarSom(somAnterior);
            }
            if(xEllipse>=250 && xEllipse<300 && somAtual!=5){
                let somAnterior = somAtual;
                somAtual=5;
                trocarSom(somAnterior);
            }
            console.log("indo para cabecaesquerda:"+somAtual)
          }
          if(prediction[i].className=="direita" && prediction[i].probability.toFixed(2)==1.0) {
            yEllipse-=5;
            volume_atual = volume_atual + 0.01;
            if(volume_atual>0)
              volume_atual=1;
            trocarVolume(somAtual);
            console.log("aumentando volume:"+volume_atual)
          }
          if(prediction[i].className=="esquerda" && prediction[i].probability.toFixed(2)==1.0) {
            yEllipse+=5;
            volume_atual = volume_atual - 0.01;
            if(volume_atual<0)
              volume_atual=0
             trocarVolume(somAtual);
            console.log("reduzindo volume:"+volume_atual)
          }
        }

        // finally draw the poses
        drawPose(pose);
    }

    function drawPose(pose) {
        if (webcam1.canvas) {
            ctx1.drawImage(webcam1.canvas, 0, 0);
            // draw the keypoints and skeleton
            if (pose) {
                const minPartConfidence = 0.5;
                tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx1);
                tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx1);
            }
        }
    }

function preload() {
  sons_passaros[0] = loadSound("/assets/Hemithraupis_guira-2929668_editado.mp3")
  sons_passaros[1] = loadSound("/assets/Ibycter_americanus-2832799(1)_editado.mp3")
  sons_passaros[2] = loadSound("/assets/Laterallus_xenopterus-2870576(1)_editado.mp3")
  sons_passaros[3] = loadSound("/assets/Pheugopedius_genibarbis-2832195(1)_editado.mp3")
  sons_passaros[4] = loadSound("/assets/Pulsatrix_perspicillata-2932532_editado.mp3")
  sons_passaros[5] = loadSound("/assets/Theristicus_caudatus-2806689(1)_editado.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log("p5js ta na area")
  sons_passaros[somAtual].setVolume(volume_atual);
  sons_passaros[somAtual].loop();
  
  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(sons_passaros[somAtual]);
  
 
  
}

function draw() {
  drawBackground()
  ellipse(xEllipse,yEllipse,volume_atual*50);
  
  // Get the average (root mean square) amplitude
  let rms = analyzer.getLevel();
  fill(127);
  stroke(0);
  //console.log(rms)
  // Draw an ellipse with size based on volume
  ellipse(xBird, yBird, 10 + rms * 200, 10 + rms * 200);
  if(rms>0.003) {
    xBird=random(50,windowWidth-50);
    yBird=random(50,windowHeight-50);
  }
  
  
}

function drawBackground() {
  for (var i = 0; i < 500; i++) {
    if(somAtual==0)
       stroke(i - 255, 30, 50);
    else if(somAtual==1)
       stroke(30, i - 255, 50);
    else if(somAtual==2)
       stroke(30,50 , i - 255);
    else if(somAtual==3)
       stroke(50, i - 255, 30);
    else if(somAtual==4)
       stroke(i - 255, 50, 30);
    else if(somAtual==5)
       stroke(i - 255, 50, i - 255);
    line(0, i, width, i);
  }
}

function trocarSom(somAnterior) {
  if(sons_passaros[somAnterior].isPlaying()) {
    sons_passaros[somAnterior].stop();
  }
  sons_passaros[somAtual].setVolume(volume_atual);
  sons_passaros[somAtual].loop();
 // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(sons_passaros[somAtual]);
  
}

function trocarVolume(somAnterior) {
  if(sons_passaros[somAnterior].isPlaying()) {
    sons_passaros[somAnterior].pause();
  }
  sons_passaros[somAtual].setVolume(volume_atual);
  sons_passaros[somAtual].loop();
  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(sons_passaros[somAtual]);
  
}
