window.onload = function(){
  var lifegame = document.getElementById("lifegame");
  var previewCanvas = document.getElementById("previewCanvas");
  game = new Lifegame(lifegame, previewCanvas, 20, "red");
  playMenu();
  scaleMenu();
  resizeMenu();
  remapMenu();
  lifegame.addEventListener("resetTime",function(){
    document.getElementById("playing").children[1].innerHTML = "0秒";
  });
  function remapMenu(){
    var i = 1;
    var parent = document.getElementById("remapping");
    lifegame.addEventListener("remap", function(){
      render();
    });
    parent.children[0].addEventListener("click",function(e){//remap
      game.remap();
    });
    function render(){
      parent.children[1].innerHTML = i + "回"
      i += 1;
    }

  }
  function playMenu(){
    lifegame.addEventListener("start",function(){
      parent.children[0].classList.remove("fa-youtube-play");
      parent.children[0].classList.add("fa-pause");
    })
    lifegame.addEventListener("stop",function(){
      parent.children[0].classList.remove("fa-pause");
      parent.children[0].classList.add("fa-youtube-play");
    })
    var parent = document.getElementById("playing");
    parent.children[0].addEventListener("click", function(){
      watchTime();
      if (this.classList.contains("fa-youtube-play")) {
        game.start();
      } else {
        game.stop();
      }
      function watchTime(){
        setTimeout(function (){
          if(game.playStatus){
            game.throughTime = game.throughTime + 0.1
            parent.children[1].innerHTML = game.throughTime.toFixed(1) + "秒"
            watchTime();
          }
        }, 100)
      }
    });
  }

  function resizeMenu(){
    var parent = document.getElementById("resizing");
    lifegame.addEventListener("resize",function(){
      render();
    });
    parent.children[0].addEventListener("click", function(){
      game.resize(0);
    });
    parent.children[1].addEventListener("click", function(){
      game.resize(1);
    });
    function render(){
      parent.children[2].innerHTML = game.cellSize + "個";
    }
  }

  function scaleMenu(){//キャンバスのサイズを変更する
    var parent = document.getElementById("scaling");
    lifegame.addEventListener("scale", function(){
      render();
    });
    render();
    verticalMiddling();
    parent.children[0].addEventListener("click", function () {//plus
        if (game.scale() < 0.9) {
          game.scale(game.scale() + 0.1);
        }
    });
    parent.children[1].addEventListener("click", function (e) {//minus
        if (game.scale() > 0.3) {
          game.scale(game.scale() - 0.1);
        }
    });
    function render(){
      parent.children[2].innerHTML = "倍率 " + Math.ceil((game.scale() + 0.5)*10)/10; //もともとのサイズを二倍したのを半分にしているので
    }
  }

  function verticalMiddling(){ //キャンバスに縦方向に中央揃えするためのメソッド
    var positionY = game.cvs.getBoundingClientRect().top;
    var canvasHeight = game.cvs.width * (game.scale());
    var windowHeight = window.innerHeight
    game.cvs.style.top = (windowHeight - canvasHeight)/2 - positionY + "px"
  }
}

Lifegame = function(canvas,previewCanvas,cellSize,color){
  var _ = this;
  _.cellSize = cellSize;
  _.cvs = canvas;
  _.previewCanvas = previewCanvas;
  if(!_.cvs || !_.cvs.getContext||!_.previewCanvas || !_.previewCanvas.getContext) return false;
  _.color = color;
  _.scaleSize = 0.5;
  _.playStatus = false;
  _.throughTime = 0;
  _.cellWidth = _.cvs.width/_.cellSize;
  _.frameRenderTime = 100;
  _.array = _.randomArray(0);
  _.initialize();
}

