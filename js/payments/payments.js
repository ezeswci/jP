// window.countrySelected 'argentina' 'chile' 'otro'
setTimeout(function(){startPaymentsJs();}, 500);
function startPaymentsJs(){
	if(window.IsLoggedInVar){
		var jugaPlayUserLocationData=getCookie("jp-UserLocationData-"+getUserJugaplayId());
		if(IsJsonString(jugaPlayUserLocationData)&&jugaPlayUserLocationData.length>4){
			var saved=JSON.parse(getCookie("jp-UserLocationData-"+getUserJugaplayId()));
			selectDataCountry(saved.location.country_code);
		}else{
			window.countrySelected='argentina';// Default
			getUserLocationDataFromServer();
		}
	}else{
		setTimeout(function(){startPaymentsJs()},100);
	}
}
function getUserLocationDataFromServer(){
	if(window.IsLoggedInVar && checkConnection2()){
		getUserLocationDataFromServer2();
	}else{
		setTimeout(function(){getUserLocationDataFromServer()},100);
	}
}
function getUserLocationDataFromServer2(){
	var json=JSON.stringify( { "user_id":getUserJugaplayId() } );
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
			if(IsJsonString(jsonStr)) { // Me fijo si dio un error, en el caso de que de le sigo mandando
				processUserLocationDataFromServer(JSON.parse(jsonStr),"get");
			}
    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
		}
 	}
	xmlhttp.open("POST",getJPDataURL()+"get_location.php",true);// El false hace que lo espere
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	//xmlhttp.withCredentials = "true";
	xmlhttp.send(json);
}
function setUserLocationDataFromServer(){
	if(window.IsLoggedInVar && checkConnection2()){
		setUserLocationDataFromServer2();
	}else{
		setTimeout(function(){setUserLocationDataFromServer()},100);
	}
}
function setUserLocationDataFromServer2() {
	var json=JSON.stringify( { "user_id":getUserJugaplayId() } );
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
				processUserLocationDataFromServer(JSON.parse(jsonStr),"set");
			}
	    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST",getJPDataURL()+"set_location.php",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//xmlhttp.withCredentials = "true";
		xmlhttp.send(json);
}

function processUserLocationDataFromServer(data,type) {
	if(data.hasOwnProperty('error')){
		if(type!="set"){
			setUserLocationDataFromServer();
		}else{
			notifyCountryIpError();
		}
	}else{
		setCookie("jp-UserLocationData-"+getUserJugaplayId(), JSON.stringify(data), 120);
		selectDataCountry(data.location.country_code);
	}
}

function selectDataCountry(actualCountry){
		if(actualCountry=="CL"){// Entra desde chile
			var country="chile";
		}else if(actualCountry=="AR"){// Entra desde argentina
			var country="argentina";
		}else if(actualCountry=="PE"){// Entra desde Peru
			var country="peru";
		}else if(actualCountry=="MX"){// Entra desde Mexico
			var country="mexico";
		}else{// Entra desde un pais global
			var country="otro";
		}
		window.countrySelected=country;
}

// Ends location
function openBuyChips(){
	changeContentOfPayment(window.countrySelected);// Default
}

function openNewWindowWithCheckControl(content){
	window.childForPaymentWindow = window.open('');
	window.childForPaymentWindow.document.body.innerHTML=content;
	window.childForPaymentWindow.document.getElementById("myPaymentForm").submit();
	window.timerForPaymentWindow = setInterval(checkChildWindowOpened, 500);
}
function checkChildWindowOpened() {

  if (window.childForPaymentWindow.closed) {
		clearInterval(window.timerForPaymentWindow);
		paymentModal.onTransactionFailed("<span class='trn'>La transacción ha sido cancelada.</span>");
		jpAnalyticsEvent('PAYMENT_CANCELED','',0);
  }
}
function paymentWentWrong() {
	clearInterval(window.timerForPaymentWindow);
	jpAnalyticsEvent('PAYMENT_FAILED','',0);
	paymentModal.onTransactionFailed("<span class='trn'>No se ha podido finalizar el pago debido a un problema temporal con la conexión. Si persiste este problema, póngase en contacto con el servicio de soporte técnico a info@jugaplay.com.</span>");
}
function paymentAccepted() {
		clearInterval(window.timerForPaymentWindow);
		editXChipsFromUsersWallet(parseInt(paymentModal.pack.replace('pack','')));
		paymentModal.onTransactionSuccess();
}
function paymentWait() {
		clearInterval(window.timerForPaymentWindow);
		closeAllOverLapseWindow();
    avisoEmergenteJugaPlay("<span class='trn'>Pago en espera</span>","<span class='trn'>El pago esta en espera, una vez procesado se acreditaran las monedas</span>");
}


function buyChips() {
	var useId='BS-FL-'+Math.floor((Math.random() * 1000000000) + 1);
	var props = {
		'{USE_ID}': useId
	}
	BootstrapDialog.show({
		id: useId,
		cssClass: 'filter-pop-up fade modal-lack-chips',
		title: '<h1><span class="trn">Conseguir Fichas</span><img src="img/icons/coins/chip.svg" class="modal-chip-icon"></h1>',
		message:parseTemplate(props,TEMPLATE_LACK_CHIPS_POPUP),
		onshown: function(dialogItself) {
								checkLanguageItem(dialogItself);
							}
	});
}




