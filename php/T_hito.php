<?php


$surl = "http://ci.nii.ac.jp/books/opensearch/author?";

$GET_ARRAY = $_GET;
$urlString = "";


foreach ($GET_ARRAY as $k => $v) {
	if($k =="name"){
		$v = urlencode($v);// GETで文字列が戻ってしまうので、再度URLエンコード
	}else if($k =="q"){
		$k = "name";
		$v = urlencode($v);
	}
	$urlString = $urlString.$k."=".$v."&";
}



$urlString = substr($urlString, 0, strlen($urlString) - 1);




//$data = file_get_contents($surl."name=%e7%94%b0%e4%b8%ad&type=0&format=rss");// URL生成　例

$data = file_get_contents($surl.$urlString);






header("Access-Control-Allow-Origin: *");


header("Content-Type: text/xml");


print $data;
?>