Lifegame.prototype = {
  initialize: function(){
    var _ = this;
    _.cvs.width *= 2; //"transformするため"
    _.cellWidth *= 2;
    _.cvs.height = _.cvs.width;
    _.cvs.style.height = _.cvs.width + "px";
    _.cvs.style.width = _.cvs.width + "px";
    _.cvs.style.transform = "scale(" + _.scaleSize + ")";
    _.previewCanvas.height = _.previewCanvas.width;
    _.previewCanvas.style.height = _.previewCanvas.width + "px";
    _.previewCanvas.style.width = _.previewCanvas.width + "px";
    _.drawmap(_.array);
    _.clickable();
    _.play();
  },
//=====================================
  randomArray: function(val){
    var _ = this;
    newArray = new Array();
    for (var i = 0; i < _.cellSize; i++) {
      newArray[i] = new Array()
      for (var j = 0; j < _.cellSize; j++) {
          if (val != null) {
              newArray[i][j] = 0;
          } else {
              newArray[i][j] = Math.round(Math.random())
          }
      }
    }
    return newArray;
  },
//=====================================
  cycleLife: function(){
    var _ = this;
    var tmpArray = _.randomArray(0);
    for (var i = 0; i < _.cellSize; i++) {
        for (var j = 0; j < _.cellSize; j++) {
            var point = aroundCheck(i, j);
            switch(_.array[i][j]){
              case 0:
              case 2:
                switch(point){
                  case 3:
                    tmpArray[i][j] = _.lifeToggle(_.array[i][j]);
                    break;
                  default:
                    tmpArray[i][j] = _.array[i][j];
                    break;
                }
                break;
              case 1:
              case 3:
                switch(point){
                  case 3:
                  case 2:
                    tmpArray[i][j] = _.array[i][j];
                    break;
                  default:
                    tmpArray[i][j] = _.lifeToggle(_.array[i][j]);
                    break;
                }
                break;
            }
        }
    }
    _.array = tmpArray;
    _.drawmap(_.array);
    function aroundCheck(x, y){
      var point = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          if (isAround(i,j)) {
            switch(_.array[x + i][y + j]){
              case 1:
              case 3:
                point = point + 1;
                break;

            }
          }
        }
      }
      function isAround(i,j){
        return !(i == 0 && j == 0) && (x + i >= 0 && y + j >= 0) && (x + i < _.cellSize && y + j < _.cellSize)
      }
      return point;
    }
  },
//=====================================
  lifeToggle: function(cell){
    return cell ? 0 : 1;
  },
//=====================================
  play: function(){
    var _ = this;
    setTimeout(function () {
      if(_.playStatus){
        _.cycleLife();
      }
      _.play();
    }, _.frameRenderTime);
  },
  start: function(){
    var _ = this;
    _.playStatus = true;
    _.fireEvent("start");
  },
  stop: function(){
    var _ = this;
    _.playStatus = false;
    _.fireEvent("stop");
  },
//=====================================
  remap: function(){
    var _ = this;
    _.array = _.randomArray();
    _.drawmap(_.array);
    _.resetTime()
    _.stop();
    _.fireEvent("remap");
  },
//=====================================
  resize: function(val){
    var _ = this;
    if(val){
      _.cellSize += 1;
      _.cellWidth = _.cvs.width / _.cellSize;
      var tmpArray = _.randomArray(0);
      for(var i = 0; i < _.cellSize; i++){
        for(var j = 0; j < _.cellSize; j++){
          if(_.cellSize%2 == 0){
            if(_.cellSize - 1 == i || _.cellSize - 1 == j){
              tmpArray[i][j] = 0;
            }else{
              tmpArray[i][j] = _.array[i][j];
            }
          }else{
            if(i==0 || j==0){
              tmpArray[i][j] = 0;
            }else{
              tmpArray[i][j] = _.array[i-1][j-1];
            }
          }
        }
      }
      _.array = tmpArray;
      _.drawmap(_.array)
    }else{
      if(_.cellSize != 1){
        _.cellSize -= 1;
        _.cellWidth = _.cvs.width / _.cellSize;
        var tmpArray = _.randomArray(0);
        for(var i = 0; i < _.cellSize; i++){
          for(var j = 0; j < _.cellSize; j++){
            if(_.cellSize%2 == 0){
              tmpArray[i][j] = _.array[i][j];
            }else{
              tmpArray[i][j] = _.array[i+1][j+1];
            }
          }
        }
        _.array = tmpArray;
        _.drawmap(_.array);
      }
    }
    _.fireEvent("resize");
  },
//=====================================
  scale: function(val){
    var _ = this;
    if(val !=null){
      _.scaleSize = val;
      _.cvs.style.transform = "scale(" + _.scaleSize + ")";
      _.fireEvent("scale");
    }else{
      return _.scaleSize;
    }
  },
