export const debounce = (callback, delay) => {
	let timeout = null;
	return (...args) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), delay);
	};
};
