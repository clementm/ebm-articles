<?php

/**
 * Méthodes d'abstraction pour l'exécution des requêtes SQL
 */

include "config.php"; 

/**
 * Permet d'exécuter une requête SQL à partir d'une chaîne de caractères
 * et d'un tableau associatif de paramètres représentant les données
 * utilisateur à manipuler (permet d'éviter les injections SQL).
 * 
 * Renvoie la requête exécutée
 */
function execute($query, $parameters = array()) {
  global $BDD_host;
  global $BDD_base;
  global $BDD_user;
  global $BDD_password;

  $dbh = new PDO("mysql:host=$BDD_host;dbname=$BDD_base", $BDD_user, $BDD_password);
  $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES,false); 
  $dbh->exec("SET CHARACTER SET utf8");

  $query = $dbh->prepare($query);

  if (!$query) {
    $e = $dbh->errorInfo();
    throw new Exception($e[2], $e[1]);
  }

  $query->execute($parameters);

  return $query;
}

/**
 * Permet d'exécuter une requête SQL à partir d'une chaîne de caractères
 * et d'un tableau associatif de paramètres représentant les données
 * utilisateur à manipuler (permet d'éviter les injections SQL).
 * 
 * Renvoie le dernier ID inséré dans la base de données (utile pour 
 * l'insertion de nouvelles lignes)
 */
function executeWithId($query, $parameters = array()) {
  global $BDD_host;
  global $BDD_base;
  global $BDD_user;
  global $BDD_password;

  $dbh = new PDO("mysql:host=$BDD_host;dbname=$BDD_base", $BDD_user, $BDD_password);
  $dbh->exec("SET CHARACTER SET utf8");

  $query = $dbh->prepare($query);

  $query->execute($parameters);

  return $dbh->lastInsertId();
}

/**
 * Renvoie une liste de résultat à partir d'une requête exécutée
 */
function jsonArray($result) {
  $result->setFetchMode(PDO::FETCH_ASSOC);
  $collection = [];

	while ($doc = $result->fetch()) 
		$collection[] = $doc;

	return $collection;
}

/**
 * Renvoie un résultat unique sous forme d'objet à partir d'une requête
 * exécutée
 */
function jsonObject($result) {
  return $result->fetch(PDO::FETCH_ASSOC);
}