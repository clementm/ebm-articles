import EventEmitter from 'event-emitter';

/// Types de notification
export const Types = { SUCCESS: 'SUCCESS', WARNING: 'WARNING', ERROR: 'ERROR' };

// Gestionnaire d'évènement permettant d'ajouter des notifications
const dispatcher = EventEmitter();

export default dispatcher;
