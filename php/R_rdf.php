<?php
require_once("./php_lib/dataget.php");// use socket 


$urlString = $_GET['url'];


$data = data_get($urlString);


header("Access-Control-Allow-Origin: *");

print $data;
?>