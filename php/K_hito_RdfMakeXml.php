<?php

//require_once("./php_lib/dataget.php");// use socket
require_once('./php_lib/simple_html_dom.php');

header("Content-Type: text/xml; charset=UTF-8");


// 研究者 ID からの　論文 rdf　詳細情報リスト　HTMLパース　同姓同名検索時に研究課題数の算出用 2013.8.12


$urlString = "";

if ($_GET) {

    $GET_ARRAY = $_GET;

    $GET_url = $_GET["url"];
    $urlString = $GET_url . "?";

    foreach ($GET_ARRAY as $k => $v) {
        if ($k != "url") {
            $urlString = $urlString . $k . "=" . $v . "&";
        }
    }
};


$html = file_get_html($urlString);







//Creates XML string and XML document using the DOM
$dom = new DomDocument('1.0');
//generate xml
$dom->formatOutput = true; // set the formatOutput attribute of


//add root - <books>
$data = $dom->appendChild($dom->createElement('data'));


//=====研究データー
$research = $data->appendChild($dom->createElement('research'));


foreach ($html->find('#research_heading .research_class') as $head) {
    $pTitle = $research->appendChild($dom->createElement('title'));
    $pTitle->appendChild($dom->createTextNode($head->innertext)); //Title
}

foreach ($html->find('#research_heading .title_research_num') as $idnum) {
    $pIDnum = $research->appendChild($dom->createElement('idStr'));
    $pIDnum->appendChild($dom->createTextNode($idnum->innertext)); //Title
}


//=====研究者データー
$investigator = $data->appendChild($dom->createElement('investigator'));

foreach ($html->find('#investigators .inv_name A') as $nameURL) { //A
    $pTitle = $investigator->appendChild($dom->createElement('name'));
    //$pTitle->appendChild($dom->createTextNode($nameURL->innertext));//Title
    $pTitle->setAttribute('url', $nameURL->getAttribute('href'));
}

foreach ($html->find('#investigators .inv_name .inv_n') as $name) { //A
    $pTitle->appendChild($dom->createTextNode($name->innertext)); //Title
}

foreach ($html->find('#investigators .inv_num') as $inv_id) { //A
    $pTitle->setAttribute('id', $inv_id->innertext);
}


foreach ($html->find('#investigators .inv_aff') as $inv_aff) { //A
    $pAff = $investigator->appendChild($dom->createElement('affiliation'));
    $pAff->appendChild($dom->createTextNode($inv_aff->innertext)); //Title
}


//=====研究課題のドキュメント


foreach ($html->find('#research_documents A') as $kadai) { //A
    $pKadai = $investigator->appendChild($dom->createElement('doc'));
    $pKadai->appendChild($dom->createTextNode($kadai->innertext)); //A
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}
foreach ($html->find('#research_documents .doc_year') as $kadaiYear) { //A
    $pKadai = $investigator->appendChild($dom->createElement('doc'));
    /* 		$pKadai->appendChild($dom->createTextNode($kadaiYear->innertext));//A */
    $pKadai->setAttribute('year', $kadaiYear->innertext);
}


//=====研究詳細データーbasic
$basic = $data->appendChild($dom->createElement('basic'));


foreach ($html->find('#basic_data .research_term P') as $term) { //期間
    $pkikan = $basic->appendChild($dom->createElement('term'));
    $pkikan->appendChild($dom->createTextNode($kadai->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}


foreach ($html->find('#basic_data .subjct A') as $subject) { //サブジェクト
    $pkikan = $basic->appendChild($dom->createElement('subject'));
    $pkikan->appendChild($dom->createTextNode($subject->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}

foreach ($html->find('#basic_data .review_type P') as $review) { //審査区分
    $pkikan = $basic->appendChild($dom->createElement('review'));
    $pkikan->appendChild($dom->createTextNode($review->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}

foreach ($html->find('#basic_data .category P') as $category) { //カテゴリー研究種目
    $pkikan = $basic->appendChild($dom->createElement('category'));
    $pkikan->appendChild($dom->createTextNode($category->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}

foreach ($html->find('#basic_data .institution P') as $institution) { //カテゴリー研究種目
    $pkikan = $basic->appendChild($dom->createElement('institution'));
    $pkikan->appendChild($dom->createTextNode($institution->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}


foreach ($html->find('#basic_data .grant_amount LI') as $grant_list) { //カテゴリー研究種目
    $pkikan = $basic->appendChild($dom->createElement('grantlist'));
    $pkikan->appendChild($dom->createTextNode($grant_list->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}
//



// save XML as string or file
$output = $dom->saveXML(); // put string in test1



echo $output;


$html->clear();

?>