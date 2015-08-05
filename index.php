<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ライフゲーム</title>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
  <div class="flex row">
    <div class="flex-auto"></div>
    <div class="flex column">
      <div class="flex-auto"></div>
      <canvas id="lifegame" width="400"></canvas>
      <div class="flex-auto"></div>
    </div>
    <div class="flex-auto">
      <div id="menuButton"><i class='fa fa-step-forward'></i></div>
    </div>
    <aside class="rightbar open" id="rightbar">
      <h1>僕らのライフゲーム</h1>
      <ul>
        <li>
          <h2>セルをランダム配置する</h2>
          <div class="content" id="remapping">
            <i class="fa fa-repeat"></i>
            <span class="value">0回</span>
          </div>
        </li>
        <li>
          <h2>セル情報をクリアする</h2>
          <div class="content" id="clearing">
            <i class="fa fa-trash"></i>
            <span class="value">0回</span>
          </div>
        </li>
        <li>
          <h2>セルサイズを変更する</h2>
          <div class="content" id="resizing">
            <i class="fa fa-minus"></i>
            <i class="fa fa-plus"></i>
            <span class="value">50個</span>
          </div>
        </li>
        <li>
          <h2>描画間隔を変更する</h2>
          <div class="content" id="frameRenderTiming">
            <i class="fa fa-caret-left"></i>
            <i class="fa fa-caret-right"></i>
            <span class="value">10フレーム/1秒</span>
          </div>
        </li>
        <li>
          <h2>画面サイズを変更する</h2>
          <div class="content" id="scaling">
            <i class="fa fa-search-plus"></i>
            <i class="fa fa-search-minus"></i>
            <span class="value"></span>
          </div>
        </li>
        <li>
          <h2>表示を反転する</h2>
          <div class="content" id="reversing">
            <i class="fa fa-arrows-v"></i>
            <i class="fa fa-arrows-h"></i>
          </div>
        </li>
        <li>
          <h2>セルカラーを変更する</h2>
          <div class="content" id="coloring">
            <input class="color" value="5cffd9">
          </div>
        </li>
        <li>
          <h2>再生する</h2>
          <div class="content" id="playing">
            <i class="fa fa-youtube-play"></i>
            <span class="value">0秒</span>
          </div>
        </li>
        <li>
          <h2 id="modalButton" class="button">データセットを読み込む</h2>
        </li>
        <li>
          <h2 id="saveButton" class="button">データを保存する</h2>
        </li>
        <li>
          <h2 id="exportButton" class="button">データを書き出す</h2>
        </li>
      </ul>
    </aside>
    <div id="modal">
      <div class="flex row">
        <div class="flex-auto"></div>
        <div class="flex column">
          <div class="flex-auto"></div>
          <div class="modal-content">
            <div id="closeButton" class="closeButton"><i class="fa fa-times"></i></div>
            <div class="flex column">
              <div class="tabs">
                <div class="tab active" id="presets">プリセット</div>
                <div class="tab" id="postData">投稿データ</div>
              </div>
              <div class="canvas-wrap">
                <canvas id="previewCanvas" width="300"></canvas>
                <div class="information">
                  <span class="tag">名前</span>
                  <h1 id="previewName">シュッシュポッポ</h1>
                  <span class="tag">備考</span>
                  <p id="previewContent">頑張って作ったよ</p>
                </div>
              </div>
              <div class="menu flex row">
                <i id="menuLeft" class="fa fa-angle-left"></i>
                <div class="flex-auto"></div>
                <div id="import">このデータを読み込む</div>
                <div class="flex-auto"></div>
                <i id="menuRight" class="fa fa-angle-right"></i>
              </div>
            </div>
          </div>
          <div class="flex-auto"></div>
        </div>
        <div class="flex-auto"></div>
      </div>
    </div>
  </div>
  <div id="saveModal">
      <div class="flex row">
        <div class="flex-auto"></div>
        <div class="flex column">
          <div class="flex-auto"></div>
          <div class="modal-content">
            <div id="closeSaveButton" class="closeButton"><i class="fa fa-times"></i></div>
            <div class="flex column">
              <h1>現在描画されているデータを保存する</h1>
              <form id="form" action="index.php" method="POST">
                <input type="text" name="name" placeholder="作品名">
                <textarea type="text" name="content" placeholder="説明"></textarea>
                <input id="submit" type="submit" value="保存する"/>
              </form>
            </div>
          </div>
          <div class="flex-auto"></div>
        </div>
        <div class="flex-auto"></div>
      </div>
    </div>
  <script type="text/javascript" src="lifegame_refactor.js"></script>
  <script type="text/javascript" src="jscolor/jscolor.js"></script>
  <?php
    try {
         $dbh = new PDO('mysql:host=160.16.97.70;port=110;dbname=x6313067','x6313067','admin');
    } catch (PDOException $e){
         var_dump($e->getMessage());
         exit;
    }
    // 処理
    // レコードの挿入
    if(!empty($_POST["name"]) && !empty($_POST["array"])){
      $stmt = $dbh->prepare("insert into lifegameArrayInfo (name,content,array) values(:name, :content,:array)");
      $stmt->execute(
        array(
          ":name"=>$_POST["name"],
          ":content"=>$_POST["content"],
          ":array"=>$_POST["array"]
        )
      );
    }

    $sql = "select * from lifegameArrayInfo";     // sql文
    $stmt = $dbh->query($sql);     // ステートメント
    $arrays = array();
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $lifegameArrayInfo) {
      array_push($arrays, array("name" => $lifegameArrayInfo['name'], "content" =>  $lifegameArrayInfo['content'], "array" => $lifegameArrayInfo['array']));
    }
    // 切断
    $dbh = null;
  ?>
  <script>
    window.onload = function(){
      var lifegame = document.getElementById("lifegame");
      var previewCanvas = document.getElementById("previewCanvas");
      game = new Lifegame(lifegame, previewCanvas, 50, "#5CFFD9");
      playMenu();
      scaleMenu();
      resizeMenu();
      remapMenu();
      clearMenu();
      reverseMenu();
      frameRenderTimeMenu();
      colorMenu();
      saveMenu();
      exportMenu();
      baseMenu();
      previewMenu();
      menuButton();
      function menuButton(){
        document.getElementById("menuButton").addEventListener("click",function(){
          if(document.getElementById("rightbar").classList.contains('open')){
            this.innerHTML = "<i class='fa fa-step-backward'></i>"
            document.getElementById("rightbar").classList.remove('open');
          }else{
            this.innerHTML = "<i class='fa fa-step-forward'></i>"
            document.getElementById("rightbar").classList.add('open');
          }
        });
      }
      function previewMenu(){
        game.loadArrays = <?php echo json_encode($arrays, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
        for(var i=0;i<game.loadArrays.length;i++){
          game.loadArrays[i].array = game.loadArrays[i].array.split(",");
          for(var j=0;j<game.loadArrays[i].array.length;j++ ){
            game.loadArrays[i].array[j] = game.loadArrays[i].array[j].split("");
            for(var k=0;k<game.loadArrays[i].array[j].length;k++ ){
              game.loadArrays[i].array[j][k] = Number(game.loadArrays[i].array[j][k])
            }
          }
        }
        game.previewCanvas.height = game.previewCanvas.width;
        previewArrays = game.presets();
        render(previewArrays[0]);
        var num = 0;
        document.getElementById("modalButton").addEventListener("click", function(){
          document.getElementById("modal").classList.add('show');
          game.stop();
        });
        document.getElementById("postData").addEventListener("click", function(){
          document.getElementById("presets").classList.remove("active");
          this.classList.add("active");
          previewArrays = game.loadArrays;
          render(previewArrays[0]);
          document.getElementById("menuRight").style.color = "#555";
          document.getElementById("menuLeft").style.color = "grey";
          num = 0;
        });
        document.getElementById("presets").addEventListener("click", function(){
          document.getElementById("postData").classList.remove("active");
          this.classList.add("active");
          previewArrays = game.presets();
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
          game.import(previewArrays[num].array)
          document.getElementById("modal").classList.remove("show");
        });
        function render(target){
          console.log(target.array.length);
          game.drawmap(target.array ,"preview");
          document.getElementById("previewName").innerHTML = target.name;
          document.getElementById("previewContent").innerHTML = target.content;
        }
      }
      function baseMenu(){
        lifegame.addEventListener("resetTime",function(){
          document.getElementById("playing").children[1].innerHTML = "0秒";
        });
      }
      function exportMenu(){
        document.getElementById("exportButton").addEventListener("click", function(){
          game.export();
        })
      }
      function saveMenu(){
        document.getElementById("saveButton").addEventListener("click",function(e){
          document.getElementById("saveModal").classList.add("show");
          game.stop();
        });
        document.getElementById("closeSaveButton").addEventListener("click",function(e){
          document.getElementById("saveModal").classList.remove("show");
        });
        document.getElementById("submit").addEventListener("click",function(e){
          var form = document.getElementById("form");
          game.save(form);
        });
      }
      function colorMenu(){
        var parent = document.getElementById("coloring");
        lifegame.color = "#" + parent.children[0].getAttribute("value");
        parent.children[0].addEventListener("change", function () {
          game.color(this.style.backgroundColor);
        });
      }
      function reverseMenu(){
        var parent = document.getElementById("reversing");
        parent.children[0].addEventListener("click", function (e) {
          game.reverse("vertical");
        });
        parent.children[1].addEventListener("click", function (e) {
          game.reverse("horizon");
        });
      }
      function frameRenderTimeMenu(){
        var parent = document.getElementById("frameRenderTiming");
        lifegame.addEventListener("renderTime",function(){
          render();
        });
        parent.children[0].addEventListener("click",function(){
          if(Math.round(1000 / game.renderTime()) > 1){
            game.renderTime(game.renderTime() * 2);
          }
        });
        parent.children[1].addEventListener("click",function(){
          if(Math.round(1000 / game.renderTime()) < 360){
            game.renderTime(game.renderTime() / 2);
          }
        });
        function render(){
          parent.children[2].innerHTML = Math.round(1000/game.renderTime()) + "フレーム/1秒";
        }
      }
      function clearMenu(){
        var parent = document.getElementById("clearing");
        var i = 1;
        lifegame.addEventListener("clear", function(){
          render();
        })
        parent.children[0].addEventListener("click", function (e) {//clear
          game.clear();
        });
        function render(){
          parent.children[1].innerHTML = i + "回"
          i += 1;
        }
      }
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
        lifegame.addEventListener("import",function(){
          render();
        })
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

  </script>
  <script>

  </script>
</body>
</html>