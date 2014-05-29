<?php
require_once("./php_lib/dataget.php");// use socket 

$surl = "http://ci.nii.ac.jp/opensearch/author?";

$GET_ARRAY = $_GET;
$urlString = "";


foreach ($GET_ARRAY as $k => $v) {//count start sortorder   format は固定
	if($k =="q"){
		$v = urlencode($v);// GETでゲットすると文字列に戻ってしまうから
	}
		$urlString = $urlString.$k."=".$v."&";
}




$urlString = substr($urlString, 0, strlen($urlString) - 1);


//$data = data_get($surl."q=%E3%82%AB%E3%83%83%E3%83%91&type=0&format=rss");// データー送信例



$data = data_get($surl.$urlString);







header("Access-Control-Allow-Origin: *");


print $data;
?>