# EBM 2017/2018 - Devoir final

*Auteur : Clément Michel*

Avant toute chose, bonne année 2018 ! :)

Une démonstration du projet est disponible ici : http://ebm.clementmichel.ovh/

## Exécution du projet

1. Installer les dépendances : `npm i`
2. Démarrer un serveur webpack et le serveur php avec la commande : `npm start`
3. Ouvrir l'URL http://localhost:8080

Le serveur webpack et le serveur php peuvent également être lancés indépendamment avec les commandes : `npm run php` et `npm run webpack`

En production, compiler le bundle JS avec la commande : `NODE_ENV=production npm run build`

## Présentation de l'architecture technique du projet

Le projet réalisé met en œuvre les nouvelles pratiques de développement front-end en utilisant **Babel** et **Webpack**. 

L'utilisation de Babel permet de transpiler certains éléments de syntaxe du code JavaScript, issus des dernières spécifications ECMAScript, tout en supportant le plus possible de navigateurs. Il permet également d'adopter de nouvelles syntaxes non spécifiées comme par exemple l'opérateur spread pour les objets (cf. `frontend/article.js`).

Webpack permet la mise en place d'une structure modulaire du code source du projet, en séparant l'implémentation des différents composants (article, zone de notifications, barre de menu) dans des fichiers CSS et JS distincts. La compilation consiste à parcourir les différents fichiers sources, en suivant les directives d'import, à partir du point d'entrée spécifié dans le fichier de configuration (`frontend/index.js`). Chaque fichier subit une transformation en fonction de son type : Babel pour les fichiers JS, CSS-loader pour les fichiers CSS, et le résultat est concaténé dans un fichier de paquetage (ex : `bundle.js`, `bundle.css`).

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
    
    Exemple de réponse : 
    ```json
    {
      data: [
        {
          id: 29,
          title: "Mon article",
          creation_date: "2017-12-29 17:51:17",
          summary: "Premier paragraphe ! :) Deuxième paragraphe... Tentative de modification ? Modification réussie :D...",
          nb_paragraphes: 3
        },
        {
          id: 30,
          title: "Deuxième article",
          creation_date: "2017-12-29 17:53:26",
          summary: "Unique paragraphe...",
          nb_paragraphes: 1
        }
      ]
    }
    ```
  - `POST` : ajout d'un article, l'article à insérer est passé dans le corps de la requête, la réponse correspond à l'article inséré avec son ID auto-généré
  
- `/articles/:id` :
  - `GET` : récupération d'un article
    
    Exemple de réponse : 
    ```json
    {
      data: {
        id: 29,
        title: "Mon article",
        creation_date: "2017-12-29 17:51:17",
        paragraphes: [
          {
            id: 46,
            article_id: 29,
            content: "Premier paragraphe ! :)",
            position: 0
          },
          {
            id: 48,
            article_id: 29,
            content: "Tentative de modification ? Modification réussie :D",
            position: 2
          },
          {
            id: 47,
            article_id: 29,
            content: "Deuxième paragraphe...",
            position: 3
          }
        ]
      }
    }
    ```
  - `POST` : modification d'un article
  - `DELETE` : suppression d'un article
- `/paragraphes` : 
  - `GET` : liste des paragraphes

    Exemple de réponse :
    ```json
    {
      data: [
        {
          id: 46,
          content: "Premier paragraphe ! :)",
          position: 0,
          article_id: 29
        },
        {
          id: 49,
          content: "Unique paragraphe",
          position: 0,
          article_id: 30
        },
        {
          id: 48,
          content: "Tentative de modification ? Modification réussie :D",
          position: 2,
          article_id: 29
        },
        {
          id: 47,
          content: "Deuxième paragraphe...",
          position: 3,
          article_id: 29
        }
      ]
    }
    ```
  - `POST` : ajout d'un paragraphe, le paragraphe à insérer est passé dans le corps de la requête, la réponse correspond au paragraphe inséré avec son ID auto-généré
- `/paragraphes/:id` :
  - `GET` : récupération d'un paragraphe
    Exemple de réponse :
    ```json
    {
      data: {
        id: 46,
        content: "Premier paragraphe ! :)",
        position: 0,
        article_id: 29
      }
    }
    ```
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

