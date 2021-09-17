let world = 1;
let highWorld = 1;
let phase = 0;//0=top, 1=game. 2=mlose, 3=mwin, 4=tlose, 5=timeup
let solo = true;
let credit = false;
let Grid = []; //２次元配列を用意する
let tdY = [];
let current; //クラスの宣言 currentという名前のTetriminoクラス
let time = 300*30;
let glitter = 0;
let restartDelay = 0;
let score = 0;
let highScore = 0;
let pop = 0;
let popY = 0;
let popX = 0;
let pop7Y = 0;
let pop7X = 0;
let popDelay = 0;
let trec = [];
let srec = [];
let tsum = 0;
let congrats = 0;
let isUserStarted = false;
let muted = true;
//tetris
let initPosX = 0;
let initPosY = 0;
let rot = 0;
let fixDelay = 0;
let fixCount = 0;
let fallSpeed = 24;
let fallDelay = 0;
let dropDelay = 0;
let slideSpeed = 2;
let slideDelay = 0;
let color = [1,2,3,4,5,6,7];
//mario
let mx = 64;
let my = 192;
let vmx = 0;
let vmy = 0;
let fmx = 0;
let fmy = 0;
let jump = false;
let landed = false;
let move = 1;
let tmove = 0;
let mstop = false;
let hitH = false;
let hitF = false;
let hitL = false;
let hitR = false;
let jmy = 0;
const inertia = 0.75;
let jumppower = 7;
const dashSpeed = 4;
const gravity = 0.75
//keyboard
let p_s = false;
let p_w = false;
let p_space = false;
let p_a = false;
let p_d = false;
let p_left = false;
let p_right = false;
let p_up = false;
let p_down = false;
//assets
let i_b = [];
let i_m = [];
let i_c = [];
let i_t = [];
let i_p = [];
let mFont;
let bgm;

function preload(){
  bgm = loadSound('assets/tetrio.mp3');
  mFont = loadFont('assets/PixelEmulator-xq08.ttf');
  for(let i = 1; i < 16; i++){
    i_b[i] = loadImage('assets/b'+ i +'.PNG');
  }
  for(let i = 0; i < 11; i++){
    i_m[i] = loadImage('assets/m'+ i +'.PNG');
  }
  for(let i = 1; i < 4; i++){
    i_c[i] = loadImage('assets/c'+ i +'.PNG');
  }
  for(let i = 1; i < 6; i++){
    i_t[i] = loadImage('assets/t'+ i +'.PNG');
  }
  for(let i = 1; i < 6; i++){
    i_p[i] = loadImage('assets/p'+ i +'.PNG');
  }
  //i_8.imageSmoothingEnabled = false;
}

function setup(){
  noSmooth()
  pixelDensity(1);
  var cnv = createCanvas( 256, 224 );
  cnv.id('mycanvas');
  cnv.imageSmoothingEnabled = false;
  windowResized();

  //getAudioContext().suspend();
  bgm.setVolume(0.1);

  frameRate(30);
  //テキストのフォント設定
  textFont(mFont);
  textSize(10.235);

  current = new Tetrimino();//クラスの作成

  for(let i = 0; i < 16; i++){
    tdY[i] = [];
    Grid[i] = []; // create nested array
    for(let k = 0; k < 20; k++){
      tdY[i][k] = 0;
      if((1<k&&i<3)||(1<k&&12<i)){
        Grid[i][k] = 11;
      }else if(k==13){
        Grid[i][k] = 12;
      }else{
        Grid[i][k] = 0;
      }
    }
  }
  Grid[11][9]=7;
  Grid[15][1]=13;


  if(localStorage.getItem('highScore')){
    highScore = localStorage.getItem('highScore');
  }if(localStorage.getItem('highWorld')){
    highWorld = localStorage.getItem('highWorld');
  }
}

function windowResized(){
  let cnv = document.getElementById( "mycanvas" );
  cnv.style.width = min(window.innerHeight*8/7, window.innerWidth) + 'px';
  cnv.style.height =  min(window.innerHeight, window.innerWidth*7/8) + 'px';
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////キーボード入力//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function mousePressed(){
  if(0<=mouseX&&mouseX<=24&&0<=mouseY&&mouseY<=24){
    if(muted){
      if(phase == 1){
        bgm.loop();
      }
      muted = false;
    }else{
      if(phase == 1){
        bgm.pause();
      }
      muted = true;
    }
  }
}
function touchStarted() {
  if (!isUserStarted) {
    // touchStarted()を1回だけ呼び出されるようにする
    print('touch');
    userStartAudio();
    isUserStarted = true;
  }
}

function keyPressed(){
  if(keyCode == 65 && !p_a){//aのコード
    p_a = true;
    move = -2;
  }
  if(keyCode == 83 && !p_s && landed){//sのコード
    jump = true;
    p_s = true;
  }
  if(keyCode == 87 && !p_w && landed){//wのコード
    jump = true;
    p_w = true;
  }
  if(keyCode == 32 && !p_space && landed){//spaceのコード
    jump = true;
    p_space = true;
  }
  if(keyCode == 68 && !p_d){//dのコード
    p_d = true;
    move = 2;
  }
  //回転
  if(keyCode == 38){//↑のコード
    if(!p_up) p_up = true;
    if(world == 1 && phase == 0){
      changesolo();
    }
  }
  if(keyCode == 37 && !p_left){//←のコード
    if(phase == 1){
      p_left = true;
      tmove = -1;
      slideDelay = -4;
    }else if(solo && phase == 0 && !trec[world-1] && highWorld != 1){
      if(1<world){
        world --;
        restart();
      }else{
        world = highWorld;
        restart();
      }
    }
  }
  if(keyCode == 39 && !p_right){//→のコード
    if(phase == 1){
      p_right = true;
      tmove = 1;
      slideDelay = -4;
    }else if(solo && phase == 0 && !trec[world-1] && highWorld != 1){
      if(world < highWorld){
        world ++;
        restart();
      }else{
        world = 1;
        restart();
      }
    }
  }
  if(keyCode == 40 && !p_down){//↓のコード
    if(phase == 1 && solo){
      p_down = true;
      dropDelay = 0;
    }else if(world == 1 && phase == 0){
      changesolo();
    }
  }
}

