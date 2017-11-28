// JavaScript Document

// ----------- Comienzo INIT
// Analytics for App
if(isProductionMode()){
setTimeout(function(){window.ga.startTrackerWithId('UA-43402607-2');}, 500);
// Init Facebook "pixel"
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '118980725254068');
document.write('<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=118980725254068&ev=PageView&noscript=1"/></noscript>');

// Init Amplitud -- test
(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script");r.type="text/javascript";
r.async=true;r.src="https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-3.4.0-min.gz.js";
r.onload=function(){e.amplitude.runQueuedFunctions()};var i=t.getElementsByTagName("script")[0];
i.parentNode.insertBefore(r,i);function s(e,t){e.prototype[t]=function(){this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
return this}}var o=function(){this._q=[];return this};var a=["add","append","clearAll","prepend","set","setOnce","unset"];
for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[];return this;
};var p=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"];
for(var l=0;l<p.length;l++){s(c,p[l])}n.Revenue=c;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","logEventWithTimestamp","logEventWithGroups"];
function v(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)));
}}for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){e=(!e||e.length===0?"$default_instance":e).toLowerCase();
if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]};e.amplitude=n;
})(window,document);
//Nro test 46200453d54c4adfe9d9522c73e355c1
amplitude.getInstance().init('7e1fbf2d393e868f9ec97eea66bd3362', null, {includeReferrer: true, includeUtm: true, platform:'ANDROID'});// Nro de test
}
function jpAnalyticsUserId(USER_ID){
	if(isProductionMode()){
	USER_ID=USER_ID.toString();
	amplitude.getInstance().setUserId(USER_ID);
	//fbq.setUserID(USER_ID); // Me parece que esto no existe
	window.ga.setUserId(USER_ID);
	window.ga.setAppVersion('2.7.0');
	}
}
 // Establezca el ID de usuario mediante el user_id con el que haya iniciado sesión.
function jpAnalyticsEvent(eventCategory, eventAction, eventLabel){
	// eventCategory STR, eventAction STR, eventLabel STR
	if(isProductionMode()){
	amplitude.getInstance().logEvent(eventCategory, { 'content_name': eventAction, 'content_category': eventLabel});
	if(isStandardFacebookEvent(eventCategory)){
			fbq('track', eventCategory, { content_name: eventAction, content_category: eventLabel});
		}else{
			fbq('trackCustom', eventCategory, { content_name: eventAction, content_category: eventLabel});
		}
	window.ga.trackEvent(eventCategory, eventAction, eventLabel);
	}
}
function isStandardFacebookEvent(eventCategory){
	return ["COMPLETED_REGISTRATION"].indexOf(eventCategory) > -1;
}
function jpAnalyicsEventPurchase(purchaseCategory, purchaseLabel,purchaseValue, purchaseCurrency ){
	// Solo para las mayores de 0 y lo pongo en Uss por ahora
	// En las encuestas guardar en label de la red que viene
	if(isProductionMode()){
		fbq('track', 'Purchase', {content_type: purchaseCategory,value: purchaseValue,currency: 'USD'});
		window.ga.addTransaction('Pollfish', purchaseCategory, purchaseValue, 0, 0, 'USD')
		var revenue = new amplitude.Revenue().setProductId('com.company.productId').setPrice(parseFloat(purchaseValue)).setQuantity(1).eventProperties({ 'content_name': purchaseCategory, 'content_category': purchaseLabel});
		amplitude.getInstance().logRevenueV2(revenue);
	}
}

function jpAnalyticsPageView(name){
	if(isProductionMode()){
	setTimeout(function(){
	amplitude.getInstance().logEvent('PAGE_VIEW_'+name);
	fbq('track', 'PageView'); // ViewContent
	fbq('track', 'ViewContent', { content_name: name});
	window.ga.trackView(name);}, 1000);// Da tiempo a inicializar
	}
}
