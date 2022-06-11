$( document ).ready( function ( ) { 
  $.ajax( {
  url: appURL + "/getDrivers" ,
  dataType: "json",
  method: "POST",
  data: JSON.stringify( { } ),
  success: function ( r ) {
    console.log( r["loadedDrivers"] );
    console.log( r["detectedNotLoaded"] );
    $("#principal").html( "Controladores" );
    var c=r["loadedDrivers"].length;
    for( var i=0; i<c; ++i ) {
      $("#loadedDrivers tbody").append( 
      '<tr>' + 
      '  <td><img src="' + r["loadedDrivers"][i]["image"] + '"></td>' +
      '  <td>' + r["loadedDrivers"][i]["modelNumber"] + "</td>" +
      '</tr>');
    }
    
    var c=r["detectedNotLoaded"].length;
    for( var i=0; i<c; ++i ) {
      $("#notLoadedDrivers tbody").append( 
      '<tr>' + 
      '  <td><img src="' + r["detectedNotLoaded"][i]["image"] + '"></td>' +
      '  <td>' + r["detectedNotLoaded"][i]["modelNumber"] + "</td>" +
      '</tr>');
    }
  },

  error: function( xhr, status, error ) {
    console.log( error );
  }

} ); 
} );
