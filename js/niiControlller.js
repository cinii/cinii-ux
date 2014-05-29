/**
 * Created with IntelliJ IDEA.
 * Date: 2013/08/10
 * Time: 12:07
 */


(function () {//
	"use strict";
	var _rt = window;



	//=================================
	//URL操作

	var urlNavi = {
			tabHashArr: ['R', 'T', 'K', 'H'],//const static
			tabTitleUnitArr: ["論文", "図書", "研究", "人", "論文 特定著者", "図書 特定著者", "特定研究者", "特定者同名"],
			isHashSettingFinish: false,//これがfalseだと履歴を残さない
			autosearchType: 0,
			currentSearchUrl: "",

			currentSearchArr:[],

			init: function () {
				"use strict";
				var _that = this;
				this.isHashSettingFinish = false;
				this.decodeHash();

				window.onpopstate = function (e) {

					//document.title = "テスト" + location.hash;

					if (_that.isHashSettingFinish) {
						niiObserver.Model.resetSearchObj();
						_that.decodeHash();

						window.location.herf = location;//履歴にのこせる
					} else {
						_that.isHashSettingFinish = true;
					}
					//e.preventDefault();
				};//END onpopstate
			},
			reset:function(){
				this.autosearchType = 0;
			},
			decodeHash: function () {
				"use strict";
				var _hashAfterStr , _hashStr;
				var _isAidMode = 0;
				var _hashSep = -1;
				var _currentTabNum = -1;
				var _searchLongStr = "";
				var _searchArr = [];
				var _searchWordStr = "";//for 4title
				var _searchDetailStr = "";//for 4title詳細検索
				var _searchParamObj = {};


				_hashAfterStr = location.hash;
				if (_hashAfterStr.length > 0) {
					_hashSep = _hashAfterStr.indexOf("?");
					if (_hashSep < 0) {
						_hashSep = _hashAfterStr.length;
						_searchLongStr = location.search.substring(1);
					} else {
						if (_hashSep < _hashAfterStr.length - 1) {
							_searchLongStr = _hashAfterStr.substr(_hashSep + 1);// search が hashに隠れる
						}
					}
					this.currentSearchUrl = _searchLongStr;
					_hashStr = _hashAfterStr.slice(1, _hashSep);//#取る
					for (var i = 0; i < 4; i++) {
						if (_hashStr === this.tabHashArr[i]) {
							_currentTabNum = i;
							if(_currentTabNum !== niiObserver.Model.searchObj.currnetTabModeNum){
								niiObserver.View.allCloseSyousaiWindow();
								niiObserver.Model.searchObj.param = {};
							}
							niiObserver.Model.searchObj.currnetTabModeNum = _currentTabNum;
							break;
						}
					}
					niiObserver.Model.searchObj.detail = 0;




					if (_searchLongStr !== "") {
						_searchArr = _searchLongStr.split('&');





						for (var i in _searchArr) {

							var _t = _searchArr[i];
							var _ix = _t.indexOf("=");
							var _param = _t.slice(0, _ix);
							_searchParamObj[_param] = _t.substr(_ix + 1);



							switch (_param) {
								case "q":
									var decodeQuery = decodeURI(_searchParamObj["q"]);
									//空白取る
									niiObserver.Model.searchObj.keywords = decodeQuery;

									if (decodeQuery !== "" && decodeQuery !== " " && decodeQuery.length > 0) {

										_searchWordStr = decodeQuery;
										if (!this.autosearchType) {
											this.autosearchType = 1;//自動サーチ
										}
									}
									break;

								case "aid":
									var idnum = _searchParamObj["aid"];
									niiObserver.Model.searchObj.aid = idnum;
									if (idnum !== "" && idnum !== " " && idnum.length > 0) {
										this.autosearchType = 2;//特定著者モード
										niiObserver.Model.searchObj.param['aid'] = idnum;
									}
									break;

								case "xa"://aid type across Aid Type aidの条件で十分か？
									var _xaNum = _searchParamObj["xa"];
									if(_xaNum !==""){
										_xaNum = +(_xaNum);
										if(_xaNum > -1){
											niiObserver.Model.searchObj.aidtype = _xaNum;
											_isAidMode = 1;
										}else if(_xaNum === -1){
											this.autosearchType = 1;//特定著者モード抜け出す
											niiObserver.Model.searchObj.param['aid'] ="";

										}

									}else{
										niiObserver.Model.searchObj.aidtype = -1;
										_isAidMode = 0;
									}
									// 0...論文AID  1... 図書著者ID  3...研究者特定
									_isAidMode = 1;//ページ遷移からの

									break;

								case "pfrom"://廃止の方向
									niiObserver.Model.searchObj.pfrom = _searchParamObj["pfrom"];
									//						if(typeSelectNum == 3 || searchObj.pfrom == 4){
									//							_isReturnHito = 1;
									//						}
									//						fromSearchTypeNum = (+_searchParamObj[_param]);
									break;


								case "dtl"://detail
									var ditailNum = +(_searchParamObj["dtl"]);
									niiObserver.Model.searchObj.detail = ditailNum;

									//if(ditailNum === 2){_searchDetailStr = "(フィルタ)";}
									break;
//								case "author":
//									var decodeAuthor = decodeURI(_searchParamObj["author"]);
//									niiObserver.Model.searchObj.author = decodeAuthor;
//									break;

								default:

									var _decodeStr = decodeURI(_searchParamObj[_param]);

									niiObserver.Model.searchObj.param[_param] = _decodeStr;


									break;

							}//ENdDswitch


							if(niiObserver.Model.searchObj.detail > 0){
								_searchDetailStr = "(詳)";//title用
								niiObserver.Model.searchObj.param.dtl = 1;
								if(this.autosearchType <1){
									this.autosearchType = 1;
								}

								var chkparam = function(objtargetStr, setTargetStr){
									var _ot = niiObserver.Model.searchObj.param[objtargetStr];
									if(_ot){
										$(function(){
											$(setTargetStr).val(decodeURI(_ot));
										});
									}
								};//END func
								var chkparamYear = function(objtargetStr, setTargetStr){
									var _ot = niiObserver.Model.searchObj.param[objtargetStr];
									if(_ot){
										$(function(){
											$(setTargetStr).val((_ot)+ "-01");// 暫定
										});
									}
								};//END func
								switch (_currentTabNum){
									case 0:
										chkparam('title', '#s-r-01');
										chkparam('author', '#s-r-02');
										chkparam('sortorder', '#sortorder-r');

										chkparamYear('year_from','#syousai-yy_start');
										chkparamYear('year_to','#syousai-yy_end');
									break;

									case 1:
										chkparam('title', '#s-t-01');
										chkparam('author', '#s-t-02');
										chkparam('sortorder', '#sortorder-t');
										chkparamYear('year_from','#syousai-t-yy_start');
										chkparamYear('year_to','#syousai-t-yy_end');
										break;

								}



							}


						}//End for
					}
				}




				if (_currentTabNum < 0) {
					// NO hash 初期化
					_currentTabNum = 0;//ronbun
					niiObserver.Model.currentTabModeNum = 0;
					document.title = "CiNii " + this.tabTitleUnitArr[0] + ':';//初期タイトル
					this.changeUrl("#" + "R", false);//初期値は論文 #R
				} else {

					niiObserver.Model.currentTabModeNum = _currentTabNum;//
					//_rt.niiView.setCurrentTabModeNum(_currentTabNum);
					var _titleNum = _currentTabNum;
					if(_isAidMode){
						_titleNum = 4;
					}
					document.title = "CiNii " + this.tabTitleUnitArr[_currentTabNum] + _searchDetailStr + ':' + _searchWordStr;
				}

				//set mainform
				var _chkNum = this.autosearchType;

				if (_chkNum) {
					var setFormString = "";
					if (_chkNum === 1) {
						setFormString = niiObserver.Model.searchObj.keywords;
					} else if (_chkNum === 2) {
						//setFormString = niiObserver.Model.searchObj.aid;

						setFormString = niiObserver.Model.searchObj.keywords;




//						switch (+(niiObserver.Model.searchObj.aidtype)){ // 入力フォームに区別を入れるのを廃止 0827
//							case 0:
//								setFormString = "論文 特定著者:";
//								break;
//							case 1:
//								setFormString = "図書 特定著者:";
//								break;
//							case 2:
//								setFormString = "研究 特定研究者:";
//								break;
//						}
//						setFormString += niiObserver.Model.searchObj.keywords;// 名前を入れる


						//
					} else if (_chkNum > 2) {
						//setFormString = "(詳細検索)";// これも廃止

					}

					$(function () {//DOM ready after

						$('#kani-search-form').val(setFormString);



						if (_currentTabNum > 2){// 詳細ボタン処理_chkNum ===3 の時は隠す
							$('#syousai').addClass('syousai-hide');


						}else{
							if($('#syousai').hasClass('syousai-hide')){
								$('#syousai').removeClass('syousai-hide');
							}
							$('.syousai-btn #setumei').show().fadeOut(1000);
						}//ENd if

					});
				}


				//KEY = SessionStrage (_hashAfterStr);//セッションストレージへキーバリューとしてコール


				niiObserver.View.layoutInitReset();
				this.makeUrl(_currentTabNum, false);//falseでは、リフレッシュさせない=URL変更をイベントで受け取るので


				//検索結果だったら　読み込み開始

				if (_chkNum > 0) {
					var _that = this;

					$(function () {//
						_that.searchStart(_that.autosearchType, _currentTabNum);

						if(niiObserver.Model.searchObj.detail > 0 && _currentTabNum < 3){
							//詳細枠を出しておく

							var _$target = $('#syousai-id-' + _currentTabNum);
							_$target.addClass('modefull');
							_$target.addClass('opened');
							$('#detailTarget').removeClass('maginTopShort');
							$('#detailTarget').addClass('maginTopFull');
							$('.tenkai', _$target).removeClass('tenkaiOpen');

						}
					});
				}

			},


			searchStart: function (autoType, TabNum) {
				var _that = this;
				var _tObj = niiObserver.Model.searchObj;
				niiObserver.Model.defaultSelectedCounter = 0;

				(function(){//@private
					var isHitoMode = 0;
					var _aidMode = 0;
					if (TabNum === 3) {//横断　人検索だったら
						isHitoMode = 1;
						if (autoType === 2) {
							_aidMode = 1;
						}
					}
					niiObserver.View.leftListViewSetting(isHitoMode, _aidMode);//2通り 呼び出すだけ
				})();



				(function(){//@private INIT
					if(_that.currentSearchArr){
						var _len = _that.currentSearchArr.length;
						if(_len >0){
							for (var i in _that.currentSearchArr){
								_that.currentSearchArr[i].targetAllClear();
								_that.currentSearchArr[i].destroy();//Ajax 通信を破棄
								_that.currentSearchArr[i] = {};//カラのオブジェクトに ガベージコレクション用？
							}
							_that.currentSearchArr = [];//インスタンスを消去
						}
					}

				})();



				// 振り分け

				var isHitoMode = 0;
				var aidExtra = 0;
				if (TabNum === 3) {//横断　人検索だったら
					isHitoMode = 1;
				}


				if (autoType > 1) {
					aidExtra = 1;// 特定著者がある場合、
				}



				switch (TabNum) {
					case 0://論文

						this.currentSearchArr[TabNum] = $.extend(Object.create(niiTemplate.ListViewClass, {}),
							niiTemplate.commonAjax, {});//NEW

						this.currentSearchArr[TabNum].loadTargetSetting('#list_target', '#left_bottom');
						this.currentSearchArr[TabNum].loadingSetting(TabNum, isHitoMode, aidExtra);//0


						//setParam
						var paramObj = {
							"q":_tObj.keywords,
							"count":20,
							"format": "rss",
						};
						if(aidExtra){
							paramObj.aid= _tObj.aid;
						}

						var searchParamObj = niiObserver.Model.searchObj.param;
						for (var _paramKey in searchParamObj) {
							if (searchParamObj[_paramKey] !== "") {
								paramObj[_paramKey] = searchParamObj[_paramKey];
							}
						}
						this.currentSearchArr[TabNum].setSendParamObj(paramObj);

						this.currentSearchArr[TabNum].loadFirstListXML();//loadStart


					break;

					case 1://図書

						this.currentSearchArr[TabNum] = $.extend(Object.create(niiTemplate.ListViewClass, {}),
							niiTemplate.commonAjax, {});//NEW

						this.currentSearchArr[TabNum].loadTargetSetting('#list_target', '#left_bottom');
						this.currentSearchArr[TabNum].loadingSetting(TabNum, isHitoMode, aidExtra);//0


						var paramObj = {
							"q":_tObj.keywords,
							"count":20,
							"format": "rss",
							"appid": "tKMVuIK7UKPDdM4cH9zJ",//for 図書API新
						};
						var searchParamObj = niiObserver.Model.searchObj.param;
						for (var _paramKey in searchParamObj) {
							if (searchParamObj[_paramKey] !== "") {
								paramObj[_paramKey] = searchParamObj[_paramKey];
							}
						}
						this.currentSearchArr[TabNum].setSendParamObj(paramObj);



						this.currentSearchArr[TabNum].loadFirstListXML();//loadStart


					break;

					case 2://研究

						this.currentSearchArr[TabNum] = $.extend(Object.create(niiTemplate.ListViewClass, {}),
							niiTemplate.commonAjax, {});//NEW

						this.currentSearchArr[TabNum].loadTargetSetting('#list_target', '#left_bottom');
						this.currentSearchArr[TabNum].loadingSetting(TabNum, isHitoMode, aidExtra);//0

						var paramObj = {
							"q":_tObj.keywords,
							"c":20,
							"format": "rss",
						};
						if( niiObserver.Model.searchObj.aid !==""){
							paramObj.qg = niiObserver.Model.searchObj.aid;
							paramObj.q = "";

						}
						var searchParamObj = niiObserver.Model.searchObj.param;
						for (var _paramKey in searchParamObj) {
							if (searchParamObj[_paramKey] !== "") {
								paramObj[_paramKey] = searchParamObj[_paramKey];
							}
						}
						this.currentSearchArr[TabNum].setSendParamObj(paramObj);



						this.currentSearchArr[TabNum].loadFirstListXML();//loadStart

					break;

					case 3://人 横断検索


						if(aidExtra){//特定著者の人リスト


						}

						for(var i = 0; i< 3; i++){

							this.currentSearchArr[i] = $.extend(Object.create(niiTemplate.ListViewClass, {}),
								niiTemplate.commonAjax, {});//NEW

							this.currentSearchArr[i].loadTargetSetting('#list_hito-'+ i +' .hito_targets', '#left_bottom'+ i);
							this.currentSearchArr[i].loadingSetting(i, isHitoMode, aidExtra);//0

							var paramObj;
							switch (i) {
								case 0:

									paramObj = {
										"q":_tObj.keywords,
										"count":10,
										"format": "rss",
									};

									if(aidExtra){// 人横断検索で特定著者がある場合 オーバーロード
										$.extend(this.currentSearchArr[0], niiTemplate.HitoAidModClass);
									}

									break;
								case 1:

									paramObj = {
										"name":_tObj.keywords,
										"count":10,
										"format": "rss",
										"appid": "tKMVuIK7UKPDdM4cH9zJ",//for 図書API新
									};

									break;
								case 2:
									paramObj = {
										"q":_tObj.keywords,
										"c":10,
										"format": "rss",
									};
									break;
							}
							this.currentSearchArr[i].setSendParamObj(paramObj);


							this.currentSearchArr[i].loadFirstListXML();//loadStart
						}


					break;
				}//END switch


				if(aidExtra > 0 && TabNum < 3){//AIDモード時
					$.extend(this.currentSearchArr[TabNum], niiTemplate.specialAidModClass);
				}

				niiObserver.View.leftListViewEventSetting();






			},


			changeUrl: function (urlStr, flag) {
				this.isHashSettingFinish = flag;

				if (this.isHashSettingFinish) {

					window.location.href = urlStr;// URLの変更イベントに投げる
				} else {
					window.location.replace(urlStr);//交換
				}

				//$('#keywords').append('');

			},

			makeUrl: function (num, flag) {
				var _t = window.location;


				var newUrl = _t.protocol + "//" + _t.host + _t.pathname + "#" + this.tabHashArr[num];




				if (niiObserver.Model.searchObj.keywords !== "" || niiObserver.Model.searchObj.detail >0) {
					newUrl += "?q=" + encodeURI(niiObserver.Model.searchObj.keywords);

					if(niiObserver.Model.searchObj.aidtype !==-1 && typeof niiObserver.Model.searchObj.aidtype !== "undefined"){
						newUrl += "&xa=" + niiObserver.Model.searchObj.aidtype;
					}

					var searchParamObj = niiObserver.Model.searchObj.param;

					var _clearFlag = 0
					if(searchParamObj["dtl"] === 0 || niiObserver.Model.searchObj.detail < 1){//clear
						_clearFlag = 1;
						searchParamObj.dtl = 0;//Clear
					}else{

						if(niiObserver.Model.searchObj.detail){
							searchParamObj.dtl = niiObserver.Model.searchObj.detail;
						}
					}

					var _clearParamArr = ["title","author","year_from","year_to","q1","qe","o","q6","q7"];



					for (var _paramKey in searchParamObj) {
						if (searchParamObj[_paramKey] !== "") {
							if(_clearParamArr.indexOf(_paramKey) > -1){
								if(_clearFlag < 1){
									newUrl += "&" + _paramKey + "=" + encodeURI(searchParamObj[_paramKey]);
								}
							}else{
								newUrl += "&" + _paramKey + "=" + encodeURI(searchParamObj[_paramKey]);
							}
						}
					}


				}

				this.isHashSettingFinish = true;
				this.changeUrl(newUrl, flag);

			}

		}
		;//

	niiObserver.Controller = $.extend(Object.create(urlNavi, {}), niiObserver.Controller, {
		init: function () {

		}
	});



})
	();