Les détails d'implémentation ne sont pas repris dans ce rapport et peuvent être explorés à partir des commentaires présents dans le code.

### Routage front-end

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

## Perspectives d'amélioration

1. Le premier aspect susceptible d'être amélioré dans le projet concerne la configuration Webpack, notamment pour l'utilisation du projet dans un environnement de production. Par exemple, un plugin pourrait être ajouté pour permettre la minification du code JS et CSS.

2. La structure du code front-end pourrait également être modifiée pour permettre une meilleure isolation et réutilisabilité des composants. Actuellement chaque composant récupère une partie du template HTML de la page et agit sur ce template. Si on souhaitait insérer plusieurs fois le même composant, il y aurait des conflits de fonctionnement. On pourrait séparer le template de chaque composant dans un fichier séparé (en utilisant par exemple un plugin webpack pour charger un code HTML), et définir chaque composant comme une classe qu'on instancierait en lui passant un point de montage dans la page (i.e. un sélecteur d'élément DOM à l'intérieur duquel s'instancier)

3. Une autre perspective d'amélioration consisterait à mieux prendre en charge les cas où un appel à l'API renvoie une erreur, tout en gardant une bonne réactivité de l'interface. En utilisant les concepts de l'Optimistic UI, on pourrait concevoir une interface répercutant immédiatemment comme actuellement les changements faits par l'utilisateur sur l'interface, effectuant les appels à l'API en arrière-plan. Lorsqu'une erreur survient dans une requête, l'interface doit être capable de revenir au dernier état consistant (c'est-à-dire, le dernier état correspondant à l'envoi d'une requête acceptée). L'intérêt d'une telle approche repose sur le fait que la probabilité qu'une erreur survienne est normalement faible. La mise en place effective de cette approche est néanmoins potentiellement complexe et est plus facilement simple dans une architecture offrant une meilleure séparation entre état (données) et interface (composants), comme avec React et Redux.

4. On pourrait également rendre l'application disponible hors connexion, pour permettre à l'utilisateur d'accéder à ses articles et préparer les prochains lorsqu'un accès internet n'est pas disponible. Il conviendrait d'utiliser pour cela des "service workers" : https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API. Cela nécessiterait également d'être capable de réconcilier l'état des données du serveur avec celui des données stockées localement en cache lors de la reconnexion, notamment lorsqu'ils ont divergés car ayant été modifiés des deux côtés.

## Bilan du module Frontend-Backend

Le module Frontend-Backend est une bonne introduction au fonctionnement des techonologies Web, pour bien comprendre le fonctionnement du protocole HTTP d'une part, ainsi que la structure d'une application web. La présentation des 3 couches (structure en HTML, présentation en CSS, interaction en JS) permet de bien comprendre le rôle de chaque langage et comment ils interagissent. L'utilisation de la librarie JQuery permet de découvrir comment l'utilisation de librairies JavaScript peut faciliter le développement, et unifier les APIs parfois divergentes offertes par chaque navigateur.

Si les structures/outils vues au cours de ce module permettent de développer facilement une page web enrichie et interactive, il manque plusieurs aspects du développement d'application web abordés plus tard à l'occasion du cours sur JS avancé :
  - Les nouvelles pratiques de développement front-end introduites dans ce projet : utilisation de modules NPM, de "bundlers" comme Webpack, d'outils de transpilation comme Babel ou TypeScript
  - L'utilisations de librairies/frameworks de développement front-end avancés : React, Angular, ou VueJS. Ces outils permettent une meilleure structuration du code front-end en séparant les éléments de code en composants et services, permettant une meilleure réutilisabilité et encapsulation du code. React offre notamment une approche de développement état-composant différente de l'approche traditionnelle MVC, qui s'applique avantageusement au développement d'interfaces web. L'utilisation de ces outils améliore bien souvent la qualité du code produit pour des projets de grande taille.

Bien sûr, l'utilisation de ces outils nécessite avant tout de bien comprendre le fonctionnement d'une page web (éléments HTML, positionnement et décoration CSS), la manipulation du DOM avec le langage JavaScript. C'est ce que permet ce premier module de développement web.