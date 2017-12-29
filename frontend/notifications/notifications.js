import NotificationCenter, { Types } from '_services/notifications';

import './notifications.css';

const feed = $('.notification-feed');

const pushNotification = (type) => (titre, message, fadeDuration = 5000) => {
	const notification = $(`
		<div class="notification ${type}">
			<span class="close"><i class="fa fa-times"></i></span>
			<h3><i class="fa fa-${type === Types.SUCCESS
				? 'check-square-o'
				: 'exclamation-triangle'}" aria-hidden="true"></i> ${titre}</h3>
			<p>${message}</p>
		</div>
	`);

	notification.find('.close').click(() => {
		notification.fadeOut(() => notification.remove());
	});

	feed.prepend(notification);
	notification.fadeIn();

	setTimeout(function() {
		notification.fadeOut(() => notification.remove());
	}, fadeDuration);
};

NotificationCenter.on(Types.SUCCESS, pushNotification(Types.SUCCESS));
NotificationCenter.on(Types.WARNING, pushNotification(Types.WARNING));
NotificationCenter.on(Types.ERROR, pushNotification(Types.ERROR));
