/**
 * js-util.js
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2014-2020
 * @date       31/01/2014
 * @version    0.4
 * @revision   $6$
 *
 * @date revision   marc laville : 01/05/2014 : capitalize
 * @date revision   marc laville : 08/05/2014 : arrayRGB
 * @date revision   marc laville : 03/04/2015: toElement, toTimeString, toByteSizeString
 * @date revision   marc laville : 16/05/2015: render (templating)
 * @date revision   marc laville : 01/07/2015: pxUtil.draggable (dragging)
 * @date revision   marc laville : 12/03/2016: Date.prototype.estFerie
 * @date revision   marc laville : 04/09/2016: String.prototype.parseSearch
 * @date revision   marc laville : 16/10/2016: String.prototype.padStart
 * @date revision   marc laville : 12/10/2020: réécriture monthNames et dayNames de la classe Date
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
//     -------------

pxUtil.draggable = function( elmt ) {

	var onEvtDragStart = function( event ) {

		event.dataTransfer.setData( 'position', JSON.stringify( { x: event.screenX, y: event.screenY } ) );
		event.dataTransfer.effectAllowed = 'move';
		// make it half transparent
		elmt.style.opacity = .6;
		elmt.style.top = [ elmt.style.top || event.screenY - window.scrollY, 'px' ].join('');

		return;
	},
	onEvtDragEnd  = function( event ) {
		var jsonData = event.dataTransfer.getData('position'),
			data = JSON.parse(jsonData),
			eltStyle = elmt.style;

		eltStyle.left = [ event.screenX - data.x + parseInt( '0' + eltStyle.left ), 'px' ].join('');
		eltStyle.top = [ event.screenY - data.y + parseInt( '0' + eltStyle.top ), 'px' ].join('');

		eltStyle.opacity = 1;

		return;
	};
	
	elmt.style.position = 'absolute';
	elmt.setAttribute( 'draggable', 'true' );
	elmt.addEventListener( 'dragstart', onEvtDragStart, false );
	elmt.addEventListener( 'dragend', onEvtDragEnd, false );

	return
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
String.prototype.repeat = String.prototype.repeat || function( nb ){
//                              ----------
  return (nb > 0) ? this + this.repeat( nb - 1 ) : '' ;
};
 */

   var latin_map = {
     "Á":"A", "Â":"A", "Ä":"A",
     "Æ":"AE","Ǽ":"AE",
     "Ç":"C",
     "É":"E","Ë":"E","È":"E","Ê":"E",
     "Í":"I","Î":"I","Ï":"I","Ì":"I",
     "Ó":"O","Ô":"O","Ö":"O","Ò":"O",
     "Œ":"OE",
     "Ú":"U","Û":"U","Ǘ":"U","Ù":"U",
     "á":"a","à":"a","â":"a","ä":"a","æ":"ae","ǽ":"ae",
     "ç":"c",
     "é":"e","ê":"e","è":"e","ë":"e",
     "í":"i","î":"i","ï":"i",
     "ó":"o","ô":"o","ö":"o","ờ":"o", "œ":"oe",
     "ù":"u","û":"u","ü":"u",
     };
     
String.prototype.latinize = function() {
  return this.replace(/[^A-Za-z0-9\[\] ]/g, function(x) { return latin_map[x] || x; });
},
/**
 * Polyfill padStart et padEnd
 */
String.prototype.padStart = String.prototype.padStart || function (max, fillString) {
  const masked = max - this.length;
  
  return ( 0 > masked ? '' : String(fillString || ' ').repeat(masked).slice(0, masked) ) + this;
};

String.prototype.padEnd = String.prototype.padEnd || function (max, fillString) {
  const masked = max - this.length;
  
  return this.concat( ( 0 > masked ) ? '' : String(fillString || ' ').repeat(masked).slice(0, masked) );
};
/**
 * Completion d'une chaine
 * 
 * @param {Number} lg : la longueur de la chaine obtenue
 * @param {String} str : la chaine utiliser pour complèter la chaine initiale
 * @return {String} La chaine répètée 
 */
String.prototype.rpad = String.prototype.rpad || function( str, lg ){
//               ----
  return  this.padEnd( lg, str );
};

String.prototype.lpad = String.prototype.lpad || function( str, lg ){
//               ----
  return  this.padStart( lg, str );
};


