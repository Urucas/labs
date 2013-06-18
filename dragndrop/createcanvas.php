<?php 
if(isset($_GET['imgURL'])) {

	$data = file_get_contents($_GET['imgURL']);
	$filename = md5($_GET['imgURL']).".png";
	$fp = fopen('img/fbtmps/'.$filename, 'wb' );
	fwrite( $fp, $data);
  	fclose( $fp );

	die("img/fbtmps/$filename");
}
