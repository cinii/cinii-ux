/**
 * Created with IntelliJ IDEA.
 * Date: 2013/08/22
 * Time: 10:21
 */


(function () {//AJAX読み込みを管理するクラス
	"use strict";
	var _rt = window;


	niiTemplate.constData = {



		// このURLをAPI用に変更＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝ 2013/09/05


		firstListURlArr: [    //0-2
			["./php/R_result.php",
				"/php/R_rdf.php?url=",//論文RDF
				"./php/R_hito_RdfMakeXml.php?"],// 論文のURL 3番目は　AIDmodeのURL ※2番目の論文IDrdfは共通 戻りは独自XML

			["./php/T_result.php",//図書だけ startアイテムではなく、pageIndex
				"/php/T_rdf.php?url=",
				"./php/T_authorIdFromAPI.php?"],// 図書のURL API叩いた方が この場合 パラメーター最小

			["./php/K_result.php",
				"/php/K_html_rdfMakeXml.php?url=",//研究詳細がHTMLなので、XMLに変換
				//"./php/K_hito_RdfMakeXml.php?url="//パースがしにくいのでhtml方式に
				"./php/K_result.php?qg="]//特定研究者の研究課題リスト API? HTMLパース？kakenos:researcherNumber　qg=で指定
			// 研究のURL
		],

		hitoListURLArr: [// 同姓同名の人を探す
			["./php/R_hito.php",
				"/php/R_hito_RdfMakeXml.php?aid="],// 論文著者　"http://ci.nii.ac.jp/nrid/9000237720818" nrid

			["./php/T_hito.php",// q= ではなく ここだけ name=
				"/php/T_hito_RdfMakeXml.php?url="],// 図書著者　"http://ci.nii.ac.jp/author/DA16256910" author/ 形式

			["./php/K_hito.php",// q=
				"/php/K_hito_result.php?url="]// 特定研究者の論文数　c=1　>totalResults Clickで人データー qg=XXXX
		],



		// このURLをAPI用に変更＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝ここまで


		setFirstUrlStr: function (ctgNum, isHitoMode, isAidMode) {
			var _url = "";


			if (isHitoMode < 1) {//通常モード 01判定紛らわしいので、enum風に数字で管理　視認性重視
				if (isAidMode === 1) {
					_url = this.firstListURlArr[ctgNum][2];//特定人物でのソートモード

				} else {
					_url = this.firstListURlArr[ctgNum][0];
				}
			} else {//3 横断人検索
				_url = this.hitoListURLArr[ctgNum][0];
			}
			return _url
		},
		setSecondUrlStr: function (ctgNum, isHitoMode) {
			var _second_url = "";
			if (isHitoMode < 1) {
				_second_url = this.firstListURlArr[ctgNum][1];
			} else {
				_second_url = this.hitoListURLArr[ctgNum][1];
			}
			return _second_url
		}

		// 特定著者の場合の論文数は、　2番目のURLを使って件数を調べる。
	};





// xml読み込みクラス
	niiTemplate.commonAjax = {
		init: function () {

		},


		ajaxActiveXHRArr: [],// XHRオブジェクト配列

		thisCategoryNum: 0,
		thisIsHitoMode: 0,
		thisIsAidMode: 0,// 特定著者・研究者モード ※人モードは、３つの横断　同姓同名検索のみ

		thisFirstUrl: "",//メインのURLパス
		thisSecondRdfURL: "",

		thisTotalResult: 0,// 結果件数の総数

		thisLoadedCount: 0,//firstがロードした回数 0回目は特別



		setConstOneTimeMaxCount: function () {// 一回の呼び出し件数
			var _int = 20;
			if (this.thisIsHitoMode > 0) {
				_int = 10;
			}
			return _int
		},

		sendParamObj: {},// data部分


		//thisLoadedDataListObj: {}, // 中に配列 Modelに一括管理

		totalCount: 0,// 最初の検索結果リストの総数　（初回時に判明する）


		loadingSetting: function (ctgNum, isHitoMode, isAidMode) {
			this.thisCategoryNum = ctgNum;
			this.thisIsHitoMode = isHitoMode;
			this.thisIsAidMode = isAidMode;

			this.thisFirstUrl = niiTemplate.constData.setFirstUrlStr(ctgNum, isHitoMode, isAidMode);
			this.thisSecondRdfURL = niiTemplate.constData.setSecondUrlStr(ctgNum, isHitoMode);

			niiObserver.Model.allResultList = [
				{},
				{},
				{},
				{},// 拡張用  for AID
				{},
				{}
			];//配列
			this.ajaxActiveXHRArr = [];


			//Viewの初期化
			this.targetAllClear();//
			this.addLoadActtionSeting();

		},
		setSendParamObj: function (setObj) {
			this.sendParamObj = setObj;// 外からdata{}をセット------
		},

		loadFirstListXML: function () {
			this.bottomAreaStatusChage(2);


			var _that = this;
			switch (this.thisCategoryNum) {
				case 0:
					this.sendParamObj.start = this.thisLoadedCount * 20 +1;
					this.sendParamObj.count = this.setConstOneTimeMaxCount();
					break;
				case 1:
					this.sendParamObj.p = this.thisLoadedCount + 1;
					this.sendParamObj.c = this.setConstOneTimeMaxCount();
					break;
				case 2:
					this.sendParamObj.f = this.thisLoadedCount * 20 + 1;
					this.sendParamObj.count = this.setConstOneTimeMaxCount();
					break;
			}


			var _XHRobj;
			_XHRobj = $.ajax({
				url: this.thisFirstUrl,
				processData: true,
				data: this.sendParamObj,// SET
				type: "GET",
				dataType: "xml",
				cache: true,
				crossDomain: true,
			}).done(function (xmldata, status, xhr) {//success

					var _$xml = $(xhr.responseXML);
					//var _MasterObj = niiObserver.Model.allResultList[_that.thisCategoryNum];
					var _$tt;
					if (_that.thisIsAidMode < 1 || _that.thisIsHitoMode > 0) {// ||
						_$tt = _$xml.find('channel').eq(0);//先頭ノード
						var _currentLoadedStartIndex = +(_$tt.find('startIndex').text() ) - 1;// 0からスタート
					}
					else {//thisIsAidMode===1
						if(_that.thisCategoryNum !== 0){
							if(_that.thisCategoryNum ===1){
								_$tt = _$xml.find('feed').eq(0);//先頭ノード
							}else{
								_$tt = _$xml.find('channel').eq(0);//先頭ノード
							}
						}else{
							_$tt = _$xml.find('personal').eq(0);//先頭ノードs
						}

					}


					var _firstFlag = 1;

					if (_that.thisLoadedCount < 1) {//初回はゼロ
						_firstFlag = -1;

						var _totalResults = +(_$tt.find('totalResults').text() );//整数化
						_that.thisTotalResult = _totalResults;

						if (_that.thisIsHitoMode < 1) {
							_that.headTotalResultsShow(_totalResults);//件数表示
						} else {
							_that.headTotalResultsHide();
							_that.headTotalResultsHitoShow(_totalResults);//件数表示
						}


						(function () {//初回時 ※初回のみ結果のcahnnel/personal データー読み込み
							var _temoObj = {};
							_temoObj.totalResult = _totalResults;
							if (_that.thisIsAidMode < 1) {
								_temoObj.title = _$tt.find('title').text();
								_temoObj.link = _$tt.find('link').text();//　今の検索結果のURL
								_temoObj.description = _$tt.find('description').text();

							} else {
								_temoObj.title = _$tt.find('name').text();
								_temoObj.aid = _$tt.find('name').attr('aid');
								_temoObj.affiliations = _$tt.find('affiliations').text();//所属
							}
							niiObserver.Model.allResultList[_that.thisCategoryNum] = _temoObj;//新規登録
							niiObserver.Model.allResultList[_that.thisCategoryNum].items = [];
						})();
					}//END if




					if (_that.thisIsAidMode > 0 && _that.thisIsHitoMode > 0 && _that.thisCategoryNum === 0) {
						_that.hitoAidModeSpecialFunc();// 人＋aidモード時　特定著者を表示　※selected
					}else if(_that.thisIsAidMode > 0){
						_that.specialAidModeFunc();// 特定著者時
					}

					if (_that.thisTotalResult < 1) {
						// 検索結果ゼロ View反映

						_that.bottomAreaStatusChage(4);


						if(_that.thisIsAidMode > 0 && _that.thisCategoryNum === 0 ){// Aidモードで結果がすべてゼロ件の場合
							_that.loadedDefaultSelected(1);
						}

					} else {
						var _restCount = _that.setConstOneTimeMaxCount();//20

						var _setCountListBaseFirst = (_that.thisTotalResult > _restCount) ? _restCount : _that.thisTotalResult;
						_that.loadTargetBaseSetting(_setCountListBaseFirst * _firstFlag);



						(function () {//items 読み込み
							var _$xmlItemListArr;
							if (_that.thisIsAidMode < 1 || _that.thisIsHitoMode > 0) {
								_$xmlItemListArr = _$xml.find('item');//複数
							} else {
								if(_that.thisCategoryNum !== 0){
									if(_that.thisCategoryNum === 1){
										_$xmlItemListArr = _$xml.find('entry');
									}else{
										_$xmlItemListArr = _$xml.find('item');
									}

								}else{
									_$xmlItemListArr = _$xml.find('list').find('item');//人AIDモード
								}

							}
							var _oneTimeLoadedCount = _$xmlItemListArr.size();

							_restCount = (_oneTimeLoadedCount < _restCount) ? _oneTimeLoadedCount : _restCount;



							for (var i = 0; i < _oneTimeLoadedCount; i++) {
								var _oo = {};
								var _creatorStr = "";
								var _cc = _$xmlItemListArr.eq(i).children();
								$.each(_cc, function (key, value) {
									var _nodeStr = (_cc.eq(key)[0].nodeName);
									_nodeStr = _that.stringObjectAnalyzeFunc(_nodeStr);//":" を取る。
									var _v = "";
									if (_nodeStr !== "seeAlso") {
										if(_nodeStr !== "encoded"){

											if(_nodeStr === "creator"){

												if(_creatorStr !==""){
													_creatorStr +="、";
												}
												_creatorStr += $(value).text();
												_v = _creatorStr;
											}else{
												_v = $(value).text();
											}
										}
									} else {
										_v = $(value).attr("rdf:resource");
									}

									_oo[_nodeStr] = _v;//set


								});
								_oo.rdfLoaded = 0;

								var _len = niiObserver.Model.allResultList[_that.thisCategoryNum].items.length;
								niiObserver.Model.allResultList[_that.thisCategoryNum].items[_len] = _oo;

								_that.loadTargetDrawListContents(_len);

							}
							;//END for

						})();


						var currentValue = _that.thisLoadedCount * _that.setConstOneTimeMaxCount();

						_that.firstXmlLoadedFinished(currentValue, _restCount);//RDF読み込み


						_that.thisLoadedCount++;
						var _oneMax = _that.setConstOneTimeMaxCount();
						var _currentLastVolume = _oneMax * _that.thisLoadedCount;// １からスタート

						(function () {//NEXT Load 処理
							var _nextLastVolume = _currentLastVolume + _oneMax;

							if (_that.thisTotalResult <= _currentLastVolume) {
								//読み込み終了
								_that.bottomAreaStatusChage(3);
								_that.bottomAreaCompleteTotalCountChange(_that.thisTotalResult );

							} else if (_that.thisTotalResult  < _nextLastVolume) {
								var _nextLoadCount = _that.thisTotalResult  - _currentLastVolume;

								_that.bottomAreaStatusChage(1);
								_that.bottomAreaNextLoadginCountChange(_that.thisTotalResult  - _currentLastVolume);
							} else {
								_that.bottomAreaStatusChage(1);
								_that.bottomAreaNextLoadginCountChange(_oneMax);

							}

						})();

						//


					}
					//

				}).error(function (data) {
					//_that.showLoadinIndicator(false);//hide Error Case Viewを変更

					console.log("-----error--");//
					console.log(data);

				});//END AJAX
			this.ajaxActiveXHRArr.push(_XHRobj);
		},
		stringObjectAnalyzeFunc: function (str) {//　　タグネーム中の　":" を処理
			var _str = str;
			var leftCutter = _str.indexOf(":");
			if (leftCutter > -1) {
				_str = _str.slice(leftCutter + 1);
			}
			return _str
		},


		firstXmlLoadedFinished: function (startNum, countNum) {// 時間差でrdfファイル先読み

			var _that = this;
			for (var i = 0; i < countNum; i++) {
				setTimeout(function (rdfStartNum) {
					_that.secondRdfLoadSetting(rdfStartNum);// startNum+i が引数
				}, i * 90, startNum + i);//
			}
		},
		secondRdfLoadSetting: function (indexNum) {
			var _index = indexNum;
			var _that = this;
			var _masterList = niiObserver.Model.allResultList[this.thisCategoryNum].items;//Arr

			try{
				if(_masterList[_index]){

					var _htmlUrl = _masterList[_index].seeAlso;//論文のrdf;//RDF Link

					if (_htmlUrl === undefined && this.thisCategoryNum === 0) {
						_htmlUrl = _masterList[_index].link;


					}
					if (this.thisCategoryNum === 1 && this.thisIsHitoMode > 0) {
						_htmlUrl = _htmlUrl.replace(".rdf", "");


					} else if (this.thisCategoryNum === 1 && this.thisIsAidMode > 0) {//図書　特定著者から検索
						_htmlUrl = _masterList[_index].id + ".rdf";

					}

					if (this.thisCategoryNum === 0 && this.thisIsHitoMode > 0) {
						_htmlUrl = _htmlUrl.replace(".rdf", "");
					}
					if (this.thisCategoryNum === 2) {
						_htmlUrl = _masterList[_index].link;
					}

					if(this.thisIsHitoMode > 0 && this.thisCategoryNum === 0){
						var _hitoRonbunRdfIDPos = _htmlUrl.indexOf('nrid/');
						if(_hitoRonbunRdfIDPos > -1){
							_htmlUrl = _htmlUrl.slice(_hitoRonbunRdfIDPos + 5 );
						}
					}

					var _XHRsubObj;
					_XHRsubObj = $.ajax({
						url: "." + this.thisSecondRdfURL + _htmlUrl,
						type: "GET", //デフォルトがGET
						dataType: "xml",
						cache: true,// キャッシュする
						crossDomain: true,

					}).done(function (xmldata, status, xhr) {// rdf detailXML DONE success

							_masterList[_index].rdf = $(xhr.responseXML);//上書きダメ
							_masterList[_index].rdfLoaded = 1;// 読み込み完了flag


							//★付属データーのアトリビューがあったら、リストにどんどん追加

							_that.loadedAddAttribute(_that.thisIsHitoMode, _that.thisCategoryNum,  _index);


							if(_index < 1){
//						if(_that.thisIsAidMode > 0 && _that.thisCategoryNum < 1 ){// Aidモードで結果がゼロではなく
//							_that.loadedDefaultSelected(1);
//						}

								if(_that.thisIsHitoMode >0 && _that.thisCategoryNum === niiObserver.Model.defaultSelectedCounter){
									if(_that.thisTotalResult > 0){
										_that.loadedDefaultSelected(_that.thisIsAidMode);
									}else{
										niiObserver.Model.defaultSelectedCounter++;// このカテゴリで総数がゼロ件だったら++
									}

								}else if(_that.thisIsHitoMode < 1){
									_that.loadedDefaultSelected(0);
								}
							}



							//VIEW側へバッチデーターを追加
						}).error(function (data) {



						});
					this.ajaxActiveXHRArr.push(_XHRsubObj);
				}


			}catch( e ){
				console.log( e );  //
			}



		},
		hitoAidModeSpecialFunc:function(){//NOT USE
			//
		},
		specialAidModeFunc:function(){//NOT USE
			//
		},
		destroy: function () {
			var _aa = this.ajaxActiveXHRArr;
			for (var _t in _aa) {

				_aa[_t].abort();// 戻り値XHR
			}
		}
	}//END {}

	niiTemplate.HitoAidModClass = {// Hito の aidモード　一回のみ
		hitoAidModeSpecialFunc:function(){//OVERRIDE
			//

			$('#list_aid_area A.authorMain').attr('data-ctg', this.thisCategoryNum - 3);

			$('#list_aid_area .name').text(niiObserver.Model.searchObj.keywords);

			$('#list_aid_area .aff').text("");//

			var _xaType = +(niiObserver.Model.searchObj.aidtype);
			var _currentAid = niiObserver.Model.searchObj.param.aid;



			switch (_xaType){//--------------まとめーーーーーーーーーーーーーー
				case 0:
					$('#list_aid_area #aid_r .aid').text(_currentAid);

					$.ajax({
						url: "./php/R_hito_RdfMakeXml.php?aid=" + _currentAid,
						type: "GET", //デフォルトがGET
						dataType: "xml",
						cache: true,// キャッシュする
						crossDomain: true,

					}).done(function (xmldata, status, xhr) {// rdf detailXML DONE success

						var _$aidXML = $( xhr.responseXML);

						//niiObserver.Model.allResultList[3].loaded = 0;// 再チェック
						niiObserver.Model.allResultList[3].aidrdf = _$aidXML;
//							niiObserver.Model.allResultList[3].loaded = 1;
						$('#list_aid_area #aid_r .count').text("論文件数 "+ _$aidXML.find('totalResults').text() );
					});

					var _chkR_aid_to_KidPos = _currentAid.indexOf("1000");
					if(_chkR_aid_to_KidPos > -1){// 論文著者IDから 研究者IDへ
						var _kenkyuAID = _currentAid.slice(_chkR_aid_to_KidPos + 5 );


						$('#list_aid_area #aid_k .aid').text(_kenkyuAID);

						$.ajax({
							url: "./php/K_result.php?qg=" + _kenkyuAID,
							type: "GET", //デフォルトがGET
							dataType: "xml",
							cache: true,// キャッシュする
							crossDomain: true,

						}).done(function (xmldata, status, xhr) {// rdf detailXML DONE success

								var _$aidXML = $( xhr.responseXML);


								niiObserver.Model.allResultList[3].loaded = 1;

								niiObserver.Model.allResultList[5].loaded = 1;
								niiObserver.Model.allResultList[5].aidrdf = _$aidXML;
								$('#list_aid_area #aid_k .count').text("研究件数 "+ _$aidXML.find('totalResults').text() );
							});


					}else{
						niiObserver.Model.allResultList[3].loaded = 1;
					}

					break;
				case 1:
					$('#list_aid_area #aid_t .aid').text(_currentAid);

					$.ajax({
						url: "./php/T_hito_RdfMakeXml.php?url=http://ci.nii.ac.jp/author/" + _currentAid,
						type: "GET", //デフォルトがGET
						dataType: "xml",
						cache: true,// キャッシュする
						crossDomain: true,

					}).done(function (xmldata, status, xhr) {// rdf detailXML DONE success

							var _$aidXML = $( xhr.responseXML);

							niiObserver.Model.allResultList[4].loaded = 1;
							niiObserver.Model.allResultList[4].aidrdf = _$aidXML;
							$('#list_aid_area #aid_t .count').log().text("著作件数 "+ _$aidXML.find('totalResults').text() );
						});

					break;
				case 2:
					$('#list_aid_area #aid_k .aid').text(_currentAid);

					$('#list_aid_area #aid_r .aid').text("10000"+ _currentAid);

					$.ajax({
						url: "./php/K_hito_result.php?qg=" + _currentAid,
						type: "GET", //デフォルトがGET
						dataType: "xml",
						cache: true,// キャッシュする
						crossDomain: true,
					}).done(function (xmldata, status, xhr) {// rdf detailXML DONE success

							var _$aidXML = $( xhr.responseXML);

							niiObserver.Model.allResultList[5].loaded = 1;
							niiObserver.Model.allResultList[5].aidrdf = _$aidXML;
							$('#list_aid_area #aid_k .count').text("");
							//$('#list_aid_area #aid_k .count').text("研究件数 "+ _$aidXML.find('totalResults').text() );
						});

					break;
			};

		}

	}//END {}

	niiTemplate.specialAidModClass = {// 論文・図書・研究 の aid特定著者研究者モード　一回のみ
		specialAidModeFunc:function(){

			this.loadedTargetBaseSpecialAidMode();//append する

			$('#list_aid_info .name').text(niiObserver.Model.searchObj.keywords);//名前

			$('#list_aid_info .aid_p .aid').text(niiObserver.Model.searchObj.param.aid);


		},

	};

})();