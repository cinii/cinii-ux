<?php

$surl = "http://ci.nii.ac.jp/books/opensearch/search?";

$GET_ARRAY = $_GET;
$urlString = "";


foreach ($GET_ARRAY as $k => $v) {
	if($k =="q"){
        //条件　仮置き
		$v = urlencode($v);//※
	}else{
        $v = urlencode($v);//TEST
    }
		$urlString = $urlString.$k."=".$v."&";
}



$urlString = substr($urlString, 0, strlen($urlString) - 1);


$data = file_get_contents($surl.$urlString);



header("Access-Control-Allow-Origin: *");


header("Content-Type: text/xml");





print $data;
?>