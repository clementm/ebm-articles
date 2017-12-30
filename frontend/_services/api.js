import NotificationCenter, { Types } from '_services/notifications';

/**
 * Permet d'envoyer une erreur au centre de notification
 * @param {*} message message de l'erreur
 */
function pushError(message) {
	NotificationCenter.emit(
		Types.ERROR,
		'Oups !...',
		`
			Impossible de récupérer vos paragraphes... vérifiez que vous êtes bien connecté à internet,
			que le réseau de l'école fonctionne, et qu\'une apocalypse n'est pas en cours. Sinon, 
			réessayez plus tard. ${message ? `Erreur obtenue : ${message}` : ''}
		`,
		10000
	);
}

/**
 * Requête POST
 * @param {*} url 
 * @param {*} data 
 * @param {*} callback 
 */
const post = (url, data, callback) =>
	$.post(
		url,
		JSON.stringify(data),
		(oRep) => {
			if (oRep.data) {
				callback(oRep.data);
			} else pushError();
		},
		'json'
	).fail((oRep) => pushError(oRep.responseJSON && oRep.responseJSON.error));

/**
 * Requête DELETE
 * @param {*} url 
 * @param {*} callback 
 */
const del = (url, callback) =>
	$.ajax(url, { method: 'delete' })
		.done((oRep) => callback())
		.fail((oRep) => pushError(oRep.responseJSON && oRep.responseJSON.error));

export default {
	ajouterParagraphe: function(paragraphe, callback) {
		post('/api/paragraphes', paragraphe, callback);
	},

	updateParagraphe: function(paragraphe, callback) {
		post('/api/paragraphes/' + paragraphe.id, paragraphe, callback);
	},

	supprimerParagraphe: function(id, callback) {
		del('/api/paragraphes/' + id, callback);
	},

	listerArticles: function(callback) {
		$.getJSON('/api/articles', (oRep) => {
			if (!oRep.data) pushError();
			else callback(oRep.data);
		}).fail((oRep) => pushError(oRep.responseJSON && oRep.responseJSON.error));
	},

	getArticle: function(id, callback) {
		$.getJSON('/api/articles/' + id, (oRep) => {
			if (!oRep.data) pushError();
			else callback(oRep.data);
		}).fail((oRep) => pushError(oRep.responseJSON && oRep.responseJSON.error));
	},

	creerArticle: function(title, callback) {
		post('/api/articles', { title }, callback);
	}
};
