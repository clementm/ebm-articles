import Api from '_services/api';
import addEditionSupport from './editor';
import History, { Route } from '_services/history';

import './article.css';

const articleContainer = $('.article');
const articleList = $('.article-list');
const placeholder = $('.placeholder');
const editionToggle = $('.edition-toggle');
const sectionAjout = $('.section-ajout');
const ajoutEditor = sectionAjout.find('textarea');

let currentId = null;

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

editionToggle.click(() => {
	const editing =
		/mode=(edition|consultation)/.test(window.location.search) &&
		RegExp.$1 === 'edition';

	History.replace(`?mode=${editing ? 'consultation' : 'edition'}`);
});

Route('/articles/:id', ({ id }) => {
	articleContainer.show();
	placeholder.hide();

	if (id !== currentId) {
		articleList.children().remove();
		Api.getArticle(id, function(oRep) {
			oRep.paragraphes.forEach((paragraphe) =>
				articleList.append(paragrapheFactory(paragraphe))
			);
		});
	}

	currentId = id;

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

articleList.sortable({
	handle: '.handle',
	update: function(event, { item }) {
		const itemData = item.data('pItem');
		const prev = item.prev().data('pItem');
		const next = item.next().data('pItem');

		let position = 0;
		if (!prev && !next) return;
		else if (!prev) position = next.position - 1;
		else if (!next) position = prev.position + 1;
		else position = (prev.position + next.position) / 2;

		item.data('pItem', { ...itemData, position });

		Api.updateParagraphe(
			{
				...itemData,
				position
			},
			(data) => item.data('pItem', data)
		);
	}
});

function ajoutParagraphe() {
	const value = ajoutEditor.val().trim() || 'Nouveau paragraphe';

	const lastItemData = articleList.find('> :last-child').data('pItem');
	const position = lastItemData ? lastItemData.position + 1 : 0;

	const paragraphe = paragrapheFactory({
		content: value,
		position,
		article_id: currentId
	});

	setTimeout(() => paragraphe.find('.content').trigger('click'));

	ajoutEditor.val('');
	articleList.append(paragraphe);

	Api.ajouterParagraphe(
		{
			position,
			content: value,
			article_id: currentId
		},
		(oRep) => paragraphe.data('pId', oRep.id).data('pItem', oRep)
	);
}

ajoutEditor.on('keydown', function(e) {
	if (e.keyCode === 13) {
		e.preventDefault();
		ajoutParagraphe();
	}
});

sectionAjout.find('button').click(function() {
	ajoutParagraphe();
});
