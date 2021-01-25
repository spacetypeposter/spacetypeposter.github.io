let mainText1 = "  FUTURE LAB  ";
let pgTextSize = 128;

let uFontBol, uFontLig, uFontReg;

let pieSlices = 200;
let pieHeight = 100;
let radius = 400;

let recordOn = false;
let recordLength = 120;
let recordStop;

function preload(){
  uFontBol = loadFont('resources/UniversLTStd-Bold.otf');
  uFontLig = loadFont('resources/UniversLTStd-Light.otf');
  uFontReg = loadFont('resources/UniversLTStd.otf')
}

function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);

  backgroundPicker = createColorPicker('#ffffff'); backgroundPicker.position(220,height + 60);
  backgroundPicker.style('height','25px');backgroundPicker.style('width','65px'); backgroundPicker.input(drawTextures);
  forePicker = createColorPicker('#000000'); forePicker.position(295,height + 60)
  forePicker.style('height','25px');forePicker.style('width','65px');forePicker.input(drawTextures);

  gradient1pick = createColorPicker('#ff0000'); gradient1pick.position(220,height + 105); gradient1pick.style('height','40px'); gradient1pick.style('width','20px'); gradient1pick.input(drawTextures);
  gradient2pick = createColorPicker('#0000ff'); gradient2pick.position(250,height + 105); gradient2pick.style('height','40px'); gradient2pick.style('width','20px'); gradient2pick.input(drawTextures);

  recordBut = createButton("Record"); recordBut.position(40,40); recordBut.mousePressed(recordThis);

  frameRate(30);
  drawTextures();
}

function draw() {
  clear();
  orbitControl();

  bkgdColor = color(backgroundPicker.value());
  foreColor = color(forePicker.value());

  background(foreColor);
  stroke(foreColor);
  fill(bkgdColor);

  let pieAngle = -2*PI/pieSlices;

  push();
  rotateX(-PI/8);
  // translate(0,0,400);

  let segmentLength = (2*PI*radius)/pieSlices;
  let pgW = pgT.width; let pgH = pgT.height;
  let heightRatio = pgW * pieHeight/pgH;

  textureMode(NORMAL); textureWrap(REPEAT);

  blendMode(BLEND);
  for(var s = 0; s<2; s++){
    let neuR;
    if(s==0){
      texture(pgTinside);
      neuR = radius;
    } else {
      texture(pgT);
      neuR = radius + 1;
    }

    beginShape(TRIANGLE_STRIP);
    for(var r=0; r<=pieSlices; r++){
      var x = cos(r*pieAngle) * neuR;
      var z = sin(r*pieAngle) * neuR;

      let u = map(r*segmentLength + frameCount*2,0,heightRatio,0,1);

      vertex(x,0,z,u,0);
      vertex(x,pieHeight,z,u,1);
    }
    endShape();
  }
  pop();

  blendMode(MULTIPLY);
  push();
  translate(-width/2,-height/2,radius+10);
  image(pgGradient,0,0);
  pop();

  if(recordOn && frameCount==recordStop){
    print("Record Stop")
    stopRecording();
    recordOn = false;
  }
}

function recordThis(){
  startRecording();
  recordOn = true;
  recordStop = frameCount + recordLength;
}
