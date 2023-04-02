const AMSI_TWITTER_API_VERSION = 'amsiTwitterApiVersion';
const AMSI_TWITTER_BEARER_TOKEN = 'amsiTwitterBearer';
const AMSI_DEFAULT_TWITTER_API = '1.1';
const AMSI_DEFAULT_TWITTER_BEARER_TOKEN = '';
let twitterBearerTokenInput = null;
let twitterApiVersion = '';
let twitterBearerToken = '';

// Wait for page to load before trying this
document.addEventListener('DOMContentLoaded', function() {
	const apiVersionButtons = document.getElementsByName('apiVersion');
	twitterBearerTokenInput = document.getElementById('twitterBearerToken');
	const saveButton = document.getElementById('saveButton');
	loadExistingSettings();
	for(let radioButton of apiVersionButtons) {
		radioButton.onchange = twitterApiVersionChange;
	}
	twitterBearerTokenInput.oninput = twitterBearerTokenChanged;
	twitterBearerTokenInput.disabled;
	updateBearerTokenInput();
	saveButton.disabled = true;
	saveButton.onclick = saveSettings;
});

function loadExistingSettings() {
	browser.storage.local.get({
			AMSI_TWITTER_API_VERSION: AMSI_DEFAULT_TWITTER_API
		},
		function(item) {
			twitterApiVersion = item['AMSI_TWITTER_API_VERSION'];
			document.getElementById(twitterApiVersion).checked = true;
			updateBearerTokenInput();
		}
	);
	browser.storage.local.get({
			AMSI_TWITTER_BEARER_TOKEN: AMSI_DEFAULT_TWITTER_BEARER_TOKEN
		},
		function(item) {
			twitterBearerToken = item['AMSI_TWITTER_BEARER_TOKEN'];
			twitterBearerTokenInput.value = twitterBearerToken;
		}
	);
}

function twitterApiVersionChange() {
	twitterApiVersion = this.value;
	updateBearerTokenInput();
	settingsChanged();
}

function updateBearerTokenInput() {
	if(!twitterBearerTokenInput) return;
	if(twitterApiVersion == 'v2') {
		twitterBearerTokenInput.disabled = false;
	} else {
		twitterBearerTokenInput.disabled = true;
	}
}

function twitterBearerTokenChanged() {
	twitterBearerToken = this.value;
	settingsChanged();
}

function settingsChanged() {
	saveButton.disabled = false;
}

function saveSettings() {
	browser.storage.local.set({
		AMSI_TWITTER_API_VERSION: twitterApiVersion,
		AMSI_TWITTER_BEARER_TOKEN: twitterBearerToken
	});
	saveButton.disabled = true;
}
