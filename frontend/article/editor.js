import { Route } from '_services/history';
import Api from '_services/api';

/**
 * Permet de rendre un paragraphe éditable
 * 
 * @param {*} paragraphe correspond à l'élement JQuery du paragraphe
 */
export default (paragraphe) => {
	// On récupère les éléments DOM
	const textarea = paragraphe.find('.content-editor');
	const display = paragraphe.find('.content');
	const supprimer = paragraphe.find('.cross');
	const handle = paragraphe.find('.handle');

	// On écoute la route pour changer le mode édition/consultation
	Route('/articles/:id', () => {
		const editing =
			/mode=(edition|consultation)/.test(window.location.search) &&
			RegExp.$1 === 'edition';

		if (editing) {
			// On rend visible la poignée de drag'n'drop et le bouton supprimer
			handle.css('visibility', 'visible');
			supprimer.css('display', '');

			// Lorsque l'utilisateur supprime le paragraphe
			supprimer.click(function() {
				Api.supprimerParagraphe(paragraphe.data('pId'), () => {});
				paragraphe.remove();
			});

			// Lorsque l'utilisateur valide la saisie dans un bloc paragraphe
			textarea.on('keydown', function(e) {
				if (e.keyCode === 13) {
					e.preventDefault();
					const value = textarea.val().trim();
					paragraphe.removeClass('focus');
					Api.updateParagraphe(
						{ ...paragraphe.data('pItem'), content: value },
						(data) => {
							paragraphe.data('pItem', data);
							display.html(value);
							textarea.hide();
							display.show();
						}
					);
				}
			});

			// Appui sur le bouton Echap, on rebascule les champs en mode consultation
			// La valeur initiale est toujours stockée dans le bloc paragraphe
			$(window).on('keydown', (event) => {
				if (event.keyCode === 27) {
					paragraphe.removeClass('focus');
					textarea.hide();
					display.show();
				}
			});

			// Le clic sur un paragraphe permt de l'éditer
			display.click(function() {
				const value = display.html().replace(/\n/g, '').trim();
				paragraphe.addClass('focus');
				display.hide();
				textarea.val(value);
				textarea.show();
				textarea.focus();
				textarea.select();
			});
		} else {
			// En mode consultation, on cache les éléments permettant de modifier
			handle.css('visibility', 'hidden');
			supprimer.hide();
			supprimer.off('click');
			textarea.off('keydown');
			display.off('click');
		}
	});

	return paragraphe;
};
