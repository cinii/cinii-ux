<?php
    //ソケットでデータを取得
    function data_get($url,$authuser="",$authpass=""){
        unset($basic);
         
        $tmp = parse_url($url);
         
        if(@$tmp[query]){
            @$tmp[path] = @$tmp[path]."?".@$tmp[query];
        }
         
        $fp = fsockopen($tmp["host"], 80, $errno, $errstr, 4); // 80番ポートに接続
         
        if(!$fp){
            //print $errno.":".$errstr; // これでエラー内容表示されるはず
            return array("status" => "connect_fail","msg" => $errstr);
        }
         
        $out = "GET {$tmp['path']} HTTP/1.1\r\n";
        $out .= "Host: {$tmp['host']}\r\n";
        $out .= "User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)\r\n";
         
        if($authuser){
            $out .= "Authorization: Basic ".base64_encode($authuser.":".$authpass)."\r\n"; 
        }
 
        $out .= "Connection: Close\r\n\r\n";
         
        fwrite($fp, $out);
        stream_set_timeout($fp, 4);
         
        //コンテンツ部分の受信
        $in = '';
        while (!feof($fp)) {
            $in .= fgets($fp, 4096);
        }
        fclose($fp);
         
        //ヘッダーとコンテンツ部分に分割
        $in = explode("\r\n\r\n",$in);
         
        //ヘッダーを配列に格納
        $info = decode_header($in[0]);
         
        //デコード
        unset($in[0]);//ヘッダー削除
        $in = join("\r\n\r\n",$in);
        $body = decode_body($info, $in);
         
        return mb_convert_encoding($body, "UTF-8","ASCII,JIS,UTF-8,EUC-JP,SJIS");
    }
     
    function decode_header($str){
        //<CRLF>ごとに分割
        $part = preg_split("/\r\n/", $str, -1, PREG_SPLIT_NO_EMPTY);
        $out = array ();
        for ($h = 0; $h < sizeof($part); $h++) {
            if ($h != 0) {
                // ：で区切ってkeyとvalueを作成
                $pos = strpos($part[$h], ':');
                $k = strtolower(str_replace(' ', '', substr($part[$h], 0, $pos)));
                $v = trim(substr($part[$h], ($pos + 1)));
            } 
            else{
                //1行目ステータスコード
                $k = 'status';
                $v = explode (' ', $part[$h]);
                $v = $v[1];
            }
             
            //keyとvalueを配列に格納
            if ($k == 'set-cookie') {
                $out['cookies'][] = $v;
            } 
            elseif ($k == 'content-type') {
                if (($cs = strpos($v, ';')) !== false) {
                    //目的が解析なのでサブタイプは切り捨てない
                    $out[$k] = $v;
                }
                else{
                    $out[$k] = $v;
                }
            }
            else{
                $out[$k] = $v;
            }
        }
         
        return $out;
    }
     
    function decode_body ($info, $str, $eol = "\r\n"){
        $tmp = $str;
        $add = strlen($eol);
         
        //チャンク形式の判定
        if (isset($info['transfer-encoding']) && $info['transfer-encoding'] == 'chunked') {
            do {
                //チャンクサイズ取得してを10進数に変換
                $tmp = ltrim($tmp);
                $pos = strpos($tmp, $eol);
                $len = hexdec(substr($tmp, 0, $pos));
                 
                //圧縮転送されている場合解凍する
                if (isset($info['content-encoding'])) {
                    $str2 .= gzinflate(substr($tmp, ($pos + $add + 10), $len));
                } 
                else{
                    $str2 .= substr($tmp, ($pos + $add), $len);
                }
                 
                $tmp = substr($tmp, ($len + $pos + $add));
                $check = trim($tmp);
            } while (!empty($check));
             
        }
        elseif(isset($info['content-encoding'])) {
        //圧縮転送されている場合解凍する
            $str2 = gzinflate(substr ($tmp, 10));
        }
        else{
            $str2 = $str;
        }
         
        return $str2;
    }
?>