String.prototype.camelcase = function() {

	if (this.length === 1 || !(/[_.\- ]+/).test(this) ) {
		if (this[0] === this[0].toLowerCase() && this.slice(1) !== this.slice(1).toLowerCase()) {
			return this;
		}

		return this.toLowerCase();
	}

	return this
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
			return p1.toUpperCase();
		});
}

String.prototype.decamelcase = function(sep) {
	return this.replace(/([a-z\d])([A-Z])/g, '$1' + (sep || '_') + '$2').toLowerCase();
};
/**
 * Checks if the string starts with the given substring
 * @param  {String} strStartsWith   Substring to check starting with
 * @return {Boolean}    true if string starts with the given substring, false otherwise
 * @author Tomislav Capan

String.prototype.startsWith = String.prototype.startsWith || function(strStartsWith) {
//                              ----------------
  return strStartsWith === this.substring(0, strStartsWith.length);
};
 */
/**
 *  "rgb(25, 20, 240)" =>["25", "20", "240"]
 * @param  none
 * @return {Array}    tableau de 3 chaines ou null si le format n'est pas valide
 */
String.prototype.arrayRGB = function() {
//                              --------------
  var match = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/.exec(this);
  
  if( match ) 
    match.shift();
  
  return match;
};

/**
 *  "25 1 -3"=>[25, 1, -3]
 * @param  none
 * @return {Array}    tableau d'entiers
 */
String.prototype.toIntArray = function() {
//              -----------
    return this.match(/\d+/g).map(function(i) { return +i; });
};

/**
 *  "?a=1&b=21&d&f=1245"=>{"?a":"1","b":"21","d":"undefined","f":"1245"}
 * @param  none
 * @return {Object}    tableau d'entiers
 */
String.prototype.parseSearch = function() {
//               -----------
    var mappage = function(query, item) {
         var bit = item.split('='),
          first = decodeURIComponent(bit[0]),
          second;
        
          if (first.length > 0) {
            second = decodeURIComponent(bit[1]);
            if (typeof query[first] == "undefined"){
              query[first] = second;
            } else {
              if (query[first] instanceof Array)
                query[first].push(second);
              else
                query[first] = [query[first], second];
            }
          }
		  
		  return query;
    };

  return this.split("?").pop().split("&").reduce( mappage, {} );
};
/**
 *https://gist.github.com/DiegoSalazar/4075533
 * takes the form field value and returns true on valid number
 */
function valid_credit_card(value) {
  // accept only digits, dashes or spaces
	if (/[^0-9-\s]+/.test(value)) return false;

	// The Luhn Algorithm. It's so pretty.
	var nCheck = 0, nDigit = 0, bEven = false;
	value = value.replace(/\D/g, "");

	for (var n = value.length - 1; n >= 0; n--) {
		var cDigit = value.charAt(n),
			  nDigit = parseInt(cDigit, 10);

		if (bEven) {
			if ((nDigit *= 2) > 9) nDigit -= 9;
		}

		nCheck += nDigit;
		bEven = !bEven;
	}

	return (nCheck % 10) == 0;
}
/**
 *
 * Creates and returns element from html string
 * Uses innerHTML to create an element
 *  
 * @param  aucun
 * @return {element}  
 */
String.prototype.toElement = function() {
//               ---------
    var div = document.createElement('div');

	div.innerHTML = this;
	
	return div.removeChild(div.firstChild);
};


/**
 * Capitalise une chaine
 * @param  aucun
 * @return {String}    La chaine avec toutes les premières lettres en majuscule
 * ne fonctionne que sur les chaines ascii
 */
String.prototype.capitalize = function () {
//               ----------
    return this.toLowerCase().replace( /(^|\s)([a-z])/g, function(match) { return match.toUpperCase(); } );
};

/**
 * Utilise la chaîme comme template
 * @param  data
 * @return {String}    
 */
String.prototype.render = function(data) {
    return this.replace(/{{(.+?)}}/g, function (m, p1) {
        return data[p1]
    })
}

/**
 * Convertit un nombre de seconde en chaine hh:mm:ss
 * @param  aucun
 * @return {String}    La chaine "hh:mm:ss"
 */
