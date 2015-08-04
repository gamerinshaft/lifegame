window.onload = function(){
  game();
}
function game(){
  window.lifegame.cellSize = 20;
  window.lifegame.cvs = document.getElementById("lifegame");
  window.lifegame.previewCanvas = document.getElementById("previewCanvas");
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
  preview();
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
                      point = point + 1;
                  }

              }
          }
      }

      return point;
  }
}
function options(){
  playing();
  scaling();
  remapping();
  clearing();
  clickable();
  coloring();
  resizing();
  reversing();
  presets();
  exporting();
  frameRenderTiming();
  saving();
}
//================================================
function playing(){ //ライフゲームを実行する
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
  function watchTime(){//プレイの時間経過を観察する
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
function stopPlaying(){//時間計測を停止する
  if(lifegame.playStatus){
    var target = document.getElementById("playing").children[0];
    target.classList.remove("fa-pause");
    target.classList.add("fa-youtube-play");
    lifegame.playStatus = false;
  }
}
//================================================
function resetTime(){//経過時間をリセットするrisettosuru
  lifegame.throughTime = 0;
  document.getElementById("playing").children[1].innerHTML = "0秒";
}
//================================================
function coloring(){//セルの色を変更する
    var parent = document.getElementById("coloring");
    lifegame.color = "#" + parent.children[0].getAttribute("value");
    parent.children[0].addEventListener("change", function () {
        lifegame.color = this.style.backgroundColor;
        drawmap(lifegame.array);
    });

}
//================================================
function frameRenderTiming(){//描画するフレームの量を変更する
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
function exporting() {
  document.getElementById("exportButton").addEventListener("click", function(){
    if(confirm("配列情報をテキストファイルとして書き出しますか？")){

      var exportFile = parseArray(lifegame.array);
      downloadAsFile("cellMap", exportFile);
    };
  })
  function downloadAsFile(fileName, content) {
      var a = document.createElement('a');
      a.download = fileName;
      a.href = 'data:application/octet-stream,'+encodeURIComponent(content);
      a.click();
  };
}
function parseArray(originalArray){
  var array = "";
  for(var i=0; i < originalArray.length; i++){
    if(i == lifegame.cellSize -1){
      array = array + originalArray[i] + "\n";
    }else{
      array = array + originalArray[i] + "&";
    }
  }
  return array;
}
//================================================
function resizing(){//セルの量を変更する
  var parent = document.getElementById("resizing");
  parent.children[0].addEventListener("click",function(){//minus
    if(lifegame.cellSize != 1){
      lifegame.cellSize = lifegame.cellSize - 1;
      lifegame.cellWidth = lifegame.frameWidth / lifegame.cellSize;
      var tmpArray = randomArray(0);
      for(var i = 0; i < lifegame.cellSize; i++){
        for(var j = 0; j < lifegame.cellSize; j++){
          if(lifegame.cellSize%2 == 0){
            tmpArray[i][j] = lifegame.array[i][j];
          }else{
            tmpArray[i][j] = lifegame.array[i+1][j+1];
          }
        }
      }
      lifegame.array = tmpArray;
      drawmap(lifegame.array);
      render();
    }
  });
  parent.children[1].addEventListener("click", function () {//plus
    lifegame.cellSize = lifegame.cellSize + 1;
    lifegame.cellWidth = lifegame.frameWidth / lifegame.cellSize;
    var tmpArray = randomArray(0);
    for(var i = 0; i < lifegame.cellSize; i++){
      for(var j = 0; j < lifegame.cellSize; j++){
        if(lifegame.cellSize%2 == 0){
          if(lifegame.cellSize - 1 == i || lifegame.cellSize - 1 == j){
            tmpArray[i][j] = 0;
          }else{
            tmpArray[i][j] = lifegame.array[i][j];
          }
        }else{
          if(i==0 || j==0){
            tmpArray[i][j] = 0;
          }else{
            tmpArray[i][j] = lifegame.array[i-1][j-1];
          }
        }
      }
    }
    lifegame.array = tmpArray;
    drawmap(lifegame.array)
    render();
  });
  function render(){
    parent.children[2].innerHTML = lifegame.cellSize + "個";
  }
}
//================================================
function randomArray(val) { //セルの配列をランダムに生成する、0を与えた場合全てのセルが死んだ状態になる
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
function verticalMiddling(){ //キャンバスに縦方向に中央揃えするためのメソッド
  var positionY = lifegame.cvs.getBoundingClientRect().top;
  var canvasHeight = lifegame.frameWidth * lifegame.scale;
  var windowHeight = window.innerHeight
  if(windowHeight < canvasHeight){
    lifegame.cvs.style.top = 8 - positionY + "px";
  }else{
    lifegame.cvs.style.top = ((windowHeight - canvasHeight) / 2) - positionY + "px"
  }
}
function scaling(){//キャンバスのサイズを変更する
  var parent = document.getElementById("scaling");
  lifegame.cvs.style.transform = "scale(0.5)";
  verticalMiddling();
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
function reversing(){//キャンバスのサイズを変更する
  var parent = document.getElementById("reversing");
  parent.children[0].addEventListener("click", function (e) {
    var tmpArray = randomArray(0);
    for(var i = 0; i < lifegame.cellSize; i++){
      for(var j = 0; j < lifegame.cellSize; j++){
        tmpArray[i][j] = lifegame.array[lifegame.cellSize-1-i][j];
      }
    }
    lifegame.array = tmpArray;
    drawmap(lifegame.array);
  });
  parent.children[1].addEventListener("click", function (e) {
    var tmpArray = randomArray(0);
    for(var i = 0; i < lifegame.cellSize; i++){
      for(var j = 0; j < lifegame.cellSize; j++){
        tmpArray[i][j] = lifegame.array[i][lifegame.cellSize-1-j];
      }
    }
    lifegame.array = tmpArray;
    drawmap(lifegame.array);
  });
}
//================================================
function remapping(){//セルをランダム生成、描画する
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
function clearing() {//キャンバスのセル情報を空にする
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
function clickable(){//ホバーしているセルの色を変更する
  var oldHoverX = -1
  var oldHoverY = -1
  var hoverX;
  var hoverY;
  var isMouseDown = false;
  var onTheX = -1;
  var onTheY = -1;
  lifegame.cvs.addEventListener( "mousemove", function(e){

    hoverX = Math.floor(((e.clientX + window.pageXOffset - this.getBoundingClientRect().left) /(lifegame.cellWidth * lifegame.scale)));
    hoverY = Math.floor((e.clientY + window.pageYOffset - this.getBoundingClientRect().top) /(lifegame.cellWidth * lifegame.scale));
    if(isMouseDown){
      if((hoverX >= 0 && hoverY >= 0) && (hoverX < lifegame.cellSize && hoverY < lifegame.cellSize) && (onTheX != hoverX || onTheY != hoverY)){
        changeCell();
        onTheX = hoverX;
        onTheY = hoverY;
        oldHoverY = hoverY;
        oldHoverX = hoverX;
      }
    }else{
      if((hoverX >= 0 && hoverY >= 0) && (hoverX < lifegame.cellSize && hoverY < lifegame.cellSize) && (onTheX != hoverX || onTheY != hoverY)){
        lifegame.array[hoverY][hoverX] = lifegame.array[hoverY][hoverX] + 2;
        if(oldHoverY != -1){
          lifegame.array[oldHoverY][oldHoverX] = lifegame.array[oldHoverY][oldHoverX] -2;
        }
        drawmap(lifegame.array);
        oldHoverY = hoverY;
        oldHoverX = hoverX;
      }
    }
  });
  lifegame.cvs.addEventListener( "mousedown", function(e){
    stopPlaying();
    isMouseDown = true;
  });
  lifegame.cvs.addEventListener( "mouseup", function(e){
    for(var i = 0; i < lifegame.cellSize; i++){
      for(var j = 0; j < lifegame.cellSize; j++){
        if(lifegame.array[i][j] >= 2){
          lifegame.array[i][j] = lifegame.array[i][j] - 2;
        }
      }
    }
    if(!isMouseDown){
      changeCell();
    }
    isMouseDown = false;
  })
  lifegame.cvs.addEventListener( "click", function(e){
    changeCell();
  });
  lifegame.cvs.addEventListener( "mouseout", function(e){
    lifegame.array[oldHoverY][oldHoverX] = lifegame.array[oldHoverY][oldHoverX] -2;
    for(var i = 0; i < lifegame.cellSize; i++){
      for(var j = 0; j < lifegame.cellSize; j++){
        if(lifegame.array[i][j] >= 2){
          lifegame.array[i][j] = lifegame.array[i][j] - 2;
        }
      }
    }
    drawmap(lifegame.array);
    oldHoverX = -1;
    oldHoverY = -1;
    isMouseDown = false;
  });
  function changeCell(){
    if(lifegame.array[hoverY][hoverX] < 2){
      lifegame.array[hoverY][hoverX] = lifeToggle(lifegame.array[hoverY][hoverX]);
    }else{
      lifegame.array[hoverY][hoverX] = lifeToggle(lifegame.array[hoverY][hoverX] -2);
    }
    drawmap(lifegame.array);
    oldHoverY = -1;
    oldHoverX = -1;
  }
}
//================================================
function drawmap(array, preview){//画面にセル情報を描画する
  if(preview != null){
    var ctx = lifegame.previewCanvas.getContext("2d");
    var cellSize = array.length;
    var canvasWidth = lifegame.previewCanvas.width;
    var cellWidth = canvasWidth / cellSize;
  }else{
    var ctx = lifegame.cvs.getContext("2d");
    var cellSize = lifegame.cellSize;
    var cellWidth = lifegame.cellWidth;
    var canvasWidth = lifegame.cvs.width;
  }
  ctx.clearRect(0,0,canvasWidth,canvasWidth);
  ctx.beginPath();
  ctx.fillStyle =  lifegame.color;
  for(var i = 0; i < cellSize; i++){
    for(var j = 0; j < cellSize; j++){
      if(array[i][j] == 0) {
        ctx.strokeRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
      }else if(array[i][j] == 1){
        ctx.fillRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
      }else if(array[i][j] == 2){
        ctx.fillStyle = "rgba(120,0,0,0.3)";
        ctx.fillRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
        ctx.fillStyle = lifegame.color;
      }else if(array[i][j] == 3){
        ctx.fillStyle = "rgba(0,120,0,0.3)";
        ctx.fillRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
        ctx.fillStyle = lifegame.color;
      }
    }
  }
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(0,canvasWidth);
  ctx.lineTo(canvasWidth,canvasWidth);
  ctx.lineTo(canvasWidth,0);
  ctx.closePath();
  ctx.stroke();
}
//================================================
function preview(){
  document.getElementById("modalButton").addEventListener("click", function(){
    document.getElementById("modal").classList.add('show');
    stopPlaying();
  });
  lifegame.previewCanvas.height = lifegame.previewCanvas.width;
  previewArrays = lifegame.presets;
  render(previewArrays[0]);
  var num = 0;
  document.getElementById("postData").addEventListener("click", function(){
    document.getElementById("presets").classList.remove("active");
    this.classList.add("active");
    previewArrays = lifegame.loadArrays;
    render(previewArrays[0]);
    document.getElementById("menuRight").style.color = "#555";
    document.getElementById("menuLeft").style.color = "grey";
    num = 0;
  });
  document.getElementById("presets").addEventListener("click", function(){
    document.getElementById("postData").classList.remove("active");
    this.classList.add("active");
    previewArrays = lifegame.presets;
    render(previewArrays[0]);
    document.getElementById("menuLeft").style.color = "grey";
    document.getElementById("menuRight").style.color = "#555";
    num = 0;
  });
  document.getElementById("menuRight").addEventListener("click",function(){
    if(num + 1 < previewArrays.length){
      num = num +1;
      document.getElementById("menuLeft").style.color = "#555";
      render(previewArrays[num]);
    }else{
      this.style.color = "grey";
    }
  });
  document.getElementById("menuLeft").addEventListener("click",function(){
    if(num - 1 >= 0 ){
      num = num -1;
      document.getElementById("menuRight").style.color = "#555";
      render(previewArrays[num]);
      if(num == 0){
        this.style.color = "grey";
        num = 0;
      }
    }
  });
  document.getElementById("closeButton").addEventListener("click",function(){
    document.getElementById("modal").classList.remove("show");
  });
  document.getElementById("import").addEventListener("click",function(){
    lifegame.array = previewArrays[num].array;
    lifegame.cellSize = previewArrays[num].array.length;
    lifegame.cellWidth = lifegame.frameWidth/lifegame.cellSize;
    drawmap(lifegame.array);
    resetTime();
    document.getElementById("modal").classList.remove("show");
  });
  function render(target){
    drawmap(target.array ,"preview");
    document.getElementById("previewName").innerHTML = target.name;
    document.getElementById("previewContent").innerHTML = target.content;
  }
}
//================================================

function drawBaseFrame(){//大元となるフレームを生成する
  lifegame.cvs.height = lifegame.cvs.width;
  lifegame.cvs.style.height = lifegame.cvs.width + "px";
  lifegame.cvs.style.width = lifegame.cvs.width + "px";
  lifegame.previewCanvas.height = lifegame.previewCanvas.width;
  lifegame.previewCanvas.style.height = lifegame.previewCanvas.width + "px";
  lifegame.previewCanvas.style.width = lifegame.previewCanvas.width + "px";
  drawmap(lifegame.array);
}

function lifeToggle(cell){ //生死を切り替えるメソッド1
  return cell ? 0 : 1;
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
function saving(){
  document.getElementById("saveButton").addEventListener("click",function(e){
    document.getElementById("saveModal").classList.add("show");
    stopPlaying();
  });
  document.getElementById("closeSaveButton").addEventListener("click",function(e){
    document.getElementById("saveModal").classList.remove("show");
  });
  document.getElementById("submit").addEventListener("click",function(e){
    var form = document.getElementById("form");
    var input = document.createElement( 'input' );
    input.setAttribute( 'type' , 'hidden' );
    input.setAttribute( 'name' , 'array' );    // nameは任意で
    input.setAttribute( 'value' , parseArray(lifegame.array) );   // データを入れる
    form.appendChild( input );
  });
}
function presets(){
  window.lifegame.presets =
  [
    {
      name: "単位欲しい",
      content: "落とした単位の数だけ強くなったためカンストしてしまった",
      array:
        [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0],
          [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
          [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
          [0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,0,0,1,1,0,0,1,1,1,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    },
    {
      name: "アクロン",
      content: "爆発的に成長し5206世代目で安定する形",
      array:
        [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    },
    {
      name: "空飛ぶ機械",
      content: "シュシュポッポ列車のように前進しながら煙を撒き散らすが煙は時間が経つと消滅する。",
      array:
        [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    },
    {
      name: "Bヘプトミノ",
      content: "往復運動のパターン。いかにも壊れそうだけど壊れずに往復運動を続ける。逆噴射も出る。",
      array:
        [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    },
    {
      name: "グライダー銃",
      content: "グライダー銃は一番最初に発見された永遠に成長を続ける形である。",
      array:
        [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
          [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    }
  ];
}