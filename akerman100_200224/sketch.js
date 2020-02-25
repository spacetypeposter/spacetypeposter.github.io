let cols = 24;
let rows = 24;

let dashSize = 2;
let dashColor;

let rippleX, rippleY;
let maxX,maxY;

let spinEngine;
let spinSpeed;
let spinStart;
let spinEnd;

let rotSpeed;
let rippleSpeed;

let svgSaveToggle = false;
let pngSaveToggle = false;

let pGradient;

let gradient1, gradient2;

let pixelDensityCheck;

// SAVE BETA
var gifLength = 157;
var gifStart, gifEnd;
var gifRecord = false;
var canvas;

var capturer = new CCapture( {
  framerate: 30,
  format:'gif',
  workersPath: 'js/',
  verbose: true
} );

function preload() {
  font = loadFont('resources/IBMPlexMono-Medium.otf');
}

function setup() {
  var p5SaveCanvas = createCanvas(windowWidth, windowHeight);
  canvas = p5SaveCanvas.canvas;

  frameRate(30);

  rowsSlider = createSlider(0,100,34); rowsSlider.position(30,30); rowsSlider.style('width','100px');
  colsSlider = createSlider(0,100,34); colsSlider.position(30,60);colsSlider.style('width','100px');
  sizeSlider = createSlider(0,2,1,0.01); sizeSlider.position(30,90); sizeSlider.style('width','100px'); sizeSlider.changed(reSize);
  rotSpeedSlider = createSlider(0,4,1,0.01);rotSpeedSlider.position(30,120);rotSpeedSlider.style('width','100px');
  rippleSpeedSlider = createSlider(0,10,5,0.01);rippleSpeedSlider.position(30,150);rippleSpeedSlider.style('width','100px');

  radialCheck = createCheckbox(' ',true);radialCheck.position(30,190);radialCheck.changed(myRadialCheck);
  diamondCheck = createCheckbox(' ',false);diamondCheck.position(30,210);diamondCheck.changed(myDiamondCheck);
  frameCheck = createCheckbox(' ',false);frameCheck.position(30,230);frameCheck.changed(myFrameCheck);

  dashColorPick = createInput('FF0000'); dashColorPick.position(30,270); dashColorPick.style('width','40px');
  bkgdColorPick = createInput('FFFFFF'); bkgdColorPick.position(30,300); bkgdColorPick.style('width','40px');

//  solidCheck = createCheckbox(' ',true); solidCheck.position(30,410);solidCheck.changed(mySolidCheck);
//  gradientCheck = createCheckbox(' ',false);gradientCheck.position(30,430);gradientCheck.changed(myGradientCheck);

//  gradient1Pick = createInput('FF0000'); gradient1Pick.position(30,460); gradient1Pick.style('width','40px');gradient1Pick.input(reSize);
//  gradient2Pick = createInput('0000FF'); gradient2Pick.position(30,490); gradient2Pick.style('width','40px');gradient2Pick.input(reSize);

  motionCheck = createCheckbox(' ',true);motionCheck.position(30,height-80);motionCheck.changed(myMotionCheck);
  scrubCheck = createCheckbox(' ',false);scrubCheck.position(30,height-60);scrubCheck.changed(myScrubCheck);
  scrubSlider = createSlider(0,200,0);scrubSlider.position(100,height-60);scrubSlider.style('width','300px');

  tlCheck = createCheckbox('',false); tlCheck.position(30,350); tlCheck.changed(myTLCheck);
  tcCheck = createCheckbox('',false); tcCheck.position(50,350); tcCheck.changed(myTCCheck);
  trCheck = createCheckbox('',false); trCheck.position(70,350); trCheck.changed(myTRCheck);
  clCheck = createCheckbox('',false); clCheck.position(30,370); clCheck.changed(myCLCheck);
  ccCheck = createCheckbox('',true); ccCheck.position(50,370); ccCheck.changed(myCCCheck);
  crCheck = createCheckbox('',false); crCheck.position(70,370); crCheck.changed(myCRCheck);
  blCheck = createCheckbox('',false); blCheck.position(30,390); blCheck.changed(myBLCheck);
  bcCheck = createCheckbox('',false); bcCheck.position(50,390); bcCheck.changed(myBCCheck);
  brCheck = createCheckbox('',false); brCheck.position(70,390); brCheck.changed(myBRCheck);
  mouseCheck = createCheckbox('',false); mouseCheck.position(30,410); mouseCheck.changed(myMouseCheck);

  saveSvgButton = createButton('Export SVG');saveSvgButton.position(30,445);saveSvgButton.mousePressed(exportSVG);
//  savePngButton = createButton('Export PNG');savePngButton.position(30,740);savePngButton.mousePressed(exportPNG);

  saveLoopSet = createButton('Save Loop'); saveLoopSet.position(30,470); saveLoopSet.mousePressed(saveLoop);

  rippleX = width/2;
  rippleY = height/2;
  maxX = 0;
  maxY = 0;

  pixelDensityCheck = pixelDensity();

//  gradient1 = color('#'+gradient1Pick.value());
//  gradient2 = color('#'+gradient2Pick.value());

//  buildGradientDash(gradient1,gradient2);
}

