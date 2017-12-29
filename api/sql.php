<?php
include "config.php"; 

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

function jsonArray($result) {
  $result->setFetchMode(PDO::FETCH_ASSOC);
  $collection = [];

	while ($doc = $result->fetch()) 
		$collection[] = $doc;

	return $collection;
}

function jsonObject($result) {
  return $result->fetch(PDO::FETCH_ASSOC);
}