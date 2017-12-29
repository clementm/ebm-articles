<?php
    $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    if (preg_match("/^\/api/i", $path)) {
      include "./api/api.php";
    } else {
      return false;
    }
?>