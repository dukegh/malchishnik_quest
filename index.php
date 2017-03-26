<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Квест - Мальчишник</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimal-ui" />
    <meta name="apple-mobile-web-app-status-bar-style" content="yes" />


    <link rel="stylesheet" href="/mobile-angular-ui/dist/css/mobile-angular-ui-hover.min.css" />
    <link rel="stylesheet" href="/mobile-angular-ui/dist/css/mobile-angular-ui-base.min.css" />
    <link rel="stylesheet" href="/mobile-angular-ui/dist/css/mobile-angular-ui-desktop.min.css" />
    <script src="/js/angular.min.js"></script>
    <script src="/js/angular-route.min.js"></script>
    <script src="/mobile-angular-ui/dist/js/mobile-angular-ui.min.js"></script>
    <script src="/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js"></script>
    <script src="/angular-file-upload/dist/angular-file-upload.min.js"></script>

    <link rel="stylesheet" href="/quest.css" />
    <script src="/js/quest.js"></script>

    <link rel="stylesheet" href="/PhotoSwipe/dist/photoswipe.css">
    <link rel="stylesheet" href="/PhotoSwipe/dist/default-skin/default-skin.css">
    <script src="/PhotoSwipe/dist/photoswipe.min.js"></script>
    <script src="/PhotoSwipe/dist/photoswipe-ui-default.min.js"></script>

</head>
<body ng-app="Quest"
      ng-controller="MainController"
      ui-prevent-touchmove-defaults>

<!-- Sidebars -->
<div class="sidebar sidebar-left">
    <div class="scrollable">
        <h1 class="scrollable-header app-name">Квесты</h1>
        <div class="scrollable-content">
            <div id="questMenu" lass="list-group" ui-turn-off='uiSidebarLeft'>
                <a class="list-group-item" href="#/">Старт
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q1">Квест 1
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q2">Квест 2
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q3">Квест 3
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q4">Квест 4
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q5">Квест 5
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q6">Квест 6
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q7">Квест 7
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q8">Квест 8
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/q9">Квест 9
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/map">Карта
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <!--<a class="list-group-item" href="#/uploadPage">Загрузка
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/carousel">Карусель
                    <i class="fa fa-chevron-right pull-right"></i></a>
                <a class="list-group-item" href="#/photoswipe">Фото
                    <i class="fa fa-chevron-right pull-right"></i></a>-->
            </div>
        </div>
    </div>
</div>
<div class="sidebar sidebar-right">Right</div>

<div class="app"
     ui-swipe-right='Ui.turnOn("uiSidebarLeft")'
     ui-swipe-left='Ui.turnOff("uiSidebarLeft")'>

    <div class="navbar navbar-app navbar-absolute-top">
        <div class="navbar-brand navbar-brand-center" ui-yield-to="title">
            Мальчишник
        </div>

        <div class="btn-group pull-left">
            <div ui-toggle="uiSidebarLeft" class="btn sidebar-toggle">
                <i class="fa fa-bars"></i> Квесты
            </div>
        </div>

        <!--<div class="btn-group pull-right">
            <div class="btn btn-navbar">
                Right Action
            </div>
        </div>-->
    </div>
    <div class="navbar navbar-app navbar-absolute-bottom">
        <div class="btn-group justified">
            <a href="http://vignette4.wikia.nocookie.net/fantendo/images/4/48/Pikachu_running_animation_by_cadetderp-d5407a9.gif" class="btn btn-navbar"> <img width="10%" src="/img/logo.png"></a>
        </div>
    </div>

    <div class='app-body' ng-class="{loading: loading}">
        <div ng-show="loading" class="app-content-loading">
            <i class="fa fa-spinner fa-spin loading-spinner"></i>
        </div>
        <div class='app-content'>
            <ng-view></ng-view>
        </div>
    </div>
</div><!-- ~ .app -->

<!-- Modals and Overlays -->
<div ui-yield-to="modals"></div>
<div ng-include="'modalPhoto.php'"></div>

<audio class="beep5">
    <source src="/mp3/beep5.mp3" />
</audio>

<audio class="beep15">
    <source src="/mp3/beep15.mp3" />
</audio>

<audio class="success">
    <source src="/mp3/success.mp3" />
</audio>



<script src="/js/jquery-3.1.0.min.js"></script>
<script src="/js/jquery.cookie.js"></script>
<script src="/js/footer.js"></script>

<?php
include "core.php";
?>
<script>
var currentQuest = <?=json_encode(getCurrentQuest())?>;
var elfPoints = <?=json_encode(getCheckPoints())?>;
updateQuestMenu();
var photoItems = [
<?php
$files = scandir('uploads');
foreach ($files as $file) {
    if ($file[0] == '.') continue;
    $size = getimagesize("uploads/$file");
    echo "{src: '/uploads/$file', w: $size[0], h: $size[1], title: '$file $size[0]x$size[1]'},";
}
?>
];
</script>

</body>
</html>