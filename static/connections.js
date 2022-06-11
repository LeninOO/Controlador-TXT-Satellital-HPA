$( document ).ready( function ( ) { 
  $("#cmdNewConnect").click( function( ) {
    $("#newConnectionModal").modal( "show" );

  } );
  $.ajax( {
  url: appURL + "/getConnections" ,
  dataType: "json",
  method: "POST",
  data: JSON.stringify( { } ),
  success: function ( r ) {
    console.log( r );
    $("#principal").html( "Administrar Conexiones" );
      var c = r["deviceList"].length;
      for( var i=0; i<c; ++i ) {
        console.log( r["deviceList"][i] );
        $("#connections tbody").append( "<tr>"+
        "<td>" + r["deviceList"][i]["connectionName"] + "</td>" +
        "<td>" + r["deviceList"][i]["driverFile"] +"</td>" +
        "<td>" + r["deviceList"][i]["type"] +"</td>" +
        "<td>" + r["deviceList"][i]["ipAddress"] +"</td>" +
        "<td>" + r["deviceList"][i]["timeout"] +"</td>" +
        "</tr>");
      }

  },

  error: function( xhr, status, error ) {
    console.log( error );
  }

} ); 
} );
