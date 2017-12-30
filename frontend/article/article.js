import Api from '_services/api';
import addEditionSupport from './editor';
import History, { Route } from '_services/history';

// On importe le CSS des articles
import './article.css';

// On récupère les éléments DOM dans la page
const articleContainer = $('.article');
const articleList = $('.article-list');
const placeholder = $('.placeholder');
const editionToggle = $('.edition-toggle');
const sectionAjout = $('.section-ajout');
const ajoutEditor = sectionAjout.find('textarea');

// ID de l'article actuel
let currentId = null;

// Permet de créer un nouveau élement DOM pour un paragraphe
const paragrapheFactory = (paragraphe) =>
	addEditionSupport(
		$(`
      <div class="paragraphe">
        <div class="cross">
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        <div class="handle">
          <i class="fa fa-sort" aria-hidden="true"></i>
        </div>
        <textarea rows="1" class="content-editor"></textarea>
        <div class="content">
          ${paragraphe.content}
        </div>
      </div>
    `)
			.data('pId', paragraphe.id)
			.data('pItem', paragraphe)
	);

// Lorsque l'utilisateur change le mode (édition, consultation) on le redirige
// vers l'URL correspondante
editionToggle.click(() => {
	const editing =
		/mode=(edition|consultation)/.test(window.location.search) &&
		RegExp.$1 === 'edition';

	History.replace(`?mode=${editing ? 'consultation' : 'edition'}`);
});

// On écoute la route /articles/:id pour pouvoir changer l'article affiché
Route('/articles/:id', ({ id }) => {
	// Lors de l'activation de la route, on affiche le containeur, et on masque
	// le placeholder
	articleContainer.show();
	placeholder.hide();

	// Si l'ID de l'article a changé, on récupère l'article via l'API
	if (id !== currentId) {
		articleList.children().remove();
		Api.getArticle(id, function(oRep) {
			// Pour chaque paragraphe, on ajoute l'élement fabriqué dans le DOM
			oRep.paragraphes.forEach((paragraphe) =>
				articleList.append(paragrapheFactory(paragraphe))
			);
		});
	}

	currentId = id;

	// On change l'état des éléments d'interface en fonction du mdoe activé
	// dans l'URL
	const editing =
		/mode=(edition|consultation)/.test(window.location.search) &&
		RegExp.$1 === 'edition';

	if (editing) {
		editionToggle.text('Mode édition');
		editionToggle.addClass('editing');
		articleList.sortable('enable');
		sectionAjout.show();
	} else {
		editionToggle.text('Mode consultation');
		editionToggle.removeClass('editing');
		articleList.sortable('disable');
		sectionAjout.hide();
	}
});

// On rend la liste des paragraphes réordonnables grâce au plugin JQuery UI
articleList.sortable({
	handle: '.handle',
	update: function(event, { item }) {
		// Lors de la modification, on récupère les paragraphes entourant le
		// paragraphe déplacé et on calcule la nouvelle position comme la
		// moyenne des deux
		const itemData = item.data('pItem');
		const prev = item.prev().data('pItem');
		const next = item.next().data('pItem');

		let position = 0;
		if (!prev && !next) return;
		else if (!prev) position = next.position - 1;
		else if (!next) position = prev.position + 1;
		else position = (prev.position + next.position) / 2;

		item.data('pItem', { ...itemData, position });

		// On modifie le paragraphe via l'API
		Api.updateParagraphe(
			{
				...itemData,
				position
			},
			(data) => item.data('pItem', data)
		);
	}
});

/**
 * Ajout d'un paragraphe
 */
function ajoutParagraphe() {
	// On récupère le contenu du paragraphe
	const value = ajoutEditor.val().trim() || 'Nouveau paragraphe';

	// On calcule la position de l'article à partir du dernier paragraphe
	const lastItemData = articleList.find('> :last-child').data('pItem');
	const position = lastItemData ? lastItemData.position + 1 : 0;

	// On construit le bloc paragraphe
	const paragraphe = paragrapheFactory({
		content: value,
		position,
		article_id: currentId
	});

	// On bascule le paragraphe en mode édition lorsqu'il a bien été ajouté
	// au DOM (en dehors de la boucle évènementielle courante)
	setTimeout(() => paragraphe.find('.content').trigger('click'));

	ajoutEditor.val('');
	articleList.append(paragraphe);

	// On ajoute un paragraphe via l'API
	Api.ajouterParagraphe(
		{
			position,
			content: value,
			article_id: currentId
		},
		(oRep) => paragraphe.data('pId', oRep.id).data('pItem', oRep)
	);
}

// L'appui sur la touche entrée dans le champ d'ajout valide la saisie
ajoutEditor.on('keydown', function(e) {
	if (e.keyCode === 13) {
		e.preventDefault();
		ajoutParagraphe();
	}
});

sectionAjout.find('button').click(function() {
	ajoutParagraphe();
});
