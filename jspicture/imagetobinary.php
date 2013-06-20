<?php 

	if(isset($_GET['imgURL'])) {
	
		$source = file_get_contents($_GET['imgURL']);
		$type   = exif_imagetype($_GET['imgURL']);

		$mime   = image_type_to_mime_type($type);
		$base64   = base64_encode($source); 
		die('data:' . $mime . ';base64,' . $base64);
	}


?>