//=====================================
  clickable: function(){
    var _ = this;
    var isMouseDown = false;
    var hoverX, oldCellX, oldCellY, hoverY;
    var cellX = -1;
    var cellY = -1;
    _.cvs.addEventListener( "mousemove", function(e){
      hoverX = Math.floor(((e.clientX + window.pageXOffset - this.getBoundingClientRect().left) /(_.cellWidth * _.scaleSize)));
      hoverY = Math.floor((e.clientY + window.pageYOffset - this.getBoundingClientRect().top) /(_.cellWidth * _.scaleSize));
      if(hoverX != oldCellX){
        cellX = hoverX;
      }
      if(hoverY != oldCellY){
        cellY = hoverY;
      }
      if(isMouseDown){
        if(IsOnNewHoverCell()){
          changeCell();
          oldCellX = cellX;
          oldCellY = cellY;
          cellX = hoverX;
          cellY = hoverY;
        }
      }else{
        if(IsOnNewHoverCell()){
          _.array[hoverY][hoverX] = _.array[hoverY][hoverX] + 2;
          if(oldCellY != null || oldCellX != null){
            _.array[oldCellY][oldCellX] = _.array[oldCellY][oldCellX] -2;
          }
          _.drawmap(_.array);
          oldCellY = hoverY;
          oldCellX = hoverX;
        }
      }
    });
    _.cvs.addEventListener( "mousedown", function(e){
      _.stop();
      changeCell();
      oldCellX = cellX;
      oldCellY = cellY;
      cellX = hoverX;
      cellY = hoverY;
      isMouseDown = true;
    });
    _.cvs.addEventListener( "click", function(e){
      if(isMouseDown){
        for(var i = 0; i < _.cellSize; i++){
          for(var j = 0; j < _.cellSize; j++){
            if(_.array[i][j] >= 2){
              _.array[i][j] = _.array[i][j] - 1;
            }
          }
        }
      }else{
        for(var i = 0; i < _.cellSize; i++){
          for(var j = 0; j < _.cellSize; j++){
            if(_.array[i][j] >= 2){
              _.array[i][j] = _.array[i][j] - 2;
            }
          }
        }
      }
      _.drawmap(_.array);
      oldCellX = null;
      oldCellY = null;
      isMouseDown = false;
    });
    _.cvs.addEventListener( "mouseout", function(e){
      _.array[oldCellY][oldCellX] = _.array[oldCellY][oldCellX] >= 2 ? _.array[oldCellY][oldCellX] -2 : _.array[oldCellY][oldCellX];
      for(var i = 0; i < _.cellSize; i++){
        for(var j = 0; j < _.cellSize; j++){
          if(_.array[i][j] >= 2){
            _.array[i][j] = _.array[i][j] - 1;
          }
        }
      }
      _.drawmap(_.array);
      oldCellX = null;
      oldCellY = null;
      isMouseDown = false;
    });
    function IsOnNewHoverCell(){
      return (hoverX >= 0 && hoverY >= 0) && (hoverX < _.cellSize && hoverY < _.cellSize) && (oldCellX != hoverX || oldCellY != hoverY);
    }
    function changeCell(){
      if(_.array[hoverY][hoverX] < 2){
        _.array[hoverY][hoverX] = _.lifeToggle(_.array[hoverY][hoverX]);
      }else{
        _.array[hoverY][hoverX] = _.lifeToggle(_.array[hoverY][hoverX] -2);
      }
      _.drawmap(_.array);
    }
  },
