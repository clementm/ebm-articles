<?php

$method = $_SERVER["REQUEST_METHOD"];

/**
 * Récupère les articles en base ainsi que les 200 premiers caractères 
 * de son contenuqui leurs sont associés, en les ordonnant par date de
 * création
 */
function findAll () {
  return jsonArray(execute("
    SELECT articles.id, title, creation_date, CONCAT(LEFT(GROUP_CONCAT(paragraphes.content SEPARATOR '\n'), 200), '...') as summary, COUNT(paragraphes.id) as nb_paragraphes
    FROM articles
    LEFT JOIN paragraphes ON paragraphes.article_id = articles.id
    GROUP BY articles.id
    ORDER BY creation_date ASC
  "));
}

/**
 * Récupère les articles en base ainsi que les 200 premiers caractères 
 * de son contenuqui leurs sont associés, en les ordonnant par date de
 * création
 * 
 * Le paramètre $query permet de filtrer les articles en fonction de leur
 * titre
 */
function findAllWithFilter ($query) {
  return jsonArray(execute("
    SELECT articles.id, title, creation_date, CONCAT(LEFT(GROUP_CONCAT(paragraphes.content SEPARATOR '\n'), 200), '...') as summary, COUNT(paragraphes.id) as nb_paragraphes
    FROM articles
    LEFT JOIN paragraphes ON paragraphes.article_id = articles.id
    WHERE articles.title LIKE :title_filter
    GROUP BY articles.id
    ORDER BY creation_date ASC",
    array("title_filter" => "%" . $query . "%")
  ));
}

/**
 * Permet de traiter une liste de lignes SQL correspondant à un article
 * et un de ses paragraphes pour renvoyer une liste de paragraphes
 */
function pReduce($acc, $row) {
  if ($row["p_id"]) $acc[] = array(
    "id" => $row["p_id"],
    "article_id" => $row["id"],
    "content" => $row["p_content"],
    "position" => $row["p_position"]
  );

  return $acc;
}

/**
 * Récupère un article à partir de son ID ainsi que les paragraphes associés
 */
function findById ($id) {
  $rows = jsonArray(execute("
    SELECT 
      articles.id as id, title, creation_date,
      paragraphes.id as p_id, paragraphes.content as p_content, paragraphes.position as p_position
    FROM articles
    LEFT JOIN paragraphes ON paragraphes.article_id = articles.id
    WHERE articles.id = :id
    ORDER BY position
  ", array("id" => $id)));

  if (count($rows) < 1) return;

  return array(
    "id" => $rows[0]["id"],
    "title" => $rows[0]["title"],
    "creation_date" => $rows[0]["creation_date"],
    "paragraphes" => array_reduce($rows, "pReduce", [])
  );
}

/**
 * Modifie les détails d'un article
 */
function update ($id, $doc) {
  execute("UPDATE articles SET title = :title WHERE id = :id", array("title" => $doc->title, "id" => $id));
  return findById($id);
}

/**
 * Ajoute un nouvel article
 */
function insert ($doc) {
  $id = executeWithId("INSERT INTO articles (title, creation_date) VALUES (:title, NOW())", array("title" => $doc->title));
  return findById($id);
}

/**
 * Supprime un article
 */
function delete ($id) {
  return execute("DELETE FROM articles WHERE id = :id", array("id" => $id));
}

/**
 * Méthode principale de l'API articles, prenant en paramètre la méthode
 * de requête (GET, POST, DELETE), et appelant les méthodes SQL
 */
function articles($method, $id) {
  try {
    switch ($method) {
      // Récupération d'un article ou d'une liste d'articles
      case "GET":
        if (isset($id)) {
          $doc = findById($id);
          if (!$doc) {
            http_response_code(404);
            $response["error"] = "Could not find record with ID " . $id;
          } else $response["data"] = $doc;
        } else if (isset($_GET["query"])) $response["data"] = findAllWithFilter($_GET["query"]);
        else $response["data"] = findAll();
        break;
        
      // Modification ou ajout d'un article
      case "POST":
        $doc = json_decode(file_get_contents("php://input"));
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
      
      // Suppression d'un article
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