function buyChipsforVideos(){
	//
	$("#videoAdBtn").button('loading');
	var appKey = "eff9233a954137730a233b09f819b37e6d4d04e901ec4e06";
	Appodeal.disableLocationPermissionCheck();
	Appodeal.initialize(appKey, Appodeal.REWARDED_VIDEO);
	var callback = function(unit){
		  Appodeal.show(Appodeal.REWARDED_VIDEO);
			document.addEventListener('onRewardedVideoLoaded', function(){});
			document.addEventListener('onRewardedVideoFailedToLoad', function(){jpAnalyticsEvent('ERROR_VIDEOAD','APPODEAL',0);avisoEmergenteJugaPlay("<span class='trn'>Sin vídeo disponible</span>","<span class='trn'>En este momento no hay vídeos disponibles, por favor intente más tarde</span>");});
			document.addEventListener('onRewardedVideoShown', function(){});
			document.addEventListener('onRewardedVideoFinished', function(data){
			  //console.log('Reward:' + data.amount + ' ' + data.name);  //data.amount  - amount of reward, data.name - reward name
				$("#videoAdBtn").button('reset');
				jpAnalyticsEvent('START_VIDEOAD','APPODEAL','Reward:' + data.amount + ' ' + data.name);
				setTimeout(function(){addChipsToWallet(1);},500);
			});
			document.addEventListener('onRewardedVideoClosed', function(){});
		}
	/*if(window.kiipInstanceInitial){
		window.kiipInstance.postMoment('Fichas')
	}else{
		initializeKiipvideos();
	}*/
}
function buyChipsforPolls(windowToClose){
	 closeFilterWindow(windowToClose);
	 window.location='surveys.html';
}
/* Fin Nuevo para las fichas */
function buyChipsforMoney(windowToClose) {
	closeFilterWindow(windowToClose);
	openPaymentsModal();
}
function paymentShowBuyOptions(content){
		 BootstrapDialog.show({
			 cssClass: 'general-modal-msj payment',
			 title: '<H4><span class="trn">Comprar Fichas</span> <img src="img/icons/coins/chip.svg" style="margin-right: 0px;margin-top: -10px;margin-bottom: -3px;margin-left: 5px;width: 30px;"></H4>',
       message: content,
			 onshown: function(dialogItself) {
	 								checkLanguageItem(dialogItself);
									changeContentOfPayment(window.countrySelected);
	 							}
		 });
		 //setTimeout(function(){changeContentOfPayment(window.countrySelected);}, 1000);
		 return false;
	}

function notifyCountryIpError() {
	var contenidoContacto= "Error en IP data-- USU id: "+window.userDataJugaPlay.id+ "-- Mail ingresado: "+getUserJugaplayEmail();
	var json=JSON.stringify( { "comment": { "sender_name": "IP DATA","sender_mail": getUserJugaplayEmail(),"content": contenidoContacto } } );
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

  	}else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
		}
 	}
	xmlhttp.open("POST",getJPApiURL()+"comments",true);// El false hace que lo espere
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.withCredentials = "true";
	xmlhttp.send(json);
}

// =============================================================================
// -------------------------------   TEMPLATES   -------------------------------
// =============================================================================
/*
var props = {
	'{USE_ID}':
}
*/
var TEMPLATE_LACK_CHIPS_POPUP = ''
		+'<div class="container-fluid nopadding">'
		+'	<div class="row">'
		+'		<div class="col-xs-12">'
		+'			<p class="modal-lack-chips-content">'
		+'				<h4><span class="trn">ENCUESTAS</span> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></h2>'
		+'				<span class="trn">Gana fichas completando nuestras encuestas.</span>'
		+'				<br/>'
		+'				<span class="trn">Nos interesa tu opinión. ¡Tu tiempo vale!</span>'
		+'				<br /><br/>'
		+'				<button class="btn btn-success btn-fancy" onClick="buyChipsforPolls(\'{USE_ID}\');"><span class="trn">Completar encuesta</span> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>'
		+'			</p>'
		+'			<!--p class="modal-lack-chips-content">'
		+'				<h4><span class="trn">PACK DE FICHAS</span> <i class="fa fa-shopping-cart" aria-hidden="true"></i></h2>'
		+'				<span class="trn">También podés comprar fichas de forma rápida y fácil. Utiliza tu medio de pago seguro favorito: MercadoPago, Paypal, Paysafe Card.</span>'
		+'				<br/><br/>'
		+'				<button class="btn btn-success btn-fancy" onClick="buyChipsforMoney(\'{USE_ID}\');"><span class="trn">Comprar Fichas</span> <i class="fa fa-shopping-cart" aria-hidden="true"></i></button>'
		+'			</p>'
		+'			<p class="modal-lack-chips-content">'
		+'				<h4><span class="trn">VIDEO ADS</span> <i class="fa fa-play-circle" aria-hidden="true"></i></h2>'
		+'				<span class="trn">Por cada video ad de 60 segundos aprox que mires adquirís una ficha! (Máximo 10 vídeo ads por día)</span>'
		+'				<br/><br/>'
		+'				<button class="btn btn-success btn-fancy" data-loading-text="<i class=\'fa fa-spinner fa-spin\'></i>" id="videoAdBtn" onClick="buyChipsforVideos();"><span class="trn">Ver vídeo</span> <i class="fa fa-play-circle" aria-hidden="true"></i></button>'
		+'			</p-->'
		+'		</div>'
		+'	</div>'
		+'</div>'
