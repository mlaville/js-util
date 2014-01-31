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
Date.monthNames = Date.monthNames || function( ) {
//       ---------------
	var arrMonth = [],
		dateRef = new Date(),
		year = dateRef.getFullYear(),
        // Firefox don't support parametres, so we construct option to conform to Firefox format
        options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};

	dateRef.setMonth(0);
	dateRef.setDate(10);
	while (year == dateRef.getFullYear()) {
		/* push le mois en lettre et passe au mois suivant */
		arrMonth.push( (dateRef.toLocaleString("fr-FR", options).split(' '))[2] );
		dateRef.setMonth( dateRef.getMonth() + 1);
	}
	
	return arrMonth;
}

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