function draw() {
  if(svgSaveToggle){
    createCanvas(windowWidth,windowHeight,SVG);
  }

  if(gifRecord){
    pixelDensity(1);
  } else {
    pixelDensity(pixelDensityCheck);
  }

  dashColor = color('#'+dashColorPick.value());
  bkgdColor = color('#'+bkgdColorPick.value());
  rows = rowsSlider.value();
  cols = colsSlider.value();
  dashSize = sizeSlider.value();
  rotSpeed = rotSpeedSlider.value();
  rippleSpeed = rippleSpeedSlider.value()/100;


  if(svgSaveToggle || pngSaveToggle){
    clear();
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
        delayDist = dist(delayDistY,delayDistX,rippleX,rippleY)/2 * -rippleSpeed + 8*PI;
  //      delayDist = dist(delayDistX,delayDistY,rippleX,rippleY) * rippleSpeed;
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
        let maxDist = dist(rippleX,rippleY,maxX,maxY);
        let scrubValue = map(scrubSlider.value(),0,200,0,2*PI + maxDist*rippleSpeed/4);
        let spinner = scrubValue - delayDist*spinSteps;

        if(spinner>2*PI || spinner<0){
          spinner = 0;
        }

        rotate(spinner);
      }

  //    if(gradientCheck.checked()){
  //       image(pGradient,-pGradient.width/2,-pGradient.height/2);
  //    } else {
        dash(0,0,dashSize);
  //    }
      pop();
    }
  }

  spinEngine += spinSteps;

  if(svgSaveToggle || pngSaveToggle  || gifRecord){
  } else {
    textFont(font);
    fill(125);
    noStroke();
    textSize(9);
    text("Rows " + rows, 30, 30);
    text("Columns " + cols, 30, 60);
    text("Size " + dashSize, 30, 90);
    text("Spin Length " + rotSpeed, 30, 120);
    text("Ripple Length " + rippleSpeedSlider.value(), 30, 150);

    text("RIPPLE SHAPE", 30, 183);
    text("Radial", 50, 203);
    text("Diamond", 50, 223);
    text("Frame", 50, 243);

    text("DASH COLOR", 80, 283);
    text("BACKGROUND", 80, 313);

//    text("DASH STYLE", 30, 403);
//    text("Solid", 50, 423);
//    text("Gradient", 50, 443);

    // text("Gradient 1", 80, 473);
    // text("Gradient 2", 80, 503);

    text("RIPPLE CENTER", 30, 345);
    text("Mouse", 55, 423);

    text("Motion", 50, height-67);
    text("Scrub", 50, height-47);

    strokeWeight(1);
    fill(dashColor); stroke(bkgdColor);
    ellipse(30, 273, 30,30);
    fill(bkgdColor); stroke(dashColor);
    ellipse(30, 303, 30,30);

    // strokeWeight(1);
    // fill(gradient1); stroke(gradient2);
    // ellipse(30, 468, 30,30);
    // fill(gradient2); stroke(gradient1);
    // ellipse(30, 498, 30,30);
  }

  if(svgSaveToggle){
    save();
    svgSaveToggle = false;
  }

  if(pngSaveToggle){
    save('ackerman' + frameCount + '.png');
    pngSaveToggle = false;
  }

  if(gifRecord == true && frameCount==(gifStart+1)){
    capturer.start();
    capturer.capture(canvas);
//    print("start");
  } else if(gifRecord == true && frameCount<=gifEnd){
    capturer.capture(canvas);
//      print("record");
  } else if (gifRecord == true && frameCount==gifEnd+1) {
    capturer.stop();
    capturer.save();
//    print("stop");
    gifRecord = false;
  }
}

