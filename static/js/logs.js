var makerData;
$( document ).ready( function ( ) { 
  $("#cmdNewConnect").click( function( ) {
    $("#newConnectionModal").modal( "show" );

  } );
  
  
  // para llenar los datos necesarios del formulario
  /*
  $.ajax( { 
    url: appURL + "/registros",
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
	success: function ( r ) {
		makerData = r;
		$("#cmbDispositivo").html( "" );
		for ( var i=0; i<r['drivers'].length; ++i ) {
		  $( "#cmbDispositivo" ).append( '<option value="1">'+ r['drivers'][i]["modelNumber"]+'</option>' );
		}
		$( "#cmbConexion" ).html( "" );
		for ( var j=0; j<r['connections'].length; ++j ) {
		  $( "#cmbConexion" ).append( '<option value="1">'+ r['connections'][j]["connectionName"]+'</option>' );
		}		
	}
  } );
 
 */ 
  // para mostrar las tareas
  $.ajax( {
    url: appURL + "/registros" ,
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    success: function ( r ) {
      $("#principal").html( "Registro de Logs del HPA  " );
       console.log( r );
      var c = r['bitacora'][0].length;
      ///alert(r["bitacora"][0][1]["hora"]);  
      for ( var i=0; i<c; ++i ) {
		var cmdPrep = '';
		var cmdCron = '';
		
					
        $( "#tasks tbody" ).append( 
        "<tr>" +
        "<td>"+ i + "</td>" + 
        "<td>"+ r["bitacora"][0][i]["hora"] + "</td>" + 
        "<td>"+ r["bitacora"][0][i]["fecha"] + "</td>" +
        "<td>"+ r["bitacora"][0][i]["actividad"] + "</td>" + 
        "<td>"+ r["bitacora"][0][i]["condicion_actividad"] + "</td>" + 
        "<td>"+ r["bitacora"][0][i]["atenuacion"] + "</td>" +
        "<td>"+ r["bitacora"][0][i]["cabina"] + "</td>" +
         "<td>"+ r["bitacora"][0][i]["fanvoltaje"] + "</td>" + 
	"<td>"+ r["bitacora"][0][i]["corrientehelix"] + "</td>" + 
        "<td>"+ r["bitacora"][0][i]["voltajehelix"] + "</td>" + 
	"<td>"+ r["bitacora"][0][i]["reflejada"] + "</td>" + 
        "<td>"+ r["bitacora"][0][i]["potenciawtt"] + "</td>" + 
	 "<td>"+ r["bitacora"][0][i]["temperaturatubo"] + "</td>" + 
         
    
	 
        "</tr>" );   

				
      } // /for 		
	  
	  $.fn.bootstrapSwitch.defaults.onColor = 'danger';
      $.fn.bootstrapSwitch.defaults.offColor = 'success';
      $( ".chkCron" ).bootstrapSwitch( );
      $( ".chkPrep" ).bootstrapSwitch( );

	  $( '.chkPrep' ).on( 'switchChange.bootstrapSwitch', function( event, state ) {
		var chk = $( this );
	    if ( !( state ) ) {
	      bootbox.confirm( {
            title: "Borradura de estructuras",
            message: "Esta acción también BORRARÁ cualquier dato almacenado por esta tarea en la base de datos. ¿Está seguro de que desea continuar? ",
            buttons: {
              confirm: {
                label: 'Sí, quitar las estructuras y los datos',
                className: 'btn-danger'
              },
              cancel: {
                label: 'No realizar esta acción',
                className: 'btn-success'
              }
            },
            callback: function ( result ) {
				if ( result ) {
				  $.ajax( {
					url: appURL + "/unprepareTask" ,
					dataType: "json",
					method: "POST",
					data: JSON.stringify( { "taskFilename": chk.val( ) } ),
					success: function ( r ) {
					}
				  } );
				  
				} else {
					chk.bootstrapSwitch( 'state', true, true );
				}

            }
          } );
		} else {
			$.ajax( {
			url: appURL + "/prepareTask" ,
			dataType: "json",
			method: "POST",
			data: JSON.stringify( { "taskFilename": $( this ).val( ) } ),
			success: function ( r ) {
			}
		  } );
		}
	  } );
	  
	  $( '.chkCron' ).on('switchChange.bootstrapSwitch', function( event, state ) { 
	    if ( state ) {
		  $.ajax( {
			url: appURL + "/startTask" ,
			dataType: "json",
			method: "POST",
			data: JSON.stringify( { "taskFilename": $( this ).val( ) } ),
			success: function ( r ) {
			}
		  } );
	
		} else {
		  $.ajax( {
			url: appURL + "/stopTask" ,
			dataType: "json",
			method: "POST",
			data: JSON.stringify( { "taskFilename": $( this ).val( ) } ),
			success: function ( r ) {
					
		    }
		  } );
		}
      } );
		
    },
    error: function( xhr, status, error ) {
      console.log( error );
    }

  } ); 
} );
