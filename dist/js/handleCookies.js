// JavaScript Document
function setCookie(cname, cvalue, exdays) {
    //var d = new Date();
    //d.setTime(d.getTime() + (exdays*24*60*60*1000));
    //var expires = "expires="+d.toUTCString();
   // document.cookie = cname + "=" + cvalue + "; " + expires;
	 window.localStorage.setItem(cname, cvalue);
}
function getCookie(cname) {
    //var name = cname + "=";
   // var ca = document.cookie.split(';');
   var ca = window.localStorage.getItem(cname);
    /*for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }*/
    return ca;
}
function delete_cookie( name ) {
  //document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.localStorage.removeItem(name);
}
function checkCookie(){
	if(navigator.cookieEnabled==true){
		document.cookie="testcookie";
		if(document.cookie.indexOf("testcookie")!=-1){
			return true;
		}else{
			//return false;
			return true;
		}
		
	}else{
		//return false;
		return true;
	}
}