<?php
require_once("./php_lib/dataget.php");// use socket 

$surl = "http://kaken.nii.ac.jp/x/opensearch/rss/r?";// 研究　人検索

$GET_ARRAY = $_GET;
$urlString = "";


foreach ($GET_ARRAY as $k => $v) {
	if($k =="q"){
		$v = urlencode($v);
        $urlString = $urlString."qe=".$v."&";
	}else if($k =="qe"){
        $v = urlencode($v);// このクエリが　研究者名検索
        $urlString = $urlString.$k."=".$v."&";//そのまま
    }else{
        $urlString = $urlString.$k."=".$v."&";
    }
		//$urlString = $urlString.$k."=".$v."&";

}




$urlString = substr($urlString, 0, strlen($urlString) - 1);

$data = data_get($surl.$urlString);





header("Access-Control-Allow-Origin: *");

print $data;
?>