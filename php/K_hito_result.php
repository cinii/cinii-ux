<?php
/**
 * Created by IntelliJ IDEA.
 * Date: 2013/08/23
 * Time: 1:02
 */


require_once("./php_lib/dataget.php");// use socket

$surl = "http://kaken.nii.ac.jp/x/opensearch/rss/r?";// 研究　人　研究者検索




$GET_url = $_GET["url"];

$urlString = "";



if($GET_url ==""){
    $urlString = "qg=".$_GET["qg"];//人名検索のクエリ
}else{
    $pos= strpos($GET_url,"kaken.nii.ac.jp/r/");
    $pos+=18;
    $urlString = "qg=".substr($GET_url, $pos, strlen($GET_url));//人検索
}





$data = data_get($surl.$urlString);


header("Access-Control-Allow-Origin: *");

print $data;
?>