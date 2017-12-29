import EventEmitter from 'event-emitter';

export const Types = { SUCCESS: 'SUCCESS', WARNING: 'WARNING', ERROR: 'ERROR' };

const dispatcher = EventEmitter();

export default dispatcher;
