<?php
    $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    if (preg_match("/^\/api/i", $path)) {
      include "./api/api.php";
    } else if ($path != "/" && file_exists(substr($path, 1))) {
      echo file_get_contents(substr($path, 1));
      return false;
    } else {
      include "./frontend/index.html";
    }
?>
