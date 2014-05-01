/**
 * util.js
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date       31/01/2014
 * @version    0.1
 * @revision   $1$
 *
 * @date revision   01/05/2014 : capitalize
 *
 * Quelques additions utiles en Javascript
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/*
  * Espace de nommage
  */
var pxUtil = { };


/**
 * Gère la sélection d'un element input
 * 
 * @param {HTMLInputElement} inputElt : le champ à sélectionner
 * 
 * @return {} Returns 
 */
pxUtil.select = function( inputElt ) { return inputElt.setSelectionRange(0, inputElt.value.length); }

// Selection d'un champ sur un click
pxUtil.selectOnClick = function( event ) { return pxUtil.select( event.currentTarget ); };
//           --------------------

Date.toLocaleDateStringSupportsLocales = function () {
    try {
        new Date().toLocaleDateString("i");
    } catch (e) {
        return e.name === "RangeError";
    }
    return false;
}

/*
 * Surcharge des objets Javascript
 */
/*
  * Classique troncature des espaces de part et d'autre d'une chaine
  */
// Devenu obsolete : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Browser_compatibility
// String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, "");};
//                              -------
/**
 * Répétion d'une chaine
 * 
 * @param {Number} nb : le nombre de répétition
 * @return {String} La chaine répètée 
 */
String.prototype.repeat = String.prototype.repeat || function( nb ){
//                              ----------
  return (nb > 0) ? this + this.repeat( nb - 1 ) : '' ;
};
String.prototype.rpad = String.prototype.lpad || function( str, lg ){
//                              ----------
  return (lg > 0) ? this.concat( str.repeat( lg ) ).slice( 0, lg ) : '' ;
};
String.prototype.lpad = String.prototype.lpad || function( str, lg ){
//                              ----------
  return (lg > 0) ? str.repeat( lg ).concat(this).slice( -lg ) : '' ;
};

/**
 * Checks if the string starts with the given substring
 * @param  {String} strStartsWith   Substring to check starting with
 * @return {Boolean}    true if string starts with the given substring, false otherwise
 * @author Tomislav Capan
 */
String.prototype.startsWith = String.prototype.startsWith || function(strStartsWith) {
  return strStartsWith === this.substring(0, strStartsWith.length);
};

/**
 * Capitalise une chaine
 * @param  aucun
 * @return {String}    La chaine avec totes les premières lettres en majuscule
 * ne fonctionne que sur les chaines ascii
 */
String.prototype.capitalize = function () {
    return this.toLowerCase().replace( /(^|\s)([a-z])/g, function(match) { return match.toUpperCase(); } );
};
  
Number.prototype.toTimeString = function() {
//                               -------------------
	var timeString = "";
	
	if(this > 0){
		var s = this % 60,
			m = (( this - s ) / 60) % 60,
			h = ( this - ( 60 * m ) - s ) / 3600;
    timeString = "" + h + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
//		ret = "" + h + "h" + ("0" + m).slice(-2);
	}
	
	return timeString;
}
/**
 * L'Objet Date support t'il la localisation ,
  * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#Example:_Checking_for_support_for_locales_and_options_arguments
  * @return {Boolean}  
 */
Date.toLocaleDateStringSupportsLocales = function () {
    try {
        new Date().toLocaleDateString("i");
    } catch (e) {
        return e.name === "RangeError";
    }
    return false;
}

/**
 * L'Objet Date sait revoyer la liste des noms de mois
 * @param  {String} locales   Langage identifier ('fr', 'es','en' ...)
 * @param  {String} optMonth   'long', 'short', .... 
 * 			see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#Example:_Using_options
 * @return {Array}   month name array
 * @author marc laville
 */
Date.monthNames = Date.monthNames || function( locales, optMonth ) {
//       ---------------
	var arrMonth = [],
		lang = Date.toLocaleDateStringSupportsLocales()  ? (locales || window.navigator.language) : window.navigator.language,
		indexMonth = 2; // Month position in the String returned to toLocaleString 
	switch( (lang.split('-'))[0] ) {
		case 'bg' : ;
		case 'en' : ;
		case 'ko' : indexMonth = 1;
			break ;
		case 'es' : ;
		case 'pt' : ;
		case 'sv' : indexMonth = 3;
			break ;
		default : ;
	}

    for( var dateRef = new Date(2001, 0, 10), m = 0, arr = [] ; m < 12 ; m++ ) {
	
		dateRef.setMonth(m);
		arr = dateRef.toLocaleDateString( lang, { month: optMonth || "long" } ).split(' ');
		arrMonth.push( arr[ arr.length > 1 ? indexMonth : 0 ].replace(/,$/g, "") );
	}
	
	return arrMonth;
}

/*
 * L'Objet Date sait revoyer la liste des noms de jour
 * locales n'est pas supporté par FireFox
 */
Date.dayNames = Date.dayNames || function( locales ) {
//       ---------------
	var arrDay = [],
		dateRef = new Date(),
        // Firefox don't support parametres, so we construct option to conform to Firefox format
        options = {weekday: "long", year: "numeric", month: "long", day: "numeric"},
		lang = pxUtil.toLocaleDateStringSupportsLocales() ? locales || window.navigator.language : window.navigator.language,
		indexDay = 0; // Day position in the String returned to toLocaleString 
		
	switch( (lang.split('-'))[0] ) {
		case 'bg' : ;
		case 'ko' : indexDay = 3;
			break ;
		default : 
	}

	dateRef.setDate( dateRef.getDate() - dateRef.getDay() ); // Now, dateRef.getDay() return 0
	for( var j = 0 ; j < 7 ; j++ ) {
		/* push le jour en lettre et passe au jour suivant */
		arrDay.push( dateRef.toLocaleString( lang, options).split(' ')[indexDay] );
		dateRef.setDate( dateRef.getDate() + 1);
	}
	
	return arrDay;
}

/**
 * Calcul le jour de Paques
 */
Date.easterDay = function( annee ) {
    var C = Math.floor(annee/100);
    var N = annee - 19*Math.floor(annee/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = annee + Math.floor(annee/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4);

    return new Date( annee, M - 1 , D );
}
