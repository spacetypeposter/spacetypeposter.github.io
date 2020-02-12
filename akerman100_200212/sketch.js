let cols = 24;
let rows = 24;

let dashSize = 0.25;
let dashColor;

let rippleX, rippleY;

let spinEngine;
let spinSpeed;
let spinStart;
let spinEnd;

let rotSpeed;
let rippleSpeed;

let svgSaveToggle = false;
let pngSaveToggle = false;

let pGradient;

let pixelDensityCheck;

function preload() {
  font = loadFont('resources/IBMPlexMono-Medium.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  frameRate(30);

  rowsSlider = createSlider(0,100,34); rowsSlider.position(30,30); rowsSlider.style('width','100px');
  colsSlider = createSlider(0,100,34); colsSlider.position(30,60);colsSlider.style('width','100px');
  sizeSlider = createSlider(0,2,0.5,0.01); sizeSlider.position(30,90); sizeSlider.style('width','100px');
  rotSpeedSlider = createSlider(0,4,1,0.01);rotSpeedSlider.position(30,150);rotSpeedSlider.style('width','100px');
  rippleSpeedSlider = createSlider(0,10,5,0.01);rippleSpeedSlider.position(30,180);rippleSpeedSlider.style('width','100px');

  radialCheck = createCheckbox(' ',true);radialCheck.position(30,240);radialCheck.changed(myRadialCheck);
  diamondCheck = createCheckbox(' ',false);diamondCheck.position(30,260);diamondCheck.changed(myDiamondCheck);
  frameCheck = createCheckbox(' ',false);frameCheck.position(30,280);frameCheck.changed(myFrameCheck);

  dashColorPick = createInput('ff0000');
  dashColorPick.position(30,330);
  dashColorPick.style('width','40px');

  bkgdColorPick = createInput('ffffff');
  bkgdColorPick.position(30,360);
  bkgdColorPick.style('width','40px');

  // solidCheck = createCheckbox(' ',true);
  // solidCheck.position(30,410);
  // solidCheck.changed(mySolidCheck);
  //
  // gradientCheck = createCheckbox(' ',false);
  // gradientCheck.position(30,440);
  // gradientCheck.changed(myGradientCheck);

  motionCheck = createCheckbox(' ',true);
  motionCheck.position(30,height-80);
  motionCheck.changed(myMotionCheck);

  scrubCheck = createCheckbox(' ',false);
  scrubCheck.position(30,height-60);
  scrubCheck.changed(myScrubCheck);

  scrubSlider = createSlider(0,6*PI,0,0.01);
  scrubSlider.position(100,height-60);
  scrubSlider.style('width','300px');

  saveSvgButton = createButton('Export SVG');saveSvgButton.position(width-100,30);saveSvgButton.mousePressed(exportSVG);
  savePngButton = createButton('Export PNG');savePngButton.position(width-100,50);savePngButton.mousePressed(exportPNG);

  rippleX = width/2;
  rippleY = height/2;

  pixelDensityCheck = pixelDensity();

  buildGradientDash();
}

function draw() {
  if(svgSaveToggle){
    createCanvas(windowWidth,windowHeight,SVG);
  }

  print(pixelDensityCheck);

  dashColor = color('#'+dashColorPick.value());
  bkgdColor = color('#'+bkgdColorPick.value());
  rows = rowsSlider.value();
  cols = colsSlider.value();
  dashSize = sizeSlider.value();
  rotSpeed = rotSpeedSlider.value();
  rippleSpeed = rippleSpeedSlider.value()/100;

  clear();

  if(svgSaveToggle || pngSaveToggle){
  } else {
    background(bkgdColor);
  }

  let spinSteps = PI/(30*rotSpeed);

  let xSpace = width/cols;
  let ySpace = height/rows;

  for(let i=0; i<=rows; i++){
    for(let j=0; j<=cols; j++){
      push();
      translate(j*xSpace,i*ySpace);

      let delayDist;
      let rippleX = width/2;
      let rippleY = height/2;

      if(diamondCheck.checked()==true){
        let delayDistY = dist(j*xSpace,i*ySpace,j*xSpace,rippleY);
        let delayDistX = dist(j*xSpace,i*ySpace,rippleX,i*ySpace);
        delayDist = (delayDistX + delayDistY)/2 * rippleSpeed;
      }

      if(radialCheck.checked() ==true){
        delayDist = dist(j*xSpace,i*ySpace,rippleX,rippleY) * rippleSpeed;
      }

      if(frameCheck.checked() ==true){
        let delayDistY = dist(j*xSpace,i*ySpace,j*xSpace,rippleY);
        let delayDistX = dist(j*xSpace,i*ySpace,rippleX,i*ySpace);
        delayDist = dist(delayDistY,delayDistX,rippleX,rippleY) * -rippleSpeed;
      }

      // spin with motion
      if(motionCheck.checked() && frameCount>(spinStart+delayDist) && frameCount<(spinEnd+delayDist)){
        let spinner = spinEngine - delayDist*spinSteps;

        // ease
        let easeFactor = map(sinEngine(spinner-PI/2,1),-1,1,0,2*PI)
        rotate(easeFactor);
      }

      //spin with scrubbing
      if(scrubCheck.checked()){
        let spinner = scrubSlider.value() - delayDist*spinSteps;

        if(spinner>2*PI || spinner<0){
          spinner = 0;
        }

        rotate(spinner);
      }

      // if(gradientCheck.checked()){
      //   image(pGradient,-pGradient.width/2,-pGradient.height/2);
      // } else {
      //   dash(0,0,dashSize);
      // }
      dash(0,0,dashSize);

      pop();
    }
  }

  spinEngine += spinSteps;


  if(svgSaveToggle || pngSaveToggle){
  } else {
    textFont(font);
    fill(125);
    noStroke();
    textSize(9);
    text("Rows", 30, 30);
    text("Columns", 30, 60);
    text("Size", 30, 90);

    text("Spin Length", 30, 150);
    text("Ripple Length", 30, 180);

    text("RIPPLE SHAPE", 30, 233);
    text("Radial", 50, 253);
    text("Diamond", 50, 273);
    text("Frame", 50, 293);

    text("DASH COLOR", 80, 343);
    text("BACKGROUND", 80, 373);

    text("Motion", 50, height-67);
    text("Scrub", 50, height-47);

    strokeWeight(1);
    fill(dashColor); stroke(bkgdColor);
    ellipse(30, 330,30,30);
    fill(bkgdColor); stroke(dashColor);
    ellipse(30, 360,30,30);
  }

  if(svgSaveToggle){
    save();
    svgSaveToggle = false;
  }

  if(pngSaveToggle){
//    saveCanvas('ackerman100' + frameCount, 'png');
    save('myCanvas' + frameCount + '.png');
    pngSaveToggle = false;
  }

//  image(pGradient,0,0);
}

function mousePressed(){
  spinStart = frameCount;
  spinEnd = frameCount + (30*rotSpeed);
  spinEngine = 0;

  print(true);

  rippleX = mouseX;
  rippleY = mouseY;
}

function buildGradientDash() {
  pGradient = createGraphics(100*dashSize,16*dashSize);
  let c1 = color('#ff0000');
  let c2 = color('#0000ff');

//  pGradient.pixelDensity(pixelDensityCheck);
  pGradient.background(0,255,0);
  for(var i=0; i<42; i++){
      let gradientColor = lerpColor(c1,c2,i/42);
      pGradient.stroke(gradientColor);
      pGradient.strokeWeight(1);
      pGradient.noFill();
      pGradient.line(i*dashSize,8*dashSize,i*dashSize + 8*dashSize,0);
  }
}

function dash(x,y,scaler){
  this.x = x;
  this.y = y;
  this.scaler = scaler;

  push();
    fill(dashColor);
    noStroke();
    translate(-25*scaler,-4*scaler);
    beginShape();
      vertex(0,8*scaler);
      vertex(8*scaler,0);
      vertex(50*scaler,0);
      vertex(42*scaler,8*scaler);
    endShape(CLOSE);
  pop();

}

function sinEngine(aLength, slope) {
  var sinus = sin(aLength);
  var sign = (sinus >= 0 ? 1: -1);
  var sinerSquare = sign * (1-pow(1-abs(sinus),slope));
  return sinerSquare;
}

function myMotionCheck(){if(scrubCheck.checked() == true){ scrubCheck.checked(false);} }
function myScrubCheck(){if(motionCheck.checked() == true){ motionCheck.checked(false);}}

function mySolidCheck(){if(gradientCheck.checked() == true){ gradientCheck.checked(false);}}
function myGradientCheck(){if(solidCheck.checked() == true){ solidCheck.checked(false);}}

function myRadialCheck(){
  if(diamondCheck.checked() == true){ diamondCheck.checked(false);}
  if(frameCheck.checked() == true){ frameCheck.checked(false);}

  if(radialCheck.checked() == false){ radialCheck.checked(true);}
}

function myDiamondCheck(){
  if(radialCheck.checked() == true){ radialCheck.checked(false);}
  if(frameCheck.checked() == true){ frameCheck.checked(false);}

  if(diamondCheck.checked() == false){ diamondCheck.checked(true);}
}

function myFrameCheck(){
  if(radialCheck.checked() == true){ radialCheck.checked(false);}
  if(diamondCheck.checked() == true){ diamondCheck.checked(false);}

  if(frameCheck.checked() == false){ frameCheck.checked(true);}
}



function exportSVG(){
  svgSaveToggle = true;
}

function exportPNG(){
  pngSaveToggle = true;
}
