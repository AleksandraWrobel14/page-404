let tombs = [];
let tombImg, tombImgHover,tombImgLit, zniczImg,backgroundImg;
let gx, gy;
let trails = [];


let links = [
  "https://web.archive.org/web/20030601000000/http://www.bramka.pl","https://web.archive.org/web/20030301000000/http://bash.org.pl","https://web.archive.org/web/20050501000000/http://blox.pl","https://web.archive.org/web/20050501000000/http://blog.onet.pl","https://web.archive.org/web/20041001000000/http://www.strony.toya.net.pl/~fixxxer/glowna.htm","https://web.archive.org/web/20051001000000/http://www.wiki256.pl/tymbark.html","https://web.archive.org/web/20010616081433/http://www.go2net.com/useless/index.html","https://web.archive.org/web/20080610115253/http://www.teamxbox.com/","https://web.archive.org/web/20000301211357/http://www.planethalflife.com/","https://web.archive.org/web/20060822211046/http://www.koreaforgottenconflict.com/","https://web.archive.org/web/20040526022308/http://polter.pl/","https://web.archive.org/web/20200227171639/http://www.slyck.com/","https://web.archive.org/web/20060528193548/http://www.astronomia.pl/","https://web.archive.org/web/20160317041623/http://www.ministryofmisanthropy.com/","https://web.archive.org/web/20120729153844/http://cofffeandcigarretes.blogspot.com/","https://web.archive.org/web/20050410005354/http://bajery.net/","https://web.archive.org/web/20180313104323/http://www.avatarsland.com/","https://web.archive.org/web/20180810203413/http://abckidsgames.us/","https://web.archive.org/web/20160208210003/http://www.officialscoobydoocostumes.com/","https://web.archive.org/web/20120503195657/http://freespongebobgames.net/","https://web.archive.org/web/20060901081742/http://espressopizza.signonsandiego.com/","https://web.archive.org/web/20160105204349/http://www.cucumbertown.com/","https://web.archive.org/web/20130309194009/http://vegancookclub.blogspot.com/","https://web.archive.org/web/20141222022625/http://spiderman.games235.com/"
];

let labels = [
  "2006","2005","2006","2005","2005","2006","2001","2018","2012","2006","2004","2020","2015","2016","2016","2005","2016","2018","2018","2021","2006","2015","2024","2018"
];

function preload() {
  tombImg = loadImage('grob-2.png');        // zwykły grób
  tombImgHover = loadImage('grobglow.png');  // grób po najechaniu
  zniczImg = loadImage('candle_3.png');//znicz
  backgroundImg = loadImage('background.png');// tło
  tombImgLit = loadImage('grob_1.png'); // nowy wygląd grobu po zapaleniu znicza
}

function setup() {
  createCanvas(windowWidth,windowHeight);
   gx = width / 2;
    gy = height / 2;
    noCursor();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(255);

  let tombWidth = 174;
  let tombHeight = 154;
  let padding = 5;

  let areaW = windowWidth-(0.09*windowWidth);
  let areaH = windowHeight;
  let areaX = (windowWidth - areaW) / 2;
  let areaY = windowHeight / 2.5;

  let maxTries = 800;
  let tries = 0;
  let index = 0;

  while (index < links.length && tries < maxTries) {
    let x = random(areaX + tombWidth / 2, areaX + areaW - tombWidth / 2);
    let y = random(areaY + tombHeight / 2, windowHeight - tombHeight / 2);

    let overlapping = false;
    for (let other of tombs) {
      let dx = abs(x - other.x);
      let dy = abs(y - other.y);
      if (dx < tombWidth + padding && dy < tombHeight + padding) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      tombs.push(new Tomb(x, y, links[index], labels[index]));
      index++;
    }

    tries++;
  }

  if (tries === maxTries) {
    console.warn("Nie udało się rozmieścić wszystkich grobów bez nachodzenia.");
  }
}

function draw() {
  background(0);
  image(backgroundImg,0,0,width,height);

  for (let tomb of tombs) {
    tomb.tombHover();
    tomb.display();
  }
  duszek();
}

function mousePressed() {
  for (let tomb of tombs) {
    if (tomb.hover && !tomb.lit) {
      window.open(tomb.url, '_blank');
      tomb.lit = true;
    }
  }
}

function duszek(){

    
    gx += (mouseX - gx) * 0.1;
    gy += (mouseY - gy) * 0.08;
    
    if (frameCount % 5 == 0) {
        trails.push({x: gx, y: gy, s: 8, a: 80, t: 25});
    }
    
    for (let i = trails.length - 1; i >= 0; i--) {
        let tr = trails[i];
        fill(255, tr.a);
        ellipse(tr.x, tr.y, tr.s);
        tr.y -= 0.5;
        tr.s += 0.4;
        tr.a -= 3;
        tr.t--;
        if (tr.t <= 0) trails.splice(i, 1);
    }
    
    push();
    translate(gx, gy + sin(frameCount * 0.1));
    
    fill(255, 255, 255, 130);
    ellipse(0, 0, 25, 30);
    
    for (let i = 0; i < 3; i++) {
        ellipse(-6 + i * 6, 12 + sin(frameCount * 0.1 + i), 6, 8);
    }
    
    fill(0);
    ellipse(-4, -2, 5, 6);
    ellipse(4, -2, 5, 6);
    
    fill(200, 50, 50);
    ellipse(-4, -2, 2, 2);
    ellipse(4, -2, 2, 2);
    
    stroke(0);
    line(-2, 5, 2, 5);
    noStroke();
    
    pop();
  
}

class Tomb {
  constructor(x, y, url, label) {
    this.x = x;
    this.y = y;
    this.w = 174;
    this.h = 154;
    this.hover = false;
    this.url = url;
    this.label = label;
    this.clicked = false;
    this.lit = false; // <-- znicz zapalony?
  }

  tombHover() {
    this.hover =
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2;
  }

  tombClick() {
    // klik tylko raz – zapala znicz na stałe
    if (this.hover && mouseIsPressed && !this.clicked) {
      window.open(this.url, '_blank');
      this.lit = true;
      this.clicked = true;
    }

    if (!mouseIsPressed) {
      this.clicked = false;
    }
  }

  display() {
    noStroke();

    if (this.lit) {
  image(tombImgLit, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
} else if (this.hover) {
  image(tombImgHover, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
} else {
  image(tombImg, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
}

    // podpis na środku grobu
    fill("#ecffba");
    text(this.label, this.x, this.y);

    // jeśli zapalono znicz – pokaż go nad grobem
    if (this.lit) {
      imageMode(CENTER);
      image(zniczImg, this.x, this.y - this.h / 2 - 10, 80, 80);
      imageMode(CORNER);
    }
  }
}
