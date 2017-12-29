import createHistory from 'history/createBrowserHistory';
import UrlPattern from 'url-pattern';

const history = createHistory();
export default history;

const match = (pattern, location, callback) => {
	const result = pattern.match(location.pathname);
	if (result) callback(result);
};

export const Route = (patternStr, callback) => {
	const pattern = new UrlPattern(patternStr);
	// trigger callback with current route, outside loading loop
	setTimeout(() => match(pattern, window.location, callback));

	return history.listen((location, action) =>
		match(pattern, window.location, callback)
	);
};

history.listen((location, action) => console.log('navigation', location));
