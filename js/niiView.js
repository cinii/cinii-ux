/**
 * Created with IntelliJ IDEA.
 * Date: 13/08/10
 * Time: 8:00
 */


(function () {//
	"use strict";
	var _rt = window;
	var ViewStatic = {
		$leftwrapper: undefined,
		formtarget: undefined,
		naviLIListArr: undefined,
		$searchResultListTarget: undefined,

		// right
		$detailTarget: undefined,


		hitoSearchMode: -1,
		aidSearchMode:-1,

		scrollFlag: false,
		screenSetting: {},
		//$fitHiadjust: undefined,
		changedFormFlag:false,


		init: function () {//コンストラクタ
			//
		},
		layoutInit: function () {
			var _w = $(window);
			var _$dd = $(document);

			var fit_heightObj = $('#container .js_fitHeight');//右左2
			var _$leftWrapper = $('#left_wrapper');
			this.$leftwrapper = _$leftWrapper;
			var $rightWrapper = $('#detail_area');
			var _$listArea = $('#list_area');
			var _$detailArea = $('#detailTarget');//inside
			this.$detailTarget = _$detailArea;


			var _currentScrollAreaHi = 0;
			//this.$fitHiadjust = fit_heightObj;
//			var fit_left_hi = $('#list_area');
			var headerHeight = 0;
			if (window.navigator.standalone) {//アプリモードの場合
				headerHeight = 20;
				$('body').css('padding-top', headerHeight + 'px');
			}
			headerHeight += $('#header').height();

			this.screenSetting.headerBottomPX = headerHeight;
			_$listArea.css('min-height', _w.height() - headerHeight + 0);
			_$detailArea.css('min-height', _w.height() - headerHeight -19);

			//body 要素 バウンズ回避
			_$dd.on('touchstart', '.bouceScrollLock', function () {// $(document)からliveで常に.bouceScrollLockを制御
				var _leftScrollTop = this.scrollTop;
				if (_leftScrollTop < 1) {
					this.scrollTop = 1;
				} else {
//					_currentScrollAreaHi = fit_heightObj.height();

					var _nowLeftAreaHi = this.childNodes[CONST_IS_NOT_IE].clientHeight - _currentScrollAreaHi - 1;
					//IEだとchildNodes[0]※IEはサポート外 WindowsTablet将来用
					if (_leftScrollTop > _nowLeftAreaHi) {
						this.scrollTop = _nowLeftAreaHi;
					}
				}
			});

			$('#syousai, .syousai-btn').on('touchmove', function(e){
				e.preventDefault();//STOP`
			});

			$('.syousai-box').on('touchmove', function(e){
					e.preventDefault();//STOP`
			});




			$rightWrapper.on('touchstart', function () {
				var _rightScrollTop = this.scrollTop;
				if (_leftScrollTop < 1) {
					this.scrollTop = 1;
				} else {
					var _nowRightAreaHi = _$detailArea.height() - _currentScrollAreaHi - 1;
					if (_rightScrollTop > _nowRightAreaHi) {
						this.scrollTop = _nowRightAreaHi;
					}
				}
			});
			$('#navi').on('touchMove', function (e) {
				e.preventDefault();//STOP`
			})




			$('#rootNavi>A.homeBtn').on('click', function(e){
				var _ctg = niiObserver.Model.currentTabModeNum;
				var _ctgArr = ["R", "T", "K", "H"];
				niiObserver.Controller.reset();
				location.assign("./#"+ _ctgArr[_ctg]);//ハッシュの変更なのでリロードしない。困った★
				location.reload();
			});



			function resizeFunc() {//private
				"use strict";
				_currentScrollAreaHi = _w.height() - headerHeight;
				fit_heightObj.height(_currentScrollAreaHi);
//				fit_left_hi.css("min-height", (_h + 34) + "px");
			};
			_w.resize(function () {
				resizeFunc();
			});
			resizeFunc();
		},
		layoutInitReset: function () {/// ＝＝＝＝＝＝
			var _$naviLIListArr = $('#navi LI');
			_$naviLIListArr.find('.naviselected').removeClass('naviselected');
			_$naviLIListArr.eq(niiObserver.Model.currentTabModeNum).find('a').addClass('naviselected');
		},
		domReady: function () {// Jquery Read First

			var _tt = this;
			var cs = 'selected';
			var formtarget = $('#kani-search-form');
			var naviLIListArr = $('#navi LI');


			//console.log("tabSelect " , niiObserver.Model.currentTabModeNum);

			naviLIListArr.eq(niiObserver.Model.currentTabModeNum).find('a').addClass('naviselected');


			_tt.formtarget = $('#kani-search-form');
			_tt.naviLIListArr = $('#navi LI');
			//_tt.$searchResultListTarget = $('#list_target');


			naviLIListArr.on('click',function (e) {
				var cnum = naviLIListArr.index($(e.target).closest('LI'));
				var current = niiObserver.Model.currentTabModeNum;// 外から持ってくる

				if (current != cnum || _tt.changedFormFlag) {
					naviLIListArr.eq(current).removeClass(cs);
					var _cObj = naviLIListArr.eq(cnum).addClass(cs);

					_rt.niiObserver.Model.currnetTabModeNum = cnum;
					niiObserver.Model.searchObj.detail = 0;
					$('.totalResults').fadeOut(10);//消去


					if(_rt.niiObserver.Model.searchObj.aidtype > -1){
						_rt.niiObserver.Model.searchObj.aidtype = -1;
						_rt.niiObserver.Model.searchObj.param.aid = "";
						_rt.niiObserver.Controller.reset();
					}
					//
					if(current !== 3){
						var _$target = $('#syousai-id-' + current);//前の詳細検索を閉じる
						_$target.removeClass('opened');
						_$target.find('.tenkai').removeClass('tenkaiOpen');
						_tt.$detailTarget.removeClass('maginTopShort').removeClass('maginTopFull');
					}

					naviLIListArr.find('.naviselected').removeClass('naviselected');
					naviLIListArr.eq(cnum).find('a').addClass('naviselected');


					_rt.niiObserver.Controller.makeUrl(cnum, true);
				};//END if
			}).on('touchstart mouseover', function (e) {

					var _inputStr = formtarget.val();
					if (_inputStr == "" || _inputStr == " " || _inputStr == "　") {
						_rt.niiObserver.Model.searchObj.keywords = "";
					} else {
//						if (_inputStr.indexOf("特定") < 0) {
//							_rt.niiObserver.Model.searchObj.keywords = _inputStr;
//						}
						if(_rt.niiObserver.Model.searchObj.aidtype > -1){
							//_rt.niiObserver.Model.searchObj.keywords = ;//そのまま
						}else{
							_rt.niiObserver.Model.searchObj.keywords = _inputStr;
						}
					}
				});//End on

			$("#form-body").submit(function () {//エンターキー押された場合
				if (_tt.formtarget.val() != "") {
					_tt.formtarget.blur();

					if(_rt.niiObserver.Model.searchObj.aidtype > -1){
						//niiObserver.Model.searchObj.keywords = ;
						_rt.niiObserver.Model.searchObj.aidtype = -1;
						_rt.niiObserver.Model.searchObj.param.aid = "";
						_rt.niiObserver.Controller.reset();
						niiObserver.Controller.makeUrl(niiObserver.Model.searchObj.currnetTabModeNum, false);// 履歴で追加しない？
					}else{
						niiObserver.Model.searchObj.keywords = _tt.formtarget.val();
						niiObserver.Controller.makeUrl(niiObserver.Model.searchObj.currnetTabModeNum, true);// 履歴で追加
						//niiObserver.Controller.searchStart(0);
						//$('#header-search-btn').trigger('click');
					}

				}
				return false
			}).on('change', function(){
					_tt.changedFormFlag = true;
					_rt.niiObserver.Model.searchObj.keywords = formtarget.val();
			});

//詳細検索用イベント
			$('.syousai-btn', '#syousai').on('click',function(e){//後で　親クラスに状態統合して整理　＞高速化

				var _nowCtgNum = _rt.niiObserver.Model.currentTabModeNum;

				var _$target = $('#syousai-id-' + _nowCtgNum);
				var _$rightTarget = _tt.$detailTarget;
				if(_$target.hasClass('opened')){
					if(_$target.hasClass('modefull')){
						_$target.removeClass('modefull');
						_$rightTarget.removeClass('maginTopFull');
						_$rightTarget.addClass('maginTopShort');
						$('.tenkai', _$target).addClass('tenkaiOpen');
					}else{
						_$target.addClass('modefull');
						_$rightTarget.removeClass('maginTopShort');
						_$rightTarget.addClass('maginTopFull');
						$('.tenkai', _$target).removeClass('tenkaiOpen');//full open
					}
				}else{
					_$target.addClass('modefull');
					_$target.addClass('opened');
					_$rightTarget.removeClass('maginTopShort');
					_$rightTarget.addClass('maginTopFull');
					$('.tenkai', _$target).removeClass('tenkaiOpen');
					_rt.niiObserver.Model.searchObj.param.dtl = 1;
				}
			});


			$('.tenkai').on('click', function(e){

				var _$now =$(this).parent();
//				var _selfNum = +(_$now.attr('data-ctg'));

				if(_$now.hasClass('modefull')){
					_$now.removeClass('modefull');
					$(this).addClass('tenkaiOpen');
					_tt.$detailTarget.removeClass('maginTopFull').addClass('maginTopShort');
				}else{
					_$now.addClass('modefull');
					$(this).removeClass('tenkaiOpen');
					_tt.$detailTarget.removeClass('maginTopShort').addClass('maginTopFull');
				}
			});
			$('.clearAndClose').on('click', function(e){

				var _$now =$(this).parent();
				_$now.removeClass('opened');
				_$now.find('.tenkai').removeClass('tenkaiOpen');
				_$now.find('.orderTarget').hide();
//				var _selfNum = +(_$now.attr('data-ctg'));
				_tt.$detailTarget.removeClass('maginTopShort').removeClass('maginTopFull');
				_rt.niiObserver.Model.searchObj.param.dtl = 0;
				_tt.clearSyousaiQuery();//clear
			});




//			$('.syousai-sortorder').on('click', function(e){
//				$(this).next().show();
//			});

//			$('.sortorderlistaction').on('click', function(e){
//				var _tar = $(e.target);
//				$(this).find('.selected').removeClass('selected');
//				_tar.addClass('selected');
//				$(this).parent().hide();
//			});


//			$('.syousai-sabmit').on('click', function(e){
//				var _tar = $(e.target);
//				_rt.niiObserver.Model.searchObj.param.dtl = 1;
//				_rt.niiObserver.Controller.makeUrl(_rt.niiObserver.Model.currentTabModeNum, true);
//			});




$(document).on('blur', '#s-r-01, #s-t-01', function(e){
	_rt.niiObserver.Model.searchObj.param.title = $(this).val();

	_tt.callQeurysyousaiForm(0,1);
});
$(document).on('blur', '#s-r-02, #s-t-02', function(e){
		_rt.niiObserver.Model.searchObj.param.author = $(this).val();
		_tt.callQeurysyousaiForm(0,1);
});
$(document).on('change', '#sortorder-r, #sortorder-t', function(e){
		_rt.niiObserver.Model.searchObj.param.sortorder = $(this).val();
		_tt.callQeurysyousaiForm(0,0);
});
			$(document).on('change', '#syousai-yy_start, #syousai-t-yy_start', function(e){
				_rt.niiObserver.Model.searchObj.param.year_from = $(this).val().slice(0, 4);
				_tt.callQeurysyousaiForm(0,1);
			});
			$(document).on('change', '#syousai-yy_end, #syousai-t-yy_end', function(e){
				_rt.niiObserver.Model.searchObj.param.year_to = $(this).val().slice(0, 4);
				_tt.callQeurysyousaiForm(0,1);
			})




			$(document).on('blur', '#s-k-01', function(e){
				_rt.niiObserver.Model.searchObj.param.q1 = $(this).val();//分野
				_tt.callQeurysyousaiForm(2,1);
			});
			$(document).on('blur', '#s-k-02', function(e){

				_rt.niiObserver.Model.searchObj.param.qe = $(this).val();//研究者情報
				//_rt.niiObserver.Model.searchObj.param.qh = $(this).val();//研究者所属名検索　２つ同時
				_tt.callQeurysyousaiForm(2,1);
			});

			$(document).on('change', '#sortorder-k', function(e){
				_rt.niiObserver.Model.searchObj.param.o = $(this).val();
				_tt.callQeurysyousaiForm(2,0);
			});
			$(document).on('change', '#syousai-k-yy_start', function(e){
				_rt.niiObserver.Model.searchObj.param.q6 = $(this).val().slice(0, 4);
				_tt.callQeurysyousaiForm(2,1);
			});
			$(document).on('change', '#syousai-k-yy_end', function(e){
				_rt.niiObserver.Model.searchObj.param.q7 = $(this).val().slice(0, 4);
				_tt.callQeurysyousaiForm(2,1);
			})






			/*
			 _tt.$searchResultListTarget.parent().on('scroll', function () {
			 var _t = $(this);
			 if (_t.children('#list_area').height() - _t.scrollTop() - _t.height() - 12 < 0) {
			 var _count = _t.find('LI').size();

			 niiObserver.Controller.currentSearch.normalLoadRDFList(niiObserver.Model.searchObj.currnetTabModeNum, false, _count);
			 }
			 });*/

		},
		callQeurysyousaiForm:function(ctgNum, isDetailMode){



			if(isDetailMode){
				niiObserver.Model.searchObj.detail = 1;
				niiObserver.Model.searchObj.param.dtl = 1;
			}
			_rt.niiObserver.Controller.makeUrl(niiObserver.Model.currentTabModeNum, true);
		},

		clearSyousaiQuery:function(ctgNum){//RESET
			_rt.niiObserver.Model.searchObj.param = {};
			niiObserver.Model.searchObj.detail = 0;

			$('#s-r-01, #s-t-01, #s-k-01').val("");
			$('#s-r-02, #s-t-02, #s-k-02').val("");

			$('#syousai-yy_start, #syousai-t-yy_start, #syousai-k-yy_start').val("1977-01");
			$('#syousai-yy_end, #syousai-t-yy_end, #syousai-k-yy_end').val("2013-08");



			_rt.niiObserver.Controller.makeUrl(niiObserver.Model.currentTabModeNum, false);
		},

		setSearchFormValue: function (setString) {
			var _that = this;
			$(function () {//
				_that.formtarget.val(setString);
			});
		},


		//LeftLis　 Draw

		normalListClear: function () {
			var _$target = this.$searchResultListTarget;
			_$target.parent().scrollTop(0).find('UL').remove();
			_$target.find('#addLoadArea').remove();

			//人モードの時は
			$('.totalResults', _$target).text("");//全体数を空欄に　別の場所へ移す
		},
		allCloseSyousaiWindow:function(){
			var _$now = $('.syousai-box:visible');
			_$now.removeClass('opened');
			_$now.find('.tenkai').removeClass('tenkaiOpen');
			_$now.find('.orderTarget').hide();
//				var _selfNum = +(_$now.attr('data-ctg'));
			$('#detailTarget').removeClass('maginTopShort').removeClass('maginTopFull');//無ければスキップ
		},

		leftListViewEventSetting:function(){
			var _that = this;
			$(document).off('click', '.clickable');
			$(document).on('click', '.clickable', function(e){
				var _tt = $(e.target).closest("a");
				if(_tt.hasClass('selected')){

				}else{
					$('#list_area .selected').removeClass("selected");
					_tt.addClass('selected');
					var _ctgNum = +( _tt.attr('data-ctg') );
					if(_ctgNum > -1){
						var indexNum = _tt.closest('LI').index();
						if(_ctgNum < 10){
							_that.rightViewReflesh(_ctgNum , indexNum);
						}else{
							_that.rightViewReflesh3(_ctgNum - 10 , indexNum);//人用
						}
					}else{
						_that.rightAidViewReflesh(_ctgNum + 3);//aid用
					}
				}

			});
			//初回だけ
			$(document).off('click', '.addLoadedBtn');
			$(document).on('click', '.addLoadedBtn', function(e){
				var _tt = $(this);

				niiObserver.Controller.currentSearchArr[_tt.attr('data-ctg')].loadFirstListXML();
				e.preventDefault();//STOP`
			});


		},
		rightViewReflesh:function(ctg, indexNum){

			this.$detailTarget.find('article').remove();//Clear

			var _$target = this.$detailTarget.append('<article></article>').parent().animate({scrollTop: "0px"}, 300);
			var _$ss = $('article', _$target);

			var _tb= niiObserver.Model.allResultList[ctg].items[indexNum];
			var _str = "";

			//

			if(ctg !== 2){

				_str +="<div class='title-box'>";

				_str +="<p class='title'>" + _tb.rdf.find('Description').eq(0).find('title').eq(0).text();//title;

				if(ctg === 1){
					var _kanaObj = _tb.rdf.find('Description').eq(0).find('title').eq(1);
					if(_kanaObj){
						_str +="<br /><span class='kana'>" + _kanaObj.text() + "</span>";//title 仮名;
					}
				}
				_str +="</p>";

				_str +="</div>";


				// 論文・図書では、著者は並列で扱われている
				var _fromRdfPersonArr = _tb.rdf.find('Person');
				var _creatorArr = _tb.rdf.find('creator');

				if(ctg === 1){
					_creatorArr = _tb.rdf.find('Person');
				}

				_str +="<div class='authorlist'>";

				for(var i= 0; i<_creatorArr.length; i++){
					var _cNameStr;
					if(ctg !==1){
						_cNameStr = _creatorArr.eq(i).text();
					}else{
						_cNameStr = _creatorArr.eq(i).find('name').eq(0).text();
					}


					var aid = _tb.rdf.find('Description').eq(0).find('title');

					if(aid){
						aid = _fromRdfPersonArr.eq(i).attr('rdf:about');//rdf データーからauthorIDを取り出す。
						if(aid != "" && aid != undefined){

							var _specialStringsPos = aid.indexOf('nrid/');
							if(_specialStringsPos > -1){
								aid = aid.slice(_specialStringsPos + 5 );//　'naid'　じゃない場合どうするか？
							}else{
								_specialStringsPos = aid.indexOf('naid/');
								if(_specialStringsPos > -1){
									aid = aid.slice(_specialStringsPos + 5 );//
								}else{
									_specialStringsPos = aid.indexOf('author/');
									if(_specialStringsPos > -1){
										aid = aid.slice(_specialStringsPos + 7 );//あとで整理
									}
								}
							}
						}else{
							aid = "";
						}
					}
					var _ronToshoStrArr = ["論文","図書"];
					var _urlstr = "#H?xa=" + ctg + "&q=" + encodeURI(_cNameStr)+ "&aid=" + aid;

					if(_cNameStr !=""){
						if(aid ===""){// 図書で著者IDが無い場合→特定著者検索が出来ない＝通常の人モードへ
							_cNameStr +="<span>（"+_ronToshoStrArr[ctg]+"著者IDが無いため同名著者の横断検索へ）</span>";
						}
						_str +="<span><a href='" + _urlstr + "' class='key-box_non' >" + _cNameStr + "</a></span>";//creator
					}

				};//END _creatorArr for


			}else{//研究の場合

				_str +="<div class='title-box'>";
				_str +="<p class='title'>" + _tb.rdf.find('title').text() + "</p>";//title;

				_str +="</div>";


				_str +="<p class=''>" + _tb.rdf.find('idStr').text() + "</p>";//研究番号


				_str +="<p class='sub'>代表者</p>  <div class='kenkyu-daihyo'>";

				var _daihyouName = _tb.rdf.find('investigator > name').text();

				var aid2 = _tb.rdf.find('investigator > name').attr('id');

				if(typeof aid2 === "undefined"){
					aid2 = "";
				}

				var _urlstr2 = "#H?xa=" + ctg + "&q=" + encodeURI(_daihyouName)+ "&aid=" + aid2;

				_str +="<span><a href='" + _urlstr2 + "' class='key-box' ><p class='name'>" + _daihyouName + "</p>";
				if(aid2 !==""){
					_str +="<p>研究者番号："+ aid2 +"</p>";
				}else{
					_str +="<p>研究者番号：なし</p>";
				}
				_str +="<p>"+ _tb.rdf.find('investigator > affiliation').text()+"</p>";
				_str +="</a></span>";
				_str +="</div>";






				var _daihyouDistArr = _tb.rdf.find('subinvestigators');//命名規則で修正

				if(_daihyouDistArr.length > 0){
					_str +="<p class='sub'>研究分担者</p>    <div class='kenkyu-buntan'>";

					for(var i= 0; i<_daihyouDistArr.length; i++){

						var _daihyouName22 = _daihyouDistArr.eq(i).text();

						var aid22 = _daihyouDistArr.eq(i).attr('sid');

						if(typeof aid22 === "undefined"){
							aid22 = "";
						}

						var _urlstr22 = "#H?xa=" + ctg + "&q=" + encodeURI(_daihyouName22)+ "&aid=" + aid22;

						_str +="<span><a href='" + _urlstr22 + "' class='key-box' ><p class='name'>" + _daihyouName22 + "</p>";
						if(aid22 ===""){
							aid22 = "なし";
						}
						_str +="<p>研究者番号："+ aid22 +"</p>";
						_str +="<p>"+ _daihyouDistArr.eq(i).attr('aff')+"</p>";
						_str +="</a></span>";
					}//END for
					_str +="</div>";
				}

			}



			_str +="</div>";//END Creator


			if(ctg ===0){
				_str +="<p class='label'>抄録</p>";

				var _desJPNObj = _tb.rdf.find('Description').eq(0).find('description');


				if(_desJPNObj.length > 0){
					_str +="<p class='description'>"+ _desJPNObj.text() + "</p>";
				}else{
					_str +="<p class='description'>(収録なし)</p>";
				}

				var _desENGObj = _tb.rdf.find('Description');

				for(var i = 0; i<_desENGObj.length; i++){
					if(_desENGObj.eq(i).attr("xml:lang")==="en"){
						_str +="<p class='description-en'>"+ _desENGObj.eq(i).find('description').text() + "</p>";
					}
				};//ENd for

			}



			//=============================
//			var _detailReadStr = "";
//			switch (ctg){// コードの視認性アップの為
//				case 0:
//					_detailReadStr = " この論文を読む／探す ";
//					break;
//				case 1:
//					_detailReadStr = "";
//					//_detailReadStr = " この図書を読む／探す ";
//					break;
//				case 2:
//					_detailReadStr = " この研究内容を読む ";
//					break;
//			}
//			_str +="<div class='wide'></div><p class='note'>"+_detailReadStr+"</p>";

			//=============================

			if(ctg ===2){

				var _tg = _tb.rdf.find('Description').eq(0).find('isPartOf');
				if(_tg.length > 0){
					_str +="<p><a href='"+_tg.attr('rdf:resource')+"' class='newlink' target='_blank'>"+ _tg.attr('dc:title') + "</a></p>";
				}

				var _seeAlsoArr = _tb.rdf.find('Description').eq(0).find('seeAlso');

				_str +="<div>";

				for(var i = 0; i<_seeAlsoArr.length; i++){
					_str +="<a href='"+_seeAlsoArr.eq(i).attr('rdf:resource')+"' class='newlink' target='_blank'>"+ _seeAlsoArr.eq(i).attr('dc:title') + "</a>";
				};
				_str +="</div>";
			}








			//=============================

			var _t_alterArr = _tb.rdf.find('Description').eq(0).find('alternative');
			for(var i = 0; i<_t_alterArr.length; i++){
				_str +="<p> "+ _t_alterArr.eq(i).text()  +"</p>";
			}





			if(ctg === 0){
				_str +="<p class='label'>論文出版元</p> <p> "+ _tb.rdf.find('Description').eq(0).find('publisher').text()  +"</p>";

				_str +="<p class='label'>NII論文ID(NAID) :</p> <p> "+ _tb.rdf.find('Description').eq(0).find('naid').text() + "</p>";
			}else if(ctg === 1){

				_str +="<p class='label'>出版社</p> <p> "+ _tb.rdf.find('Description').eq(0).find('publisher').text()  +"</p>";

				_str +="<p class='label'>出版部署</p> <p> "+ _tb.rdf.find('Description').eq(0).find('publicationName').text() + "</p>";

				_str +="<p class='label'>出版年</p> <p> "+ _tb.rdf.find('Description').eq(0).find('date').text() + "</p>";//なぜか、date()で年だけ

				_str +="<p class='label'>出版日</p> <p> "+ _tb.rdf.find('Description').eq(0).find('publicationDate').text() + "</p>";

				_str +="<p class='label'>NII書誌ID(NCID) :</p> <p> "+ _tb.rdf.find('Description').eq(0).find('ncid').text() + "</p>";
			}




			if(ctg !== 2){

				_str +="<p class='label'>本文言語コード :</p> <p> "+ _tb.rdf.find('Description').eq(0).find('language').text() + "</p>";

				_str +="<p class='label'>NDL 記事登録ID :</p> <p> "+ _tb.rdf.find('Description').eq(0).find('ndljpi').text() + "</p>";


				_str +="<p class='label'>NDL 雑誌分類 :</p> <p> "+ _tb.rdf.find('Description').eq(0).find('issn').text() + "</p>";

//			_str +="<p>NDL 請求記号 :</p> <p> "+ _tb.rdf.find('Description').eq(0).find('issn').text() + "</p>";

				_str +="<p class='label'>収録DB :</p> <p> "+ _tb.rdf.find('Description').eq(0).find('source').text() + "</p>";
			}



			if(ctg <2){

				_str +="<p class='label'>トピック :</p>";

				var _topicArr = _tb.rdf.find('Description').eq(0).find('topic');




				_str +="<div class='t-topic-area'>";
				var _hashArr = ["R", "T", "K"];

				for(var i = 0; i<_topicArr.length; i++){

					var _url = "#"+_hashArr[ctg]+"?q="+ encodeURI(_topicArr.eq(i).attr('dc:title'));
					_str +="<a href='"+_url+"' class='t-topic'>"+_topicArr.eq(i).attr('dc:title')+"</a>";
					//_str +="<a href='"+_topicArr.eq(i).attr('rdf:resource')+"' class='t-topic' target='_blank'>"+_topicArr.eq(i).attr('dc:title')+"</a>";
				};
				_str +="</div>";



			}



			if(ctg ===0){

				_str +="<p class='label'>収録刊行物 :</p>";

				var _tg = _tb.rdf.find('Description').eq(0).find('isPartOf');
				if(_tg.length > 0){
					_str +="<p><a href='"+_tg.attr('rdf:resource')+"' class='newlink' target='_blank'>"+ _tg.attr('dc:title') + "</a></p>";
				}

				var _seeAlsoArr = _tb.rdf.find('Description').eq(0).find('seeAlso');

				_str +="<div>";

				for(var i = 0; i<_seeAlsoArr.length; i++){
					_str +="<a href='"+_seeAlsoArr.eq(i).attr('rdf:resource')+"' class='newlink' target='_blank'>"+ _seeAlsoArr.eq(i).attr('dc:title') + "</a>";
				};
				_str +="</div>";
			}



			if(ctg ===1){// 図書　関連図書

				_str +="<p class='label'>関連図書</p> <div> ";

				var _isPartOfArr = _tb.rdf.find('isPartOf');


				for(var i = 0; i<_isPartOfArr.length; i++){
					_str +="<a href='"+_isPartOfArr.eq(i).attr('rdf:resource')+"' class='t-topic' target='_blank'>"+_isPartOfArr.eq(i).attr('dc:title')+"</a>";
				};


				_str +="</div><hr />";
			}


			if(ctg === 2){

				_str +="<p class='label'>この研究課題のドキュメント :</p>";
				var _docyearArr = _tb.rdf.find('docyear');

				for(var dy = 0; dy < _docyearArr.length; dy++){

					var _yearStr = _docyearArr.eq(dy).attr('year');

					_str +="<div class='k-docyear-group'><p class=''>"+_yearStr+"</p>";

					var _docArr = _docyearArr.eq(dy).find('doclink');

					for(var dl = 0; dl < _docArr.length; dl++){

						_str +="<a href='"+ _docArr.eq(dl).attr('href')+"' class='newlink' target='_blank' >"+_docArr.eq(dl).text()+"</a>";
					}
					_str +="</div>";

				}

				_str +="<hr />";




				var _tempObj = _tb.rdf.find('basic').eq(0);

				_str +="<p class='label'>期間 :</p> <p> "+ _tempObj.find('term').text() +"</p>";


				_str +="<p class='label'>研究分野 :</p> <p> ";

				var _subArr = _tempObj.find('subject');

				for(var i = 0; i< _subArr.length ; i++){
					var _subjectLink = "#K?q="+ encodeURI(_subArr.eq(i).text());

					_str +="<a href='" + _subjectLink + "' class='k-bunya'>"+ _subArr.eq(i).text() +"</a>";
				}



				_str +="</p>";

				_str +="<p class='label'>審査区分 :</p> <p> "+ _tempObj.find('review').eq(0).text() +"</p>";

				_str +="<p class='label'>研究種目 :</p> <p> "+ _tempObj.find('category').eq(0).text() +"</p>";
				_str +="<p class='label'>研究機関 :</p> <p> "+ _tempObj.find('institution').eq(0).text() +"</p>";

				_str +="<p class='label'>配分額 :</p>";

				var _haibunArr = _tempObj.find('grantlist');
				for(var gg = 0; gg < _haibunArr.length ; gg++){
					_str +="<p>"+_haibunArr.eq(gg).text()+"</p>";
				}

				_str +="<hr /><p class='label'>研究概要(最新報告) :</p>";
				var _summaryArr = _tempObj.find('summary');
				for(var sa = 0; sa < _summaryArr.length ; sa++){
					_str +="<p class='summary'>"+_summaryArr.eq(sa).text()+"</p>";
				}


				if(_tempObj.find('progressstatus').size > 0 ){
					_str +="<hr /><p class='label'>現在までの達成度(最新報告) :</p>";
					_str +="<p>"+_tempObj.find('progressstatus').eq(0).attr('subtitle') +" : " +_tempObj.find('progressstatus').eq(0).text()+"</p>";
					_str +="<p>"+_tempObj.find('progressstatus').eq(1).attr('subtitle') +" : " +_tempObj.find('progressstatus').eq(1).text()+"</p>";

				}



				if(_tempObj.find('future').size > 0 ){
					_str +="<hr /><p class='label'>今後の研究の推進方策(最新報告) :</p>";
					_str +="<p>"+_tempObj.find('futuredata').eq(0).text() + "</p>";

				}

				_str +="<hr />";


			}



			//common

			var _ctgNameArr = ["論文","図書","研究"];
			var _refPageURL = _tb.rdf.find('Description').eq(0).attr('rdf:about');
			if(ctg === 2){
				_refPageURL = _tb.link;
			}

			_str +="<p><a href='" + _refPageURL +"' class='refpage' target='_blank'>この" + _ctgNameArr[ctg] + "のPC版ページを新規に開く</a></p></div>";



			if(ctg === 1){

				_str +="<p class='label'>収録図書館数 :</p>";//収録図書館

				var _ownerArr = _tb.rdf.find('owner');

				var _ownerCount = _ownerArr.size();

				if(_ownerCount < 1){
					_str +="<p >0 件</p>";
				}else{
					_str +="<p >"+_ownerCount+" 件</p>";//これだけでいいのでは

					_str +="<ul class='ownerlist'>";
					for(var i = 0; i <_ownerCount ; i++){
						_str +="<li>";
						var _linkTag = _ownerArr.eq(i).find('seeAlso');
						if(_linkTag.size() > 0){
							_str +="<a href='"+_linkTag.attr('rdf:resource')+"' class='owner' target='_blank'>"+_ownerArr.eq(i).find('name').text()+"</a>";
						}else{
							_str +="<span class='owner-nolink'>"+_ownerArr.eq(i).find('name').text()+"</span>";
						}

						_str +="</li>";
					}
					_str +="</ul>";


				}



			}



			_$ss.append(_str);





		},

		rightViewReflesh3:function(_ctgNum , indexNum){// 人モード時の右側パース
			this.$detailTarget.find('article').remove();//Clear



			var _$target = this.$detailTarget.append('<article></article>').parent().animate({scrollTop: "0px"}, 300);
			var _$ss = $('article', _$target);
			var _str = '';

			var _aid = 0;
			var _url;
			var _totalCount = 0;
			var _firstName = "";

			if(_ctgNum !== 2){//論文と図書

				var _tb= niiObserver.Model.allResultList[_ctgNum].items[indexNum];

				var _hitoStrArr = ["論文著者ID","図書著者ID","研究者ID"];


				_str +="<div class='name-box'>";

				var _nameArr = _tb.rdf.find('personal').find('name');

				for(var i = 0; i< _nameArr.length; i++){
					if(i <1 ){
						_firstName = _nameArr.eq(i).text();//最初がメイン
					}
					var _namekanjiClassName = "title";

					if(i > 0){
						_namekanjiClassName = "title-roma";
					}
					_str +="<p class='"+_namekanjiClassName+"'>"+_nameArr.eq(i).text()+"</p>";
				}

				_str +="</div>";




				_aid = _tb.rdf.find('personal').attr('aid');

				_str +="<p class=''>" + _hitoStrArr[_ctgNum] +" : "+ _aid + "</p>";

				var _affArr = _tb.rdf.find('personal').find('affiliations');
				for(var i = 0; i< _affArr.length; i++){
					_str +="<p class=''>"+_affArr.eq(i).text()+"</p>";//name;
				}

				_totalCount = _tb.rdf.find('personal').find('totalResults').text();


			}else{//研究API

				_str +="<div class='name-box'>";

				var _con = $(niiObserver.Model.allResultList[2].items[indexNum].rdf.find('encoded').text() );
				_str +="<p class='title'>"+_con.find('a').text()+"</p>";
				_firstName = _con.find('a').text();

				_str +="<p class='title-roma'>"+_con.children('dt').eq(0).text()+"</p>";//名前？ローマ字


				_str +="</div>";

				var _dtArr = _con.children('dt');
				_str +="<p class='note'>"+_dtArr.eq(1).text()+"</p>";//所属
				_str +="<p >"+_dtArr.eq(1).next().text()+"</p>";



				_aid = niiObserver.Model.allResultList[2].items[indexNum].rdf.find('link').eq(0).text();

				_aid = _aid.slice(_aid.indexOf("r?qg=") + 5);

				_totalCount = niiObserver.Model.allResultList[2].items[indexNum].rdf.find('totalResults').text();
			}





			//box
			_str +="<div class='selectBox'>";


			var _myselfNameArr = ["論文著者", "図書著者","研究者"];
			if(_ctgNum === 2){
				_url = "#R?xa=" + 0 + "&q=" + encodeURI(_firstName) + "&aid=10000" + _aid;// 論文から
			}else{
				_url = "#R?xa=" + 0 + "&q=" + encodeURI(_firstName) + "&aid=" + _aid;
			}


			var _mySelfName = _myselfNameArr[_ctgNum];



			_str +="<a href='"+_url+"' class='"+((_ctgNum!==1)? "":"notActive")+"'>";
			_str +="<p>この"+_mySelfName+"の論文</p>";
			if(_ctgNum !== 1){
				if(_ctgNum === 2){
					_str +="<span>ID: 10000"+_aid +"</span>";
				}else{
					_str +="<span>ID: "+_aid +"</span>";
				}

				//_str +="<span>"+_totalCount +"　件</span>";
			}else{
				_str +="<span> (登録無し)</span>";
			}

			_str +="</a>";


			_url = "#T?xa=" + 1 + "&q=" + encodeURI(_firstName) + "&aid=" + _aid;

			_str +="<a href='"+_url+"' class='"+((_ctgNum===1)? "":"notActive")+"'>";
			_str +="<p>この"+_mySelfName+"の図書</p>";
			if(_ctgNum === 1){

				_str +="<span>ID: "+_aid +"</span>";
				//_str +="<span>"+_totalCount +"　件</span>";
			}else{
				_str +="<span> (登録無し)</span>";
			}
			_str +="</a>";




			if(_aid.indexOf("1000") > -1){



				_aid = _aid.slice(5);
				_url = "#K?xa=" + 2 + "&q=" + encodeURI(_firstName) + "&aid=" + _aid;

//				var _currentXHR = $.ajax({
//					url: "./php/K_hito_result.php?qg=" + _aid,
//					type: "GET", //デフォルトがGET
//					dataType: "xml",
//					cache: true,// キャッシュする
//					crossDomain: true,
//				}).done(function (xmldata, status, xhr) {// rdf detailXML DONE success
//						var _$aidXML = $( xhr.responseXML);
//						if(_currentXHR.aid === xhr.aid){
//							$('#detailTarget .k-total-target').text(_$aidXML.find('totalResults').text() + "　件");
//						}
//					});
//				_currentXHR.aid = _aid;

				_str +="<a href='"+_url+"' class=''>";
				_str +="<p>この"+_mySelfName+"の研究</p>";
				_str +="<span >番号: " + _aid + "</span>";
				//_str +="<span class='k-total-target'>" + "-" + "　件</span>";

			}else if(_ctgNum === 2){

				_url = "#K?xa=" + 2 + "&q=" + encodeURI(_firstName) + "&aid=" + _aid;
				_str +="<a href='"+_url+"' class=''>";
				_str +="<p>この"+_mySelfName+"の研究</p>";
				_str +="<span >番号: " + _aid + "</span>";

			}else{
				_url = "";
				_str +="<a href='"+_url+"' class='"+((_ctgNum===2)? "":"notActive")+"'>";
				_str +="<p>この"+_mySelfName+"の研究</p>";
				_str +="<span> (登録無し)</span>";
			}

			_str +="</a>";

			_str +="</div>";



			var _ctgNameArr = ["論文著者","図書著者","研究者"];
			var _ctgUrlArr = ["http://ci.nii.ac.jp/nrid/","http://ci.nii.ac.jp/author/","https://kaken.nii.ac.jp/d/r/"];
			var _refPageURL = _ctgUrlArr[_ctgNum] + _aid;

			_str +="<p><a href='" + _refPageURL +"' class='refpage' target='_blank'>この" + _ctgNameArr[_ctgNum] + "のPC版ページを新規に開く</a></p></div>";






			_$ss.append(_str);


		},//人用

		rightAidViewReflesh:function(ctgNum){// AIDモード用 aidRdfロード待ち
			var _that = this;
			var _timer;
			ctgNum = niiObserver.Model.searchObj.aidtype;
			this.$detailTarget.find('article').remove();//Clear



			(function(){
				var _counterLimit = 300;//　ここは、　Derfredオブジェクトのコールバック式に書き換え中
				clearInterval(_timer);

				_timer = setInterval(function(){

					var _tloaded = niiObserver.Model.allResultList[ctgNum + 3];


					if(_tloaded){
						if(_tloaded.loaded > 0 || _counterLimit < 0){//読み込まれるまでループ
							clearInterval(_timer);
							_that.rightAidViewDraw(ctgNum, ctgNum + 3);
						}
					}else{
						//clearInterval(_timer);
					}

					_counterLimit--;
				}, 66);
			}());

		},

		rightAidViewDraw:function(ctgNum, dataTargetNum){
			var _$target = this.$detailTarget.append('<article></article>').parent().animate({scrollTop: "0px"}, 300);
			var _$ss = $('article', _$target);
			var _str = "";
			var _temp = $(niiObserver.Model.allResultList[dataTargetNum].aidrdf);
			var _url = "";
			var _aid = "";

			switch (ctgNum){
				case 0:// 論文特定著者用


					//  リンクベルトあとでリファクタリング★

					_str +="<div class='name-box'>";

					var _nameArr = _temp.find('name');
					var _firstName = "";
					for(var i = 0; i< _nameArr.length; i++){
						if(i <1 ){
							_firstName = _nameArr.eq(i).text();
						}
						var _namekanjiClassName = "title";

						if(i > 0){
							_namekanjiClassName = "title-roma";
						}
						_str +="<p class='"+_namekanjiClassName+"'>"+_nameArr.eq(i).text()+"</p>";
					}

					_str +="</div>";

					_aid = _temp.find('personal').attr('aid');


					_str +="<p class=''>論文著者ID: "+_aid+"</p>";




					//= = = = =
					_url = "#R?xa=" + 0 + "&q=" + encodeURI(_firstName) + "&aid=" + _aid;

					_str +="<div class='selectBox'>";

					_str +="<a href='"+_url+"' class=''>";
					_str +="<p>この論文著者の論文</p>";

					_str +="<span>ID: "+_aid +"</span>";
					//_str +="<span>"+_temp.find('totalResults').text() +"　件</span>";
					_str +="</a>";

					_str +="<a href='"+_url+"' class='notActive'>";
					_str +="<p>この論文著者の図書</p>";
					_str +="<span> (登録無し)</span>";
					_str +="</a>";

					var _$content;

					_aid +="";
					if(_aid.indexOf("1000") < 0){
						_url = "javascript:void(0);";
						_str +="<a href='"+_url+"' class='notActive'>";
						_str +="<p>この論文著者の研究</p>";
						_str +="<span> (登録無し)</span>";
						_str +="</a>";
					}else{

						_aid = _aid.slice(5);
						_url = "#K?xa=" + 2 + "&q=" + encodeURI(_firstName)+ "&aid=" + _aid;
						_str +="<a href='"+_url+"' class=''>";
						_str +="<p>この論文著者の研究</p>";

						_str +="<span>番号: "+_aid +"</span>";
						//_str +="<span>"+niiObserver.Model.allResultList[5].aidrdf.find('totalResults').text() +"　件</span>";
						_str +="</a>";
					}

					_str +="</div>";

					break;


				case 1:

					_str +="<div class='name-box'>";

					var _nameArr = _temp.find('name');
					var _firstName = "";
					for(var i = 0; i< _nameArr.length; i++){
						if(i <1 ){
							_firstName = _nameArr.eq(i).text();
						}
						var _namekanjiClassName = "title";
						if(i > 0){
							_namekanjiClassName = "title-roma";//kana
						}
						_str +="<p class='"+_namekanjiClassName+"'>"+_nameArr.eq(i).text()+"</p>";
					}
					_str +="</div>";


					_aid = _temp.find('personal').attr('aid');
					_str +="<p class=''>図書著者ID: "+_aid+"</p>";

					//=====


					_str +="<div class='selectBox'>";

					_url = "javascript:void(0);";
					_str +="<a href='"+_url+"' class='notActive'>";
					_str +="<p>この著者の論文</p>";
					_str +="<span>(登録無し)</span>";
					_str +="</a>";


					_aid = _temp.find('personal').attr('aid');
					_url = "#T?xa=" + 1 + "&q=" + encodeURI(_firstName) + "&aid=" + _aid;

					_str +="<a href='"+_url+"' class=''>";
					_str +="<p>この著者の図書</p>";

					_str +="<span>ID: "+_aid +"</span>";
					//_str +="<span>"+_temp.find('totalResults').text() +"　件</span>";
					_str +="</a>";

					_url = "javascript:void(0);";
					_str +="<a href='"+_url+"' class='notActive'>";
					_str +="<p>この著者の研究</p>";
					_str +="<span>(登録無し)</span>";
					_str +="</a>";



					_str +="</div>";



					break;
				case 2:
					var _$content = $(_temp.find('encoded').text());//CDDATA 研究のみ

					_str +="<div class='name-box'>";
					_str +="<p class='title'>"+_$content.find('a').text()+"</p>";

					_str +="<p class='title-roma'>"+_$content.children('dt').eq(0).text()+"</p>";//名前？ローマ字

					_str +="</div>";

					var _$content = $(niiObserver.Model.allResultList[5].aidrdf.find('encoded').text() );
					var _kaid = _$content.find('a').attr('href')+"";
					if(_kaid ==="undefined"){
						_kaid = "";
					}else if(_kaid.indexOf("jp/r/") > -1){
						_kaid = _kaid.slice(_kaid.indexOf("jp/r/") + 5);
					}

					_str +="<p class=''>研究者番号: "+_kaid+"</p>";

					var _dtArr = _$content.children('dt');
					_str +="<p class='note'>"+_dtArr.eq(1).text()+"</p>";//所属
					_str +="<p >"+_dtArr.eq(1).next().text()+"</p>";



					//  リンクベルト
					var _url = "";

					_str +="<div class='selectBox'>";


					var _raid = "10000" + _kaid;
					_url = "#R?xa=" + 0 + "&q=" + encodeURI(_$content.find('a').text())+ "&aid=" + _raid;


					_str +="<a href='"+_url+"' class=''>";
					_str +="<p>この研究者の論文</p>";
					_str +="<span>ID: " + _raid + "</span>";
					_str +="</a>";

					_str +="<a href='"+_url+"' class='notActive'>";
					_str +="<p>この研究者の図書</p>";
					_str +="<span> (登録無し)</span>";
					_str +="</a>";


					_aid = _$content.find('a').attr('href')+"";
					if(_aid ==="undefined"){
						_aid = "";
					}else if(_aid.indexOf("jp/r/") > -1){
						_aid = _aid.slice(_aid.indexOf("jp/r/") + 5);
					}


					_url = "#K?xa=" + 2 + "&q=" + encodeURI(_$content.find('a').text())+ "&aid=" + _aid;
					_str +="<a href='"+_url+"' class=''>";
					_str +="<p>この研究者の研究</p>";
					_str +="<span>番号: "+_kaid +"</span>";
					//_str +="<span>"+_temp.find('totalResults').text() +"　件</span>";
					_str +="</a>";

					_str +="</div>";



					_str +="<hr /> ";

					for(var i = 2; i < _dtArr.length; i++){
						_str +="<p class='note'>"+_dtArr.eq(i).text()+"</p>";
						_str +="<p >"+_dtArr.eq(i).next().text()+"</p>";
					}
					break;
			}
			_$ss.append(_str);






		},



		leftListViewSetting: function (isHitoSearchMode, isAidMode) {

			this.changedFormFlag = false;

			if (this.hitoSearchMode !== isHitoSearchMode || this.aidSearchMode !==isAidMode) {


				var _targetObj = this.$leftwrapper.children('#list_area');//section
				this.hitoSearchMode = isHitoSearchMode;
				this.aidSearchMode = isAidMode;

				_targetObj.children().remove();// ---------clear

				//new viewMode
				var _str = "";
				if (!this.hitoSearchMode) {
					_str = this.normalListViewSetting();
				} else {
					_str = this.hitoListViewSetting(isAidMode);//AID hitoMode　// hito mode + AID hitoMode
				}
				_targetObj.append(_str);
				this.$searchResultListTarget = $('#list_target');
			}//END if

			this.$detailTarget.find('article').remove();//Clear
		},



	}


	niiObserver.View = $.extend(Object.create(ViewStatic, {}), niiObserver.View, {
	});
})();


