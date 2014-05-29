<?php
/**
 * Created by IntelliJ IDEA.
 * Date: 2013/08/20
 */



$surl = "http://ci.nii.ac.jp/books/opensearch/search?";

$GET_ARRAY = $_GET;
$urlString = "";


foreach ($GET_ARRAY as $k => $v) {
    if($k =="aid"){
        //条件
        $urlString = $urlString."authorid=".$v."&";
    //}else if($k =="type" || $k =="format" || $k =="sortorder" || $k =="p" || $k =="count" || $k =="appid"){
     //   $urlString = $urlString.$k."=".$v."&";
    }
}


$urlString = substr($urlString, 0, strlen($urlString) - 1);




$data = file_get_contents($surl.$urlString);



header("Access-Control-Allow-Origin: *");

header("Content-Type: text/xml");


print $data;
?>