// 1
// 3
// 6
// 12
// 25
// 50
// 100
// 200
// 400
// 800

// 1000/ 100 = 10 1秒間に 10回呼ばれる ということは 0.1秒だと良い
// 1000/ 200 = 5 1秒間に 5回呼ばれる ということは 0.2秒だと良い


window.onload = function(){
  game();
}
function game(){
  window.lifegame.cellSize = 20;
  window.lifegame.cvs = document.getElementById("lifegame");
  lifegame.cvs.width = lifegame.cvs.width * 2;
  lifegame.cvs.style.transform = "scale(0.5)"; //scaleできるようにするために必要な処理
  window.lifegame.scale = 0.5;
  window.lifegame.color;
  window.lifegame.playStatus = false;
  window.lifegame.throughTime = 0;
  window.lifegame.frameWidth = lifegame.cvs.width;
  window.lifegame.cellWidth = lifegame.frameWidth/lifegame.cellSize;
  window.lifegame.frameRenderTime = 100;
  window.lifegame.array = randomArray(0);
  if(!lifegame.cvs || !lifegame.cvs.getContext) return false;
  drawBaseFrame();
  options();
}

function cycle(){
    var tmpArray = randomArray(0);
    for (var i = 0; i < lifegame.cellSize; i++) {
        for (var j = 0; j < lifegame.cellSize; j++) {
            var point = aroundCheck(i, j);
            if (lifegame.array[i][j] == 0 || lifegame.array[i][j] == 2) {
                if (point == 3) {
                        tmpArray[i][j] = lifegame.array[i][j] + 1;
                } else {
                    tmpArray[i][j] = lifegame.array[i][j];
                }
            } else if(lifegame.array[i][j] == 1 || lifegame.array[i][j] == 3){
                if( point==3 || point == 2){
                    tmpArray[i][j] = lifegame.array[i][j];
                }else{
                    tmpArray[i][j] = lifegame.array[i][j] - 1;
                }
            }
        }
    }
    lifegame.array = tmpArray;
    drawmap(lifegame.array);
  function aroundCheck(x, y){
      var point = 0;
      for (var i = -1; i <= 1; i++) {
          for (var j = -1; j <= 1; j++) {
              if (!(i == 0 && j == 0) && (x + i >= 0 && y + j >= 0) && (x + i < lifegame.cellSize && y + j < lifegame.cellSize)) {
                  if (lifegame.array[x + i][y + j] == 1 || lifegame.array[x + i][y + j] == 3) {//hover時のことを考慮するとこの書き方
                      var point = point + 1;
                  }

              }
          }
      }

      return point;
  }
  function alive(){

  }
  function increase(){
  }
  function decrease(){

  }
}
function options(){
  scaling();
  remapping();
  clearing();
  clickable();
  coloring();
  resizing();
  frameRenderTiming();
  playing();
}
//================================================
function playing(){
  var parent = document.getElementById("playing");
  parent.children[0].addEventListener("click",function(){//minus
      play();
      watchTime();
      if (this.classList.contains("fa-youtube-play")) {
          this.classList.remove("fa-youtube-play");
          this.classList.add("fa-pause");
          lifegame.playStatus = true;
      } else {
          this.classList.remove("fa-pause");
          this.classList.add("fa-youtube-play");
          lifegame.playStatus = false;
      }
  });
  function play(){
      setTimeout(function () {
          if(lifegame.playStatus){
            cycle();
            play();
          }
      }, lifegame.frameRenderTime);
  }
  function watchTime(){
    setTimeout(function (){
      if(lifegame.playStatus){
        lifegame.throughTime = lifegame.throughTime + 0.1
        parent.children[1].innerHTML =  lifegame.throughTime.toFixed(1) + "秒"
        watchTime();
      }
    }, 100)
  }
}
//================================================
function stopPlaying(){
  if(lifegame.playStatus){
    var target = document.getElementById("playing").children[0];
    target.classList.remove("fa-pause");
    target.classList.add("fa-youtube-play");
    lifegame.playStatus = false;
  }
}
//================================================
function resetTime(){
  lifegame.throughTime = 0;
  document.getElementById("playing").children[1].innerHTML = "0秒";
}
//================================================
function coloring(){
    var parent = document.getElementById("coloring");
    lifegame.color = "#" + parent.children[0].getAttribute("value");
    parent.children[0].addEventListener("change", function () {
        lifegame.color = this.style.backgroundColor;
        drawmap(lifegame.array);
    });

}
//================================================
function frameRenderTiming(){
  var parent = document.getElementById("frameRenderTiming");
  parent.children[0].addEventListener("click",function(){//minus
    if(Math.round(1000 / lifegame.frameRenderTime) > 1){
      lifegame.frameRenderTime = lifegame.frameRenderTime * 2;
      render();
    }
  });
  parent.children[1].addEventListener("click",function(){//minus
    if(Math.round(1000 / lifegame.frameRenderTime) < 160){
      lifegame.frameRenderTime = lifegame.frameRenderTime / 2;
      render();
    }
  });
  function render(){
    parent.children[2].innerHTML = Math.round(1000/lifegame.frameRenderTime) + "フレーム/1秒";
  }
}
//================================================
function resizing(){
  var parent = document.getElementById("resizing");
  parent.children[0].addEventListener("click",function(){//minus
    if(lifegame.cellSize != 1){
      lifegame.cellSize = lifegame.cellSize - 1;
      lifegame.cellWidth = lifegame.frameWidth / lifegame.cellSize;
      lifegame.array = randomArray(0);
      drawmap(lifegame.array);
      resetTime();
      stopPlaying();
      render();
    }
  });
  parent.children[1].addEventListener("click", function () {//plus
      console.log("he")
    lifegame.cellSize = lifegame.cellSize + 1;
    lifegame.cellWidth = lifegame.frameWidth / lifegame.cellSize;
    lifegame.array = randomArray(0);
    drawmap(lifegame.array)
    render();
  });
  function render(){
    parent.children[2].innerHTML = lifegame.cellSize + "個";
  }
}
//================================================
function randomArray(val) {
  newArray = new Array();
  for (var i = 0; i < lifegame.cellSize; i++) {
    newArray[i] = new Array()
    for (var j = 0; j < lifegame.cellSize; j++) {
        if (val != null) {
            newArray[i][j] = 0;
        } else {
            newArray[i][j] = Math.round(Math.random())
        }
    }
  }
  return newArray;
}
//================================================
function scaling(){
    var parent = document.getElementById("scaling");
  lifegame.cvs.style.transform = "scale(0.5)";

  render();
  parent.children[0].addEventListener("click", function () {//plus
      if (lifegame.scale < 0.9) {
          lifegame.scale = lifegame.scale + 0.1;
          lifegame.cvs.style.transform = "scale(" + lifegame.scale + ")";
          render();
      }
  });
  parent.children[1].addEventListener("click", function (e) {//minus
      if (lifegame.scale > 0.3) {
          lifegame.scale = lifegame.scale - 0.1;
          lifegame.cvs.style.transform = "scale(" + lifegame.scale + ")";
          render();
      }
  });
  function render(){
    parent.children[2].innerHTML = "倍率 " + Math.ceil((lifegame.scale + 0.5)*10)/10; //もともとのサイズを二倍したのを半分にしているので
  }
}
//================================================
function remapping(){
  var parent = document.getElementById("remapping");
  parent.children[0].addEventListener("click",function(e){//remap
    lifegame.array = randomArray();
    drawmap(lifegame.array);
    resetTime()
    stopPlaying()
    render();
  });
  var i = 1;
  function render(){
    parent.children[1].innerHTML = i + "回"
    i += 1;
  }
}
//================================================
function clearing() {
    var parent = document.getElementById("clearing");
    parent.children[0].addEventListener("click", function (e) {//clear
        lifegame.array = randomArray(0);
        drawmap(newArray);
        resetTime()
        stopPlaying()
        render();
    });
    var i = 1;
    function render() {
        parent.children[1].innerHTML = i + "回"
        i += 1;
    }
}
//================================================
function clickable(){
  var oldHoverX = -1
  var oldHoverY = -1
  var hoverX;
  var hoverY;
  lifegame.cvs.addEventListener( "mousemove", function(e){
    hoverX = Math.floor(((e.clientX + window.pageXOffset - this.getBoundingClientRect().left) /(lifegame.cellWidth * lifegame.scale)));
    hoverY = Math.floor((e.clientY + window.pageYOffset - this.getBoundingClientRect().top) /(lifegame.cellWidth * lifegame.scale));
    //console.log("x:"+ Math.round(e.clientX + window.pageXOffset - this.getBoundingClientRect().left) + "y:" + (e.clientY + window.pageXOffset - this.getBoundingClientRect().top));
    //console.log("cellSize:" + lifegame.cellSize);
    //console.log("xcell:"+ hoverX + "ycell:" + hoverY);
    lifegame.array[hoverX][hoverY] = lifegame.array[hoverX][hoverY] + 2;
    if(oldHoverX != -1){
      lifegame.array[oldHoverX][oldHoverY] = lifegame.array[oldHoverX][oldHoverY] -2;
    }
    drawmap(lifegame.array);
    oldHoverX = hoverX;
    oldHoverY = hoverY;
  });
  lifegame.cvs.addEventListener( "click", function(e){
    console.log(lifegame.array[hoverX][hoverY])
    if(lifegame.array[hoverX][hoverY] < 2){
      lifegame.array[hoverX][hoverY] = lifeToggle(lifegame.array[hoverX][hoverY]);
    }else{
      lifegame.array[hoverX][hoverY] = lifeToggle(lifegame.array[hoverX][hoverY] -2);
    }
    drawmap(lifegame.array);
    oldHoverX = -1;
    oldHoverY = -1;
  });
  lifegame.cvs.addEventListener( "mouseout", function(e){
    lifegame.array[oldHoverX][oldHoverY] = lifegame.array[oldHoverX][oldHoverY] -2;
    drawmap(lifegame.array);
    oldHoverY = -1;
    oldHoverX = -1;
  });
}
//================================================
function drawmap(array){
  var ctx = lifegame.cvs.getContext("2d");
  ctx.clearRect(0,0,lifegame.cvs.width,lifegame.cvs.width);
  ctx.beginPath();
  ctx.fillStyle =  lifegame.color;
  for(var i = 0; i < lifegame.cellSize; i++){
    for(var j = 0; j < lifegame.cellSize; j++){
      if(array[i][j] == 0) {
        ctx.strokeRect(lifegame.cellWidth*i,lifegame.cellWidth*j,lifegame.cellWidth,lifegame.cellWidth);
      }else if(array[i][j] == 1){
        ctx.fillRect(lifegame.cellWidth*i,lifegame.cellWidth*j,lifegame.cellWidth,lifegame.cellWidth);
      }else if(array[i][j] == 2){
        ctx.fillStyle = "rgba(120,0,0,0.3)";
        ctx.fillRect(lifegame.cellWidth*i,lifegame.cellWidth*j,lifegame.cellWidth,lifegame.cellWidth);
        ctx.fillStyle = lifegame.color;
      }else if(array[i][j] == 3){
        ctx.fillStyle = "rgba(0,120,0,0.3)";
        ctx.fillRect(lifegame.cellWidth*i,lifegame.cellWidth*j,lifegame.cellWidth,lifegame.cellWidth);
        ctx.fillStyle = lifegame.color;
      }
    }
  }
  ctx.beginPath(); //今から線を引く
  ctx.moveTo(0,0); //視点
  ctx.lineTo(0,lifegame.cvs.width); //移動
  ctx.lineTo(lifegame.cvs.width,lifegame.cvs.height); //移動
  ctx.lineTo(lifegame.cvs.height,0); //移動
  ctx.closePath(); //視点に戻る
  ctx.stroke();
}
//================================================
function initialize(){
  var array = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ];
  // var hoge = new Array();
  // for (var i = 0; i <= 10; i++) {
  //   hoge[i] = new Array()
  //   for (var j = 0; j <= 10; j++) {
  //     hoge[i][j] = i;
  //     console.log(hoge[i][j] +" = "+i);
  //   }
  // }
}

