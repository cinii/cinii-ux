cinii-ux
========
# 導入手順

ソースコード一式を動作させる条件は以下のとおり。

## ファイル設置場所
* PHP 5以上が稼働しているウェブサー

## ファイル設置方法
* すべてのファイルをディレクトリにコピーします。
* 一般的なウェブサーバであればサーバ側の特別な設定は不要です。

## 動作方法
* 上記で設置した公開ウェブサーバのパスをブラウザで入力します。
（例： https://example.com/cinii-ux/ )

## 依存APIとウェブページ
* このユーザインターフェイスは、既存のCiNii,KakenのAPIに依存しているため、先の2つのAPI仕様が2013年9月現在の仕様と同一であることが条件となります。
* ※参照
- CiNii OpenSearchAPI: http://ci.nii.ac.jp/info/ja/api/a_opensearch.html
- Kaken: https://kaken.nii.ac.jp/ja/help/#search-form
* 論文検索の特定著者IDソートによる論文リスト取得に関して、2014年3月現在、OpenSearch APIで提供されていないため、htmlのページから情報を取得しています。http://ci.nii.ac.jp/nrid/1000030413925 のように、 /nrid/(論文著者ID）の結果ウェブページの仕様が変更になると正確に情報を取得することが出来なくなります。
* （※ ウェブページの仕様が変わる＝htmlのタグ構造が変わり同じ解析方法が使えなくなる事を指す）
* 対象ブラウザ
- iOS用 iPad版 Safari6以上 ランドスケープモード（＝横状態）Retina display 解像度対応
- 画面サイズの異なるスマートフォン・ファブレット・タブレットでもSafariかChromeならば動作しますが、デザイン上、横幅1024pxで設計・デザインしているため、文字サイズ等が最適化されて表示できません。

# ソースコード構成ファイル

HTML

* index.html
トップページ

スタイルシート

* /css/common.css
共通スタイルシート。iPad Safariをターゲットに全体およびヘッダ部分のスタイル指定。
* /css/detail-search.css.css
詳細検索（通常使用では隠れている部分のスタイル指定）。
* /css/left-style.css
左側、検索結果一覧部分のスタイルを指定。
* /css/right-style.css
右側、レコード詳細のスタイル指定（各検索対象エンティティに限らず、すべて共通に指定） 
* /css/parts-style.css
ローディングのサークルアイコンやオプション的な表示要素のスタイル指定。

JavaScript

* /js/jquery-2.0.3.min.js
Jquery DOM操作系Javascriptライブラリ　取得元：http://jquery.com (MITライセンス)
* /js/setup.js
ユーザインターフェイスのセットアップ初期設定を行うスクリプト。※上記jQuery読み込み後の最初に必要
* （以下の６つは、読み込み順序不問）
* /js/niiModel.js
ユーザインターフェイスのデータモデルを設定
* /js/niiControlller.js
ユーザインターフェイスの制御部分を管理するスクリプトがまとめられている。
* /js/niiView.js
ユーザインターフェイスのViewに関わる基本的な実装のあつまり。
* /js/niiLoadXmlClass.js
AjaxによるAPI読み込みを集中管理するクラス
* /js/niiViewClass.js
上記クラスと一緒にインスタンス化されて、左側一覧ビューのHTMLタグをセットするクラス。
* /js/niiViewSettings.js
上記クラスでセットされるHTMLを記述したスクリプト
* /js/ciNiiLibUtilitySet.js
初回の処理完了後にDelayをかけて、画面全体に対して処理を行うスクリプトCiNiiプロトタイプ専用

PHP

* /php/php_lib/dataget.php
クロスドメイン制約の回避の為の共通PHPライブラリ（プログラム）※ 80番port  Socket方式http://www.muratayusuke.com/works/#PHPSocket (村田佑介氏 作）
* /php/php_lib/simple_html_dom.php
PHPで指定URLのHTMLを解析するライブラリ
http://simplehtmldom.sourceforge.net/ by. S.C. Chen (me578022@gmail.com)  作
* /php/R_result.php
論文検索にて、論文一覧を取得するPHP
*  /php/R_rdf.php
論文検索にて、上記一覧の論文IDを元に論文詳細 rdf に取得するPHP
*  /php/R_hito.php
論文検索にて、論文著者一覧を出すPHP。（※APIが別アドレスになっているのでスクリプトも分割）
* /php/R_hito_RdfMakeXml.php
論文検索にて、著者ID による論文一覧を取得するためのPHP。
APIが用意されていないので、HTMLを解析してxmlを生成している。※この場合のXSS制約は発生していない。独自にHTML情報を参照しているので、論文著者の詳細情報を共通。
* /php/T_result.php
図書検索にて、図書一覧を取得するPHP
* /php/T_rdf.php
図書検索にて、上記一覧の図書IDを元に、図書詳細 rdf を読み込む為のPHP
* /php/T_hito.php
図書検索にて、検索条件に合致する図書著者一覧を取得するPHP
* /php/T_hito_RdfMakeXml.php
図書検索にて、図書著者ID（rdfのリンク）を元に詳細 rdf情報を取得するPHP
* /php/T_authorIdFromAPI.php
図書検索にて、特定図書著者ID(authorID）をソートして図書一覧を取得するPHP
* /php/K_result.php
研究検索にて、KAKENから、研究課題一覧を取得するPHP
* /php/K_html_rdfMakeXml.php
研究検索にて、上記研究課題のIDにつけられたrdfのリンクからhtmlをPHP内で解析するPHP
（※ KAKENのAPIからは、XML構造で詳細データが返信されないので、HTMLを解析する方式を採用）
（※ 単純に、研究名・研究者情報のみ取り出したい場合は、APIを使う事も可能）
* /php/K_hito.php
研究検索にて、KAKENから、研究者一覧を取得するPHP。同じように対象と人とでアドレスが違う為別PHPに
* /php/K_hito_result.php
研究検索にて、上記研究者番号(=ID)から、研究者検索のAPIを使って詳細 rdf 情報を取得するPHP。
* /php/K_hito_RdfMakeXml.php
研究検索にて、特定の研究者番号(=ID)が、どんな研究課題に参加しているか、参加研究課題一覧を取得するPHP
（※研究課題検索のID検索をかけるとAPIからも情報を取得できるが、XML構造で定義されていない情報があるため、HTMLを解析して独自のXMLを取得できる方式を採用）
