var urlName = document.URL
var urlSplit = urlName.split('/')
var pageName = urlSplit.pop()
//var pageSplit = pageName.split('.')
//var fileType = pageSplit[pageSplit.length-1]

//Get max res Tumblr image (1280 as of version 1.0)
if(/tumblr\.com/i.test(document.domain)){
	//console.log("Tumblr!")
	if((!/_1280\.(png|gif|jpg)$/.test(pageName))){ //so we don't constantly reload
		document.location.href = urlName.replace(/_\d+\.(png|gif|jpg)$/, "_1280.$1")
	}
}
//Get max res twimg image (append:orig to image url)
else if(/pbs\.twimg\.com/i.test(document.domain)){
	//console.log("Twimg!")
	//console.log(pageName)
	if((!/:orig$/i.test(pageName))){
		urlName = urlName.replace(/:large$/i, "")
		urlName += ":orig"
		document.location.href = urlName
	}
}/*else if(/instagram\.com/i.test(pageName)){
	console.log("Instagram!")
	//small image starts with "display_resources":[{"src":"small_image_url",
	//large image is <meta property="og:image" content="large_image_url" />
}else{
	console.log("Unknown site: " + document.domain)
}*/
//Get max res Instagram image (found in HTML data of post page)
else{
	//console.log("Instagram!")
	document.addEventListener("contextmenu", function(e){
		document.location.href = document.querySelector('meta[property="og:image"]').content
	}, false)
	//window.open(largePicUrl, '_blank')
	//var smallPicData
	//console.log(largePicUrl)
}