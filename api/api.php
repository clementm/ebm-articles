<?php 

/**
 * Point d'entrée de l'API
 */

// On récupère le chemin de la requête
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

include "sql.php";

// On extrait du chemin le nom de la ressource (paragraphe ou articles)
// et l'ID éventuellement fourni
if (preg_match("/^\/api\/([^\/]+)(?:\/([^\/]+))?/i", $path, $matches)) {

  $type = $matches[1];
  $id = isset($matches[2]) ? $matches[2] : null;

  // Selon le type extrait, on appelle la méthode du fichier correspondant
  // et on renvoit la réponse encodée en JSON
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