/**
 * Created with IntelliJ IDEA.
 * Date: 13/08/20
 * Time: 7:02
 */

(function () {//
	"use strict";
	var _rt = window;//root

	niiTemplate.ListViewClass = {// 増産型

		$mainTarget: undefined,
		$bottomTarget: undefined,

		init: function () {//new した後

		},
		loadTargetSetting: function (mainTargetIdName, bottomTargetIdName) {//ここで設定 #list_hito-0  #list_hito-1
			this.$mainTarget = $(mainTargetIdName, '#left_wrapper');

			this.$bottomTarget = $(bottomTargetIdName, '#left_wrapper');

			this.bottomAreaStatusChage(0);//clear
			this.bottomAreaNextLoadginCountChange(20);

			this.$mainTarget.parent().parent().animate({scrollTop: 0}, 200);



		},
		addLoadActtionSeting:function(){
			//buton に data-ctg
			this.$bottomTarget.find('.addLoadedBtn').attr('data-ctg',this.thisCategoryNum);
		},

		loadedTargetBaseSpecialAidMode:function(){
			var _str = "";
			var _strHeaderTextArr = ["特定 論文著者の論文リスト","特定 著者の図書リスト","特定 研究著者の採択研究リスト"];
			var _ctgNum = this.thisCategoryNum;
			var _strLabelAidTextArr = ["論文著者","著者","研究者"];

			_str += "<div id='list_aid_info'>";// 特定著者のヘッダー選択できない
			_str += "   <div id='list_aid_header' class='aidHeader"+_ctgNum+"'>" +_strHeaderTextArr[_ctgNum] + "</div>";// 各AIDモード時のヘッダーラベル

			_str += "   <section class='specialAuthorInfo'>";
			_str += "       <p class='name'></p>";
			_str += "       <p class='aff'></p>";//所属
			_str += "       <p class='aid_p'>"+_strLabelAidTextArr[_ctgNum]+" ID : <span class='aid'></span></p>";//

			_str += "   </section>";
			_str += "</div>";//END #list_aid_info

			this.$mainTarget.append(_str);


		},


		loadTargetBaseSetting: function (count) {
			if (count < 0) {
				var _baseStr = "<ul class='clickable'></ul>";
				this.$mainTarget.append(_baseStr);
				count *= -1;
			}
			var _str = "";
			for (var i = 0; i < count; i++) {
				if(i % 2 != 0){
					_str += "<li class='even'></li>";
				}else{
					_str += "<li></li>";
				}

			}
			this.$mainTarget.children('UL').append(_str);
		},

		loadTargetDrawListContents: function (indexNum) {

			var _tempArr = niiObserver.Model.allResultList[this.thisCategoryNum].items[indexNum];

			var _btndata = this.thisCategoryNum + (this.thisIsHitoMode * 10);
			var _str = "";
			_str += "<div><a href='javascript:void(0);' data-ctg='" + _btndata + "'>";

			_str += "";

			var _t = _tempArr.title;
			if(this.thisCategoryNum === 2){
				_t = _t.replace("KAKEN - ", "");
			}

			_str += '<p class="title">' + _t + '</p>';
			if(this.thisIsHitoMode <1 ){
				var _creatorStr = "";
				if(this.thisCategoryNum !== 2){
					_creatorStr = _tempArr.creator;
				}
				_str += '<p class="creator">' + _creatorStr + '</p>';
			}else{
				_str += '<p class="info"></p>';//後から入れる
			}


			_str += "</a><span class='bgnumber'>"+ (indexNum + 1)+"</span><div class='mask'></div></div>";

			this.$mainTarget.find('UL.clickable > LI').eq(indexNum).append(_str);

		},


		loadedDefaultSelected:function(isAidFlag){// デフォルト時最初の選択箇所を設定
			if(isAidFlag < 1){
				this.$mainTarget.find('UL.clickable > LI').eq(0).find('a').addClass('selected');

				//call right view reflesh
				if(this.thisIsHitoMode < 1){
					niiObserver.View.rightViewReflesh(this.thisCategoryNum, 0);// ここはsessionstrage から前回セレクトしていた番号　20overの場合は・・・
				}else{
					niiObserver.View.rightViewReflesh3(this.thisCategoryNum, 0);// 人用
				}
			}else{
				$('.authorMain').addClass('selected');
				niiObserver.View.rightAidViewReflesh(niiObserver.Model.searchObj.aidtype);

				//call right view AID reflesh
			}
		},




		loadedAddAttribute:function(mode, ctgNum, indexNum){
			if(mode < 1){//通常モード時

				if(ctgNum === 2){// K 研究のみ後入れ

					var _addInfo = niiObserver.Model.allResultList[ctgNum].items[indexNum].rdf.find('investigator > affiliation').text()+")";
					_addInfo = niiObserver.Model.allResultList[ctgNum].items[indexNum].rdf.find('investigator > name').text() +" ("+ _addInfo;
					this.$mainTarget.find('UL.clickable > LI').eq(indexNum).find('.creator').text(_addInfo);
				}else{

					var _addInfoR = this.$mainTarget.find('UL.clickable > LI').eq(indexNum).find('.creator').text()+"  ";

					_addInfoR += niiObserver.Model.allResultList[ctgNum].items[indexNum].rdf.find("publisher").text();
					if(ctgNum !==1){
						_addInfoR += " (" + niiObserver.Model.allResultList[ctgNum].items[indexNum].rdf.find("publicationDate").text()+")";
					}else{
						_addInfoR += " (" + niiObserver.Model.allResultList[ctgNum].items[indexNum].rdf.find("date").text()+")";
					}

					this.$mainTarget.find('UL.clickable > LI').eq(indexNum).find('.creator').text(_addInfoR);
				}




			}else{// 人モードの時
				var _firstData ="";
				if(ctgNum !==2){
					var _countStr = niiObserver.Model.allResultList[ctgNum].items[indexNum].rdf.find('totalResults').text();

					_firstData = niiObserver.Model.allResultList[ctgNum].items[indexNum].rdf.find('title').eq(0).text();



						this.$mainTarget.find('UL.clickable > LI').eq(indexNum).find('a')
							.append('<span>' + _countStr +  '件</span>').find('.info').text(_firstData);


				}else{

					var _con = $(niiObserver.Model.allResultList[2].items[indexNum].rdf.find('encoded').text() );
					_firstData = _con.children('dt').eq(1).next().text();//所属
					this.$mainTarget.find('UL.clickable > LI').eq(indexNum).find('.info').text(_firstData);

				}

			}
		},




		bottomAreaStatusChage: function (status) {
			var _$bottomloadBtn = this.$bottomTarget.children('.addloadbox');
			var _$bottomContent = this.$bottomTarget.children('.bottom_contents');

			var _$circleLoading = $('.CircleTarget', _$bottomContent);
			var _$loadingMess = $('.loadingMessage', _$bottomContent);
			var _$completeMess = $('.completeMessage', _$bottomContent);
			var _$noResultMess = $('.noResult', _$bottomContent);

			switch (status) {
				case 1:
					_$bottomloadBtn.show();//対読み込みボタン状態
					_$bottomContent.hide();
//					var _that = this;
//					_$bottomloadBtn.children('A').on('click', function () {
//						_that.loadFirstListXML();
//					});
					$('#navi LI').find('.miniCircleBase figure').fadeOut(300, function(){
						$(this).remove();
					});
					break;

				case 2:
					_$bottomloadBtn.hide();
					_$bottomContent.show();//loadingCircle状態
					_$circleLoading.show();
					_$loadingMess.show();
					_$completeMess.hide();
					_$noResultMess.hide();


					//
					$('#navi LI').find('.miniCircleBase figure').show().remove();
					var appendStra = '<figure class="lodingCircleSmall"></figure>';
					if(this.thisIsHitoMode > 0){
						$('#navi LI').eq(3).find('.miniCircleBase').append(appendStra);
					}else{
						$('#navi LI').eq(this.thisCategoryNum).find('.miniCircleBase').append(appendStra);
					}
//					loding
				break;

				case
				3
				:
					_$bottomloadBtn.hide();
					_$bottomContent.show();//元
					_$circleLoading.hide();
					_$loadingMess.hide();
					_$completeMess.show();// 全件表示
					_$noResultMess.hide();


					$('#navi LI').find('.miniCircleBase figure').remove();
					break;

				case
				4
				:
					_$bottomloadBtn.hide();
					_$bottomContent.show();
					_$circleLoading.hide();
					_$loadingMess.hide();
					_$completeMess.hide();
					_$noResultMess.show();// 該当なし

					$('#navi LI').find('.miniCircleBase figure').remove();
					break;

				default:
					_$bottomloadBtn.hide();//すべて表示から消す
					_$bottomContent.hide();
					break;
			}

		},
		bottomAreaNextLoadginCountChange: function (changeNum) {
			$('.addMessage SPAN', this.$bottomTarget).text(changeNum);
			$('.loadingMessage SPAN', this.$bottomTarget).text(changeNum);
		},
		bottomAreaCompleteTotalCountChange: function (totalCount) {
			$('.completeMessage SPAN', this.$bottomTarget).text(totalCount);
		},
		headTotalResultsShow: function (totalCount) {
			var ctgNamArr = ["論文", "図書", "研究"];
			var _ctgStr = "<span class='ctg"+this.thisCategoryNum+"'>"+ctgNamArr[this.thisCategoryNum]+"</span><span>";
			$('.totalResults').stop().show().html(_ctgStr + totalCount + " 件</span>");
		},
		headTotalResultsHide:function(){
			$('.totalResults').hide();
		},

		headTotalResultsHitoShow: function (totalCount) {
			$('#list_hito-' + this.thisCategoryNum).find('.hito_part_header SPAN').text(totalCount);
		},
		targetAllClear: function () {
			this.$mainTarget.children().remove();

			$('#list_aid_info').hide();

		}



	};//END ListViewClass

})();