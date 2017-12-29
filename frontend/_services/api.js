import NotificationCenter, { Types } from '_services/notifications';

function pushError() {
	NotificationCenter.emit(
		Types.ERROR,
		'Oups !...',
		`
		Impossible de récupérer vos paragraphes... vérifiez que vous êtes bien connecté à internet,
		que le réseau de l'école fonctionne, et qu\'une apocalypse n'est pas en cours. Sinon, 
		réessayez plus tard.
	`,
		10000
	);
}

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
	).fail(function() {
		pushError();
	});

const del = (url, callback) =>
	$.ajax(url, { method: 'delete' }).done((oRep) => callback()).fail(function() {
		pushError();
	});

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
		$.getJSON('/api/articles', function(oRep) {
			if (!oRep.data) pushError();
			else callback(oRep.data);
		});
	},

	getArticle: function(id, callback) {
		$.getJSON('/api/articles/' + id, function(oRep) {
			if (!oRep.data) pushError();
			else callback(oRep.data);
		});
	},

	creerArticle: function(title, callback) {
		post('/api/articles', { title }, callback);
	}
};
