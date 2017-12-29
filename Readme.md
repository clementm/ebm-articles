# EBM 2017/2018 - Devoir final

## Présentation du projet

Le projet réalisé met en œuvre les nouvelles pratiques de développement front-end en utilisant **Babel** et **Webpack**. 

L'utilisation de Babel permet de transpiler certains éléments de syntaxe du code JavaScript, issus des dernières spécifications ECMAScript, tout en supportant le plus possible de navigateurs. Il permet également d'adopter de nouvelles syntaxes non spécifiées comme par exemple l'opérateur spread pour les objets (cf. `frontend/article.js`).

Webpack permet la mise en place d'une structure modulaire du code source du projet, en séparant l'implémentation des différents composants (article, zone de notifications, barre de menu) dans des fichiers CSS et JS distincts. La compilation consiste à parcourir les différents fichiers sources, en suivant les directives d'import, à partir du point d'entrée spécifié dans le fichier de configuration (`frontend/index.js`). Chaque fichier subit une transformation en fonction de son type : Babel pour les fichiers JS, CSS-loader pour les fichiers CSS, et le résultat est concaténé dans un fichier de paquetage (ex : `bundle.js`).

La configuration Webpack mise en place dans ce projet est volontairement simpliste, et nécessiterait plusieurs ajustements pour une utilisation en production (minification du code, ...).