function keyReleased(){
  if (keyCode == 65) {//aのコード
    p_a = false;
    if(p_d){
      move = 2;
    }else{
      move = -1;
    }  
  }
  if(keyCode == 83){//sのコード
    jump = false;
    p_s = false;
  }
  if(keyCode == 87){//wのコード
    jump = false;
    p_w = false;
  }
  if(keyCode == 32){//spaceのコード
    jump = false;
    p_space = false;
  }
  if(keyCode == 68){//dのコード
    p_d = false;
    if(p_a){
      move = -2;
    }else{
      move = 1;
    }
  }
  if(keyCode == 38){//dのコード
  }
  if(keyCode == 37){//←のコード
    p_left = false;
    if(p_right){
      tmove = 1;
    }else{
      tmove = 0;
    }
  }
  if(keyCode == 39){//→のコード
    p_right = false;
    if(p_left){
      tmove = -1;
    }else{
      tmove = 0;
    }
  }
  if(keyCode == 40){//↓のコード
    p_down = false;
  }
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////毎フレーム////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

function draw(){
  noStroke();
  background(0)
  

  //stats
  fill(255);
  if(muted){
    image(i_t[4], 0, 7);
  }else{
    image(i_t[5], 0, 7);
  }
  text("TETRIO", 23, 15);
  if(solo){text( ("000000" + score).slice( -6 ), 22, 23);}
  image(i_c[max(1, ceil(sin(glitter/5)*1.2)+1)], 89, 16);
  textAlign(RIGHT);
  text(world+"-4", 174, 23);
  textAlign(LEFT);
  text("WORLD", 144, 15);
  text("TIME", 202, 15);
  text( ("000" + floor(time/30)).slice( -3 ) + "    s", 208, 23);
  if(phase == 0){
    if(solo && !trec[world-1] && highWorld != 1){
      image(i_t[3], 144, 16);
    }
    if(world == 1){
      if(!credit){
        text("1 PLAYER GAME", 70, 148);
        text("2 PLAYER GAME", 69, 164);
        text("TOP- "+("000000" + highScore).slice( -6 ), 78, 188);
        if(solo){
          image(i_t[1], 48, 24);
        }else{
          image(i_t[2], 48, 24);
        }
      }else{
        text("made by", 60, 47);
        text("takuma onishi", 68, 55);
        text("with", 60, 79);
        text("processing/P5.js", 68, 87);
        text("inspired by", 60, 111);
        text("ko aoki", 67, 119);
        text("bgm by", 60, 143);
        text("maretu", 67, 151);
        text("apologizing to", 60, 175);
        text("nintendo", 68, 183);
        text("tetris hldg.", 68, 191);
        credit = false;
      }
    }
  }

  //static blocks
  for(let i = 0; i < 16; i++){
    for(let k = 0; k < 15; k++){
      if(Grid[i][k] == 7||Grid[i][k] == 13){
        image(i_b[(Grid[i][k])+max(0, ceil(sin(glitter/5)*1.2))],i*16, k*16-8+tdY[i][k]);
      }else if(Grid[i][k]!=0){
        image(i_b[(Grid[i][k])],i*16, k*16-8+tdY[i][k]);
      }
    }
  }

  if(phase != 2 && !(phase == 5 && solo) && !mstop){
    moveM();
    if(phase != 4){
      glitter++;
    }
    if(phase == 1){
      if(0<time){
        time--;
      }else{
        phase = 5;
        bgm.stop();
      }
      moveT();
      displayCurrent();
      verifyGrid();
    }
    checkCollision();
  }

  if(phase == 2||phase == 3||phase == 5){
    if(time != 300*30){
      displayCurrent();
    }
  }

  if(phase != 2 && !(phase == 5 && solo)){
    //mario
    if(0<move||mstop){
      if(jump||mstop){
        image(i_m[4], round(mx)-8, round(my)-8);
      }else{
        if(vmx == 0){
          image(i_m[0], round(mx)-8, round(my)-8);
        }else{
          image(i_m[(1+abs(floor(mx/8)%4-1))], round(mx)-8, round(my)-8);
        }
      }
    }else{
      if(jump){
        image(i_m[9], round(mx)-8, round(my)-8);
      }else{
        if(vmx == 0){
          image(i_m[5], round(mx)-8, round(my)-8);
        }else{
          image(i_m[(6+abs(floor(mx/8)%4-1))], round(mx)-8, round(my)-8);
        }
      }
    }
  }else{
    if(20<restartDelay){
      vmy+=gravity;
      my = round(my-8+vmy);
    }
    image(i_m[10], mx-8, my-8);
  }

  if(0 < pop){
    popDelay ++
    if(solo){
      image(i_p[pop], 120+popX, popY-popDelay);
    }
    if(pop == 5 && popDelay <= 7){
      tdY[pop7X][pop7Y] -= (4-popDelay);
    }
    if(20 < popDelay){
      pop = 0;
      popDelay = 0;
      popX = 0;
      popY = 0;
    }
  }

  fill(255);
  if(phase == 0 && world!=1){
    text("WORLD "+world+"-4", 94, 103);
  }else if(phase == 2){//mlose
    if(!solo){
      text("TETRIS WINS", 86, 119);//mlose
    }else{
      text("GAME OVER", 94, 119);
    }
    restartDelay++;
    if(100<restartDelay){
      if(solo) world=1;
      restart();
    }
  }else if(phase == 3){//mwin
    if(world == 8){
      if(congrats == 0){
        text("ALL", 117, 103);
        text("WORLD CLEAR!", 85, 119);
      }else if(congrats == 13){
        text("TETRIO", 106, 103);
        text("BY TAKUMA ONISHI", 65, 119);
      }else if(congrats == 14){
        text("SCORE", 109, 71);
        text("TOTAL", 80, 169);
        textAlign(RIGHT);
        for(let x = 0; x <= 1; x++){
          for(let y = 1; y <= 4; y++){
            text(x*4+y+"-4", 76+x*80, 79+y*16);
            if(srec[x*4+y]){
              text(srec[x*4+y], 124+x*80, 79+y*16);
            }else{
              text("-", 104+x*80, 79+y*16);
            }
          }
        }
        text(score, 172, 169);
        textAlign(LEFT);
      }else{
        text("TIME", 113, 71);
        text("TOTAL", 80, 169);
        textAlign(RIGHT);
        for(let x = 0; x <= 1; x++){
          for(let y = 1; y <= 4; y++){
            text(x*4+y+"-4", 76+x*80, 79+y*16);
            if(trec[x*4+y]){
              text(trec[x*4+y], 124+x*80, 79+y*16);
            }else{
              text("-", 104+x*80, 79+y*16);
            }
          }
        }
        if(tsum != 0){
          text(tsum.toFixed(2), 172, 169);
        }else{
          text("-", 148, 169);
        }
        textAlign(LEFT);
      }
      if(1000<restartDelay){
        restartDelay--;
      }
    }else if(!solo){
      text("MARIO WINS", 90, 119);
    }else {
      text("WORLD CLEAR!", 85, 119);
    }
    restartDelay++;
    for(let i = 3; i <= 12; i++){
      for(let y = 0; y <= 20; y++){
        tdY[i][y] += max(0, restartDelay-12+i)*gravity;
      }
    }
    if(mstop){
      if(120<=time){//1秒＝30time＝10点
        time-=120;
        score+=40;
      }else if(30<=time){
        time-=30;
        score+=10;
      }else if(256<tdY[3][0]){
        restartDelay = 1000;
        for(let i = 0; i < 4; i++){
          Grid[(current.getShapeX(i) + initPosX)][(current.getShapeY(i) + initPosY)] = current.col;
        }
        for(let x = 3; x < 13; x++){
          for(let y = 0; y < 16; y++){
            Grid[x][y] = 0;
          }
        }
        initPosY = 20
        if(solo){
          if(srec[9]){
            srec[world] = score - srec[9];
          }else{
            srec[world] = score;
          }
          srec[9] = score;
        }
        mstop = false;
      }
    }
    if(1080<restartDelay){
      if(solo){
        world ++;
      }
      restart();
    }
  }else if(phase == 4){//tlose
    if(!solo){
      text("MARIO WINS", 90, 119);
    }else{
      text("GAME OVER", 94, 119);
    }
    restartDelay++;
    if(100<restartDelay){
      if(solo) world=1;
      restart();
    }
  }else if(phase == 5){//timeup
    if(!solo){
      text("DRAW", 113, 119);
    }else{
      text("TIME UP", 101, 119);
    }
    restartDelay++;
    if(100<restartDelay){
      if(solo) world=1;
      restart();
    }
  }
}


////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////関数とクラス////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


function moveM(){//mario controls
  if(move == -2){
    if(-dashSpeed < vmx){
      vmx -= inertia;
    }
  }else if(move == 2){
    if(vmx < dashSpeed){
      vmx += inertia;
    }
  }else if(move == 1||move == -1){
    if(vmx < 0){
      vmx += inertia;
    }else if(0 < vmx){
      vmx -= inertia;
    }
  }
  fmx = mx;
  fmy = my;
  mx += vmx;

  if(0 < jmy && !landed){
    jmy -= 2;
  }else{
    jmy = 0;
  }
  if(jump){
    jmy = jumppower;
  }
  my -= jmy;
  if(!landed){
    vmy += gravity;
    my += vmy;
  }
  mx = round(mx);
  my = round(my);
}
function moveT(){//tetris controls
  if(p_up){
    trotate();
    p_up=false;
  }
  if(tmove == -1){
    if(slideSpeed < slideDelay||slideDelay == -3){
      tleft();
      slideDelay = min(0, slideDelay);
    }
    slideDelay ++;
  }
  if(tmove == 1){
    if(slideSpeed < slideDelay||slideDelay == -3){
      tright();
      slideDelay = min(0, slideDelay);
    }
    slideDelay ++;
  }
  //stopするかの判定
  let canGo = 0;
  let out = 0;
  for(let i = 0; i < 4; i++){
    if(14 < current.getShapeY(i)+initPosY){
      out++;
    }
    if(current.getShapeY(i)+initPosY < -1){
      canGo++;
    }else if(Grid[(current.getShapeX(i) + initPosX)][(current.getShapeY(i) + initPosY + 1)] == 0){
      canGo ++;
    }
  }
  fallDelay++;
  if(canGo != 4||out == 4){
    fixDelay ++;
    fallDelay --;
    if(15 <= fixCount){
      fixDelay = 15;
    }
  }else if(p_down){
    dropDelay ++;
    score ++;
  }
  if(fallSpeed < fallDelay||0 < dropDelay){
    fallDelay = 0;
    dropDelay = -fallSpeed/20; //dropDelay factor
    fixDelay = 0;
    fixCount = 0;
    initPosY++;
    if(tdY[pop7X][pop7Y] != 0){
      pop7Y ++;
      tdY[pop7X][pop7Y] = tdY[pop7X][pop7Y-1];
      tdY[pop7X][pop7Y-1] = 0;
    }
    for(let i = 0; i < 4; i++){
      let x = (current.getShapeX(i)+initPosX)*16+8;
      let y = (current.getShapeY(i)+initPosY)*16;
      if(abs(y-my)<=14){
        if(abs(x-mx)<=14 && abs(x-fmx)<14){
          if(mx<=x-10){//hitright
            mx = x-14;
            fmx = x-14;
            vmx = -3;
          }else if(x+10<=mx){//hitleft
            mx = x+14;
            fmx = x+14;
            vmx = 3;
          }else{ //hithead
            hitH = true;
            my = y+15;
            vmy = 10;
            jmy = 0;
            jump = false;
            if(current.col == 7){
              pop = 5;
              tdY[pop7X][pop7Y] = 0;
              pop7X = current.getShapeX(i)+initPosX;
              pop7Y = current.getShapeY(i)+initPosY;
              score += 1000;
              popDelay = 0;
              popY = y-16;
              popX = x-128;
            }
          }
        }
      }
    }
  }
}

function checkCollision(){
  landed = false;
  //check moving block
  if(phase){
    for(let i = 0; i < 4; i++){
      const x = (current.getShapeX(i)+initPosX)*16+8;
      const y = (current.getShapeY(i)+initPosY)*16;
      if(abs(x-mx)<=13){
        if(my == y-15 && abs(x-fmx)<=13){
          hitF = true;
          vmy = 0;
          jump = false;
          landed = true;
        }else if(abs(y-my)<=14){
          if(abs(x-fmx)<14 && abs(y-fmy)<15){//回転により埋められたとき
            if(0<current.getShapeX(i)){//hithead
              hitH = true;
              my = y+15;
              fmy = y+15;
              vmy = 10;
              jmy = 0;
              jump = false;
              //console.log("ohhh");
            }else if(current.getShapeX(i)<0){//hitfoot
              hitF = true;
              my = y-15;
              fmy = y-15;
              vmy = -10;
              jump = false;
              landed = true;
              //console.log("ohhh");
            }else if(current.getShapeY(i)<0){//hitleft
              hitL = true;
              mx = x+14;
              fmx = x+14;
              vmx = 6;
              //console.log("ohhh");
            }else if(0<current.getShapeY(i)){//hitright
              hitR = true;
              mx = x-14;
              fmx = x-14;
              vmx = -6;
              //console.log("ohhh");
            }else{//hitfoot
              hitF = true;
              my = y-15;
              fmy = y-15;
              vmy = -10;
              jump = false;
              landed = true;
              //console.log("ohhh");
            }
          }
          if(fmx<=x-14){//hitright
            hitR = true;
            mx = x-14;
            vmx = 0;
          }else if(x+14<=fmx){//hitleft
            hitL = true;
            mx = x+14;
            vmx = 0;
          }else if(y+15<=fmy){//hithead if(y+15<=fmy)
            hitH = true;
            my = y+15;
            vmy = 0;
            jmy = 0;
            jump = false;
            if(current.col == 7){
              pop = 5;
              tdY[pop7X][pop7Y] = 0;
              pop7X = current.getShapeX(i)+initPosX;
              pop7Y = current.getShapeY(i)+initPosY;
              score += 1000;
              popDelay = 0;
              popY = y-16;
              popX = x-128;
            }
          }else if(fmy<=y-15){//hitfoot if(fmy<=y-15)
            hitF = true;
            my = y-15;
            vmy = 0;
            jump = false;
            landed = true;
          }
        }
      }
    }
  }
  //check static block
  for(let dy = 7; dy > -8; dy-=14){
    for(let dx = 7*Math.sign(move); abs(dx) < 8; dx-=14*Math.sign(move)){
      const x = floor((mx+dx)/16);
      const y = floor((my+dy+8)/16);
      if(0<=y && y<=15 && 0<=x && x<=15){
        if(Grid[x][y] != 0){
          if(Grid[x][y] == 13){
            if(phase == 1){
              Grid[x][y] = 0;
              mstop = true;
              if(solo){
                trec[world] = (300-time/30).toFixed(2);
                if(trec[1]){
                  tsum += (300-time/30);
                  //console.log(tsum.toFixed(2));
                }
              }
              phase = 3;//mwin
              bgm.stop();
            }
          }else if(abs(x*16+8-mx)<=13){
            if(my == y*16-15 && abs(x*16+8-fmx)<=13){//touchfoot
              if(hitH){
                phase = 2;
                bgm.stop();
                //console.log("deaaaaad")
              }
              vmy = 0;
              jump = false;
              landed = true;
              if(phase == 0){
                if(world == 1 && Grid[x][y] == 7){
                  credit = true;
                }
              }
            }else if(abs(y*16-my)<=14){
              if(fmx<=x*16+8-14){//hitright
                if(hitL){
                  phase = 2;
                  bgm.stop();
                  //console.log("deaaaaad")
                }
                mx = x*16-6;
                vmx = 0;
              }else if(x*16+8+14<=fmx){//hitleft
                if(hitR){
                  phase = 2;
                  bgm.stop();
                  //console.log("deaaaaad")
                }
                mx = x*16+16+6;
                vmx = 0;
              }else if(y*16+15<=fmy){//hithead
                if(hitF){
                  phase = 2;
                  bgm.stop();
                  //console.log("deaaaaad")
                }
                my = y*16+15;
                vmy = 0;
                jmy = 0;
                jump = false;
                if(world != 8||phase != 3){
                  if(Grid[x][y] == 7){
                    Grid[x][y] = 10;
                    pop = 5;
                    tdY[pop7X][pop7Y] = 0;
                    pop7X = x;
                    pop7Y = y;
                    score += 1000;
                    popY = 16*y-16;
                    popX = 16*x-120;
                    popDelay = 0;
                    if(phase == 0){
                      phase = 1;
                      if(!muted){
                        bgm.loop();
                      }
                      p_up = false;
                    }
                  }
                }else{
                  if(Grid[x][y] == 7){
                    Grid[13][0] = 7;
                    Grid[14][0] = 7;
                    Grid[15][0] = 7;
                    Grid[x][0] = 10;
                    congrats = x;
                  }else{
                    Grid[x][0] = 7;
                    congrats = 0;
                  }
                }
              }else if(fmy<=y*16-15){//hitfoot // if(fmy<=y*16-15)
                if(hitH){
                  phase = 2;
                  bgm.stop();
                  //console.log("deaaaaad")
                }
                my = y*16-15;
                vmy = 0;
                jump = false;
                landed = true;
              }else{
                phase = 2;
                bgm.stop();
                //console.log("dddddddddddddd")
              }
            }
          }
        }
      }else if(250<mx){//hitright
        if(hitL){
          phase = 2;
          bgm.stop();
          //console.log("deaaaaad")
        }
        mx = 250;
        vmx = 0;
      }else if(mx<6){//hitleft
        if(hitR){
          phase = 2;
          bgm.stop();
          //console.log("deaaaaad")
        }
        mx = 6;
        vmx = 0;
      }else if(15<y){
        my += 100;
        if(phase == 1||phase == 0){
          phase = 2;
          bgm.stop();
        }else if(phase == 3 && world == 8){
          world = 1;
          congrats = 0;
          phase = 0;
          restart();
        }
      }
    }
  }
  hitH = false;
  hitF = false;
  hitL = false;
  hitR = false;
}

function verifyGrid(){
  if(15 <= fixDelay){//stop
    //グリッドの色を塗り替えるか終了
    let deadline = 0;
    for(let i = 0; i < 4; i++){
      if((current.getShapeY(i)+initPosY) < 0){
        phase = 4;
        bgm.stop();
      }else if(current.getShapeY(i) + initPosY < 15){
        if((current.getShapeY(i)+initPosY) == 0){
          if(3<=(current.getShapeX(i) + initPosX) && (current.getShapeX(i) + initPosX)<=12){
            deadline = current.getShapeX(i) + initPosX;
          }else{
            phase = 4;
            bgm.stop();
          }
        }
        Grid[(current.getShapeX(i) + initPosX)][(current.getShapeY(i) + initPosY)] = current.col;
      }
    }
    //横一列に色がついていたら、ブロックを消す
    let count = 0;
    let height = 0;
    for(let y = 14; 0<y; y--){
      let destroy = true;
      for(let x = 3; x <= 12; x++){
        if(Grid[x][y] == 0||Grid[x][y] == 12) destroy = false;
      }
      if(destroy){
        /*if(solo){
          for(let i=y; i<=14; i++){
            for(let x=3; x<13; x++){
              Grid[x][i] = 0;
            }
          }
        }*/
        for(let y2 = y-1; y2 > -1; y2--){
          for(let x = 3; x < 13; x++){
            Grid[x][y2+1] = Grid[x][y2];
          }
        }
        for(let x = 3; x < 13; x++){
          Grid[x][0] = 0;
        }
        if(round(my/16)<y){
          if(Grid[floor((fmx-6)/16)][round(my/16)] != 0||Grid[floor((fmx+5)/16)][round(my/16)] != 0){//hithead
            my += 16;
            fmy += 16;
          }
          if(tdY[pop7X][pop7Y]!=0){
            pop7Y++;
          }
        }
        count++;
        height += y;
        if(solo){
          fallSpeed *= 0.9;
        }else{
          fallSpeed *= 0.8;
        }
        y++;//ズレた分下から判定再開
      }
    }
    if(deadline != 0){
      if(Grid[deadline][0] != 0){
        phase = 4;
        bgm.stop();
      }
    }
    if(solo && 0 < count){
      pop = count;
      popY = floor(height/count*16)-16;
      if(count == 1){
        score += 200;
      }
      else if(count == 2){
        score += 800;
      }
      else if(count == 3){
        score += 2000;
      }
      else{
        score += 5000;
      }
    }
    current = new Tetrimino();//クラスの作成
    /*
    for(let i = 0; i < 4; i++){
      if(0 <= (current.getShapeY(i) + initPosY)){
        if(Grid[current.getShapeX(i) + initPosX][current.getShapeY(i) + initPosY] != 0){  //初期位置のブロックに色がついてたら
          phase = 4;
        }
      }
    }*/
    fixDelay = 0;
    fixCount = 0;
    fallDelay = 0;
  }//ここまでif(stop)
}

function displayCurrent(){
  if(current.col == 7){
    for(let i = 0; i < 4; i++){
      image(i_b[7+max(0, ceil(sin(glitter/5)*1.2))],(current.getShapeX(i) + initPosX)*16, (current.getShapeY(i) + initPosY)*16-8+tdY[current.getShapeX(i) + initPosX][current.getShapeY(i) + initPosY]);
    }
  }else{
    for(let i = 0; i < 4; i++){
      image(i_b[current.col],(current.getShapeX(i) + initPosX)*16, (current.getShapeY(i) + initPosY)*16-8+tdY[current.getShapeX(i) + initPosX][current.getShapeY(i) + initPosY]);
    }
  }
}

function tleft(){ //←方向に移動
  let stop = false;
  for(let i = 0; i < 4; i++){
    if(current.getShapeX(i) + initPosX == 0){
      stop = true;
    }else if(0 <= current.getShapeY(i) + initPosY){
      if(Grid[(current.getShapeX(i) + initPosX) -1][(current.getShapeY(i) + initPosY)] != 0){  //←方向のブロックに色がついてたら
        stop = true;
      }
    }
  }
  if(!stop){
    initPosX--;
    if(tdY[pop7X][pop7Y] != 0){
      pop7X --;
      tdY[pop7X][pop7Y] = tdY[pop7X+1][pop7Y];
      tdY[pop7X+1][pop7Y] = 0;
    }
    for(let i = 0; i < 4; i++){
      if(abs((current.getShapeX(i)+initPosX)*16+8-fmx)<15){
        if(abs((current.getShapeY(i)+initPosY)*16-fmy)<15){//hitright
          hitR = true;
          mx = (current.getShapeX(i)+initPosX)*16+8-14;
          vmx = -6;
        }
      }
    }
    fixDelay = 0;
    fixCount ++;
  }
}

function tright(){ //→方向に移動
  let stop = false;
  for(let i = 0; i < 4; i++){
    if(current.getShapeX(i) + initPosX == 15){
      stop = true;
    }else if(0 <= current.getShapeY(i) + initPosY){
      if(Grid[current.getShapeX(i) + initPosX +1][current.getShapeY(i) + initPosY] != 0){  //→方向のブロックに色がついてたら
        stop = true;
      }
    }
  }  
  if(!stop){
    initPosX++;
    if(tdY[pop7X][pop7Y] != 0){
      pop7X ++;
      tdY[pop7X][pop7Y] = tdY[pop7X-1][pop7Y];
      tdY[pop7X-1][pop7Y] = 0;
    }
    for(let i = 0; i < 4; i++){
      if(abs((current.getShapeX(i)+initPosX)*16+8-fmx)<15){
        if(abs((current.getShapeY(i)+initPosY)*16-fmy)<15){//hitleft
          hitL = true;
          mx = (current.getShapeX(i)+initPosX)*16+8+14;
          vmx = 6;
        }
      }
    }
    fixDelay = 0;
    fixCount ++;
  }
}

function trotate(){
  if(phase == 1 && current.col != 7){
    for(let n = 0; n <= 4; n++){
      let dX = 0;
      let dY = 0;
      if(current.col == 1){
        if(n == 1+rot%2){
          dX = -2+4*floor((rot+1)%4/2);
        }
        if(n == 2-rot%2){
          dX = 1-2*floor((rot+1)%4/2);
        }
        if(n == 3+rot%2){
          dX = -2+4*floor((rot+1)%4/2);
          dY = 1-2*floor(rot%4/2);
        }
        if(n == 4-rot%2){
          dX = 1-2*floor((rot+1)%4/2);
          dY = -2+4*floor(rot%4/2);
        }
        dX += (rot%2*(rot%4-2));
        dY += ((rot+1)%2*((rot+3)%4-2));
      }else{
        if(n == 1){
          dX = -1+floor((rot+1)%4/2)*2;
        }
        if(n == 2){
          dX = -1+floor((rot+1)%4/2)*2;
          dY = -1+(rot%2)*2;
        }
        if(n == 3){
          dX = 0;
          dY = 2-(rot%2)*4;
        }
        if(n == 4){
          dX = -1+floor((rot+1)%4/2)*2;
          dY = 2-(rot%2)*4;
        }
      }
      let count = 0;
      for(let i = 0; i < 4; i++){
        if(0<=current.getRotShapeX(i) + initPosX + dX&&current.getRotShapeX(i) + initPosX + dX<=15){
          if(current.getRotShapeY(i) + initPosY + dY < 0){
            count++;
          }else{
            if(Grid[current.getRotShapeX(i) + initPosX + dX][current.getRotShapeY(i) + initPosY + dY] == 0){
              count++;
            }
          }
        }
      }
      if(3 < count){
        current.rot();
        initPosX += dX;
        initPosY += dY;
        //console.log("ccccccccccccccccccccccccccccc");
        for(let i = 0; i < 4; i++){
          let x = (current.getShapeX(i)+initPosX)*16+8;
          let y = (current.getShapeY(i)+initPosY)*16;
          if(abs(y-my)<=14){
            if(abs(x-mx)<=14){
              if(my<=y-10){//hitfoot
                fmy = y-15;
                //console.log("ahhh");
              }else if(y+10<=my){//hithead
                fmy = y+15;
                //console.log("ahhh");
              }else if(mx<=x-10){//hitright
                fmx = x-15;
                //console.log("ahhh");
              }else if(x+10<=mx){//hitleft
                fmx = x+15;
                //console.log("ahhh");
              }
            }
          }
        }
        break;
      }
    }
  }
}

function changesolo(){
  solo = !solo;
  if(!solo){
    Grid[11][9]=0;
    Grid[11][10]=7;
    jumppower=10;
    slideSpeed = 3;
    time=200*30;
    if(abs(160-my)<15){
      if(abs(184-mx)<15){//hithead
        my = 160+8+7;
        vmy = 0;
        jump = false;
        landed = true;
      }
    }
  }else{
    Grid[11][9]=7;
    Grid[11][10]=0;
    jumppower=7;
    slideSpeed = 2;
    time=300*30
    if(abs(144-my)<15){
      if(abs(184-mx)<15){//hitfoot
        my = 144-8-7;
        vmy = 0;
        jump = false;
        landed = true;
      }
    }
  }
}

function restart(){
  if(solo){
    if(highScore < score){
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    if(highWorld < world){
      highWorld = world;
      localStorage.setItem('highWorld', highWorld);
    }
  }
  color = [1,2,3,4,5,6,7];
  current = new Tetrimino;
  glitter = 0;
  time = 0;
  fallDelay = 0;
  fixDelay = 0;
  fixCount = 0;
  fallSpeed = 24;
  dropDelay = 0;
  slideDelay = 0;
  restartDelay = 0;
  mx = 64;
  my = 192;
  vmx = 0;
  vmy = 0;
  jmy = 0;
  fmx = 0;
  fmy = 0;
  jump = false;
  landed = false;
  mstop = false;
  move = 1;
  tmove = 0;
  time = 30*300;
  if(phase != 3){
    trec = [];
    srec = [];
    tsum = 0;
  }
  
  if(world == 1){
    for(let i = 0; i < 16; i++){
      for(let k = 0; k < 20; k++){
        tdY[i][k] = 0;
        if((1<k&&i<3)||(1<k&&12<i)){
          Grid[i][k] = 11;
        }else if(k==13){
          Grid[i][k] = 12;
        }else{
          Grid[i][k] = 0;
        }
      }
    }
    Grid[15][1]=13;
    score = 0;
    solo = !solo;
    changesolo();

  }else if(world == 2){
    for(let i = 0; i < 16; i++){
      for(let k = 0; k < 20; k++){
        tdY[i][k] = 0;
        if((1<k&&i<3)||(1<k&&12<i)){
          Grid[i][k] = 11;
        }else if(k==13){
          Grid[i][k] = 12;
        }else{
          Grid[i][k] = 0;
        }
      }
    }
    Grid[15][1]=13;
    Grid[12][9]=3;
    Grid[11][9]=7;
    Grid[10][9]=3;
    for(let i = 9; i <= 12; i++){
      Grid[9][i] = 3;
    }
    mx = 176;

  }else if(world == 3){
    for(let i = 0; i < 16; i++){
      for(let k = 0; k < 20; k++){
        tdY[i][k] = 0;
        if((1<k&&i<3)||(1<k&&12<i)){
          Grid[i][k] = 11;
        }else if(k==13){
          Grid[i][k] = 12;
        }else{
          Grid[i][k] = 0;
        }
      }
    }
    Grid[15][1]=13;
    for(let i = 4; i <= 10; i++){
      Grid[5][i] = 2;
    }
    Grid[5][11]=7;
    Grid[6][12]=2;
    //mx=160;
    //my=65;

  }else if(world == 4){
    for(let i = 0; i < 16; i++){
      for(let k = 0; k < 20; k++){
        tdY[i][k] = 0;
        if((1<k&&i<3)||(1<k&&12<i)){
          Grid[i][k] = 11;
        }else if(k==13){
          Grid[i][k] = 12;
        }else{
          Grid[i][k] = 0;
        }
      }
    }
    Grid[15][1]=13;
    for(let x = 5; x < 13; x++){
      Grid[x][17-x] = 4;
    }
    Grid[8][9]=7;
    mx = 136;

  }else if(world == 5){
    for(let i = 0; i < 16; i++){
      for(let k = 0; k < 20; k++){
        tdY[i][k] = 0;
        if((1<k&&i<3)||(1<k&&12<i)){
          Grid[i][k] = 11;
        }else{
          Grid[i][k] = 0;
        }
      }
    }
    Grid[15][1]=13;
    for(let i = 0; i <= 4; i++){
      Grid[4+2*i][7] = 5;
      Grid[3+2*i][10] = 5;
      Grid[4+2*i][13] = 12;
    }
    Grid[11][10]=7;
    mx = 72;

  }else if(world == 6){
    for(let i = 0; i < 16; i++){
      for(let k = 0; k < 20; k++){
        tdY[i][k] = 0;
        if((1<k&&i<3)||(12<i && k<12)){
          Grid[i][k] = 11;
        }else{
          Grid[i][k] = 0;
        }
      }
    }
    for(let i = 13; i < 16; i++){
      Grid[i][13]=12;
    }
    Grid[15][12]=13;
    Grid[12]=[0,0,0,0,0,0,6,6,6,6,0,0,0,12,0,0,0,0,0,0];
    Grid[11]=[0,0,0,0,6,0,0,6,6,6,6,6,6,0,6,6,6,6,6,6];
    Grid[10]=[0,0,0,6,0,0,6,6,6,6,6,6,0,0,0,0,0,0,0,0];
    Grid[ 9]=[0,0,0,6,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6];
    Grid[ 8]=[0,0,0,0,0,0,0,0,6,6,6,6,6,6,0,0,0,0,0,0];
    Grid[ 7]=[0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6];
    Grid[ 6]=[0,0,0,0,0,0,0,7,0,0,6,6,6,6,6,6,6,6,6,6];
    Grid[ 5]=[0,0,0,0,0,6,0,0,0,0,6,6,6,0,0,0,0,0,0,0];
    Grid[ 4]=[0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6];
    Grid[ 3]=[0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0,0,0]
    mx = 32;
    my = 16;

  }else if(world == 7){
    for(let i = 0; i < 16; i++){
      for(let k = 0; k < 20; k++){
        tdY[i][k] = 0;
        if((k<12&&i<3)||(1<k&&12<i)){
          Grid[i][k] = 11;
        }else{
          Grid[i][k] = 0;
        }
      }
    }
    Grid[0][13]=12;
    Grid[1][13]=12;
    Grid[2][13]=12;
    Grid[15][1]=13;
    Grid[3][11]=7;
    for(let x = 6; x <= 11; x++){
      Grid[x][5]=1;
    }
    Grid[11][4]=1;
    Grid[12][4]=1;
    for(let x = 4; x <= 7; x++){
      Grid[x][10]=1;
    }
    Grid[4][11]=1;
    mx = 16;
   
  }else if(world == 8){
    for(let x = 0; x < 16; x++){
      for(let y = 0; y < 20; y++){
        tdY[x][y] = 0;
        if((1<y&&x<3)||(1<y&&12<x)){
          Grid[x][y] = 11;
        }else{
          Grid[x][y] = 0;
        }
      }
    }
    Grid[15][1]=13;
    for(let i =5; i <=20 ; i++){
      Grid[3][i]=7;
    }
    for(let i =4; i <=20 ; i++){
      Grid[6][i]=7;
    }
    for(let i =4; i <=13 ; i++){
      Grid[9][i]=7;
    }
    for(let i =0; i <=7 ; i++){
      Grid[11][i]=7;
    }
    for(let i =9; i <=12 ; i++){
      Grid[i][13]=7;
    }
    for(let i =12; i <=15 ; i++){
      Grid[i][0]=7;
    }
    //Grid[3][11]=7;
    Grid[3][12]=0;
    Grid[6][11]=0;
    Grid[9][10]=0;
    Grid[9][12]=7;
    //mx = 72;
    //my = 208;
    //mx=220;
    //my=32;
  }
  phase = 0;
}

class Tetrimino{
  constructor(){
    this.shape = [];
    for(let i = 0; i < 4; i++){
      this.shape[i] = []; // create nested array
      for(let k = 0; k < 2; k++){
        this.shape[i][k] = 0;
      }
    }
    //ランダムに色を選ぶ
    if(!color.length){
      color = [1,2,3,4,5,6,7];
    }
    let r = floor(random()*(color.length));
    this.col = color[r];
    color.splice(r,1);
    //初期位置に戻す
    if(this.col == 1||this.col == 7){
      initPosX = 8;
    }else{
      initPosX = 7;
    }
    initPosY = 0;
    rot = 0;
    if(this.col == 1){
      this.shape[1][0] = 1;
      this.shape[2][0] = -1;
      this.shape[3][0] = -2;
    }
    else if(this.col == 2){
      this.shape[1][0] = 1;
      this.shape[2][0] = -1;
      this.shape[3][0] = -1;
      this.shape[3][1] = -1;
    }
    else if(this.col == 3){
      this.shape[1][0] = 1;
      this.shape[2][0] = -1;
      this.shape[3][0] = 1;
      this.shape[3][1] = -1;
    }
    else if(this.col == 4){
      this.shape[1][0] = 1;
      this.shape[2][1] = -1;
      this.shape[3][0] = -1;
      this.shape[3][1] = -1;
    }
    else if(this.col == 5){
      this.shape[1][0] = -1;
      this.shape[2][1] = -1;
      this.shape[3][0] = 1;
      this.shape[3][1] = -1;
    }
    else if(this.col == 6){
      this.shape[1][0] = 1;
      this.shape[2][0] = -1;
      this.shape[3][1] = -1;
    }
    else if(this.col == 7){
      this.shape[1][0] = -1;
      this.shape[2][1] = -1;
      this.shape[3][0] = -1;
      this.shape[3][1] = -1;
    }
  }

  //左に90度回転
  rot(){
    for(let i = 0; i < 4; i++){
      let buff = this.shape[i][1];
      this.shape[i][1] = this.shape[i][0];
      this.shape[i][0] = -buff;
    }
    fixDelay = 0;
    fixCount ++;
    rot ++;
  }
  getShapeX(i){
    return this.shape[i][0];
  }
  getRotShapeX(i){
    return -this.shape[i][1];
  }
  getShapeY(i){
    return this.shape[i][1];
  }
  getRotShapeY(i){
    return this.shape[i][0];
  }
  getMaxX(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(this.shape[k][0] > this.shape[i][0]) i = k;
    }
    return this.shape[i][0];
  }
  getRotMaxX(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(-this.shape[k][1] > -this.shape[i][1]) i = k;
    }
    return -this.shape[i][1];
  }
  getMinX(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(this.shape[k][0] < this.shape[i][0]) i = k;
    }
    return this.shape[i][0];
  }

  getRotMinX(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(-this.shape[k][1] < -this.shape[i][1]) i = k;
    }
    return -this.shape[i][1];
  }

  getMaxY(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(this.shape[k][1] > this.shape[i][1]) i = k;
    }
    return this.shape[i][1];
  }
  getRotMaxY(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(this.shape[k][0] < this.shape[i][0]) i = k;
    }
    return this.shape[i][0];
  }
  getMinY(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(this.shape[k][1] < this.shape[i][1]) i = k;
    }
    return this.shape[i][1];
  }
  getRotMinY(){
    let i = 0;
    for(let k = 0; k < 4; k++){
      if(this.shape[k][0] > this.shape[i][0]) i = k;
    }
    return this.shape[i][0];
  }
}