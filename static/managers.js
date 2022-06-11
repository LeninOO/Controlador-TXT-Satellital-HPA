




$( document ).ready( function ( ) {

  var timeout = 0;
  nunjucks.configure({ autoescape: true });
  $( '[data-toggle="popover"]' ).popover( );


  $.ajax( {
   url: appURL + "/getTasks",
  dataType: "json",
  method: "POST",
  data: JSON.stringify( { } ),
   success: function ( r ) {


////////////////////////////    inicio  bloque 2 ////////////////////////////////////////////////////////////////////////
      $( "#principal" ).html( "Control HPA" );

      
                             		var xyz = nunjucks.renderString( $( "#tplPanelGestor" ).html( ),
		                           { "inputList":[{"label": "atenuacion", "name": "atenuacion", "control":"text" }],"tituloPanel": "Atenuacion","idPanel": "configurar1" } );
	                                $( "body" ).append( xyz );
                             
                                      var xyz = nunjucks.renderString( $( "#tplPanelGestor" ).html( ),
		                           { "inputList": [ { "label": "Potencia", "name": "potenciaout", "control":"text" } ], "tituloPanel": "Potencia de Salida",
                                       "idPanel": "configurar3" } );
	                                $( "body" ).append( xyz );
                                
                                      var xyz1 = nunjucks.renderString( $( "#tplPanelGestor" ).html( ),
		                           { "experimento": [{"label": "cocinar", "name": "comandito", "text":"limpiar" }], "tituloPanel": "Comandos",
                                       "idPanel": "configurar5"} );
	                                $( "body" ).append( xyz1 );
 

      
													   
     
	 
      
         
		  
      
////////////////////////////    fin  bloque 2 ////////////////////////////////////////////////////////////////////////
///////////////////////////    inicio  bloque 3 ////////////////////////////////////////////////////////////////////////
      $( ".callSetter" ).click( function( e ) {
		                           e.preventDefault();
		                           //$( this ).popover( "hide" );
                                   var v = $( this ).val( );
		                           clearTimeout( timeout );
		                           console.log( v );
                                   var formulario = {};
                                   var items = $("#manager_" + v + " :text").each( function ( ) {
                                                               formulario[ $(this).attr("id") ] = $(this).val( );
                                               } );
		var boton = $( this );
        console.log( formulario );
                 ///...........................................................................................................
		$.ajax( {
          url: appURL + "/callSetter",
          dataType: "json",
          method: "POST",
          data: JSON.stringify( { "managerName": v, "thisform": formulario } ),success: function ( r ) {boton.attr( "data-content", "> " + r['response'] ); boton.popover( "show" );
	  timeout = setTimeout( function(){ boton.popover( "hide" ) }, 3000 );}
	, error: function( xhr, status, error ) { console.log( "Servidor ocupado o en modo depuracion...1" );}
                                 } );
			    } );
                ////..............................................................................................................................
                                                     },
     ////////////////////////////    fin  bloque 3 ////////////////////////////////////////////////////////////////////////

	////////////////////////////    inicio  bloque 5 ////////////////////////////////////////////////////////////////////////
     error: function( xhr, status, error ) {
                         console.log( "Servidor ocupado o en modo depuracion...2" );
                                           }
    ////////////////////////////    inicio  bloque 5 ////////////////////////////////////////////////////////////////////////

  
  } ); ////// primer ajax 2


var  DEDO= ' <div id="container-Atenuacion" style="width: 300px; height: 200px; margin: 0 auto"></div>' ;
 $( "body" ).append( DEDO );
 
var  DES= ' <div id="container-Potencia" style="width: 300px; height: 200px; margin: 0 auto"></div>' ;
 $( "body" ).append( DES );

 var  DD= ' <div id="container-Reflejada" style="width: 300px; height: 200px; margin: 0 auto"></div>' ;
 $( "body" ).append( DD );
 


var mano ='<div id="container" style="width: 600px; height: 200px; margin: 0 auto"></div>';
$( "body" ).append( mano);


var queso ='<div id="caja" style="width: 250px; height: 200px; margin: 0 auto"></div>';
$( "body" ).append( queso);

var huil ='<div id="cajon" style="width: 250px; height: 200px; margin: 0 auto"></div>';
$( "body" ).append( huil);





} );  /// Principal 1

