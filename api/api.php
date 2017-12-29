<?php 

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

include "sql.php";

if (preg_match("/^\/api\/([^\/]+)(?:\/([^\/]+))?/i", $path, $matches)) {
  // penser à maj le nom de la base et le mot de passe

  $type = $matches[1];
  $id = isset($matches[2]) ? $matches[2] : null;

  switch ($type) {
    case "paragraphes":
      include "paragraphes.php";

      echo json_encode(paragraphes($method, $id));
      break;
    
    case "articles":
      include "articles.php";

      echo json_encode(articles($method, $id));
      break;
  }
}