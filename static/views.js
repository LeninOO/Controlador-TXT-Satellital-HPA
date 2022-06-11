var model = null;
var taskResponseSpecs = null;

////////////////////  inicio  bloque 1 //////////////////////////////////

$( document ).ready( function ( ) { 

  $.ajax( {
  url: appURL + '/getTasksResponses' ,
  dataType: "json",
  method: "POST",
  data: JSON.stringify( { } ),
  success: function ( res ) {
    console.log( res );
    taskResponseSpecs = res;
    
    
  },

  error: function( xhr, status, error ) {
    location.reload( );
  }

} ); 

////////////////////  fin  bloque 1 //////////////////////////////////

//////////////////////  inicio  bloque 2 ////////////////////////////

  // $( "#modalNewEditView" ).modal( );
  $( "#cmdNewView" ).click( function ( ) { 
    $( "#modalNewEditView" ).modal( "show" ); 
  
  } );
  
  $( "#cmdGroups" ).click( function ( ) { 
    $( "#groupsModal" ).modal( "show" ); 
  
  } );
  
  
  $( "#cmdAddGroup" ).click( function ( ){ 
    console.log( "aaaa" );  
  } );
 
 //////////////////////  fin  bloque 2 ////////////////////////////


 
   $.ajax( {    ///  llave  1  abierta
    url: appURL + "/getGroups" ,
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    
	success: function ( groups ) {  ///  llave  2 abierta

      var groupCount = groups['groupList'].length;
      
      
	  
	  ///////////////////////////////////  bloque 3   inicio  //////////////////////////////////////////////////
	  
      for( var i=0; i<groupCount; ++i ) {  ///  llave  3 abierta
		
		// agrega en la caja del modal de grupos 
	    var grupoStr = nunjucks.renderString( $( "#tplNewGroup" ).html( ), { "groupName": "GUILLE" } );
	    $( "#groupsModal .list-group" ).append( grupoStr );  
		  
        $( "#cmbGroupName ul.dropdown-menu" ).append( '<li data-value="'+groups['groupList'][i]['groupName']+'"><a href="#">'+ groups['groupList'][i]['groupName'] + '</a></li>' );
        
        var collapse = "";
        if ( i==0 ) {
          collapse=" in ";
            		} else {
			collapse = "";
		                   }
		
        var viewGroupCount = groups['groupList'][i]['viewsList'].length;
        var viewsPanels = "";
        for ( var j=0; j<viewGroupCount; ++j ) {
          viewsPanels += '<div class="col-sm-4">' +
                         '  <div class="panel panel-default" id="view_' + groups['groupList'][i]['viewsList'][j] + '" >' + 
                         '    <div style="height:52px;" class="panel-heading">' +
                         '      <h3 class="panel-title">' +
                         '      </h3>'+
                         '    </div>'+
                         '    <div class="panel-body">' +
                         '     cargando...' +
                         '    </div>' +
                         '  </div>' +
                         '</div>';
                                              }
        $( "#accordion" ).append( 
        '<div class="panel panel-info"> <!-- panel -->'+
        ' <div class="panel-heading" role="tab" id="group_' + groups['groupList'][i]['groupName'] + '" >'+
        '   <h4 class="panel-title">'+
        '     <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+i+'" aria-expanded="true" aria-controls="collapse' + i + '">'+
                groups['groupList'][i]['groupDesc'] + 
        '     </a>' +
        '   </h4>'+
        ' </div>'+
        ' <div id="collapse'+i+'" class="panel-collapse collapse '+collapse + '"  role="tabpanel" aria-labelledby="heading' + i + '">'+
        '   <div class="panel-body">'+
        '     <div class="row">'+
              viewsPanels +
        '     </div>'+
        '   </div>'+
        ' </div>'+
        '</div><!-- fin panel -->' ); 
                                             }  ///  se cierra llave  3
	  

	    ///////////////////////////////////  bloque  3   fin  //////////////////////////////////////////////////
		
	      // termine de escribir los paneles, empezamos 
      // escribiendo los contenidos de las vistas
    

    
      $.ajax( {   ///   abre llaves   4  de ajax /////////////////////////////////////////////////////////////
        url:  appURL+ '/getViews' ,
        dataType: "json",
        method: "POST",
        data: JSON.stringify( { } ),
        
		success: function ( viewsRes ) {    ///  Abre  llave 5  fuction
          var viewCount = viewsRes['allViews'].length;
          for ( var i=0; i<viewCount; ++i ) {   /// abre llave  6 primer for
            
            var taskCount = viewsRes['allViews'][i]['viewDetails'].length;
            for( var j=0; j<taskCount; ++j ) {   ///  abre llave  7 segundo for  CERRADA
              // var respCount = viewsRes['allViews'][i]['viewDetails'][j]['taskResults'].length;
              $( "#view_" + viewsRes['allViews'][i]['viewName'] + "  .panel-heading" ).html( '<h3 class="panel-title">'+ viewsRes['allViews'][i]['viewDescription'] + '<button style="float:right;" class="cmdStretch btn btn-default">Maximizar</button></h3>');
              var allHeaders = getHeaders( viewsRes['allViews'][i]['viewDetails'] );     
			  console.log("HEADERS>>>>>>>>>>>>>>>>>>>>>");
			  console.log( allHeaders );
              var allTuples = mixUpTuples( viewsRes['allViews'][i]['mainOutput'], viewsRes['allViews'][i]['viewDetails'] );
              console.log("tuplas");
              console.log( allTuples );
              nunjucks.configure({ autoescape: true });
			  
              //////////////////////////   abre llave   8 swicht ////////////////
			  switch( viewsRes['allViews'][i]["template"] ) {
                    case "tables":
                    var x = nunjucks.renderString( $( "#tplTable" ).html( ), 
                    { "tabheaders": allHeaders, "tupleList": allTuples } );
                    $( "#view_" + viewsRes['allViews'][i]['viewName'] + " .panel-body" ).html( x );
                    break;
              
                    case "linesgraph":
                    $( "#view_" + viewsRes['allViews'][i]['viewName'] + " .panel-body" ).html( '<div id="linesgraph_'+viewsRes['allViews'][i]['viewName']+'"></div>' );
                    zingchart.THEME = "classic";
                    var colors = {
                    gray: "#EBEBEB",
                    grayDark: "#3F3F3F"
                                 };

		//////////////////////////////////////  inicio  bloque   //////////////////////////////////////////////////////////////////						  
                    function getValues( tuplas ) {
                    console.log( "EN GETVALUES" );
                    console.log( tuplas );
                    var aData = [];
                    var num = tuplas.length;
                    for (var i = 0; i < num; i++) {   
                                  aData.push(parseFloat(tuplas[i][1]));
                                                  }
                    return aData;
                                                  }
												  
		//////////////////////////////////////  fin   bloque   //////////////////////////////////////////////////////////////////															  
                   
//////////////////////////////////////  inicio  bloque   configuracion//////////////////////////////////////////////////////////////////						  
         
                    console.log( "TUPLAS: ");
                    console.log( getValues( allTuples ) );
				    // debugger;
                    var myConfig = {
                                    type: 'area',
                                    backgroundColor: "#FFF",
				                    plot: {
                                           aspect: 'spline',
                                           lineColor: "#" + parseInt( Math.floor( (Math.random() * 16777215 ) ) ).toString( 16 ), //"rgba(151,187,205,1)",
                                           lineWidth: "2px",
                                           backgroundColor2: "rgba(151,187,205,1)",
                                           marker: {
                                           backgroundColor: "rgba(151,187,205,1)",
                                           borderColor: "white",
                                           shadow: false
                                                   }
                                          },
                                          plotarea: {
                                          backgroundColor: "white"
                                                    },
         
 
         									scaleX: { labels: getXAxis( allTuples ) , step: 10,
                                          lineColor: colors.gray,lineWidth: "1px",
                                          tick: {
                                          lineColor: "#C7C7C7",
                                          lineWidth: "1px"
                                                },
                                          guide: {
                                          lineStyle: 'solid',
                                          lineColor: colors.gray,
                                          alpha: 1
                                                 },
                                          item: {
                                          color: colors.grayDark
                                                }
                                                  },
												  
												  
                                          scaleY: {
                                          lineColor: colors.gray,
                                          lineWidth: "1px",
                                          step: 10,
                                          tick: {
                                          lineColor: "#C7C7C7",
                                          lineWidth: "1px"
                                                },
                                          guide: {
                                                 lineStyle: 'solid',
                                                 lineColor: colors.gray,
                                                 alpha: 1
                                                 },
                                          item: {
                                                color: colors.grayDark
                                                }
                    
					                              },
////////////////////////////////////////////  fin  bloque  configuracion/////////////////////////////////////////////////////////////

												  
                    series: [{
                      values: getValues( allTuples )
                    }]
                  }       ///  cierra  llave  7  del segundo for  

				  // debugger;
//////////////////////////////////////////////////////////////////////////////////inicio ////////////////////////////////				  
                  zingchart.render({
                    id: "linesgraph_" + viewsRes['allViews'][i]['viewName'],
                    data: myConfig,
                    hideprogresslogo: true,
                    height: 300,
                    width: 320
                                    });

//////////////////////////////////////////////////////////////////////////////////fin ////////////////////////////////	


///////////////////////////////////////////////////////////  inicio  bloque  //////////////////////////////////////////////
									
				  $( "#linesgraph_" + viewsRes['allViews'][i]['viewName'] +" a" ).remove( );
                  break;
				  
                case "gauge":
                  console.log("imprimiendo gauge");
                  console.log("#view_" +viewsRes['allViews'][i]['viewName']);
                  
                  $( "#view_" + viewsRes['allViews'][i]['viewName'] + " .panel-body" ).html( '<div id="gauge_'+viewsRes['allViews'][i]['viewName']+'"></div>' );
                  
                  zingchart.THEME = "classic";
                  var myConfig = {
                    "graphset": [{
                      "type": "gauge",
                      "background-color": "#fff #eee",
                      "plot": {
                        "background-color": "#666"
                      },
                      "plotarea": {
                        "margin": "0 0 0 0"
                      },
                      "scale": {
                        "size-factor":1,
                        "offset-y":50,
                        "offset-x":-15
                      },
                      "tooltip": {
                        "background-color": "black"
                      },
                      "scale-r": {
                        "values": "0:100:10",
                        "border-color": "#b3b3b3",
                        "border-width": "2",
                        "background-color": "#eeeeee,#b3b3b3",
                        "ring": {
                          "size": 10,
                          "offset-r": "130px",
                          "rules": [{
                            "rule": "%v >=0 && %v < 20",
                            "background-color": "#348D00"
                          }, {
                            "rule": "%v >= 20 && %v < 40",
                            "background-color": "#B1AD00"
                          }, {
                            "rule": "%v >= 40 && %v < 60",
                            "background-color": "#FAC100"
                          }, {
                            "rule": "%v >= 60 && %v < 80",
                            "background-color": "#EC7928"
                          }, {
                            "rule": "%v >= 80",
                            "background-color": "#FB0A02"
                          }]
                        }
                      },  //////////////  Cierra  la llave  8  dek switch  //////////////////////////////////////////
                      "images": [
                        // {
                        //     "src":"gaugle_scale_mini.png",
                        //     "position":"50% 80%"
                        // }
                      ],
                      "labels": [ ],
                      "series": [{
                        "values": [ parseFloat( allTuples[0][1] )],
                        "animation": {
                          "method": 5,
                          "effect": 2,
                          "speed": 2500
                                     }
                                }],
                      "alpha": 1
                    }]
                  };

                  zingchart.render({
                    id: "gauge_" + viewsRes['allViews'][i]['viewName'],
                    data: myConfig,
                    height: 200,
                    width: 320
                  });

		          $("#gauge_" + viewsRes['allViews'][i]['viewName'] +" a").remove( ); 
                  break;
				  
                case "linesgraphcjs":
				  var ejex = getValues( allTuples );
				  $( "#view_" + viewsRes['allViews'][i]['viewName'] + " .panel-body" ).html( '<canvas height="400" id="canvas_'+viewsRes['allViews'][i]['viewName']+'"></canvas>' );
				  var ctx = document.getElementById( 'canvas_' + viewsRes['allViews'][i]['viewName'] ).getContext('2d');
				  var myChart = new Chart( ctx, {
				    type: 'line',
					height: 300,
				    data: {
				      labels: getXAxis( allTuples ),
					  //labels:[1,2,3,4,5,6,7,8,9,10],
					  datasets: [ {
					    label: viewsRes['allViews'][i]['viewName'],
					    data: ejex,
					    backgroundColor: "#" + parseInt( Math.floor( (Math.random() * 16777215 ) ) ).toString( 16 ) + "ff", //"rgba(153,255,51,0.4)"
					  } ],
					  xValueType: "dateTime"
				    },
					options: { 
					  elements: { 
					    point: { 
						  radius: 0 
						} 
					  },
						scales: {
									xAxes: [{
										ticks: {
											//autoSkip: true,
											maxTicksLimit:5,
											maxRotation: 90,
											minRotation: 90
											
										}
									}]
								}
					}
		
				  } );
				  
                  break;				

              } // FIN SWITCH
              
              $( ".cmdStretch" ).click( function ( ) { 
			    //console.log( $( this ).parent( ).parent( ).parent( ).parent( ).parent( ) );
			    //$( "#stretchView .modal-body" ).html(  );
		        //$( "#stretchView" ).modal( "show" );
				
              } );

           
            }
              
          }
          
          $( "#principal" ).html( " Lecturas Historicas Parametros HPA" );
        },

        error: function( xhr, status, error ) {
         //  location.reload( );
        }

      } ); 
      
      
    },
    error: function( xhr, status, error ) {
      console.log( error );
      // location.reload( );
    }

  } ); 
   
 ////////////////////////  inicio  bloque  /////////////////////////////////////////////////////////////////////////////
  $.ajax( {
    url: appURL + '/getTemplates' ,
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    success: function ( res ) {
      for( var i=0; i<res['allTemplates'].length; ++i ) {
        $( "#cmbTemplateName ul.dropdown-menu" ).append( '<li data-value="'+res['allTemplates'][i]+'"><a href="#">'+ res['allTemplates'][i] + '</a></li>' );
                                                        }
                              },

    error: function( xhr, status, error ) {
                                          }

  } ); 
 /////////////////////  fin  bloque  /////////////////////////////////////////////////////////////////////////////

  
  
  
  $( "#cmdAddData" ).click( function ( ) { 
    console.log( taskResponseSpecs );
    var opcionesTareas = '<option value="">Escoger...</option>';

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    for ( var key in taskResponseSpecs ) {
      opcionesTareas += '<option value="'+ key +'">'+key +'</option>';
      
                                         }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
    $( "#lista-campos" ).append( 
      '<a href="#" class="list-group-item">' +
   // ' <h4 class="list-group-item-heading">List group item heading</h4>' +
      ' <!-- Select Basic -->' +
      ' <div class="form-group">' +
      '   <label class="col-md-4 control-label" for="selectbasic">Tarea</label>' +
      '   <div class="col-md-4">' +
      '     <select id="selectbasic" name="selectbasic" class="form-control comboTareas">' +
      opcionesTareas + 
      '     </select>' +
      '   </div>' +
      ' </div>' +
      ' <div class="form-group">' +
      '   <label class="col-md-4 control-label" for="cmbCampo">Campo</label>' +
      '   <div class="col-md-4">' +
      '     <select id="cmbCampo" name="cmbCampo" class="form-control comboCampo">' +
      '<option value="">Escoger...</option>' + 
      '     </select>' +
      '   </div>' +
      ' </div>' +
      ' <div class="form-group">' +
      '   <label class="col-md-4 control-label" for="radPrincipal">Principal</label>' +

      '   <div class="col-md-4">' +
      //'   <div class="radio">' +
      '     <label for="radPrincipal-0">' +
      '       <input name="radPrincipal" id="radPrincipal-0" value="1" checked="checked" type="radio">' +
      '       Seleccionar' +
      '     </label>' +
      '   </div>' +
      //'   </div>' +
      ' </div>' +
   // ' <p class="list-group-item-text">...</p>' + 
      ' </a>' );

/////////////////////////////////////////////////////////////////////////////////////////////////////////

      
    $( ".comboTareas" ).on( "change",  function ( ) { 
      var optTarea = $( this ).children( "option:selected" ).val( ) ; 
      console.log( optTarea );
      var optionsResponses = '<option value="">Escoger...</option>';
      var c = taskResponseSpecs[ String( optTarea ) ].length;
      console.log( c );
      for ( var i=0; i<c; ++i ) {
        optionsResponses += '<option value="'+taskResponseSpecs[ String( optTarea ) ][i]['outputName']+'">'+taskResponseSpecs[ String( optTarea ) ][i]['outputDesc']+'</option>';
                                }
      $( this ).parent( ).parent( ).parent( ).find( ".comboCampo" ).html( optionsResponses );
                                                    } );
  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  } );  //////////////////  Cierro el  click
 
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  $( document ).delegate( "#cmdOK", "click", function ( evento ) { 
    console.log( "RESULTADO ");
    var lista = {}
    var campoPrincipal = "";
    var tareaPrincipal = ""
    $( "#lista-campos .list-group-item" ).each( function ( ) { 
      //console.log( $( this ).parent( ).parent( ).parent( ).parent( ).html( ) );
      //$( this ).parent( ).parent( ).find( ".comboCampo option:selected" ).each( console.log( $( this ).val( ) ) );
      //var valor = {  "taskName": $( this ).val( ), "outputDesc":  ) }; 
      /*
      console.log( $( this ).find( ".comboTareas option:selected" ).val( ) );
      console.log( $( this ).find( ".comboCampo option:selected" ).val( ) );
      console.log( $( this ).find( ".comboCampo option:selected" ).text( ) );
      */
      

      if ( $( this ).find( "#radPrincipal-0" ).is(":checked") ) {
        campoPrincipal = $( this ).find( ".comboCampo option:selected" ).val( );
        tareaPrincipal = $( this ).find( ".comboTareas option:selected" ).val( );
      }
      try {
        lista[ $( this ).find( ".comboTareas option:selected" ).val( ) ].push( $( this ).find( ".comboCampo option:selected" ).val( ) );
      } catch( err ) {
        lista[ $( this ).find( ".comboTareas option:selected" ).val( ) ] = [ ];
        lista[ $( this ).find( ".comboTareas option:selected" ).val( ) ].push( $( this ).find( ".comboCampo option:selected" ).val( ) );
      }
      
      
    } );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
    
    $.ajax( {
      url: appURL + '/saveView' ,
      dataType: "json",
      method: "POST",
      data: JSON.stringify( { 
        "viewDesc": $( "#txtNombreVista" ).val( ), 
        "viewName": $( "#txtNombreInterno" ).val( ), 
        "registers": $( "#spnRegistrosInput" ).val( ), 
        "mainTaskName": tareaPrincipal, 
        "mainOutputName": campoPrincipal, 
        "listaCampos": lista,
        "templateName": $( "#cmbTemplateName" ).combobox( "selectedItem" ).text,
        "groupName": $( "#cmbGroupName" ).combobox( "selectedItem" ).text
                           } ),
      success: function ( res ) {
        alert( "Se genero la nueva vista." );
                                },

      error: function( xhr, status, error ) {

                                            }
            } ); 

    console.log( lista );
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  } );
  
  
} ); // fin document ready