function drawBaseFrame(){
  lifegame.cvs.height = lifegame.cvs.width;
  lifegame.cvs.style.height = lifegame.cvs.width + "px";

  drawmap(lifegame.array);
}

function lifeToggle(cell){ //生死を切り替える関数
  return cell ? 0 : 1;
}

function update(){
}
function clear(){//画面を真っ白に
  clearRect();
}
function triggerEvent(element, event) {
  if (document.createEvent) {
    // IE以外
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type, bubbling, cancelable
    return element.dispatchEvent(evt);
  } else {
    // IE
    var evt = document.createEventObject();
    return element.fireEvent("on"+event, evt)
  }
}
  // for( var i=0; i < 100; i++){
  //   var x = Math.floor(Math.random() *400);
  //   var y = Math.floor(Math.random() *200);
  //   var r = Math.floor(Math.random() *200);
  //   ctx.fillStyle = "rgb(" + rnd() + "," + rnd() + "," + rnd() + ")";
  //   ctx.beginPath();
  //   ctx.arc(x,y,r,0,2*Math.PI);
  //   ctx.stroke();
  //   ctx.fill();
  // }

  // function rnd(){
  //   return Math.floor(Math.floor(Math.random() * 255));
  // }
  // document.addEventListener('mousedown', draw);
  //mousedown click dclick mousemove mouseover mouseout mousewheel
  // function draw(e){
  //   alert("hello");
  //   e.clientX; //横幅
  //   e.clientY; //縦幅取得
  // }
  /*
  ctx.strokeRect(10,10,50,50); // 四角縁
  ctx.fillRect(60,10,50,50); // 塗りつぶし色
  ctx.clearRect(60,40,50,50); // 色を抜く
  ctx.strokeStyle = "red";
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 5 //pixel太さ
  ctx.beginPath(); //今から線を引く
  ctx.moveTo(20,20); //視点
  ctx.lineTo(120,20); //移動
  ctx.lineTo(120,120); //移動
  ctx.fill() //塗りつぶしてくれる
  ctx.closePath(); //視点に戻る
  ctx.stroke();
  ctx.beginPath();//今から線を引く
  ctx.strokeStyle = "red";
  ctx.arc(120,100,150,10/180*Math.PI, 120/180*Math.PI); //180度から210度
  ctx.fill()
  ctx.stroke;
  ctx.font = "bold 20px serif";
  ctx.textAlign = "center";
  ctx.fillText("Japan", 20, 20);
  ctx.fillStyle = "yellow";
  ctx.fillText("Japan", 20, 40, 40); //強引に入れてくれる
  */
// }