//=====================================
  drawmap: function(array, preview){
    var _ = this;
    if(preview != null){
      var ctx = _.previewCanvas.getContext("2d");
      var cellSize = array.length;
      var canvasWidth = _.previewCanvas.width;
      var cellWidth = canvasWidth / cellSize;
    }else{
      var ctx = _.cvs.getContext("2d");
      var cellSize = _.cellSize;
      var cellWidth = _.cellWidth;
      var canvasWidth = _.cvs.width;
    }
    ctx.clearRect(0,0,canvasWidth,canvasWidth);
    ctx.beginPath();
    ctx.fillStyle =  _.color;
    for(var i = 0; i < cellSize; i++){
      for(var j = 0; j < cellSize; j++){
        switch(array[i][j]){
          case 0:
            ctx.strokeRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
            break;
          case 1:
            ctx.fillRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
            break;
          case 2:
            ctx.fillStyle = "rgba(120,0,0,0.3)";
            ctx.fillRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
            ctx.fillStyle = _.color;
            break;
          case 3:
            ctx.fillStyle = "rgba(0,120,0,0.3)";
            ctx.fillRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
            ctx.fillStyle = _.color;
            break;
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
  },
  fireEvent: function(eventName){
    var _ = this;
    var customEvent = document.createEvent("HTMLEvents");
    customEvent.initEvent(eventName, true, false);
    _.cvs.dispatchEvent(customEvent);
  },
  resetTime: function(){
    var _ = this;
    lifegame.throughTime = 0;
    _.fireEvent("resetTime");
  }
}


// //================================================

// //================================================
// function coloring(){//セルの色を変更する
//     var parent = document.getElementById("coloring");
//     lifegame.color = "#" + parent.children[0].getAttribute("value");
//     parent.children[0].addEventListener("change", function () {
//         lifegame.color = this.style.backgroundColor;
//         drawmap(lifegame.array);
//     });

// }
// //================================================
// function frameRenderTiming(){//描画するフレームの量を変更する
//   var parent = document.getElementById("frameRenderTiming");
//   parent.children[0].addEventListener("click",function(){//minus
//     if(Math.round(1000 / lifegame.frameRenderTime) > 1){
//       lifegame.frameRenderTime = lifegame.frameRenderTime * 2;
//       render();
//     }
//   });
//   parent.children[1].addEventListener("click",function(){//minus
//     if(Math.round(1000 / lifegame.frameRenderTime) < 160){
//       lifegame.frameRenderTime = lifegame.frameRenderTime / 2;
//       render();
//     }
//   });
//   function render(){
//     parent.children[2].innerHTML = Math.round(1000/lifegame.frameRenderTime) + "フレーム/1秒";
//   }
// }

// //================================================
// function exporting() {
//   document.getElementById("exportButton").addEventListener("click", function(){
//     if(confirm("配列情報をテキストファイルとして書き出しますか？")){

//       var exportFile = parseArray(lifegame.array);
//       downloadAsFile("cellMap", exportFile);
//     };
//   })
//   function downloadAsFile(fileName, content) {
//       var a = document.createElement('a');
//       a.download = fileName;
//       a.href = 'data:application/octet-stream,'+encodeURIComponent(content);
//       a.click();
//   };
// }
// function parseArray(originalArray){
//   var array = "";
//   for(var i=0; i < originalArray.length; i++){
//     if(i == lifegame.cellSize -1){
//       array = array + originalArray[i] + "\n";
//     }else{
//       array = array + originalArray[i] + "&";
//     }
//   }
//   return array;
// }
// //================================================
// function randomArray(val) { //セルの配列をランダムに生成する、0を与えた場合全てのセルが死んだ状態になる
//   newArray = new Array();
//   for (var i = 0; i < lifegame.cellSize; i++) {
//     newArray[i] = new Array()
//     for (var j = 0; j < lifegame.cellSize; j++) {
//         if (val != null) {
//             newArray[i][j] = 0;
//         } else {
//             newArray[i][j] = Math.round(Math.random())
//         }
//     }
//   }
//   return newArray;
// }
// //================================================
// function reversing(){//キャンバスのサイズを変更する
//   var parent = document.getElementById("reversing");
//   parent.children[0].addEventListener("click", function (e) {
//     var tmpArray = randomArray(0);
//     for(var i = 0; i < lifegame.cellSize; i++){
//       for(var j = 0; j < lifegame.cellSize; j++){
//         tmpArray[i][j] = lifegame.array[lifegame.cellSize-1-i][j];
//       }
//     }
//     lifegame.array = tmpArray;
//     drawmap(lifegame.array);
//   });
//   parent.children[1].addEventListener("click", function (e) {
//     var tmpArray = randomArray(0);
//     for(var i = 0; i < lifegame.cellSize; i++){
//       for(var j = 0; j < lifegame.cellSize; j++){
//         tmpArray[i][j] = lifegame.array[i][lifegame.cellSize-1-j];
//       }
//     }
//     lifegame.array = tmpArray;
//     drawmap(lifegame.array);
//   });
// }
// //================================================
// function clearing() {//キャンバスのセル情報を空にする
//     var parent = document.getElementById("clearing");
//     parent.children[0].addEventListener("click", function (e) {//clear
//         lifegame.array = randomArray(0);
//         drawmap(newArray);
//         resetTime()
//         stopPlaying()
//         render();
//     });
//     var i = 1;
//     function render() {
//         parent.children[1].innerHTML = i + "回"
//         i += 1;
//     }
// }
// //================================================

// //================================================
// function preview(){
//   document.getElementById("modalButton").addEventListener("click", function(){
//     document.getElementById("modal").classList.add('show');
//     stopPlaying();
//   });
//   lifegame.previewCanvas.height = lifegame.previewCanvas.width;
//   previewArrays = lifegame.presets;
//   render(previewArrays[0]);
//   var num = 0;
//   document.getElementById("postData").addEventListener("click", function(){
//     document.getElementById("presets").classList.remove("active");
//     this.classList.add("active");
//     previewArrays = lifegame.loadArrays;
//     render(previewArrays[0]);
//     document.getElementById("menuRight").style.color = "#555";
//     document.getElementById("menuLeft").style.color = "grey";
//     num = 0;
//   });
//   document.getElementById("presets").addEventListener("click", function(){
//     document.getElementById("postData").classList.remove("active");
//     this.classList.add("active");
//     previewArrays = lifegame.presets;
//     render(previewArrays[0]);
//     document.getElementById("menuLeft").style.color = "grey";
//     document.getElementById("menuRight").style.color = "#555";
//     num = 0;
//   });
//   document.getElementById("menuRight").addEventListener("click",function(){
//     if(num + 1 < previewArrays.length){
//       num = num +1;
//       document.getElementById("menuLeft").style.color = "#555";
//       render(previewArrays[num]);
//     }else{
//       this.style.color = "grey";
//     }
//   });
//   document.getElementById("menuLeft").addEventListener("click",function(){
//     if(num - 1 >= 0 ){
//       num = num -1;
//       document.getElementById("menuRight").style.color = "#555";
//       render(previewArrays[num]);
//       if(num == 0){
//         this.style.color = "grey";
//         num = 0;
//       }
//     }
//   });
//   document.getElementById("closeButton").addEventListener("click",function(){
//     document.getElementById("modal").classList.remove("show");
//   });
//   document.getElementById("import").addEventListener("click",function(){
//     lifegame.array = previewArrays[num].array;
//     lifegame.cellSize = previewArrays[num].array.length;
//     lifegame.cellWidth = lifegame.frameWidth/lifegame.cellSize;
//     drawmap(lifegame.array);
//     resetTime();
//     document.getElementById("modal").classList.remove("show");
//   });
//   function render(target){
//     drawmap(target.array ,"preview");
//     document.getElementById("previewName").innerHTML = target.name;
//     document.getElementById("previewContent").innerHTML = target.content;
//   }
// }
// //================================================

// function triggerEvent(element, event) {
//   if (document.createEvent) {
//     // IE以外
//     var evt = document.createEvent("HTMLEvents");
//     evt.initEvent(event, true, true ); // event type, bubbling, cancelable
//     return element.dispatchEvent(evt);
//   } else {
//     // IE
//     var evt = document.createEventObject();
//     return element.fireEvent("on"+event, evt)
//   }
// }
// function saving(){
//   document.getElementById("saveButton").addEventListener("click",function(e){
//     document.getElementById("saveModal").classList.add("show");
//     stopPlaying();
//   });
//   document.getElementById("closeSaveButton").addEventListener("click",function(e){
//     document.getElementById("saveModal").classList.remove("show");
//   });
//   document.getElementById("submit").addEventListener("click",function(e){
//     var form = document.getElementById("form");
//     var input = document.createElement( 'input' );
//     input.setAttribute( 'type' , 'hidden' );
//     input.setAttribute( 'name' , 'array' );    // nameは任意で
//     input.setAttribute( 'value' , parseArray(lifegame.array) );   // データを入れる
//     form.appendChild( input );
//   });
// }
// function presets(){
//   window.lifegame.presets =
//   [
//     {
//       name: "単位欲しい",
//       content: "落とした単位の数だけ強くなったためカンストしてしまった",
//       array:
//         [
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,1,0,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0],
//           [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
//           [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
//           [0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,1,0,0,1,1,0,0,1,1,1,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//         ]
//     },
//     {
//       name: "アクロン",
//       content: "爆発的に成長し5206世代目で安定する形",
//       array:
//         [
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//         ]
//     },
//     {
//       name: "空飛ぶ機械",
//       content: "シュシュポッポ列車のように前進しながら煙を撒き散らすが煙は時間が経つと消滅する。",
//       array:
//         [
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
//           [1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
//           [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [1,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//         ]
//     },
//     {
//       name: "Bヘプトミノ",
//       content: "往復運動のパターン。いかにも壊れそうだけど壊れずに往復運動を続ける。逆噴射も出る。",
//       array:
//         [
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//         ]
//     },
//     {
//       name: "グライダー銃",
//       content: "グライダー銃は一番最初に発見された永遠に成長を続ける形である。",
//       array:
//         [
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
//           [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//         ]
//     }
//   ];
// }