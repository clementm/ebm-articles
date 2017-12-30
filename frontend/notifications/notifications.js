import NotificationCenter, { Types } from '_services/notifications';

// On import le CSS du fil de notification
import './notifications.css';

// On récupère l'élément DOM correspondant au fil
const feed = $('.notification-feed');

/**
 * Permet d'ajouter une notification au fil
 * @param {*} type type de notification (erreur, alerte, succès)
 */
const pushNotification = (type) => (titre, message, fadeDuration = 5000) => {
	// On crée le bloc de notification
	const notification = $(`
		<div class="notification ${type}">
			<span class="close"><i class="fa fa-times"></i></span>
			<h3><i class="fa fa-${type === Types.SUCCESS
				? 'check-square-o'
				: 'exclamation-triangle'}" aria-hidden="true"></i> ${titre}</h3>
			<p>${message}</p>
		</div>
	`);

	// La notification peut être masquée
	notification.find('.close').click(() => {
		notification.fadeOut(() => notification.remove());
	});

	// On ajoute le bloc au fil
	feed.prepend(notification);
	notification.fadeIn();

	// On le masque à l'expiration du délai
	setTimeout(function() {
		notification.fadeOut(() => notification.remove());
	}, fadeDuration);
};

// On écoute les évènements du centre de notification
NotificationCenter.on(Types.SUCCESS, pushNotification(Types.SUCCESS));
NotificationCenter.on(Types.WARNING, pushNotification(Types.WARNING));
NotificationCenter.on(Types.ERROR, pushNotification(Types.ERROR));
