<?php

require_once ('./php_lib/simple_html_dom.php');

header("Content-Type: text/xml; charset=UTF-8");

// 該当人名IDでの　論文数と　論文リストを取得させるHTMLパーサー　

// APIでは提供されていない 2013.8 ※このXML構成は、rdf規格に準じていない　誤解を避けるため

$nridURL = "http://ci.nii.ac.jp/nrid/";
$urlString ="";

if($_GET){

    $GET_ARRAY = $_GET;


    $GET_url = $_GET["aid"];
    $urlString = $GET_url."?";

    foreach ($GET_ARRAY as $k => $v) {
        if($k !=="aid" && $k !=="q"){
            $urlString = $urlString.$k."=".$v."&";
        }
    }
};



//$GET_url = "http://ci.nii.ac.jp/nrid/9000237720818";//　URL　例







$html = file_get_html($nridURL.$urlString);//HTML Call 処理重い


 //Creates XML string and XML document using the DOM 
 $dom = new DomDocument('1.0'); 
 //generate xml 
 $dom->formatOutput = true; // set the formatOutput attribute of




 //add root - <books> 
 $data = $dom->appendChild($dom->createElement('data'));

 






//=====著者データー
 $personal = $data->appendChild($dom->createElement('personal'));
 
 foreach($html->find('H1.author_class SPAN') as $pSpan){
		$pName = $personal->appendChild($dom->createElement('name'));
		$pName->appendChild($dom->createTextNode($pSpan->innertext));//name  二つ目はローマ字表記
 }
 
 //$aidStr = str_replace('ID:', '' , $html->find('div#idinheadeing')->innertext ); //ID:取る
foreach($html->find('#idinheadeing') as $ppaid){
	$aidStr = str_replace('ID:', '' , $ppaid->innertext ); //ID:取る
 $personal->setAttribute('aid', $aidStr );
}



foreach($html->find('#affiliationinheading SPAN') as $pa){
	$paffi = $personal->appendChild($dom->createElement('affiliations'));
	$paffi->appendChild($dom->createTextNode($pa->innertext));//所属
}


//論文数　総数

foreach($html->find('#resultlist H1.srchh1') as $number){

	$phitc = $personal->appendChild($dom->createElement('totalResults'));
	
	$countStr = $number->innertext;
	
	$keftMojiLength = strpos($countStr,":") + 1;
	
	$numStr = trim(mb_substr($countStr, $keftMojiLength, strpos($countStr,"件") - $keftMojiLength) );
	$numStr = trim($numStr, " 　 ");
	
	$numStr = intval($numStr);//整数に

	$phitc->appendChild($dom->createTextNode($numStr));//論文総数
	
}










//

$itemsCount = 0;// 20個かそれ未満をチェック


$itemlist = $data->appendChild($dom->createElement('list'));//論文のリスト

foreach($html->find('#itemlistbox li') as $element){//dt[class=itemlistbox]

			$item = $itemlist->appendChild($dom->createElement('item'));
			$item->setAttribute('showNum', $itemsCount);
	 		
	 			
	 		$htmldom = new DomDocument('1.0');
	 		$htmldom->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'.$element->innertext);
		
		
		//$dtTitleNode = $htmldom->getElementsByTagName( "a" );
		$entry =  $htmldom->getElementsByTagName( "a" )->item(0);
		
		
		
		
		$dtTitle = $element->innertext;//find('a');//DT A
	

		
		//add <book> element to <books> 
		//
		
		$itemTitle = $item->appendChild($dom->createElement('title'));

		$itemTitle->appendChild($dom->createTextNode( $entry->nodeValue ));


        $itemLink = $item->appendChild($dom->createElement('link'));
        $itemLink->appendChild($dom->createTextNode( "http://ci.nii.ac.jp".$entry->getAttribute('href').".rdf" ));


//http://ci.nii.ac.jp/naid/110009585654.rdf
		
		$naidString = str_replace('/naid/', '', $entry->getAttribute('href'));
		
		$item->setAttribute('id',  $naidString);



	




		foreach($htmldom->getElementsByTagName( "p" ) as $para){
			$chkClass = $para->getAttribute('class');

			switch ($chkClass){
			case 'item_authordata':
			  // 処理
			  $itemAuthor = $item->appendChild($dom->createElement('author'));
			  $itemAuthor->appendChild($dom->createTextNode($para->nodeValue));//str_replace(array("\r\n","\n","\r"), '', #str)
			  
			  break;
			 case "item_summry description":
			  	
			  $itemsummry = $item->appendChild($dom->createElement('description'));
			  $itemsummry->appendChild($dom->createTextNode($para->nodeValue));
			  	
			  break;
			case 'item_summry':
			  $itemsummry = $item->appendChild($dom->createElement('summry'));
			  $itemsummry->appendChild($dom->createTextNode($para->nodeValue));
			  break;
			case 'item_journaldata':
			  $itemjournaldata = $item->appendChild($dom->createElement('journaldata'));
			  $itemjournaldata->appendChild($dom->createTextNode($para->nodeValue));
			  break;
			case 'item_otherdata':
			
				$itemotherdata = $item->appendChild($dom->createElement('otherdata'));
				
				
				$pcount = 0;
				foreach($para->getElementsByTagName( "a" ) as $otherdatalink){
					
			  	$itemotherdataLink = $itemotherdata->appendChild($dom->createElement('otherlink'));
			  	$itemotherdataLink->appendChild($dom->createTextNode( $otherdatalink->nodeValue ));//href
			  	
			  	$thisUrl = $otherdatalink->getAttribute('href');
				  $itemotherdataLink->setAttribute('url',  $thisUrl);
				  
				  //$para->removeChild($para->getElementsByTagName( "a" )->item(0) );// 個別に消えない
				  $pcount++;
				}
				for ($i = 0; $i < $pcount; $i++) {
					$para->removeChild( $para->getElementsByTagName( "a" )->item(0) );
				}
				
			  //残り このXML構成良くない
			  
			  $itemotherdata->appendChild($dom->createTextNode($para->nodeValue));

			  break;
			default:
			  // non
			}
			
		}


	$itemsCount++;
}


$itemlist->setAttribute('thisPageItemcount', $itemsCount);








                            
// save XML as string or file
$output = $dom->saveXML(); // put string in test1


echo $output;


$html->clear();
?>