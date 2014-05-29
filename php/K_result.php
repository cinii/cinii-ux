<?php
require_once("./php_lib/dataget.php");// use socket 

$surl = "http://kaken.nii.ac.jp/x/opensearch/rss/p?";// 研究　研究課題基本サーチ

$GET_ARRAY = $_GET;
$urlString = "";


foreach ($GET_ARRAY as $k => $v) {
	if($k =="q"){
        //条件　チェックの痕跡
        $v = urlencode($v);
    }else{
        $v = urlencode($v);
    }
		$urlString = $urlString.$k."=".$v."&";
}




$urlString = substr($urlString, 0, strlen($urlString) - 1);

//$data = data_get($surl."q=%E3%82%AB%E3%83%83%E3%83%91&type=0&format=rss");// クエリ送信　例

$data = data_get($surl.$urlString);





header("Access-Control-Allow-Origin: *");

print $data;
?>