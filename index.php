<?php
    $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    if (preg_match("/^\/api/i", $path)) {
      include "./api/api.php";
    } else if ($path != "/" && file_exists("public" . $path)) {
      echo file_get_contents("public" . $path);
    } else {
      include "./public/index.html";
    }
?>
