menuInsertLineTitle=menuGetMenuTitle();
menuInsertLineCoins=menuGetAmountOfCoins();
menuInsertLineNick=menuGetNickName();
menuProfileImage=menuGetImage();
menuInsertLine='<nav class="navbar navbar-default navbar-fixed-top main-nav"><div class="container-fluid main-nav-container"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed btn-sanwich-menu" data-toggle="collapse" data-target="#top-navbar-collapse" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><button type="button" class="navbar-toggle navbar-right btn-navbar-back"></button><h4 class="text-center">'+menuInsertLineTitle+'</h4></div><div class="collapse navbar-collapse menu-jp-to-update" id="top-navbar-collapse"><div class="top-nav-user"><img src="'+menuProfileImage+'"><p>'+menuInsertLineNick+'</p></div><div class="row top-nav-stats"><div class="col-xs-12 coins"><h2>'+menuInsertLineCoins+'</h2><h4>Monedas</h4></div></div><ul class="nav navbar-nav navbar-right"><li><a href="game.html">Juego</a></li><li><a href="referal.html">Gana <img src="img/icons/coins/coins.gif" width="15px"> ¡invita amigos!</a></li><li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tienda<span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="store.html">Premios</a></li><li><a href="exchanged.html">Canjeados</a></li></ul> </li><li><a href="history.html">Historial</a></li><li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Jugadores<span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="ranking.html">Ranking</a></li><li><a href="champions.html">Campeones</a></li></ul> </li><li><a href="profile.html">Perfil</a></li><li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Ayuda<span class="caret"></span></a> <ul class="dropdown-menu"> <li><a href="how-to-play.html">Como jugar</a></li><li><a href="frecuent-questions.html">Preguntas frecuentes</a></li><li><a href="suport.html">Soporte</a></li><li><a href="tables-scores.html">Reglas y puntajes</a></li><li><a href="privacity.html">Privacidad</a></li><!--li><a href="terms-and-conditions.html">Terminos y condiciones</a></li--></ul> </li><li><a onClick="logOutFromJugaPlay();">Log Out</a></li></ul></div></div></nav>';
document.write(menuInsertLine);							
function menuGetAmountOfCoins(){
	if(window.userDataJugaPlay!=null){
		return window.userDataJugaPlay.coins+' ';// Add space to be treated as text
	}else{
		return '...';// Add space to be treated as text
	}
	
}
function menuGetNickName(){
	if(window.userDataJugaPlay!=null){
		return window.userDataJugaPlay.nickname;
	}else{
		return '...';// Add space to be treated as text
	}
	
}
function menuGetImage(){
	if(window.userDataJugaPlay!=null){
		if(window.userDataJugaPlay.image!=null && imageMenuExists(window.userDataJugaPlay.image)){
			return window.userDataJugaPlay.image;
		}else{
			return 'img/icons/user-profile-no-img.jpg';
		}
	}else{
		return 'img/icons/user-profile-no-img.jpg';
	}
	
}
function imageMenuExists(image_url){
   /* var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404; */
	return true;
}
function menuGetMenuTitle(){
	return window.menuTitleOfWindow;
}
