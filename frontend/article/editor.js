import { Route } from '_services/history';
import Api from '_services/api';

export default (paragraphe) => {
	const textarea = paragraphe.find('.content-editor');
	const display = paragraphe.find('.content');
	const supprimer = paragraphe.find('.cross');
	const handle = paragraphe.find('.handle');

	Route('/articles/:id', () => {
		const editing =
			/mode=(edition|consultation)/.test(window.location.search) &&
			RegExp.$1 === 'edition';

		if (editing) {
			handle.css('visibility', 'visible');
			supprimer.css('display', '');

			supprimer.click(function() {
				Api.supprimerParagraphe(paragraphe.data('pId'), () => {});
				paragraphe.remove();
			});

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

			$(window).on('keydown', (event) => {
				if (event.keyCode === 27) {
					paragraphe.removeClass('focus');
					textarea.hide();
					display.show();
				}
			});

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
			handle.css('visibility', 'hidden');
			supprimer.hide();
			supprimer.off('click');
			textarea.off('keydown');
			display.off('click');
		}
	});

	return paragraphe;
};
