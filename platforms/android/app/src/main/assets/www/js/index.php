<?php

foreach (new DirectoryIterator(__DIR__) as $file) {
  if ($file->isFile()) {
      $filename = $file->getFilename();
	  echo 'include("'.$filename.'");<br>';
  }
}

?>