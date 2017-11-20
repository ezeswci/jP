// JavaScript Document
/*
0- Acordarse de las encuestas de pollfish
1- Solicitar al servidor una encuesta, ver el valor.
2- Si hay encuesta cambiar el boton
3- Si falta tiempo poner un contador
4-
*/
window.actualInternalSurveyAnswers=[];
window.actualInternalSurveyOption=null;
window.internalServerSituation="Loading";
setTimeout(function(){askServerForInternalSurveys();},1000);
function askServerForInternalSurveys(){
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
				processUsersSurveysDataFromServer(JSON.parse(jsonStr));
			}
	    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST",getJPDataURL()+"get_surveys.php",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//xmlhttp.withCredentials = "true";
		xmlhttp.send(json);
		//processUsersSurveysDataFromServer(JSON.parse('{"survey":{"survey_id":"0","name":"Encuesta demografica","duration":"30","chips":"1","amount_questions":"7"}}'));
}
function processUsersSurveysDataFromServer(surveys){
	if(surveys.hasOwnProperty("next_survey_in_seconds")){
		changeInternalSurveyButtonWait(surveys.next_survey_in_seconds);
	}else{
		window.actualInternalSurveyOption=surveys.survey;
		changeInternalSurveyButton("normal",surveys.survey.chips);
	}
}
function changeInternalSurveyButton(option,chips){
	window.internalServerSituation=option;
	var internalButton=document.getElementById("internal-Surveys-Button");
	switch(window.internalServerSituation){
		case "pollfish":
			internalButton.classList="btn btn-large btn-block btn-success btn-poll active";
			internalButton.innerHTML='<span class="trn">¡Promo! Responde YA!</span> + '+chips+' <img src="img/icons/coins/chip.svg" style="margin-right: 0px;margin-top: -10px;margin-bottom: -3px;margin-left: 5px;width: 30px;">';
			break;
		default: // "normal"
			internalButton.classList="btn btn-large btn-block btn-success btn-poll";
			internalButton.innerHTML='<span class="trn">CONTESTAR</span> + '+chips+' <img src="img/icons/coins/chip.svg" style="margin-right: 0px;margin-top: -10px;margin-bottom: -3px;margin-left: 5px;width: 30px;">';
	}
	checkLanguageElement(internalButton);
}
function changeInternalSurveyButtonWait(seconds){
	window.internalServerSituation="wait";
	window.actualInternalSurveyOption=null;
	var internalButton=document.getElementById("internal-Surveys-Button");
	internalButton.classList="btn btn-next-poll btn-block polls-margin-space1";
	internalButton.innerHTML='<span class="trn">Próxima encuesta en</span> <b class="button-wait-class">...</b>';
	countDownButtonWait(seconds);
	checkLanguageElement(internalButton);

}
function countDownButtonWait(seconds){
  // Set the date we're counting down to
  var countDownDate = new Date();
  countDownDate.setSeconds(countDownDate.getSeconds() + parseInt(seconds));
  countDownDate = countDownDate.getTime();
  // Update the count down every 1 second
  var x = setInterval(function() {
  // Get todays date and time
  var now = new Date().getTime();
  // Find the distance between now an the count down date
  var distance = countDownDate - now;
  // Time calculations for days, hours, minutes and seconds
  var hours = parseInt((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = parseInt((distance % (1000 * 60)) / 1000);
  //alert(hours + ":"+ minutes + ":" + seconds);
  $(".button-wait-class").text(hours + ":"+ parse0Xtoshow(minutes) + ":" + parse0Xtoshow(seconds));
	if (distance < 0) {askServerForInternalSurveys();}
  }, 200);
}
function parse0Xtoshow(val){
	if(val<10){return"0"+val}else{return val;}
}
function answerInternalSurvey(){
	switch(window.internalServerSituation){
		case "normal":
			startInternalSurvey();
			break;
		case "pollfish":
			tryToDoPollfishSurveyOrSendToSurveys();
			break;
		case "wait":
			avisoEmergenteJugaPlay("<span class='trn'>A esperar!!</span>","<p class='trn'>Hay encuestas limitadas, por lo que tiene que esperar para la próxima.</p>");
			break;
		default: // "Loading"
			avisoEmergenteJugaPlay("<span class='trn'>Cargando</span>","<p class='trn'>Por favor espere mientras se cargan las opciones.</p><p class='trn'>Si esto persiste verifique su conexión.</p>");
	}
}
// Logica de aparicion de la encuesta
function startInternalSurvey(){
	startLoadingAnimation();
	var json=JSON.stringify( { "user_id":getUserJugaplayId(), "survey_id":window.actualInternalSurveyOption.survey_id} );
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
			closeLoadingAnimation();
			if(IsJsonString(jsonStr)){ // Me fijo si dio un error, en el caso de que de le sigo mandando
				processUsersSurveyDataFromServer(JSON.parse(jsonStr));
			}
	    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST",getJPDataURL()+"get_survey.php",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//xmlhttp.withCredentials = "true";
		xmlhttp.send(json);
		//processUsersSurveysDataFromServer(JSON.parse('{"survey":{"survey_id":"0","name":"Encuesta demografica","duration":"30","chips":"1","amount_questions":"7"}}'));
}
function processUsersSurveyDataFromServer(survey){
	if(survey.hasOwnProperty("error")){
		avisoEmergenteJugaPlay("Contestada","<p>Esta encuesta fue contestada desde otro dispositivo.</p>");
		askServerForInternalSurveys();
	}else{
		// questions
		window.actualInternalSurveyOption.questions=survey.survey.questions;
		window.actualInternalSurveyOption.questions.sort(sortQuestionsAndAnswersByOrder);
		startShowingInternalSurvey();
	}
}
//$json["survey"]= array("survey_id"=>0,"name"=>"Encuesta demografica","duration"=>140,"chips"=>1,"amount_questions"=>7);
function startShowingInternalSurvey(){
	$("body").append('<div class="navbar navbar-fixed-top nav-polls"><div class="col-xs-2 nopadding"> <a class="btn sharp no-margin btn-danger btn-lg btn-block" href="#" role="button" onclick="closeInternalSurveyPanel();"><i class="fa fa-times-circle fa-2x" aria-hidden="true"></i></a> <!--a class="btn sharp no-margin btn-info btn-lg btn-block" href="#" role="button"><i class="fa fa-info-circle fa-2x" aria-hidden="true"></i></a--> </div><div class="col-xs-10 poll-container text-color7  text-center"> <h3 class="text-color9 polls-margin-space1 trn">Comparta su opinión sobre las cosas que importan!</h3> <h4 class="text-color9 polls-margin-space3">'+window.actualInternalSurveyOption.name+'</h4> <img src="img/icons/polls/back-poll.jpg" class="row polls-margin-space3" style="width: calc(100% + 30px);border-top: #f3f6f7 25px solid;border-bottom: #f3f6f7 25px solid;"> <button type="button" class="btn btn-warning btn-lg btn-block polls-margin-space1 trn" onclick="nextQuestionForSuervey()">Comenzar</button> <footer class="footer"> <p><a href="#" onclick="closeInternalSurveyPanel();" class="trn">No, gracias</a></p><!--p>Al tomar esta encuesta<br>Usted acepta nuestros <span class="text-color3">Términos y Condiciones</span></p--></footer></div></div>').after(function() {
            var left = $('.nav-polls').width();
			 $(".nav-polls").css({left:left}).after(function() {
				 $(".nav-polls").animate({"left":"0px"}, "slow");
			 });
        });
	jpAnalyticsEvent("OPEN_POLL", 'Jugaplay', 0);
	checkLanguageElement($("body"));
}
function nextQuestionForSuervey(){
	window.startTimeForQuestion=new Date();
	if(window.actualInternalSurveyAnswers.length<window.actualInternalSurveyOption.amount_questions){
		if($(".poll-container").hasClass("text-center")){$(".poll-container").removeClass("text-center");$(".poll-container").addClass("text-left");}
		$(".poll-container").html(parseNextQuestionForSuervey(window.actualInternalSurveyOption.questions[window.actualInternalSurveyAnswers.length])).after(function() {
            checkQuestionsForSelection(window.actualInternalSurveyOption.questions[window.actualInternalSurveyAnswers.length]);
        });;// Agarra la pregunta proxima a responder
	}else{
		endSurveySendAnswersToServer();
	}
	checkLanguageElement($(".poll-container"));
}
function parseNextQuestionForSuervey(question){
	window.arrSelectedForAnswer=[];
	$(".poll-container").scrollTop(0);
	var opt;
	switch(question.type){
		  case "single_selection":
			opt=parseNextQuestionForSuerveySingleSelection(question);
			break;
		case "multiple_selection":
			opt=parseNextQuestionForSuerveyMultipleSelection(question);
			break;
		case "date_picker":
			opt=parseNextQuestionForSuerveyDatePicker(question);
			break;
		default:
			// Que pasa si no tiene esta modalidad, tendria que buscar en internet no?
	}
	return createProgressBar()+opt;
}
function checkQuestionsForSelection(question){
	switch(question.type){
		  case "single_selection":
			checkQuestionsForSingleSelection();
			break;
		case "multiple_selection":
			checkQuestionsForMultipleSelection();
			break;
		case "date_picker":
			checkQuestionsForDatePicker();
			break;
		default:
			// Que pasa si no tiene esta modalidad, tendria que buscar en internet no?
	}
}
// ------- single_selection
function parseNextQuestionForSuerveySingleSelection(question){
	var opts='';
	for(answer in question.answers){
		opts+='<label class="btn sharp btn-poll btn-block"><input type="radio" name="options" value="'+question.answers[answer].order+'"  autocomplete="off">'+question.answers[answer].content+'</label>';
	}
	return '<h4 class="text-color9 polls-margin-space3">'+question.content+'<br><small class="trn">Elija una</small></h4><div class="answers polls-margin-space1"><div class="btn-group btn-block text-left" data-toggle="buttons">'+opts+'</div></div><button type="button" id="btn-Next-Int-Jp" class="btn btn-lg btn-block polls-margin-space1 trn" data-trigger="focus" onClick="nextQuestionForInternalSurveyJp()" data-placement="top" data-content="Elegir una opcion">Elegir</button></div>';
}
function checkQuestionsForSingleSelection(){
	$('input:radio').change(
			function(){
				$('#btn-Next-Int-Jp').popover('hide');
				if ($(this).is(':checked')) {
					window.arrSelectedForAnswer=[$(this).val()];
				}else{
					window.arrSelectedForAnswer=[];
				}
				if(window.arrSelectedForAnswer.length>0){
					if(!$("#btn-Next-Int-Jp").hasClass("btn-success")){
						$("#btn-Next-Int-Jp").addClass("btn-success");
						$("#btn-Next-Int-Jp").html("<span class='trn'>Siguiente</span>");
					}
				}else{
					if(!$("#btn-Next-Int-Jp").hasClass("btn-success")){
						$("#btn-Next-Int-Jp").removeClass("btn-success");
						$("#btn-Next-Int-Jp").html("<span class='trn'>Elegir</span>");
					}
				}
				checkLanguageElement($("#btn-Next-Int-Jp"));
			});
}
// ------- multiple_selection
function parseNextQuestionForSuerveyMultipleSelection(question){
	var opts='';
	for(answer in question.answers){
		opts+='<label class="btn sharp btn-poll btn-block"><input type="checkbox" value="'+question.answers[answer].order+'"  autocomplete="off">'+question.answers[answer].content+'</label>';
	}
	return '<h4 class="text-color9 polls-margin-space3">'+question.content+'<br><small class="trn">Elija al menos una</small></h4><div class="answers polls-margin-space1"><div class="btn-group btn-block text-left" data-toggle="buttons">'+opts+'</div></div><button type="button" id="btn-Next-Int-Jp" class="btn btn-lg btn-block polls-margin-space1 trn" data-trigger="focus" onClick="nextQuestionForInternalSurveyJp()" data-placement="top" data-content="Elegir una opcion">Elegir</button></div>';
}
function checkQuestionsForMultipleSelection(){
	$('input:checkbox').change(
			function(){
				$('#btn-Next-Int-Jp').popover('hide');
				if ($(this).is(':checked')) {
					window.arrSelectedForAnswer.push($(this).val());
				}else{
					var index=window.arrSelectedForAnswer.indexOf($(this).val());
					if(index>-1){window.arrSelectedForAnswer.splice(index, 1);}
				}
				if(window.arrSelectedForAnswer.length>0){
					if(!$("#btn-Next-Int-Jp").hasClass("btn-success")){
						$("#btn-Next-Int-Jp").addClass("btn-success");
						$("#btn-Next-Int-Jp").html("<span class='trn'>Siguiente</span>");
					}
				}else{
					if(!$("#btn-Next-Int-Jp").hasClass("btn-success")){
						$("#btn-Next-Int-Jp").removeClass("btn-success");
						$("#btn-Next-Int-Jp").html("<span class='trn'>Elegir</span>");
					}
				}
				checkLanguageElement($("#btn-Next-Int-Jp"));
			});
}
// ------- date_picker
function parseNextQuestionForSuerveyDatePicker(question){
	var opts='';
	for(answer in question.answers){
		opts+='<label class="btn sharp btn-poll btn-block"><input type="checkbox" value="'+question.answers[answer].order+'"  autocomplete="off">'+question.answers[answer].content+'</label>';
	}
	return '<h4 class="text-color9 polls-margin-space3">'+question.content+'<br><small class="trn">Completar</small></h4><div class="answers polls-margin-space1"><input type="date" class="date-picker" id="datePickerInput"></div><button type="button" id="btn-Next-Int-Jp" class="btn btn-lg btn-block polls-margin-space1 trn" data-trigger="focus" onClick="nextQuestionForInternalSurveyJp()" data-placement="top" data-content="Completar fecha con un valor valido">Elegir</button></div>';
}
// datePickerInput
function checkQuestionsForDatePicker(){
	$('#datePickerInput').change(
			function(){
				$('#btn-Next-Int-Jp').popover('hide');
				if(new Date() > new Date($(this).val())){
					if(!$("#btn-Next-Int-Jp").hasClass("btn-success")){
						$("#btn-Next-Int-Jp").addClass("btn-success");
						$("#btn-Next-Int-Jp").html("<span class='trn'>Siguiente</span>");
					}
				}else{
					if(!$("#btn-Next-Int-Jp").hasClass("btn-success")){
						$("#btn-Next-Int-Jp").removeClass("btn-success");
						$("#btn-Next-Int-Jp").html("<span class='trn'>Elegir</span>");
					}
				}
				checkLanguageElement($("#btn-Next-Int-Jp"));
			}
			);
}
// -------- General for all polls
function nextQuestionForInternalSurveyJp(){
	if(validateAnswerForNextQuestion()){
		$('#btn-Next-Int-Jp').popover('hide');
			saveQuestionForSuerveyAndNext();
	}else{
		$('#btn-Next-Int-Jp').popover('show')
	}
}
function validateAnswerForNextQuestion(){
	switch(window.actualInternalSurveyOption.questions[window.actualInternalSurveyAnswers.length].type){
		case "single_selection":
		case "multiple_selection":
			return window.arrSelectedForAnswer.length>0;
		case "date_picker":// Date picker si agrego antes el valor lo lee mal
			window.arrSelectedForAnswer=[];
			window.arrSelectedForAnswer.push($('#datePickerInput').val());
			return new Date() > new Date($('#datePickerInput').val());
		default:
		// Que pasa si no tiene esta modalidad, tendria que buscar en internet no?
	}
}
function createProgressBar(){
	var nro=window.actualInternalSurveyAnswers.length;
	var length=window.actualInternalSurveyOption.questions.length;
	var c="";
	var w=parseInt(nro/length*100);
	if(w<10){w=10;}
	if(nro==length){c="progress-bar-success";}
	return '<div class="progress"> <div class="progress-bar '+c+' progress-bar-striped active" role="progressbar" aria-valuenow="'+w+'" aria-valuemin="0" aria-valuemax="100" style="width:'+w+'%"> '+String(nro+' / <b>'+length+'</b>')+' </div></div>';
}
function saveQuestionForSuerveyAndNext(){
	var endTime   = new Date();
	var seconds = parseInt((endTime.getTime() - window.startTimeForQuestion.getTime()) / 1000);
	// {"order":1,"answers":[1],"duration":30}, {"order":1,"answers":[1,2],"duration":30}, {"order":1,"answers":["Algo"],"duration":30}
	var answer={"order":window.actualInternalSurveyOption.questions[window.actualInternalSurveyAnswers.length].order,"answers":window.arrSelectedForAnswer,"duration":seconds}
	window.actualInternalSurveyAnswers.push(answer);
	nextQuestionForSuervey();
}

function sortQuestionsAndAnswersByOrder(a,b){ // -1 va antes 1 despues 0 mantiene
        return (a.order < b.order) ? -1 : 1;
}
// ------------------------ End Survey ---------------------
function endSurveySendAnswersToServer(){
	startLoadingAnimation();
	var json=JSON.stringify( {"survey":{ "user_id":getUserJugaplayId(), "survey_id":window.actualInternalSurveyOption.survey_id, "questions":window.actualInternalSurveyAnswers}} );
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
			closeLoadingAnimation();
			if(IsJsonString(jsonStr)){ // Me fijo si dio un error, en el caso de que de le sigo mandando
				processUsersEndOfSurveyDataFromServer(JSON.parse(jsonStr));
				jpAnalyticsEvent("COMPLETED_POLL", 'Jugaplay', 0);
			}else{
				avisoEmergenteJugaPlayConnectionError();
			}
	    }else if(xmlhttp.status==503 || xmlhttp.status==404 || xmlhttp.status==105){// Esto es si el servidor no le llega a poder responder o esta caido
			 avisoEmergenteJugaPlayConnectionError();
			 return "ERROR";
			}
	 	 }
		xmlhttp.open("POST",getJPDataURL()+"answer_survey.php",true);// El false hace que lo espere
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		//xmlhttp.withCredentials = "true";
		xmlhttp.send(json);
}
function processUsersEndOfSurveyDataFromServer(endSurvey){
	// $json["transaction"]=array("survey_id"=>$survey_id, "surv_chips"=>$surv_chips);
	if(endSurvey.hasOwnProperty("transaction")){
		showUserEndOfSuervey(endSurvey.transaction.surv_chips);
	}else{
		// Ocurrio un error, como lo manejamos?
		avisoEmergenteJugaPlayConnectionError();
	}
}
function showUserEndOfSuervey(surv_chips){
	$(".poll-container").scrollTop(0);
	$(".poll-container").html('<h3 class="text-color9 polls-margin-space1 text-center trn">¡Muchas gracias!</h3> <h4 class="text-color9 polls-margin-space1 text-center trn">Ha finalizado la encuesta. <br><small>¡Oprime el botón para cobrar las monedas!</small></h4> <button type="button" class="btn btn-next-poll btn-block polls-margin-space1" id="internal-Surveys-Button" onclick="answerInternalSurvey();"><span class="trn">Próxima encuesta en</span> <b class="button-wait-class">24:00:00</b></button> <button type="button" id="btn-sig" class="btn btn-lg btn-info btn-block polls-margin-space1" data-trigger="focus" onClick="collectChipsAnimationAndClose(\''+surv_chips+'\')" data-placement="top" data-content="Elegir una opcion"><span class="trn">COBRAR</span> + '+surv_chips+' <img src="img/icons/coins/chip.svg" style="margin-right: 0px;margin-top: -10px;margin-bottom: -3px;margin-left: 5px;width: 30px;"></button> ');
	if($(".poll-container").hasClass("text-left")){$(".poll-container").removeClass("text-left");$(".poll-container").addClass("text-center");}
	checkLanguageElement($(".poll-container"));
	changeInternalSurveyButtonWait(86400);// Por ahora los segundo vienen pre seteados
}
function collectChipsAnimationAndClose(amount){
	closeInternalSurveyPanel()
	addChipsToWallet(amount);
}
// ------------- Extra functions
function closeInternalSurveyPanel(){
	  // Get the calculated left position
	  var left = $('.nav-polls').width();
	 $(".nav-polls").animate({"left":left+"px"}, "slow", function() {$(this).remove()});
	 jpAnalyticsEvent("CLOSE_POLL", 'Jugaplay', 0);
}