function mousePressed(){
  if(mouseCheck.checked() && mouseX>150){
    rippleX = mouseX; rippleY = mouseY;
    maxX = mouseX + width; maxY = mouseY + height;
  }

  spinStart = frameCount;
  spinEnd = frameCount + (30*rotSpeed);
  spinEngine = 0;
}

function saveLoop() {
  let maxDist2 = dist(rippleX,rippleY,maxX,maxY);
  let gifGuess = (30*rotSpeed) + maxDist2*rippleSpeed;

  gifLength = round(gifGuess) + 15;

  if(confirm('Click OK to generate your gif.\nThe process will take a minute. Be patient, please!')){
    gifStart = frameCount;
    gifEnd = gifStart + gifLength;
    gifRecord = true;
  } else {
    gifRecord = false;
  }
}

function buildGradientDash() {
  pGradient = createGraphics(100*dashSize/4,16*dashSize/4);

  gradient1 = color('#'+gradient1Pick.value())
  gradient2 = color('#'+gradient2Pick.value())

  pGradient.pixelDensity(pixelDensityCheck);
//  pGradient.background(0,255,0);
  for(var i=0; i<42; i++){
      let gradientColor = lerpColor(gradient1,gradient2,i/42);
      pGradient.stroke(gradientColor);
      pGradient.strokeWeight(dashSize/4);
      pGradient.noFill();
      pGradient.line(i*dashSize/4,8*dashSize/4,i*dashSize/4 + 8*dashSize/4,0);
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

function reSize() {
  dashSize *= 2;
  buildGradientDash();
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

function myTRCheck(){
  rippleX = width; rippleY = 0;
  maxX = 0; maxY = height;

  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(trCheck.checked() == false){ trCheck.checked(true);}
}
function myTCCheck(){
  rippleX = width/2; rippleY = 0;
  maxX = 0; maxY = height;

  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(tcCheck.checked() == false){ tcCheck.checked(true);}
}
function myTLCheck(){
  rippleX = 0; rippleY = 0;
  maxX = width; maxY = height;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(tlCheck.checked() == false){ tlCheck.checked(true);}
}
function myCLCheck(){
  rippleX = 0; rippleY = height/2;
  maxX = width; maxY = 0;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(clCheck.checked() == false){ clCheck.checked(true);}
}
function myCCCheck(){
  rippleX = width/2; rippleY = height/2;
  maxX = 0; maxY = 0;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(ccCheck.checked() == false){ ccCheck.checked(true);}
}
function myCRCheck(){
  rippleX = width; rippleY = height/2;
  maxX = 0; maxY = 0;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(crCheck.checked() == false){ crCheck.checked(true);}
}
function myBRCheck(){
  rippleX = width; rippleY = height;
  maxX = 0; maxY = 0;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(brCheck.checked() == false){ brCheck.checked(true);}
}
function myBCCheck(){
  rippleX = width/2; rippleY = height;
  maxX = 0; maxY = 0;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(bcCheck.checked() == false){ bcCheck.checked(true);}
}
function myBLCheck(){
  rippleX = 0; rippleY = height;
  maxX = width; maxY = 0;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(mouseCheck.checked() == true){ mouseCheck.checked(false);}

  if(blCheck.checked() == false){ blCheck.checked(true);}
}

function myMouseCheck(){
  rippleX = mouseX; rippleY = mouseY;
  maxX = mouseX+width; maxY = mouseY+height;

  if(trCheck.checked() == true){ trCheck.checked(false);}
  if(tlCheck.checked() == true){ tlCheck.checked(false);}
  if(tcCheck.checked() == true){ tcCheck.checked(false);}
  if(clCheck.checked() == true){ clCheck.checked(false);}
  if(ccCheck.checked() == true){ ccCheck.checked(false);}
  if(crCheck.checked() == true){ crCheck.checked(false);}
  if(brCheck.checked() == true){ brCheck.checked(false);}
  if(bcCheck.checked() == true){ bcCheck.checked(false);}
  if(blCheck.checked() == true){ blCheck.checked(false);}

  if(mouseCheck.checked() == false){ mouseCheck.checked(true);}
}

function exportSVG(){
  svgSaveToggle = true;
}
function exportPNG(){
  pngSaveToggle = true;
}
