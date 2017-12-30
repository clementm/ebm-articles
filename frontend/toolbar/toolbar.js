import NotificationCenter, { Types } from '_services/notifications';
import History, { Route } from '_services/history';
import Api from '_services/api';

// On import le CSS de la barre de menu
import './toolbar.css';

// On récupère les éléments DOM présents dans la page
const articleSelect = $('#article-select');
const articleModal = $('.modal');
const openArticleModal = $('#modal-open');
const articleTitleInput = $('#article-title');
const articleSubmit = $('.article-submit');

// Lorsqu'on accède à une route /articles/:id, on modifie l'article
// sélectionné
Route('/articles/:id', ({ id }) => articleSelect.val(id));

// Lorsque l'utilisateur sélectionne un article, on "redirige" l'utilisateur
// vers l'URL correspondante
articleSelect.change((event) => {
	History.push(`/articles/${event.target.value}`);
});

// On récupère la liste des articles
Api.listerArticles(function(oRep) {
	oRep.forEach((article) =>
		// Pour chaque article, on ajoute une option dans le <select/>
		articleSelect.append(`
			<option value="${article.id}">${article.title}</option>
		`)
	);
});

// L'utilisateur valide l'ajout d'un article
const submitArticle = () => {
	const title = articleTitleInput.val();
	Api.creerArticle(title, (article) => {
		articleModal.hide(); // on masque la modale
		articleSelect.append(
			`<option value="${article.id}">${article.title}</option>`
		); // on ajoute l'option dans le <select/>
		// On redirige l'utilisateur vers l'URL du nouvel article en mode édition
		History.push(`/articles/${article.id}?mode=edition`);
	});
};

// L'appui sur la touche entrée dans le champ d'ajout d'article valide la saisie
articleTitleInput.on('keydown', function(e) {
	if (e.keyCode === 13) {
		e.preventDefault();
		submitArticle();
	}
});

// L'utilisateur peut également appuyer sur le bouton de soumission
articleSubmit.click(submitArticle);

// On affiche la modale lorsque l'utilisateur appuie sur le bouton +
openArticleModal.click(() => {
	articleModal.css('display', 'flex').hide().fadeIn();
	articleTitleInput.focus();
});
