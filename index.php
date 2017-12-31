<?php
    $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    if (preg_match("/^\/api/i", $path)) {
      // Si le chemin correspond à une route d'API, on appelle le fichier api.php
      include "./api/api.php";
    } else if ($path != "/" && file_exists("public" . $path)) {
      // Sinon, on vérifie s'il correspond à un fichier statique pour l'envoyer
      echo file_get_contents("public" . $path);
    } else {
      // Sinon, il s'agit d'une URL interne à la partie frontend de l'application
      // On renvoie le fichier index.html
      include "./public/index.html";
    }
?>
