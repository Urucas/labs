<?php
if (isset($GLOBALS["HTTP_RAW_POST_DATA"])) {
	$imageData=$GLOBALS['HTTP_RAW_POST_DATA'];
	$filename= md5($imageData).".png";
  $filteredData=substr($imageData, strpos($imageData, ",")+1);
  $unencodedData=base64_decode($filteredData);
  $fp = fopen('img/tmps/'.$filename, 'wb' );
  fwrite( $fp, $unencodedData);
  fclose( $fp );

  die(json_encode(array("filename"=>$filename)));
}
?>
