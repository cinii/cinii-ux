/**
 * Created with IntelliJ IDEA.
 * Date: 13/08/22
 * Time: 0:41
 */
(function () {//
	"use strict";
	var _rt = window;
	var ViewSettings = {

		normalListViewSetting: function () {

			var _str = "";




			_str += "<div id='list_target'>";

			_str += "</div>";

			_str += "<div id='left_bottom'>";//番号無し
			_str += "    <div class='addloadbox'><a href='javascript:void(0);' class='addLoadedBtn' >";
			_str += "       <figure class='CircleTarget addLoadingSymbol'></figure>";
			_str += "        <p class='addMessage'>+<span>20</span> 件</p>";
			_str += "    </a></div>";
			_str += "    <div class='bottom_contents'>";

			_str += "        <figure class='CircleTarget lodingCircleBig'></figure>";//全読み込み時はこの2タグを hide()
			_str += "        <p class='loadingMessage'><span>20</span> 件 追読み込み中...</p>";
			_str += "        <p class='completeMessage'>全 <span>0</span>件 ここまで</p>";
			_str += "        <p class='noResult'>0件 該当無し</p>";
			_str += "    </div>";
			_str += "</div>";
			return _str
		},








		hitoListViewSetting: function (aIdFlag) {//aIdFlag が trueだと特定著者のフラグ
			var _str = "";
			_str += "<div id='list_target_hito'>";//全体スクロール可　ここ以下から .selectedクラスを探す


			if (aIdFlag) {

				_str += "<div id='list_aid_header'>特定 著者（研究者)</div>";// AIDモード時のヘッダーラベル


				_str += "<div id='list_aid_area'>";// ここにAタグ　著者セレクタぶる研究者でもaidにする。
				_str += "   <a href='javascript:void(0);' data-ctg='-1' class='authorMain clickable'>";

				_str += "       <p class='name'></p>";
				_str += "       <p class='aff'></p>";//所属
				_str += "       <ul class=''>";//該当リスト
				_str += "           <li id='aid_r'><p><span>論文著者ID : </span><span class='aid'>該当無し</span>&emsp; : <span class='count'></span></p></li>";
				//論文著者idと数
				_str += "           <li id='aid_t'><p><span>図書著者ID : </span><span class='aid'>該当無し</span>&emsp; : <span class='count'></span></p></li>";
				//図書著者idと数
				_str += "           <li id='aid_k'><p><span>研究者ID : </span><span class='aid'>該当無し</span>&emsp; : <span class='count'></span></p></li>";
				//研究者idと数
				_str += "       </ul>";
				_str += "   </a>";
				_str += "</div>";

			}


			_str += "<div class='list_hito_all_header'>カテゴリー横断 (同姓同名)人物検索</div>";//同姓同名 aidの時だけのデバイダー

			_str += "<div id='list_hito-0'>";
			_str += "    <div class='hito_part_header'>";
			_str += "        <p class='ptitle'>論文：著者数 <span>0</span> 人</p>";
			_str += "        <div class='openCloseBtn'></div>";
			_str += "    </div>";//END
			_str += "    <section class='hito_areas'>";//ここが中スクロール
			_str += "        <div class='hito_targets'>";//ここにUL

			_str += "        </div>";//END DIV for UL


			_str += "           <div id='left_bottom0'>";

			_str += "           <div class='addloadbox'><a href='javascript:void(0);' class='addLoadedBtn' >";
			_str += "               <figure class='CircleTarget addLoadingSymbol'></figure>";
			_str += "               <p class='addMessage'>+<span>20</span> 件</p>";
			_str += "           </a></div>";

			_str += "            <div class='bottom_contents'>";

			_str += "               <figure class='CircleTarget lodingCircleBig'></figure>";///全読み込み時はこの2タグを hide()
			_str += "               <p class='loadingMessage'><span>20</span> 件 追読み込み中...</p>";
			_str += "               <p class='completeMessage'><span>XXX</span>件 ここまで</p>";
			_str += "                <p class='noResult'>0件 該当無し</p>";
			_str += "            </div>";
			_str += "        </div>";

			_str += "    </section>";//END SECTION
			_str += "</div>";//END 0


			_str += "<div id='devCtrl0'>";
			_str += "    <div class='ctrlArea'></div>";//デバイダー
			_str += "</div>";
				//--------------------------------

			_str += "<div id='list_hito-1'>";
			_str += "    <div class='hito_part_header'>";
			_str += "        <p class='ptitle'>図書：著者数 <span>0</span> 人</p>";
			_str += "        <div class='openCloseBtn'></div>";
			_str += "    </div>";//END
			_str += "    <section class='hito_areas'>";//ここが中スクロール
			_str += "        <div class='hito_targets'>";//ここにUL

			_str += "        </div>";//END DIV for UL


			_str += "        <div id='left_bottom1'>";// 01

			_str += "           <div class='addloadbox'><a href='javascript:void(0);' class='addLoadedBtn' >";
			_str += "               <figure class='CircleTarget addLoadingSymbol'></figure>";
			_str += "               <p class='addMessage'>+<span>20</span> 件</p>";
			_str += "           </a></div>";

			_str += "            <div class='bottom_contents'>";

			_str += "               <figure class='CircleTarget lodingCircleBig'></figure>";///全読み込み時はこの2タグを hide()
			_str += "               <p class='loadingMessage'><span>20</span> 件 追読み込み中...</p>";
			_str += "               <p class='completeMessage'><span>XXX</span>件 ここまで</p>";
			_str += "                <p class='noResult'>0件 該当無し</p>";
			_str += "            </div>";
			_str += "        </div>";

			_str += "    </section>";//END SECTION
			_str += "</div>";//END 0


			_str += "<div id='devCtrl1'>";
			_str += "    <div class='ctrlArea'></div>";//デバイダー
			_str += "</div>";
			//--------------------------------

			_str += "<div id='list_hito-2'>";
			_str += "    <div class='hito_part_header'>";
			_str += "        <p class='ptitle'>研究：研究者数 <span>0</span> 人</p>";
			_str += "        <div class='openCloseBtn'></div>";
			_str += "    </div>";//END
			_str += "    <section class='hito_areas'>";//ここが中スクロール
			_str += "        <div class='hito_targets'>";//ここにUL

			_str += "        </div>";//END DIV for UL


			_str += "        <div id='left_bottom2'>";// 02

			_str += "           <div class='addloadbox'><a href='javascript:void(0);' class='addLoadedBtn' >";
			_str += "               <figure class='CircleTarget addLoadingSymbol'></figure>";
			_str += "               <p class='addMessage'>+<span>20</span> 件</p>";
			_str += "           </a></div>";

			_str += "            <div class='bottom_contents'>";

			_str += "               <figure class='CircleTarget lodingCircleBig'></figure>";///全読み込み時はこの2タグを hide()
			_str += "               <p class='loadingMessage'>20件 追読み込み中...</p>";
			_str += "                <p class='noResult'>0件 該当無し</p>";
			_str += "            </div>";
			_str += "        </div>";

			_str += "    </section>";//END SECTION
			_str += "</div>";//END 0


			_str += "<div id='devCtrl1'>";
			_str += "    <div class='ctrlArea'></div>";//デバイダー
			_str += "</div>";


			_str += "</div>";//END list_target_hito

			return _str
		},



	};//END ViewSettings Class

	niiObserver.View = $.extend({}, niiObserver.View, ViewSettings);//追加

})();




