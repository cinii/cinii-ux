(function () {
	var uaChk = window.navigator.userAgent.toLowerCase();
	if (uaChk.indexOf('ipad; cpu os 5') > -1 || uaChk.indexOf('cpu os 4') > -1) {
		alert("このプロトタイプは、iPad: iOS6 以上を対象としています。");
		console.log("このプロトタイプは、iPad: iOS6 以上を対象としています。");
	}
})();


if (window.navigator.standalone) {//スタンドアローン（ホームアプリ状態の場合）
	//alert("只今、スタンドアローン・アプリとして起動しています。");
	console.log("只今、スタンドアローン・アプリとして起動しています。");
}


var ciNiiCtrlObj = {
	currentRotation: -1,
	onChkRotationEvnet: function () {//=== 画面の回転判定
		var _cr = window.orientation;
		if (_cr != this.currentRotation) {//=== 回転角度変更ならば　初回時 -1 なので必ず
			if (Math.abs(_cr) != 90) {
				//alert("このCiNiiプロトタイプ UI は、iPad ランドスケープモード（横長）状態に最適化しています。横長モードでお使い下さい。");
			}
			this.currentRotation = _cr;
		}
	},
	init: function () {//=== 時間差で処理
		//post setting
		if (window.orientation != null) {//window.orientation = 0 の場合がある
			$(window).bind("resize", this.onChkRotationEvnet);//onorientationchange not work
			this.onChkRotationEvnet();
		}
		console.log("external JS");
	}
};
