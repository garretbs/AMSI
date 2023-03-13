let urlName = document.URL;
let pageName =  urlName.split('/').pop();

function replaceImage(newImageUrl){
	document.location.href = newImageUrl
}

async function sendRequest(url, method, headers = {}) {
	const response = await fetch(url, {
		method: method,
		headers: headers
	}).then((res) => res.text()).catch(error => {
		console.error(error);
	});
	return response;
}

function getCookie(name) {
	const cookies = decodeURIComponent(document.cookie).split(/; +/);
	for(let i=0; i < cookies.length; i++) {
		let cookieNameAndValue = cookies[i].split(/=/);
		if (cookieNameAndValue[0] == name) {
			return cookieNameAndValue[1];
		}
	}
	// The cookie does not exist, so return null
	return null;
}

function getParentElement(currentElement, level) {
	if(level == 0) {
		return currentElement;
	}
	return getParentElement(currentElement.parentElement, level - 1);
}