Number.prototype.toTimeString = function() {
//                              --------------------
	var hh = Math.floor(this / 3600),
		mm = Math.floor((this - (hh * 3600)) / 60),
		ss = this - (hh * 3600) - (mm * 60),
		lpad0 = function(n) { return ('0' + n).slice(-2) };

	return [hh, mm, ss].map( lpad0 ).join(':');
};

/**
 * Convertit un nombre en taille en Byte, Kb, Mb ....
 * @param  {Number} precision   nombre de décimales (1 par défaut)
 * @return {String}    La chaine de type '1.5 Mb'
 */
Number.prototype.toByteSizeString = function(precision) {
//                              --------------------------
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
      i = (this >= 0) ? parseInt( Math.floor(Math.log(this) / Math.log(1024)) ) : null;

	return (i == null) ? 'n/a' : [ (this / Math.pow(1024, i)).toFixed( precision || 2 ), sizes[i] ].join(' ');
};

/**
 *
 */
Date.fromISO = function(str) { // 2015-08-14T19:14:24.957
  var dateTime = ( str.split('.')[0] ).split('T'),
      datePart = dateTime[0].split('-'),
      timePart = dateTime[1].split(':');
  
  return new Date( datePart[0], datePart[1] - 1, datePart[2], timePart[0], timePart[1], timePart[2] );  
}

Date.prototype.diff = function(otherDate) {
  return ( otherDate || new Date() ).getTime() - this.getTime();
}

Date.prototype.getQuater = function() {
//             ---------
    return Math.trunc( ( this.getMonth() + 1 ) / 4 ) + 1;
};

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
 Date.monthNames = function( locales, optMonth ) {
//   ----------
	const arrMonth = [];
	const lang = locales || window.navigator.language;
	const option = { month: optMonth || 'long' };
  
	for( let dateRef = new Date(2001, 0, 10), m = 0 ; m < 12 ; m++ ) {
		dateRef.setMonth(m);
		arrMonth.push( dateRef.toLocaleDateString( lang, option ) );
	}
	
	return arrMonth;
}
*/
/*
 * L'Objet Date sait revoyer la liste des noms de jour
 * locales n'est pas supporté par FireFox
 */

Date.dayNames = function( locales, optDay ) {
//   --------
	const arrDay = [];
	const lang = locales || window.navigator.language;
	const option = { month: optMonth || 'long' };

  let dateRef = new Date()
  
	dateRef.setDate( dateRef.getDate() - dateRef.getDay() ); // Now, dateRef.getDay() return 0
	for( var j = 0 ; j < 7 ; j++ ) {
		/* push le jour en lettre et passe au jour suivant */
		dateRef.setDate( dateRef.getDate() + 1);
		arrDay.push( dateRef.toLocaleDateString( lang, option ) );
	}
	
	return arrDay;
}

/**
 * Calcul le jour de Paques
 c = y / 100
    n = y - 19 * ( y / 19 )
    k = ( c - 17 ) / 25
    i = c - c / 4 - ( c - k ) / 3 + 19 * n + 15
    i = i - 30 * ( i / 30 )
    i = i - ( i / 28 ) * ( 1 - ( i / 28 ) * ( 29 / ( i + 1 ) ) * ( ( 21 - n ) / 11 ) )
    j = y + y / 4 + i + 2 - c + c / 4
    j = j - 7 * ( j / 7 )
    l = i - j
    m = 3 + ( l + 40 ) / 44
    d = l + 28 - 31 * ( m / 4 )

 */
Date.easterDay = function( annee ) {
    var C = Math.floor(annee/100), // Siecle
		N = annee - 19*Math.floor(annee/19);
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


Date.prototype.estFerie = function() {
	'use strict';
	var jourMois = [ this.getMonth(), this.getDate() ],
      egalJourMois = function(arr) {
        return arr[0] == jourMois[0] && arr[1] == jourMois[1];
      },
	  estPaqAscPent = function( dtPaques ) {
          return [1, 38, 11].some(function(i){
            dtPaques.setDate(dtPaques.getDate() + i);
            
            return egalJourMois( [dtPaques.getMonth(), dtPaques.getDate()] );
          });
      };
	return [[0, 1], [4, 1], [4, 8], [6, 14], [7,15], [10, 1], [10, 11], [11,25]].some(egalJourMois)
    || estPaqAscPent( Date.easterDay( this.getFullYear() ) );
}
