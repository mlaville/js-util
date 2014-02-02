/**
 * util.js
 * 
 * @auteur     marc laville
 * @Copyleft 2014
 * @date       31/01/2014
 * @version    0.1
 * @revision   $0$
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

/*
  * Gère la sélection d'un element input
  */
pxUtil.select = function( inputElt ) { return inputElt.setSelectionRange(0, inputElt.value.length); }

// Selection d'un champ sur un click
pxUtil.selectOnClick = function( event ) { return pxUtil.select( event.currentTarget ); };
//           --------------------

pxUtil.toLocaleDateStringSupportsLocales = function () {
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
String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, "");};
//                               -------

/*
 * L'Objet Date sait revoyer la liste des noms de mois
 */
 
 Date.monthNames = Date.monthNames || function( locales, optMonth ) {
//       ---------------
	var arrMonth = [],
		dateRef = new Date(),
		year = dateRef.getFullYear(),
        // Firefox don't support parametres, so we construct option to conform to Firefox format
        options = {weekday: "long", year: "numeric", month: optMonth || "long", day: "numeric"},
		lang = pxUtil.toLocaleDateStringSupportsLocales() ? locales || window.navigator.language : window.navigator.language,
		indexMonth = 2; // Month position in the String returned to toLocaleString 
	
	switch( (lang.split('-'))[0] ) {
		case 'en' : ;
		case 'ko' : indexMonth = 1;
			break ;
		case 'es' : indexMonth = 3;
			break ;
		default : 
	}

	dateRef.setMonth(0);
	dateRef.setDate(10);
	while (year == dateRef.getFullYear()) {
		/* push le mois en lettre et passe au mois suivant */
		arrMonth.push( dateRef.toLocaleDateString( lang, options ).split(' ')[indexMonth] );
//		arrMonth.push( dateRef.toLocaleDateString( lang, options ) );
		dateRef.setMonth( dateRef.getMonth() + 1);
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

