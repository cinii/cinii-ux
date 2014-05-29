<?php


$urlString = $_GET['url'];// API direct call

$data = file_get_contents($urlString);


header("Access-Control-Allow-Origin: *");

header("Content-Type: text/xml");


print $data;
?>