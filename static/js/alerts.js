$( document ).ready( function ( ) { 
  $( "#principal" ).html( "Alertas" );
  $( "#cmdNewAlert" ).click( function ( ) { $( "#modalNewEditAlert" ).modal( "show" ); } );
  nunjucks.configure({ autoescape: true });
  $( ".row" ).html( "" );
  $.ajax( {
    url: appURL + "/getAlerts" ,
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    success: function ( r ) {
      console.log( r['listAlerts'] );
	  
	  
      for ( var i=0; i<r['listAlerts'].length; ++i ) {
		var tipo="";
		if ( r['listAlerts'][i]["isAlarmed"] == 0 ) {
			tipo="panel-success";
			
		} else {
			tipo="panel-danger";
		}
		var act="";
		if ( r['listAlerts'][i]["isActive"] == 0 ) {
			act="unchecked";
		} else {
			act="checked";
		}
		
		cuerpo="";
		$( ".row" ).append( nunjucks.renderString( $( "#tplPanel" ).html( ), 
		  { "id": "alert_" + i, 
		  "titulo": r['listAlerts'][i]['alertName'], 
		  "cuerpo": cuerpo,
		  "tipo":tipo,
		  "act": act } 
		) );
		$.fn.bootstrapSwitch.defaults.onColor = 'danger';
        $.fn.bootstrapSwitch.defaults.offColor = 'success';
		$( ".chkAct" ).bootstrapSwitch( );
	  }
        
    },
    error: function( xhr, status, error ) {
      console.log( error );
    }
  } ); 
  
} );