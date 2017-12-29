<?php

$method = $_SERVER["REQUEST_METHOD"];

function findAll () {
  return jsonArray(execute("SELECT id, content, position, article_id FROM paragraphes ORDER BY position ASC"));
}

function findById ($id) {
  return jsonObject(execute("SELECT id, content, position, article_id FROM paragraphes WHERE id = :id", array("id" => $id)));
}

function update ($id, $doc) {
  $doc["id"] = $id;
  execute("UPDATE paragraphes SET content = :content, position = :position, article_id = :article_id WHERE id = :id", $doc);
  return findById($id);
}

function insert ($doc) {
  $id = executeWithId("INSERT INTO paragraphes (content, position, article_id) VALUES (:content, :position, :article_id)", $doc);
  return findById($id);
}

function delete ($id) {
  return execute("DELETE FROM paragraphes WHERE id = :id", array("id" => $id));
}

function paragraphes($method, $id) {
  try {
    switch ($method) {
      case "GET":
        if (isset($id)) {
          $doc = findById($id);
          if (!$doc) {
            http_response_code(404);
            $response["error"] = "Could not find record with ID " . $id;
          } else $response["data"] = $doc;
        } else $response["data"] = findAll();
        break;
      
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
      
      case "DELETE":
        $response["data"] = [];
        if (isset($id)) {
          delete($id);
        }
        break;
    }
  } catch (Exception $e) {
    http_response_code(500);
    $response["error"] = $e->getMessage();
  }

  return $response;
}

?>