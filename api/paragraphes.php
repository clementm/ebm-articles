<?php

$method = $_SERVER["REQUEST_METHOD"];

/**
 * Récupère tous les paragraphes présents dans la base de donnée
 */
function findAll () {
  return jsonArray(execute("SELECT id, content, position, article_id FROM paragraphes ORDER BY position ASC"));
}

/**
 * Récupère un paragraphe à partir de son ID
 */
function findById ($id) {
  return jsonObject(execute("SELECT id, content, position, article_id FROM paragraphes WHERE id = :id", array("id" => $id)));
}

/**
 * Modifie un paragraphe à partir de son ID
 */
function update ($id, $doc) {
  $doc["id"] = $id;
  execute("UPDATE paragraphes SET content = :content, position = :position, article_id = :article_id WHERE id = :id", $doc);
  return findById($id);
}

/**
 * Insère un nouveau paragraphe dans la base de données
 */
function insert ($doc) {
  $id = executeWithId("INSERT INTO paragraphes (content, position, article_id) VALUES (:content, :position, :article_id)", $doc);
  return findById($id);
}

/**
 * Supprime un article de la base de données
 */
function delete ($id) {
  return execute("DELETE FROM paragraphes WHERE id = :id", array("id" => $id));
}


/**
 * Méthode principale de l'API paragraphes, prenant en paramètre la méthode
 * de requête (GET, POST, DELETE), et appelant les méthodes SQL
 */
function paragraphes($method, $id) {
  try {
    switch ($method) {
      // Récupération d'un paragraphe ou d'une liste de paragraphes
      case "GET":
        if (isset($id)) {
          $doc = findById($id);
          if (!$doc) {
            http_response_code(404);
            $response["error"] = "Could not find record with ID " . $id;
          } else $response["data"] = $doc;
        } else $response["data"] = findAll();
        break;
      
      // Modification ou création d'un paragraphe
      case "POST":
        $doc = json_decode(file_get_contents("php://input"), true);
        if (isset($id)) {
          $doc = update($id, $doc);
          if (!$doc) {
            http_response_code(404);
            $response["error"] = "Could not find record with ID " . $id;
          } else $response["data"] = $doc;
        } else {
          $response["data"] = insert($doc);
        }
        break;
      
      // Suppression d'un paragraphe
      case "DELETE":
        $response["data"] = [];
        if (isset($id)) {
          delete($id);
        }
        break;
    }
  } catch (Exception $e) {
    // En cas d'erreur, on renvoit un code erreur adapté avec le message
    // d'erreur obtenu
    http_response_code(500);
    $response["error"] = $e->getMessage();
  }

  return $response;
}

?>