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
      <p>必修なのにテストを受け忘れてしまったけれど単位が欲しいです！！！！</p>
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
            <span class="value">20個</span>
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
      $content = $lifegameArrayInfo['content'];
      array_push($arrays, array("name" => $lifegameArrayInfo['name'], "content" =>  $content, "array" => $lifegameArrayInfo['array']));
    }
    // 切断
    $dbh = null;
  ?>
  <script>
    window.lifegame.loadArrays = <?php echo json_encode($arrays, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
    for(var i=0;i<window.lifegame.loadArrays.length;i++){
      window.lifegame.loadArrays[i].array = window.lifegame.loadArrays[i].array.split("&");
      for(var j=0;j<window.lifegame.loadArrays[i].array.length;j++ ){
        window.lifegame.loadArrays[i].array[j] = window.lifegame.loadArrays[i].array[j].split(",");
        for(var k=0;k<window.lifegame.loadArrays[i].array[j].length;k++ ){
          window.lifegame.loadArrays[i].array[j][k] = Number(window.lifegame.loadArrays[i].array[j][k])
        }
      }
    }
  </script>
  <script>
    document.getElementById("menuButton").addEventListener("click",function(){
      if(document.getElementById("rightbar").classList.contains('open')){
        this.innerHTML = "<i class='fa fa-step-backward'></i>"
        document.getElementById("rightbar").classList.remove('open');
      }else{
        this.innerHTML = "<i class='fa fa-step-forward'></i>"
        document.getElementById("rightbar").classList.add('open');
      }
    });
  </script>
  <script type="text/javascript" src="lifegame.js"></script>
  <script type="text/javascript" src="jscolor/jscolor.js"></script>
</body>
</html>