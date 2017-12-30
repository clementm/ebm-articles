# EBM 2017/2018 - Devoir final

Une démonstration du projet est disponible ici : http://ebm.clementmichel.ovh/

## Exécution du projet

1. Installer les dépendances : `npm i`
2. Démarrer un serveur php avec la commande `php -S localhost:7000 index.php`
3. Lancer le serveur Webpack avec la commande `npm start`
4. Ouvrir l'URL http://localhost:8080

En production, compiler le bundle JS avec la commande `npm run build`

## Présentation de l'architecture technique du projet

Le projet réalisé met en œuvre les nouvelles pratiques de développement front-end en utilisant **Babel** et **Webpack**. 

L'utilisation de Babel permet de transpiler certains éléments de syntaxe du code JavaScript, issus des dernières spécifications ECMAScript, tout en supportant le plus possible de navigateurs. Il permet également d'adopter de nouvelles syntaxes non spécifiées comme par exemple l'opérateur spread pour les objets (cf. `frontend/article.js`).

Webpack permet la mise en place d'une structure modulaire du code source du projet, en séparant l'implémentation des différents composants (article, zone de notifications, barre de menu) dans des fichiers CSS et JS distincts. La compilation consiste à parcourir les différents fichiers sources, en suivant les directives d'import, à partir du point d'entrée spécifié dans le fichier de configuration (`frontend/index.js`). Chaque fichier subit une transformation en fonction de son type : Babel pour les fichiers JS, CSS-loader pour les fichiers CSS, et le résultat est concaténé dans un fichier de paquetage (ex : `bundle.js`).

La configuration Webpack mise en place dans ce projet est volontairement simpliste, et nécessiterait de nombreux ajustements pour une utilisation en production (minification du code, ...).

## Présentation de la partie back-end

La partie back-end a été modifié en profondeur par rapport au projet initial, pour permettre notamment la mise en place d'une API REST. De manière à concilier le fonctionnement du serveur intégré à la version 7 de PHP pour le développement, ainsi que les fonctionnalités de réecriture d'URL d'Apache en production, le fichier index.php sert de point d'entrée à l'ensemble des requêtes.  L'URL de la requête est analysée pour identifier 3 cas de figure :

- La requête porte sur l'API (`/api/...`) : on appelle alors le fichier `api.php` pour prendre le relai en identifiant le point d'entrée (articles ou paragraphes) et les verbes HTTP associés.
- La requête porte sur un fichier statique, auquel cas celui-ci est renvoyé directement au client
- Dans tous les autres cas, le fichier index.html de la partie front-end est renvoyé, pour passer le relai au routeur JavaScript

Un fichier `.htaccess` à la racine permet, lorsque le projet est servi par l'intermédiaire d'un serveur Apache, de rediregier les requêtes vers le fichier `index.php`.

L'API du projet est donc structurée à la manière d'une API Rest, les routes étant les suivantes :

- `/articles` : 
  - `GET` : liste des articles
  - `POST` : ajout d'un article
- `/articles/:id` :
  - `GET` : récupération d'un article
  - `POST` : modification d'un article
  - `DELETE` : suppression d'un article
- `/paragraphes` : 
  - `GET` : liste des paragraphes
  - `POST` : ajout d'un paragraphe
- `/paragraphes/:id` :
  - `GET` : récupération d'un paragraphe
  - `POST` : modification d'un paragraphe
  - `DELETE` : suppression d'un paragraphe

## Présentation de la partie front-end

Lors de la conception de la partie front-end, l'accent a été mis sur la séparation du code en composants distincts pour permettre une meilleure encapsulation du code ainsi qu'une meilleure séparation des responsabilités. Trois composants ont été ainsi isolés : 

 - `toolbar` : barre en haut de l'écran permettant de sélectionner ou ajouter un article
 - `article` : zone au centre de l'écran permettant la consultation et la modification 
 - `notifications` : zone de notification permettant d'afficher les erreurs survenues, notamment lors des appels REST
 
Un troisième composant pourrait être identifié dans le fichier `editor.js`, qui représente un paragraphe au sein d'un article et prend en charge notamment les aspects d'édition du paragraphe.

Certains éléments du code ont également été isolés dans des services séparés, pour faciliter la réutilisation des fonctionnalités qu'ils exposent à différents endroits du projet :
  - `api` : permet la récupération des ressources depuis l'API REST
  - `history` : fournit l'interface de routage pour la partie front-end
  - `notifications` : centralise la gestion des notifications au moyen d'un gestionnaire d'évènements, ce qui permet de découpler la publication des messages d'erreur et leur affichage, permettant potentiellement à plusieurs composants/services de consommer les messages publiés

### Routage fron-end

La partie front-end du projet expose plusieurs routes :

- `/` : la page d'accueil, avec un placeholder invitant à sélectionner un article depuis la barre de menu
- `/articles/:id?mode` : la page de consultation d'un article, le paramètre `id` représentant l'ID de l'article et le paramètre mode indiquant s'il s'agit d'une cosultation ou d'une édition

La mise en place de ce routage offre plusieurs avantages :
- L'état de l'application est ainsi partiellement stocké dans l'URL de la page, ce qui permet de le centraliser et le rend accessible à chaque composant. Ainsi, les composants des paragraphes utilisent l'URL pour déterminer à partir du paramètre mode s'ils doivent être éditables ou non, par exemple.
- Les états de l'application représentés par une URL sont directement accessibles en accédant à celle-ci : si l'utilisateur saisit directement l'URL /articles/12?mode=edition dans la barre d'URL, l'article 12 sera immédiatement ouvert en mode édition.
- Lors de la sélection d'un article, la barre de menu a pour seule responsabilité de modifier l'URL pour que le composant permettant d'afficher un article mette en place la vue correspondante et récupère les données associées : on obtient ainsi une meilleure séparation des responsabilités.

L'API du navigateur permet également une gestion fine de l'historique avec les méthodes `pushState` et `popState`, permettant respectivement d'ajouter l'URL sur la pile de l'historique de navigation, ou de remplacer la dernière entrée par l'URL actuelle. Ainsi, si on passe d'un articl à l'autre, l'URL change et l'utilisation de la touche "précédent" du navigateur permet de retourner à l'article précédent. Inversement, si on passe du mode consultation au mode édition, l'URL change mais l'entrée est simplement remplacée dans l'historique pour éviter que de multiples passages successifs du mode édition au mode consultation ne pollue l'historique de navigation.

Concrètement, les composants qui sont associés à une URL particulière ou qui dépendent de l'URL déclarent la route correspondante auprès du service `History` de la manière suivante : 

```javascript
Route('/articles/:id', ({ id }) => {
	// Modification de la vue
});
```

La méthode `Route` est appelée avec en premier argument l'URL avec les placeholders correspondant aux paramètres de l'URL. Le deuxième argument correspond à la callback qui sera appelée lorsque l'URL change et que la nouvelle URL correspond à celle précédemment indiquée, avec en argument les valeurs des paramètres. Le composant peut alors faire les modifications qui s'imposent.