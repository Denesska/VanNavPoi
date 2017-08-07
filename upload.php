<?php
header("Content-type: application/javascript");

$c = $_GET['a'];
    if($c == "data_list"){
        $url = "http://vanillanav.rosoftlab.net/api/v2/venue/5949";
    }else{
        echo "fucking error!!";
    }
    $handle = fopen($url, "r");

    if($handle) {
        while (!feof($handle)){
            $buffer = fgets($handle, 4096);
            echo $buffer;
        }
        fclose($handle);
    }