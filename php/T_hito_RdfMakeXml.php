<?php

require_once ('./php_lib/simple_html_dom.php');

header("Content-Type: text/xml; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
// 該当人名IDでの　論文数と　論文リストを取得させるHTMLパーサー

/* $nridURL = "http://ci.nii.ac.jp/nrid/"; // === 例　*/

$urlString ="";

if($_GET){

	$GET_ARRAY = $_GET;


	$GET_url = $_GET["url"];
	$urlString = $GET_url."?";
	
	foreach ($GET_ARRAY as $k => $v) {
		if($k !="url"){
			$urlString = $urlString.$k."=".$v."&";
		}
	}
};








$html = file_get_html($GET_url);//HTML Call 処理重い


 //Creates XML string and XML document using the DOM 
 $dom = new DomDocument('1.0'); 
 //generate xml 
 $dom->formatOutput = true; // set the formatOutput attribute of 
                            // domDocument to true




 //add root - <books> 
 $data = $dom->appendChild($dom->createElement('data'));

 


//=====著者データー
 $personal = $data->appendChild($dom->createElement('personal'));
 
 foreach($html->find('H1.author-class SPAN') as $pSpan){
		$pName = $personal->appendChild($dom->createElement('name'));
		$pName->appendChild($dom->createTextNode($pSpan->innertext));//name  二つ目はローマ字表記
 }
 
 //$aidStr = str_replace('ID:', '' , $html->find('div#idinheadeing')->innertext ); //ID:取る
foreach($html->find('P.idinheading') as $ppaid){
	$aidStr = str_replace('ID:', '' , $ppaid->innertext ); //ID:取る
 $personal->setAttribute('aid', $aidStr );
}



foreach($html->find('#affiliationinheading SPAN') as $pa){
	$paffi = $personal->appendChild($dom->createElement('affiliations'));
	$paffi->appendChild($dom->createTextNode($pa->innertext));//所属
}



foreach($html->find('.bblp-othertitle .seefm') as $other){// 別名
	$potherName = $personal->appendChild($dom->createElement('otherName'));
	$potherName->appendChild($dom->createTextNode($other->innertext));//
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

$itemsCount = 0;// 20個かそれ未満をチェック 表示している数　全体数とは限らない


$itemlist = $data->appendChild($dom->createElement('list'));//論文のリスト





foreach($html->find('#itemlistbox LI') as $element){//dt[class=itemlistbox]

			$item = $itemlist->appendChild($dom->createElement('item'));
			$item->setAttribute('showNum', $itemsCount);
	 		
	 			
	 		$htmldom = new DomDocument('1.0');
	 		$htmldom->loadHTML('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'.$element->innertext);
		$htmldom->formatOutput = true; // set the formatOutput attribute of 

		
		//$dtTitleNode = $htmldom->getElementsByTagName( "a" );
		
		
		$entry = $htmldom->getElementsByTagName("a")->item(0);

		//$dtTitle = $element->innertext;//find('a');//DT A
	

		
		//add <book> element to <books> 
		//
		
		$itemTitle = $item->appendChild($dom->createElement('title'));

		$itemTitle->appendChild($dom->createTextNode( $entry->nodeValue ));//href
		
		
		$naidString = str_replace('/ncid/', '', $entry->getAttribute('href'));// 論文は、naid 図書は、ncid
		//$naidString = str_replace('/ncid/', '', 'abcde');
		$item->setAttribute('id',   $naidString);



	





		foreach($htmldom->getElementsByTagName( "p" ) as $para){
		
			$chkClass = $para->getAttribute('class');

			switch ($chkClass){
			
			case 'item_authordata':
			  // 処理
			  $itemAuthor = $item->appendChild($dom->createElement('author'));
			  $itemAuthor->appendChild($dom->createTextNode($para->nodeValue));//str_replace(array("\r\n","\n","\r"), '', #str)
			  
			  break;

			case "item_authordata al":
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
			  
			  
			case 'bibliodata bbldata-line1':
			 
			 	foreach($htmldom->getElementsByTagName("span") as $spanlist){//#itemlistbox LI .bibliodata SPAN
			 	
			 		$chk2Class = $spanlist->getAttribute('class');
			 		switch ($chk2Class){
			 		
			 			case 'pblc"':// 図書の class=pblc に　ダブルコーテーション文字が入っている。
			 				$itempub = $item->appendChild($dom->createElement('publisher'));//パブリッシャー
			 				$itempub->appendChild($dom->createTextNode($spanlist->nodeValue));
			 			break;
			 			
			 			case 'pblc':
			 				$itempub = $item->appendChild($dom->createElement('publisher'));//パブリッシャー
			 				$itempub->appendChild($dom->createTextNode($spanlist->nodeValue));
			 			break;
			 			
			 			case "pblcdt":
			 				$itempubdate = $item->appendChild($dom->createElement('publishDate'));//パブリッシャー出版日
			 				$itempubdate->appendChild($dom->createTextNode($spanlist->nodeValue));
			 			break;
			 			
			 		default:

			 			break;
			 		}


			  }

			  
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
				break;
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