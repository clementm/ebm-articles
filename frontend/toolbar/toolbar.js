import NotificationCenter, { Types } from '_services/notifications';
import History, { Route } from '_services/history';
import Api from '_services/api';

import './toolbar.css';

const articleSelect = $('#article-select');
const articleModal = $('.modal');
const openArticleModal = $('#modal-open');
const articleTitleInput = $('#article-title');
const articleSubmit = $('.article-submit');

Route('/articles/:id', ({ id }) => articleSelect.val(id));

articleSelect.change((event) => {
	History.push(`/articles/${event.target.value}`);
});

Api.listerArticles(function(oRep) {
	oRep.forEach((article) =>
		articleSelect.append(`
			<option value="${article.id}">${article.title}</option>
		`)
	);
});

const submitArticle = () => {
	const title = articleTitleInput.val();
	Api.creerArticle(title, (article) => {
		articleModal.hide();
		articleSelect.append(
			`<option value="${article.id}">${article.title}</option>`
		);
		History.push(`/articles/${article.id}?mode=edition`);
	});
};

articleTitleInput.on('keydown', function(e) {
	if (e.keyCode === 13) {
		e.preventDefault();
		submitArticle();
	}
});

articleSubmit.click(submitArticle);

openArticleModal.click(() => {
	articleModal.css('display', 'flex').hide().fadeIn();
	articleTitleInput.focus();
});
