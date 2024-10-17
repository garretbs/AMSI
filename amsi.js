
//Get max res twimg image
if(/pbs\.twimg\.com/i.test(document.domain)) {
	console.log("Twimg!");
	if(/profile_images/.test(urlName)) { //if profile image
		console.log("Profile image")
		if(/_\d+x\d+/.test(pageName)) {
			urlName = urlName.replace(/_\d+x\d+/i, '');
			replaceImage(urlName);
		}
	}
	else if(/\?format=[A-Za-z]+.*/.test(urlName)) { // New UI images
		console.log("New UI image");
		urlName = urlName.replace(/\?format=([A-Za-z]+).*/, ".$1:orig");
		replaceImage(urlName);
	} else if((!/:orig$/i.test(pageName))) { //if not already an :orig image
		console.log("Regular image");
		urlName = urlName.replace(/:large$/i, "");
		urlName += ":orig";
		replaceImage(urlName);
	} else {
		console.log("Unknown twimg image type?");
	}
}
//Get max res ytimg thumbnail
else if(/i\.ytimg\.com/i.test(document.domain)) {
	console.log("ytimg thumbnail");
	if((!/maxresdefault.jpg$/i.test(pageName))) { //if not already a maxresdefault.jpg
		console.log("Regular image");
		urlName = urlName.replace(/hqdefault.jpg(.*)$/i, "maxresdefault.jpg");
		replaceImage(urlName);
	}
}else{
	console.log("Unknown site: " + document.domain);
}
