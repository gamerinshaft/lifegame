Lifegame = function(canvas,previewCanvas,cellSize,color){
  var _ = this;
  _.cellSize = cellSize;
  _.cvs = canvas;
  _.previewCanvas = previewCanvas;
  if(!_.cvs || !_.cvs.getContext||!_.previewCanvas || !_.previewCanvas.getContext) return false;
  _.cellColor = color;
  _.scaleSize = 0.5;
  _.playStatus = false;
  _.throughTime = 0;
  _.cellWidth = _.cvs.width/_.cellSize;
  _.frameRenderTime = 100;
  _.array = _.randomArray(0);
  _.loadArrays;
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
          if(!(i == 0 && j == 0)){
            switch(_.array[roopCell(x + i)][roopCell(y + j)]){
              case 1:
              case 3:
                point = point + 1;
                break;
            }
          }
        }
      }
      function roopCell(val){
        if(val >= _.cellSize){
          return val - _.cellSize;
        }else if(val < 0){
          return val + _.cellSize;
        }else{
          return val;
        }
      }
      function isAround(i,j){
        return !(i == 0 && j == 0) && (x + i >= 0 && y + j >= 0) && (x + i < _.cellSize && y + j < _.cellSize)
      }
      return point;
    }
  },
  reverse: function(val){
    var _ = this;
    var tmpArray = _.randomArray(0);
    for(var i = 0; i < _.cellSize; i++){
      for(var j = 0; j < _.cellSize; j++){
        if(val == "vertical"){
          tmpArray[i][j] = _.array[_.cellSize-1-i][j];
        }else if(val == "horizon"){
          tmpArray[i][j] = _.array[i][_.cellSize-1-j];
        }
      }
    }
    _.array = tmpArray;
    _.drawmap(_.array);
  },
//=====================================
  clear: function(){
    var _ = this;
    _.array = _.randomArray(0);
    _.drawmap(_.array);
    _.resetTime()
    _.stop()
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
  renderTime: function(val){
    var _ = this;
    if(val !=null){
      _.frameRenderTime = val;
      _.fireEvent("renderTime");
    }else{
      return _.frameRenderTime;
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
      if(hoverX == null || hoverY == null){
        hoverX = Math.floor(((e.clientX + window.pageXOffset - this.getBoundingClientRect().left) /(_.cellWidth * _.scaleSize)));
        hoverY = Math.floor((e.clientY + window.pageYOffset - this.getBoundingClientRect().top) /(_.cellWidth * _.scaleSize));
      }
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
    ctx.fillStyle =  _.cellColor;
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
            ctx.fillStyle = _.cellColor;
            break;
          case 3:
            ctx.fillStyle = "rgba(0,120,0,0.3)";
            ctx.fillRect(cellWidth*j,cellWidth*i,cellWidth,cellWidth);
            ctx.fillStyle = _.cellColor;
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
  },
  color: function(val){
    var _ = this;
    if(val !=null){
      _.cellColor = val;
      _.drawmap(_.array);
    }else{
      return _.cellColor;
    }
  },
  save: function(form){
    var _ = this;
    var input = document.createElement( 'input' );
    input.setAttribute( 'type' , 'hidden' );
    input.setAttribute( 'name' , 'array' );    // nameは任意で
    input.setAttribute( 'value' , _.parseArray(_.array) );   // データを入れる
    form.appendChild( input );
  },
  parseArray: function(originalArray){
    var _ = this;
    var array = "";
    for(var i=0; i < originalArray.length; i++){
      if(i == _.cellSize -1){
        array = array + originalArray[i]
      }else{
        array = array + originalArray[i] + "&";
      }
    }
    array = array.replace(/,/g,"");
    array = array.replace(/&/g,",");
    return array;
  },
  export: function(){
    var _ = this;
    if(confirm("配列情報をテキストファイルとして書き出しますか？")){
      var exportFile = _.parseArray(_.array);
      downloadAsFile("cellMap", exportFile);
    };
    function downloadAsFile(fileName, content) {
      var a = document.createElement('a');
      a.download = fileName;
      a.href = 'data:application/octet-stream,'+encodeURIComponent(content);
      a.click();
    };
  },
  import: function(array){
    var _ = this;
    console.log(array.length);
    _.array = array;
    _.cellSize = _.array.length;
    _.cellWidth = _.cvs.width/_.cellSize;
    _.drawmap(_.array);
    _.resetTime();
    _.fireEvent("import");
  },
  presets: function(){
    var data =
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
    return data;
  }
}