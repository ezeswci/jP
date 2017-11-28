// JavaScript Document
// Link de recomendacion
window.sendMailsInvitatios=[];
setTimeout(function(){startReferFriendsJs();}, 500);
function startReferFriendsJs(){
	if(window.IsLoggedInVar && checkConnection() && $("#recomendationLink").length>0){
		showRecomendationUrl();
	}else{
		setTimeout(function(){startReferFriendsJs()},100);
	}
}
function showRecomendationUrl(){
	var linkText=getCookie("recomendationLinkJPUsu-"+getUserJugaplayId());
	if(linkText.length>4){
		var element=document.getElementById("recomendationLink");
		if (typeof(element) != 'undefined' && element != null)
		{
			document.getElementById("recomendationLink").value=linkText;
			setCookie("recomendationLinkJPUsu-"+getUserJugaplayId(), linkText, 120);
			document.getElementById("recomendationLink").value=linkText;
		}else{
			setTimeout(function(){showRecomendationUrl();}, 500);
		}
	}else{
		askForRequestInvitationId('Link');
	}
}
function inviteFriendsLink(tknRequest){
		var element=document.getElementById("recomendationLink");
		if (typeof(element) != 'undefined' && element != null)
		{
			var linkText="http://www.jugaplay.com/?tkn="+tknRequest;
			setCookie("recomendationLinkJPUsu-"+getUserJugaplayId(), linkText, 120);
			document.getElementById("recomendationLink").value=linkText;
		}else{
			setTimeout(function(){inviteFriendsLink(tknRequest);}, 500);
		}
}
// Copiar el link
function copyRecomendationLink(){
	document.getElementById("recomendationLink").select();
	copySelectedText();
}
function copySelectedText(){
	try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  	} catch (err) {
    avisoEmergenteJugaPlay('Su navegador no soporta la función para copiar automáticamente');
	console.log('Error ' + err);
  }
}
function relocateInvitationRequest(tknRequest, type){
	if(type=="Twitter"){inviteFriendsTwitter(tknRequest);}
	if(type=="Facebook"){inviteFriendsFacebook(tknRequest);}
	if(type=="Whatsapp"){inviteFriendsWhatsapp(tknRequest);}
	if(type=="Mail"){sendMailsRecomendations(tknRequest);}
	if(type=="Link"){inviteFriendsLink(tknRequest);}
	// SMS
}
// Otras funciones de recomendacion!!
function inviteFriendsFacebook(tknRequest){
  document.getElementById('recomendationLink').click();// Hace click para evitar que se bloquee el pop up de Fb
  var linkText="http://www.jugaplay.com/?tkn="+tknRequest;
  window.plugins.socialsharing.share(linkText);
}
function inviteFriendsTwitter(tknRequest){
	var linkText="http://www.jugaplay.com/?tkn="+tknRequest;
	window.plugins.socialsharing.share(linkText);
}
//<a href="whatsapp://send?text=The text to share!" data-action="share/whatsapp/share">Share via Whatsapp</a>
function inviteFriendsWhatsapp(tknRequest){
	//var whatsapp = document.createElement("a");
	var linkText="http://www.jugaplay.com/?tkn="+tknRequest;
	window.plugins.socialsharing.share(linkText);/*
		whatsapp.href='whatsapp://send?text=Te%20desafío%20a%20jugar%20en%20Jugaplay,%20la%20mejor%20competencia%20de%20futbol%20fantasía%20en%20todo%20América.%20Dudo%20que%20me%20puedas%20ganar!\nEntra%20con%20este%20link%20desde%20tu%20celular%20o%20computadora%20así%20me%20haces%20ganar%20monedas:'+linkText+'\nGracias%20:)';
	whatsapp.setAttribute("data-tournament-type", "share/whatsapp/share");
	document.body.appendChild(whatsapp);
	whatsapp.click();*/
}
// Datos para FB
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=1790148521213303";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1790148521213303',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  })
 }
// Datos para Twitter
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js?171113";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
// Invitar Amigos por mail

/* Notificacion de como es el mensaje de contacto */
function inviteFriendsMail(){
		 BootstrapDialog.show({
			 cssClass: 'general-modal-msj',
			 title: "<H1>Invitar por Mail</H1>",
            message: contenidoDeEnviarMailInvitacion(),
			buttons: [{
                label: 'Invitar',
				id:'boton-panel-registro-aviso-error-pop-up',
                action: function(dialogItself){
                    validateMailToSend(dialogItself);
                }
            }]
		 });
	}
function headerDeEnviarMailInvitacion(){
	texto="<div class='row'><div class='cont-img'><img src='../img/beta/pop-ups/pop3.jpg'></div></div><div class='row'><H1>INVITAR A AMIGOS POR MAIL</H1></div>";
	return texto;
}
function contenidoDeEnviarMailInvitacion(){
	linea1="<p>Invita amigos y gana monedas para usarlas como quieras!!  Si deseas ingrear mas de un mail, separalos por comas.</p>";
	linea3="<p></p>";
	linea4="<p>Mail/Mails: </p><input id='mailContactoInvitacion' type='text'>";
	texto=linea1+linea3+linea4;
	return texto;
}
function validateMailToSend(dialog){
	mailsContacto=document.getElementById("mailContactoInvitacion").value;
	if(mailsContacto.length>1){
		window.sendMailsInvitatios=(document.getElementById("mailContactoInvitacion").value).split(",");
		askForRequestInvitationId('Mail');
		dialog.close();
	}else{
			avisoEmergenteJugaPlay("Sin Contenido","<p>El campo mails es obligatorio</p>");
	}
}
function sendMailsRecomendations(tknRequest){
	if(getUserJugaplayEmail()!=null){var sendFrom=getUserJugaplayEmail();}else{var sendFrom="info@jugaplay.com";}
	var linkText="http://www.jugaplay.com/?tkn="+tknRequest;
	var json=JSON.stringify({ "from": "info@jugaplay.com", "to": window.sendMailsInvitatios, "from_user_id":getUserJugaplayId(), "sender_link":linkText, "content_mail":" "});
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
	 	 if ((xmlhttp.readyState==4 && xmlhttp.status==200) ||  (xmlhttp.readyState==4 && xmlhttp.status==422))
	    {
			avisoEmergenteJugaPlay("Muchas Gracias","<p>Muchas gracias por su recomendación</p>");

	    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST",getJPApiURL()+"mailer/send_request",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//xmlhttp.withCredentials = "true";
		xmlhttp.send(json);
}
function askForRequestInvitationId(type){
	json=JSON.stringify({ "type": type });
	startLoadingAnimation();
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
	 	 if ((xmlhttp.readyState==4 && xmlhttp.status==200) ||  (xmlhttp.readyState==4 && xmlhttp.status==422))
	    {
			var jsonStr=xmlhttp.responseText;
			if(IsJsonString(jsonStr)){ // Me fijo si dio un error, en el caso de que de le sigo mandando
			closeLoadingAnimation();
			relocateInvitationRequest( (JSON.parse(jsonStr)).token, type);
				}else{
				askForRequestId(type);
			}

	    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST",getJPApiURL()+"invitation_requests/",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.withCredentials = "true";
		xmlhttp.send(json);
}
