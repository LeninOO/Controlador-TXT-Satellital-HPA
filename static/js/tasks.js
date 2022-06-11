var makerData;
$( document ).ready( function ( ) { 
  $("#cmdNewConnect").click( function( ) {
    $("#newConnectionModal").modal( "show" );

  } );
  
  
  // para llenar los datos necesarios del formulario
  
  $.ajax( { 
    url: appURL + "/taskMakerData",
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
  
  // para mostrar las tareas
  $.ajax( {
    url: appURL + "/getTasks" ,
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    success: function ( r ) {
      $("#principal").html( "Administrar Tareas" );
      console.log( r );
      
      var c = r["allTasks"].length;
      for ( var i=0; i<c; ++i ) {
		var cmdPrep = '';
		var cmdCron = '';
		
		if ( r["allTasks"][i]["ready"] == 0 ) {
			// cmdPrep = '<button type="button" class="btn btn-success cmdPrepareTask" data-dismiss="modal">Preparar</button>';
			cmdPrep = '<input type="checkbox" class="chkPrep" value="'+ r["allTasks"][i]["taskFilename"] +'" unchecked>';
		} else {
	        // cmdPrep = '<button type="button" class="btn btn-danger cmdRemoveTask" data-dismiss="modal">Quitar</button>';
			cmdPrep = '<input type="checkbox" class="chkPrep" value="'+ r["allTasks"][i]["taskFilename"] +'"  checked>';
		}
		
		if ( r["allTasks"][i]["running"] == 0 ) {
			// cmdCron = '<button type="button" class="btn btn-success cmdStartTask" data-dismiss="modal">Iniciar</button>';
			cmdCron = '<input type="checkbox" class="chkCron" value="'+ r["allTasks"][i]["taskFilename"] +'"  unchecked>';
		} else {
			// cmdCron = '<button type="button" class="btn btn-danger cmdStopTask" data-dismiss="modal">Detener</button>';
     		cmdCron = '<input type="checkbox" class="chkCron" value="'+ r["allTasks"][i]["taskFilename"] +'" checked>';

		}
		
			
        $( "#tasks tbody" ).append( 
        "<tr>" +
        "<td>"+ r["allTasks"][i]["taskName"] + "</td>" + 
        "<td>"+ r["allTasks"][i]["modelNumber"] + "</td>" + 
	    "<td>"+ r["allTasks"][i]["connectTo"] + "</td>" + 
		"<td class=\"sw\">" + cmdCron + "</td>" +
	    "<td class=\"sw\">" + cmdPrep + "</td>" +

        '<td><button type="button" id="cmdEditTask" class="btn btn-default" data-dismiss="modal">Editar</button></td>' + 
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
