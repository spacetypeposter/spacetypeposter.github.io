function drawTextures(){
  c1 = color(gradient1pick.value());
  c2 = color(gradient2pick.value());
  bkgdColor = color(backgroundPicker.value());
  foreColor = color(forePicker.value());

  createText();
  createTextInside();
  createGradient();
}

function createText(){
  textSize(pgTextSize);

  textFont(uFontReg);
  repeatSize = round(textWidth(mainText1));

  pgT = createGraphics(1024,pgTextSize);
  // pgT.background(foreColor);
  pgT.fill(bkgdColor);
  pgT.noStroke();
  pgT.textAlign(CENTER);

  pgT.textSize(pgTextSize);

  pgT.textFont(uFontReg);
  pgT.text(mainText1,pgT.width/2,pgT.height/2 + pgTextSize*0.7/2);
}

function createTextInside(){
  textSize(pgTextSize);

  textFont(uFontReg);
  repeatSize = round(textWidth(mainText1));

  pgTinside = createGraphics(1024,pgTextSize);
  // pgT.background(foreColor);
  pgTinside.fill(100);
  pgTinside.noStroke();
  pgTinside.textAlign(CENTER);

  pgTinside.textSize(pgTextSize);

  pgTinside.textFont(uFontReg);
  pgTinside.text(mainText1,pgT.width/2,pgT.height/2 + pgTextSize*0.7/2);
}

function createGradient(){
  pgGradient = createGraphics(2048,2048);

  for(var g = 0; g<height; g++){
    var lerpC = lerpColor(c1,c2,g/height);
    pgGradient.stroke(lerpC);
    pgGradient.strokeWeight(1);
    pgGradient.noFill();
    pgGradient.line(0,g,pgGradient.width,g);
  }

}
