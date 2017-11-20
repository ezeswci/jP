// JavaScript Document
setTimeout(function(){askServerForExternalSurveys();},1000);
function askServerForExternalSurveys(){
	var fingerprint = new Fingerprint({canvas:true}).get();
	var json=JSON.stringify( { "user_id":getUserJugaplayId(),"fingerprint":fingerprint } );
	var xmlhttp;
		if (window.XMLHttpRequest)
	 	 {// code for IE7+, Firefox, Chrome, Opera, Safari
	  		xmlhttp=new XMLHttpRequest();
	  		}
		else
	  	{// code for IE6, IE5
	 	 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	 	 }
		xmlhttp.onreadystatechange=function()
	  	{
	 	 if ((xmlhttp.readyState==4 && xmlhttp.status==200) ||  (xmlhttp.readyState==4 && xmlhttp.status==422) ||  (xmlhttp.readyState==4 && xmlhttp.status==403))
	    {
			var jsonStr=xmlhttp.responseText;
			if(IsJsonString(jsonStr)){ // Me fijo si dio un error, en el caso de que de le sigo mandando
				processUsersNetworksDataFromServer(JSON.parse(jsonStr));
			}
	    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST",getJPDataURL()+"get_networks.php",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//xmlhttp.withCredentials = "true";
		xmlhttp.send(json);
}
function processUsersNetworksDataFromServer(networks){
	if(networks.location.hasOwnProperty("state") && networks.demographic.hasOwnProperty("state")){
		if(networks.location.state!="not_completed"&&networks.demographic.state!="not_completed"){
			showExternalNetworks(networks.networks);
		}// sino no estan completas
	}// Sino no estan completas
}
function showExternalNetworks(networks){
	// Agrego el cartel de avisos
	// Muestro las preguntas disponibles
	// Le agrego el analytics de responder una pregunta
	var explanation=false;
	for (network in networks){
		for(survey in networks[network].surveys){
			if(!explanation){activateExternalSurveysExplanation();explanation=true;}
			parseNetowrksSurveys(networks[network].name,networks[network].surveys[survey]);
		}
	}
}
function parseNetowrksSurveys(network_name,survey){
	// falta agregar el analytics
	var duration=parseInt(survey.duration/60);
	$("#external-polls").append('<div class="container polls-container polls-style"> <h4><b>'+survey.name+'</b></h4> <h5 class="trn">ENCUESTA EXTERNA</h5> <div class="col-xs-6"> <h2>'+duration+'\' <i class="fa fa-clock-o" aria-hidden="true"></i> </h2> </div><div class="col-xs-6"> <h2>'+survey.amount_questions+' <i class="fa fa-pencil-square-o" aria-hidden="true"></i></h2> </div><button type="button" class="btn btn-large btn-block btn-success btn-poll" onclick="answerExternalSurvey(\''+survey.name+'\',\''+survey.network+'\',\''+survey.link+'\',\''+survey.chips+'\');"><span class="trn">CONTESTAR</span> + '+survey.chips+' <img src="img/icons/coins/chip.svg" style="margin-right: 0px;margin-top: -10px;margin-bottom: -3px;margin-left: 5px;width: 30px;"></button> </div>');
	checkLanguageElement($("#external-polls"));
}
// answerExternalSurvey
function answerExternalSurvey(name,network,link,chips){
	$("body").append('<div class="navbar navbar-fixed-top nav-polls"><div class="col-xs-2 nopadding"> <a class="btn sharp no-margin btn-danger btn-lg btn-block" href="#" role="button" onclick="closeExternalSurveyPanel(\''+network+'\');"><i class="fa fa-times-circle fa-2x" aria-hidden="true"></i></a> <!--a class="btn sharp no-margin btn-info btn-lg btn-block" href="#" role="button"><i class="fa fa-info-circle fa-2x" aria-hidden="true"></i></a--> </div><div class="col-xs-10 poll-container text-color7  text-center" style="padding: 0px;"><iframe src="'+link+'" style="width: 100%;height: 100%;min-height: 100vh;"></iframe></div></div>').after(function() {
            var left = $('.nav-polls').width();
			 $(".nav-polls").css({left:left}).after(function() {
				 $(".nav-polls").animate({"left":"0px"}, "slow");
			 });
        });
	jpAnalyticsEvent("OPEN_POLL", network, 0);// Ajustar analytics a valores
}
function activateExternalSurveysExplanation(){
	$("#external-polls").append('<div class="alert alert-jugaplay alert-dismissable fade in text-justify trn"><a href="#" style="float:right;" class="close" data-dismiss="alert" aria-label="close">&times;</a> <p>Las <strong>"Encuestas externas"</strong> se abren en un sitio web aparte. En general tienen un <strong>tiempo de duración más largo</strong> que la "encuesta del día".</p><p>Revisa el <strong><i class="fa fa-2x fa-clock-o" aria-hidden="true"></i> </strong> en el detalle para conocer cuanto tiempo te puede consumir responderla.</p><p>El ícono <strong><i class="fa fa-2x fa-pencil-square-o" aria-hidden="true"></i> </strong> marca cuantas preguntas debes responder aproximadamente.</p><p>Para las encuestas externas, el comienzo del <strong>código postal</strong> es la letra de la provincia ejemplo Buenos aires B, Capital C y Santa fe F. Ejemplo codigo provincia de Buenos Aires, B1669</p></div>');
	checkLanguageElement($("#external-polls"));
}
function closeExternalSurveyPanel(network){
	  // Get the calculated left position
	  var left = $('.nav-polls').width();
	 $(".nav-polls").animate({"left":left+"px"}, "slow", function() {$(this).remove()});
	 jpAnalyticsEvent("CLOSE_POLL", network, value);
}
/*
 * fingerprintJS 0.5.4 - Fast browser fingerprint library
 * https://github.com/Valve/fingerprintjs
 * Copyright (c) 2013 Valentin Vasilyev (valentin.vasilyev@outlook.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
!function(e,t,n){"undefined"!=typeof module&&module.exports?module.exports=n():"function"==typeof define&&define.amd?define(n):t[e]=n()}("Fingerprint",this,function(){"use strict";var e=function(e){var t,n;t=Array.prototype.forEach,n=Array.prototype.map,this.each=function(e,n,r){if(null!==e)if(t&&e.forEach===t)e.forEach(n,r);else if(e.length===+e.length){for(var i=0,a=e.length;a>i;i++)if(n.call(r,e[i],i,e)==={})return}else for(var o in e)if(e.hasOwnProperty(o)&&n.call(r,e[o],o,e)==={})return},this.map=function(e,t,r){var i=[];return null==e?i:n&&e.map===n?e.map(t,r):(this.each(e,function(e,n,a){i[i.length]=t.call(r,e,n,a)}),i)},"object"==typeof e?(this.hasher=e.hasher,this.screen_resolution=e.screen_resolution,this.screen_orientation=e.screen_orientation,this.canvas=e.canvas,this.ie_activex=e.ie_activex):"function"==typeof e&&(this.hasher=e)};return e.prototype={get:function(){var e=[];if(e.push(navigator.userAgent),e.push(navigator.language),e.push(screen.colorDepth),this.screen_resolution){var t=this.getScreenResolution();"undefined"!=typeof t&&e.push(t.join("x"))}return e.push((new Date).getTimezoneOffset()),e.push(this.hasSessionStorage()),e.push(this.hasLocalStorage()),e.push(this.hasIndexDb()),document.body?e.push(typeof document.body.addBehavior):e.push("undefined"),e.push(typeof window.openDatabase),e.push(navigator.cpuClass),e.push(navigator.platform),e.push(navigator.doNotTrack),e.push(this.getPluginsString()),this.canvas&&this.isCanvasSupported()&&e.push(this.getCanvasFingerprint()),this.hasher?this.hasher(e.join("###"),31):this.murmurhash3_32_gc(e.join("###"),31)},murmurhash3_32_gc:function(e,t){var n,r,i,a,o,s,h,c;for(n=3&e.length,r=e.length-n,i=t,o=3432918353,s=461845907,c=0;r>c;)h=255&e.charCodeAt(c)|(255&e.charCodeAt(++c))<<8|(255&e.charCodeAt(++c))<<16|(255&e.charCodeAt(++c))<<24,++c,h=(65535&h)*o+(((h>>>16)*o&65535)<<16)&4294967295,h=h<<15|h>>>17,h=(65535&h)*s+(((h>>>16)*s&65535)<<16)&4294967295,i^=h,i=i<<13|i>>>19,a=5*(65535&i)+((5*(i>>>16)&65535)<<16)&4294967295,i=(65535&a)+27492+(((a>>>16)+58964&65535)<<16);switch(h=0,n){case 3:h^=(255&e.charCodeAt(c+2))<<16;case 2:h^=(255&e.charCodeAt(c+1))<<8;case 1:h^=255&e.charCodeAt(c),h=(65535&h)*o+(((h>>>16)*o&65535)<<16)&4294967295,h=h<<15|h>>>17,h=(65535&h)*s+(((h>>>16)*s&65535)<<16)&4294967295,i^=h}return i^=e.length,i^=i>>>16,i=2246822507*(65535&i)+((2246822507*(i>>>16)&65535)<<16)&4294967295,i^=i>>>13,i=3266489909*(65535&i)+((3266489909*(i>>>16)&65535)<<16)&4294967295,i^=i>>>16,i>>>0},hasLocalStorage:function(){try{return!!window.localStorage}catch(e){return!0}},hasSessionStorage:function(){try{return!!window.sessionStorage}catch(e){return!0}},hasIndexDb:function(){try{return!!window.indexedDB}catch(e){return!0}},isCanvasSupported:function(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))},isIE:function(){return"Microsoft Internet Explorer"===navigator.appName?!0:"Netscape"===navigator.appName&&/Trident/.test(navigator.userAgent)?!0:!1},getPluginsString:function(){return this.isIE()&&this.ie_activex?this.getIEPluginsString():this.getRegularPluginsString()},getRegularPluginsString:function(){return this.map(navigator.plugins,function(e){var t=this.map(e,function(e){return[e.type,e.suffixes].join("~")}).join(",");return[e.name,e.description,t].join("::")},this).join(";")},getIEPluginsString:function(){if(window.ActiveXObject){var e=["ShockwaveFlash.ShockwaveFlash","AcroPDF.PDF","PDF.PdfCtrl","QuickTime.QuickTime","rmocx.RealPlayer G2 Control","rmocx.RealPlayer G2 Control.1","RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)","RealVideo.RealVideo(tm) ActiveX Control (32-bit)","RealPlayer","SWCtl.SWCtl","WMPlayer.OCX","AgControl.AgControl","Skype.Detection"];return this.map(e,function(e){try{return new ActiveXObject(e),e}catch(t){return null}}).join(";")}return""},getScreenResolution:function(){var e;return e=this.screen_orientation?screen.height>screen.width?[screen.height,screen.width]:[screen.width,screen.height]:[screen.height,screen.width]},getCanvasFingerprint:function(){var e=document.createElement("canvas"),t=e.getContext("2d"),n="http://valve.github.io";return t.textBaseline="top",t.font="14px 'Arial'",t.textBaseline="alphabetic",t.fillStyle="#f60",t.fillRect(125,1,62,20),t.fillStyle="#069",t.fillText(n,2,15),t.fillStyle="rgba(102, 204, 0, 0.7)",t.fillText(n,4,17),e.toDataURL()}},e});
