/**
 * Created with IntelliJ IDEA.
 * Date: 13/08/14
 * Time: 7:28
 */

(function () {//
	"use strict";
	var _rt = window;
	var _modelObj = {
		init: function () {//　コンストラクタ

		},
		currnetTabModeNum: 0,
		defaultSelectedCounter:0,

		searchObj: {
			keywords: "",
			default: "ddddd",
			aid:"",
			param:{},// ほかのパラメータを入れる1111
		},
		searchHistoryArr:[],

		allResultList: [],// すべてのマスター
		quick: [],// 総数のクイック検索用 　0-3の4種類

		resetSearchObj:function(){
			this.searchObj = {
				keywords: "",
				default: "ddddd",
				aid:"",
				param:{},// ほかのパラメータを入れる
			};
		}
	};
	if(niiObserver){
		niiObserver.Model = $.extend(Object.create(_modelObj, {}), {
			//
		});
	}
})();