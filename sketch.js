let radius = 200;
let segmentCount = 40;
let ringCount = 25;
let typeX;
let typeY = 40;
let bkgdColor, backRibbon, frontRibbon, typeColor;
let typeStroke = 1;
let SA;
let mobile;

let heightRandom = [];
let xAngleRandom = [];
let zAngleRandom = [];
let radiusRandom = [];
let typeYrandom = [];
let selectorRandom = [];
let speedRandom = [];
let innerRandom = [];

function preload() {
  font = loadFont('Tratto-Trial-Medio.otf');
  img = loadImage('stg_typoposter4-01.png');

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  typeColor = color('#ff0000');
  bkgdColor = color('#ffffff');
  backRibbon = color('#0000ff');
  frontRibbon = color('#ffffff');
    
  for(var r1=0; r1<ringCount; r1++){ heightRandom[r1] = random(-height*3/8,height*3/8); }
  for(var r2=0; r2<ringCount; r2++){ xAngleRandom[r2] = random(-PI/8,PI/8); }
  for(var r3=0; r3<ringCount; r3++){ zAngleRandom[r3] = random(-PI/8,PI/8); }
  for(var r4=0; r4<ringCount; r4++){ radiusRandom[r4] = random(50,width*3/8); }
  for(var r5=0; r5<ringCount; r5++){ typeYrandom[r5] = random(20,70); }
  for(var r6=0; r6<ringCount; r6++){ selectorRandom[r6] = round(random(1,10)); }
  for(var r7=0; r7<ringCount; r7++){ speedRandom[r7] = random(-100,100); }
  for(var r8=0; r8<ringCount; r8++){ innerRandom[r8] = random(0,3); }
}

function draw() {
  background(bkgdColor);
  if(rotationX == 0 && rotationY == 0 && rotationZ ==0){
    mobile = 0;
  } else {
    mobile = 1;
  }
  
  
  //  rotating cammera
  push();
  if(mobile==1){
//    rotateX(radians(rotationX*0.4)+PI/3-PI/2);
//    rotateY(radians(rotationY*0.3));
    rotateX(radians(rotationX)-PI/4);
    rotateY(radians(rotationY));
    rotateZ(radians(rotationZ));
  }
  textFont(font);
    
  SA = typeStroke/2;
  
  let pieSlice = 2*PI/segmentCount;

  for(var j =0; j<ringCount; j++){
    push();
    translate(0,heightRandom[j],0);
    rotateX(xAngleRandom[j]);
    rotateZ(zAngleRandom[j]);
    
    radius = radiusRandom[j];
    typeX = 2*PI*radius/segmentCount;
    typeY = typeYrandom[j];
    
    for(var i=0; i<segmentCount; i++){
      push();
        rotateY(i*pieSlice + frameCount*speedRandom[j]/10000);
        translate(0,0,radius);
        translate(-typeX/2,-typeY/2,0);
      
        // graphic
        ringSelection(selectorRandom[j]);
        
        // front ribbon
        translate(0,0,-0.5);
        fill(frontRibbon); noStroke();
        rect(0,0,typeX,typeY);
    
        // back ribbon
        translate(0,0,-0.5);
        fill(backRibbon); noStroke();
        rect(0,0,typeX,typeY);
      pop();
    }
    pop();
  }
  pop();
  
  noStroke();
  texture(img);
  
  if(mobile==1){
    plane(width*0.9,height);
  } else {
    plane(height*0.5625,height);
  }
}

function ringSelection(selector) {
  if(selector == 1){
    graphic_a();
  } else if(selector == 2){
    graphic_b();
  } else if(selector == 3){
    graphic_c();
  } else if(selector == 4){
    graphic_d();
  } else if(selector == 5){
    graphic_e();
  } else if(selector == 6){
    graphic_f();
  } else if(selector == 7){
    graphic_g();
  } else if(selector == 8){
    graphic_h();
  } else if(selector == 9){
    graphic_i();
  } else if(selector == 10){
    graphic_j();
  }
}

function mouseClicked() {
  for(var r1=0; r1<ringCount; r1++){ heightRandom[r1] = random(-height*3/8,height*3/8); }
  for(var r2=0; r2<ringCount; r2++){ xAngleRandom[r2] = random(-PI/8,PI/8); }
  for(var r3=0; r3<ringCount; r3++){ zAngleRandom[r3] = random(-PI/8,PI/8); }
  for(var r4=0; r4<ringCount; r4++){ radiusRandom[r4] = random(50,width*3/8); }
  for(var r5=0; r5<ringCount; r5++){ typeYrandom[r5] = random(20,70); }
  for(var r6=0; r6<ringCount; r6++){ selectorRandom[r6] = round(random(1,10)); }
  for(var r7=0; r7<ringCount; r7++){ speedRandom[r7] = random(-100,100); }
  for(var r8=0; r8<ringCount; r8++){ innerRandom[r8] = random(0,3); }
}


function touchEnded() {
  for(var r1=0; r1<ringCount; r1++){ heightRandom[r1] = random(-height*3/8,height*3/8); }
  for(var r2=0; r2<ringCount; r2++){ xAngleRandom[r2] = random(-PI/8,PI/8); }
  for(var r3=0; r3<ringCount; r3++){ zAngleRandom[r3] = random(-PI/8,PI/8); }
  for(var r4=0; r4<ringCount; r4++){ radiusRandom[r4] = random(50,width*3/8); }
  for(var r5=0; r5<ringCount; r5++){ typeYrandom[r5] = random(20,70); }
  for(var r6=0; r6<ringCount; r6++){ selectorRandom[r6] = round(random(1,10)); }
  for(var r7=0; r7<ringCount; r7++){ speedRandom[r7] = random(-100,100); }
  for(var r8=0; r8<ringCount; r8++){ innerRandom[r8] = random(0,3); }
}