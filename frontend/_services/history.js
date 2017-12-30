import createHistory from 'history/createBrowserHistory';
import UrlPattern from 'url-pattern';

const history = createHistory();
export default history;

const match = (pattern, location, callback) => {
	const result = pattern.match(location.pathname);
	if (result) callback(result);
};

/**
 * Les composants utilisent cette méthode pour écouter une route particulière
 * @param {*} patternStr motif de la route avec les placeholder des paramètres
 * @param {*} callback méthode à rappeler lorsque la route est activée
 */
export const Route = (patternStr, callback) => {
	const pattern = new UrlPattern(patternStr);
	// trigger callback with current route, outside loading loop
	setTimeout(() => match(pattern, window.location, callback));

	return history.listen((location, action) =>
		match(pattern, window.location, callback)
	);
};

history.listen((location, action) => console.log('navigation', location));
