// var appURL = "http://192.168.12.74:8080";
var appURL = "http://192.168.12.174:8080";
function baseURL( ) {
  pathArray = location.href.split( '/' );
  protocol = pathArray[0];
  host = pathArray[2];
  url = "8080" + '//' + host;
  
  return "http://127.0.0.1:8080";
}

function getHeaders( viewDetails ) {
  var headers = [];
  headers.push( "Hora" );
  var c = viewDetails.length;
  for( var i=0; i<c; ++i ) {
    var cc = viewDetails[i]['taskResults'].length;
    for( var j=0; j<cc; ++j ) {
      headers.push( viewDetails[i]['taskResults'][j]["outputDesc"] );
    }
  }
  
  return headers;
}

function getMainOutput( mainOutput, viewDetails ) { 
  var c = viewDetails.length;
  for( var i=0; i<c; ++i ) {
    var cc = viewDetails[i]['taskResults'].length;
    for( var j=0; j<cc; ++j ) {
      if( viewDetails[i]['taskResults'][j]["outputName"] == mainOutput ) {
        return viewDetails[i]['taskResults'][j];
      }
    }
  }
}

function mixUpTuples( mainOutput, viewDetails ) {
  
  // leer la salida del principal y luego procesar lo demas
  var mix=[];
  var detailsMain = getMainOutput( mainOutput, viewDetails );

  var c = viewDetails.length;
  for( var i=0; i<c; ++i ) {
    var cc = viewDetails[i]['taskResults'].length;
    var onetuple = [];
    
    for ( var l=0; l<detailsMain['resultsList'].length; ++l ) {
      onetuple.push( [ new Date( detailsMain['resultsList'][l]["queryTime"] * 1000 ), detailsMain['resultsList'][l]["value"] ] );
      // onetuple.push( [ convertTime( detailsMain['resultsList'][l]["queryTime"] ), detailsMain['resultsList'][l]["value"] ] );
    }
          
    for( var j=0; j<cc; ++j ) {
      var ccc=viewDetails[i]['taskResults'][j]["resultsList"].length;
      if( viewDetails[i]['taskResults'][j]["outputName"] != mainOutput ) {
        console.log( "leyendo datos de un tipo ");  
        
        for( var k=0; k<ccc; ++k ) {
          onetuple[k].push( viewDetails[i]['taskResults'][j]["resultsList"][k]["value"] );
        }
        //console.log( "uno" );
        //console.log( onetuple );
        
      }
    }
    mix.push( onetuple );
  }
  
  //console.log( "mezcla" );
  //console.log( mix );
  return mix[0];
}

function currentTime( ) {
  var currentdate = new Date(); 
  var hh = ( currentdate.getHours( ) + "" ).length != 2 ? "0" + currentdate.getHours( ) : currentdate.getHours( );
  var mm = ( currentdate.getMinutes( ) + "" ).length != 2 ? "0" + currentdate.getMinutes( ) : currentdate.getMinutes( );
  var ss = ( currentdate.getSeconds( ) + "" ).length != 2 ? "0" + currentdate.getSeconds( ) : currentdate.getSeconds( );
  return hh + ":" + mm + ":" + ss;
}

function convertTime( x ) {
  var currentdate = new Date( x * 1000 ); 
  var hh = ( currentdate.getHours( ) + "" ).length != 2 ? "0" + currentdate.getHours( ) : currentdate.getHours( );
  var mm = ( currentdate.getMinutes( ) + "" ).length != 2 ? "0" + currentdate.getMinutes( ) : currentdate.getMinutes( );
  var ss = ( currentdate.getSeconds( ) + "" ).length != 2 ? "0" + currentdate.getSeconds( ) : currentdate.getSeconds( );
  return hh + ":" + mm + ":" + ss;
}

function getXAxis( tuples ) {
	// debugger;
	var x_labels = [];
	for ( var i=0; i<tuples.length; ++i ) {
	  x_labels.push( tuples[i][0] );
	}
	console.log( "ETIQUETAS:");
	console.log( x_labels );
	return x_labels;
}
