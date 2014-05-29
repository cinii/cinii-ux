<?php


require_once('./php_lib/simple_html_dom.php');


header("Content-Type: text/xml; charset=UTF-8");


// 論文ID からの　論文 rdf　詳細情報リスト　HTMLパース　同姓同名検索時に研究課題数の算出用




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


//$urlString = "http://kaken.nii.ac.jp/d/p/23240072"; //====== このようなurlがコールされる


$html = file_get_html($urlString); //HTML Call ※処理重い







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

foreach ($html->find('#investigators .inv_name .inv_n') as $nameURL) { //A
    $pTitle = $investigator->appendChild($dom->createElement('name'));
    //$pTitle->appendChild($dom->createTextNode($nameURL->innertext));//Title

    if($nameURL->getAttribute('href')){
        $pTitle->setAttribute('url', $nameURL->getAttribute('href'));
    }

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




$pdis = $data->appendChild($dom->createElement('distributors'));



//distributors 研究分担者
foreach ($html->find('#distributors .dist_data UL') as $distributorsXML) { //進捗

    $distLIinner = str_get_html('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'.$distributorsXML->innertext);
    //$distLIinner->formatOutput = true;


    $pdistributors = $pdis->appendChild($dom->createElement('subinvestigators'));//distributors//subinvestigators


    $pdistributors->appendChild($dom->createTextNode($distLIinner->find('.dist_n',0)->innertext)); //研究分担者


    if($distLIinner->find('A', 0)){

        $pdistributors->setAttribute('url', $distLIinner->find('A',0)->getAttribute('href'));//リンクが内場合がある
    }

    $pdistributors->setAttribute('sid', '');
    $pdistributors->setAttribute('sid', $distLIinner->find('.dist_num',0)->innertext);

    $pdistributors->setAttribute('aff', '');
    $pdistributors->setAttribute('aff', $distLIinner->find('.dist_aff',0)->innertext);

}










//
////=====研究課題のドキュメント
//
//
//foreach ($html->find('#research_documents A') as $kadai) { //A
//    $pKadai = $investigator->appendChild($dom->createElement('doc'));
//    $pKadai->appendChild($dom->createTextNode($kadai->innertext)); //A
//    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
//}
//foreach ($html->find('#research_documents .doc_year') as $kadaiYear) { //A
//    $pKadai = $investigator->appendChild($dom->createElement('doc'));
//    /* 		$pKadai->appendChild($dom->createTextNode($kadaiYear->innertext));//A */
//    $pKadai->setAttribute('year', $kadaiYear->innertext);
//}

//=====研究課題のドキュメント




$report = $data->appendChild($dom->createElement('report'));

foreach($html->find('#research_documents TR') as $docTR){//TR

    $docTRinner = str_get_html($docTR->innertext);//'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'


    foreach($docTRinner->find('.doc_year') as $docyear){//year
        $pdocc = $report->appendChild($dom->createElement('docyear'));
        $pdocc->setAttribute('year', $docyear->innertext);
    }
    foreach($docTRinner->find('A') as $doclink){//成果レポート※複数ある
        $pdoclink = $pdocc->appendChild($dom->createElement('doclink'));
        $pdoclink->appendChild($dom->createTextNode($doclink->innertext));
        $pdoclink->setAttribute('href',  $doclink->getAttribute('href') );
    }

}








//=====研究詳細データーbasic
$basic = $data->appendChild($dom->createElement('basic'));





foreach ($html->find('#basic_data .research_term P') as $term) { //期間
    $pkikan = $basic->appendChild($dom->createElement('term'));
    $pkikan->appendChild($dom->createTextNode($term->innertext)); //kikan
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






foreach ($html->find('#research_summary .summary_text') as $summary) { //要約 長い
    $psummary = $basic->appendChild($dom->createElement('summary'));
    $psummary->appendChild($dom->createTextNode($summary->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));
}
//







foreach ($html->find('#progressstatus_data LI') as $shinchoku) { //進捗

    $statusLIinner = str_get_html($shinchoku->innertext);

    $pprogress= $basic->appendChild($dom->createElement('progressstatus'));
    $pprogress->appendChild($dom->createTextNode($statusLIinner->find('P',0)->innertext)); //区分

    $pprogress->setAttribute('subtitle', $statusLIinner->find('H4',0)->innertext);

}
//



foreach ($html->find('#cit') as $futureTitle) { //将来
    $pfuture = $basic->appendChild($dom->createElement('future'));

    $pfuturet = $pfuture->appendChild($dom->createElement('futuretitle'));

    $pfuturet->appendChild($dom->createTextNode($futureTitle->innertext)); //kikan
    //$pKadai->setAttribute('url', $nameURL->getAttribute('href'));

    foreach ($html->find('.futurework_data') as $futureData){

        $pfuturedata = $pfuture->appendChild($dom->createElement('futuredata'));

        $pfuturedata->appendChild($dom->createTextNode($futureData->innertext)); //kikan
    }
}
//





$output = $dom->saveXML(); // put string in test1



echo $output;


$html->clear();

?>