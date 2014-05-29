/**
 * Created with IntelliJ IDEA.
 * Date: 13/08/14
 * Time: 1:53
 */




(function () {//niiLib.createChain(元)
	"use strict";
	var _rt = window;
	_rt.Object.create = function (o) {
		"use strict";
		var f;
		var F = function () {
		};
		F.prototype = o;
		f = new F();
		f.init(arguments.length > 1 ? arguments[1] : undefined);
		return f;
	};
})();

var CONST_IS_NOT_IE = 1;// IEだったら0 childNodes[CONST_IS_NOT_IE] で使う
if(/*@cc_on!@*/false){
	CONST_IS_NOT_IE = 0;
}




jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
	{
		def: 'easeOutQuint',
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	});
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */




var niiObserver = {};

niiObserver.Model = function () {
};
niiObserver.View = function () {
};
niiObserver.Controller = function () {
};
niiTemplate = {};


$(function () {//-------------
	niiObserver.View.layoutInit();
	niiObserver.View.domReady();//jquery Object Initialize



	//test DOMのテスト★★消すこと
//
//	var tt = document.getElementById("left_wrapper");
//	alert($(tt.childNodes[1]));
//	console.log($(tt.childNodes[1]));
});

/*

$(function () {//--------------------　画面レイアウト

	var fit_heightObj = $('.js_fitHeight', '#container');
	var fit_left_syousai = $('.js-left-target');// js_leftは消去
	var headerHeight = 0;
	if (window.navigator.standalone) {//アプリモードの場合
		headerHeight = 20;
		$('body').css('padding-top', headerHeight + 'px');
		headerHeight = 20;
	}
	headerHeight += $('#header').height();


	function resizeFunc() {//private
		"use strict";
		var _h = $(window).height() - headerHeight;
		fit_heightObj.height(_h);
		fit_left_syousai.css("min-height", (_h + 34) + "px");
	}

	$(window).resize(function () {
		resizeFunc();
	});

	resizeFunc();
});//End DOM ready
*/


niiObserver.Controller = $.extend({}, niiObserver.Controller, {//外部JS読み込み init()元のオブジェクト名が必要
	loadExternalScript: function (src, funObjNameStr) {
		$.ajax({
			scriptCharset: "UTF-8",
			dataType: "script",
			cache: false,//true// 変更無しの場合は、tureに
			crossDomain: true,
			url: src
		}).done(function (script, textStatus) {
				//console.log("outter js = " + textStatus);
				if (funObjNameStr) {
					window[funObjNameStr].init();
				} else {
					ciNiiCtrlObj.init();// to ./js/ciNiiLibUtilitySet.js
				}
			});
	}
});


//------LAST

$(function () {//--------------------補助要素の外部Javascriptを読み込み ready終了後900msディレイ ※キャッシュから
	setTimeout(function () {
		niiObserver.Controller.loadExternalScript("./js/ciNiiLibUtilitySet.js", 'ciNiiCtrlObj');
	}, 400);
});

