var urlName = document.URL
var urlSplit = urlName.split('/')
//console.log(document.location.host)
var pageName = urlSplit.pop()
var pageSplit = pageName.split('.')
var fileType = pageSplit[pageSplit.length-1]
//console.log(fileType)

if(/tumblr\.com/i.test(document.domain)){
	//console.log("Tumblr!")
	if((!/_1280\.(png|gif|jpg)$/.test(pageName))){ //so we don't constantly reload
		document.location.href = urlName.replace(/_\d+\.(png|gif|jpg)$/, "_1280.$1")
	}
}else if(/pbs\.twimg\.com/i.test(document.domain)){
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
else{
	console.log("Instagram!")
	document.addEventListener("contextmenu", function(e){
		document.location.href = document.querySelector('meta[property="og:image"]').content
	}, false)
	//window.open(largePicUrl, '_blank')
	//var smallPicData
	console.log(largePicUrl)
}

/*
https://scontent-ort2-1.cdninstagram.com/vp/00e69570a1523bfd95c61671fbc88359/5BCA667C/t51.2885-15/e35/37286097_2137230119825075_5749275662313586688_n.jpg

https://scontent-ort2-1.cdninstagram.com/vp/e893bb436a655f294fbb177452fe7214/5BEFB916/t51.2885-15/sh0.08/e35/p640x640/37286097_2137230119825075_5749275662313586688_n.jpg


https://scontent-ort2-1.cdninstagram.com/vp/e12dc580dd5e2b29dcc7716bc849bc93/5BCE6D31/t51.2885-15/sh0.08/e35/p640x640/36160969_177941356399648_5526106855215988736_n.jpg

https://scontent-ort2-1.cdninstagram.com/vp/06e3f2771c3d031bd1d356f0c13ca394/5BD686C7/t51.2885-15/e35/36160969_177941356399648_5526106855215988736_n.jpg
*/

//instagram