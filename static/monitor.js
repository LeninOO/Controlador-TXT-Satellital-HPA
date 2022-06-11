var CANT_MAX = 5;

function processAnswer( ans ) {
  var c = ans.length;
  var x = {};
  for ( var i=0; i<c; ++i ) {
    x[ ans[i].id ] = ans[i].val;
  }

  return x;
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

function limitData( here ) {
  while ( $( '#' + here + " .append tr" ).length > CANT_MAX ) {
    $( '#' + here + " .append tr" )[0].remove( );
  }
}

function commandConfig( command, settings ) {
  for ( var i=0; i<settings.selectedCommands.length; ++i ) {
    if( settings.selectedCommands[i].name == command ) {
      return settings.selectedCommands[i];
    } 
  }
  
  return { };
}



function generateCSVRow( dd ) {
  row = "\"" + dd.QUERY_TIME + "\",";
  
  for ( var i=0; i<dd.commandOutput.length; ++i ) {
    if ( i == dd.commandOutput.length - 1 ) {
      row = row + "\"" + dd.commandOutput[i].val + "\"";
    } else {
      row = row + "\"" + dd.commandOutput[i].val + "\",";
    }
  }
  
  row = row + "\n";
  return row;
}


function makeDownload( data ) {
    // atob to base64_decode the data-URI
 
    // Use typed arrays to convert the binary data to a Blob
    var arraybuffer = new ArrayBuffer(data.length);
    var view = new Uint8Array(arraybuffer);
    for (var i=0; i<data.length; i++) {
        view[i] = data.charCodeAt(i) & 0xff;
    }
    try {
        // This is the recommended method:
        var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
    } catch (e) {
        // The BlobBuilder API has been deprecated in favour of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the `Blob` constructor
        //  also works, there's no need to add `MSBlobBuilder`.
        var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
        bb.append(arraybuffer);
        var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
    }

    // Use the URL object to create a temporary URL
    var url = (window.webkitURL || window.URL).createObjectURL(blob);
    location.href = url; // <-- Download!
};


var filedata = "";
var cfg;
$( document ).ready( function ( ) { 
  $.ajax( {
    url: "http://localhost:8080/firstQuery",
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    success: function ( firstAnswer ) {
      $.ajax( {
        url: "http://localhost:8080/getSettings",
        dataType: "json",
        method: "POST",
        data: JSON.stringify( { } ),
        success: function ( settings ) {
          cfg = settings;
          //$( "#principal" ).text( settings.modelNumber );
          $( "#principal" ).text( "Eventos" );
          $( ".container-fluid" ).append( '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">'+
                                          ' <div class="panel panel-default">'+
                                          '   <div class="panel-heading" role="tab" id="headingOne">'+
                                          '     <h4 class="panel-title">'+
                                          '       <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
                                                    settings.modelNumber +
                                          '       </a>'+
                                          '     </h4>'+
                                          '   </div>'+
                                          '   <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">'+
                                          '     <div class="panel-body">'+
                                          '       <div class="row" id="paneles">'+
                                          '       </div>' + 
                                          '     </div>'+
                                          '   </div>'+
                                          ' </div>'+
                                          '</div>' );
                                          
          for ( var i=0; i<firstAnswer.commandOutputList.length; ++i ) {
            var cc = commandConfig( firstAnswer.commandOutputList[i].command, settings );
            var dd = processAnswer( firstAnswer.commandOutputList[i].commandOutput );
            dd['TIME'] = currentTime( );
            
            dd['QUERY_TIME'] = convertTime( firstAnswer.commandOutputList[i].QUERY_TIME ); 
            
            if( $( "#" + cc.name ).length == 0 ) {
              var cont = nunjucks.renderString( cc.renderTemplate, dd );
              $( "#paneles" ).append( '<div class="col-sm-4">' +
                                      ' <div id="' + cc.name + '" class="panel panel-primary">' +
                                      '   <div class="panel-heading">' +
                                      '     <h3 class="panel-title" style="margin-top: 8px; float:left;">' +
                                              cc.description +
                                      '     </h3> <button class="btn btn-default pull-right history-button">History</button><div class="clearfix"></div>' +
                                      '   </div> ' +
                                      '   <div class="panel-body">' +
                                          cont +
                                      '   </div>' +
                                      ' </div>' +
                                      '</div>' );
            } else {
              // adjunto los adicionales... 
              var cont = nunjucks.renderString( cc.appendTemplate, dd ) 
              $( "#" + cc.name + " tbody.append" ).append( cont );
            }
            
            if ( cc.display == "graph" ) {
              doGraph( firstAnswer.commandOutputList[i].command );
            } 
          }
          
          $(".history-button").each( function ( ) { 
            var cmd = $(this).parent( ).parent( )[0].id;
            $( this ).click( function ( ) {
              $( "#modalCant" ).modal( );
              
              $( "#cmdShowHistory" ).unbind( );
              $( "#cmdShowHistory" ).click(  function ( ) { 
                var c = $("#txtCant").val( );
                $("#txtCant").val( 0 );
                var u = "";
                if ( $("#chkUnlimit").prop( "checked" ) ) {
                  u = "http://localhost:8080/queryHistory/" + cmd + "/-1";
                } else {
                  u = "http://localhost:8080/queryHistory/" + cmd + "/" + c;
                }
                
                $.ajax( {
                  url: u ,
                  dataType: "json",
                  method: "POST",
                  data: JSON.stringify( { } ),
                  success: function ( thishistory ) {
                    filedata = "";
                    for( var i=0; i<thishistory.commandOutputList.length; ++i ) {
                      var cc = commandConfig( cmd, cfg );
                      var dd = processAnswer( thishistory.commandOutputList[i].commandOutput );
                      dd['QUERY_TIME'] = convertTime( thishistory.commandOutputList[i].QUERY_TIME );
                      if( $( "#historyModal .modal-body" ).html( ) == 0 ) {
                        var cont = nunjucks.renderString( cc.renderTemplate, dd );
                        $( "#historyModal .modal-body" ).html( cont );
                      } else {
                        var cont = nunjucks.renderString( cc.appendTemplate, dd );
                        $( "#historyModal .modal-body .append" ).append( cont );
                      }
                      var xxxx = generateCSVRow( thishistory.commandOutputList[i] );
                      console.log( "armando archivo ");
                      console.log( xxxx );
                      filedata = filedata + String( xxxx );
                    }
                    $( "#modalCant" ).modal( "hide" );
                    $( "#historyModal" ).modal( "show" );
                  },

                  error: function( xhr, status, error ) {
                
                  }

                } );  
              } );
            } );
          } );
          
          
          
     
          
        },

        error: function( xhr, status, error ) {
          console.log( "Corrigiendo..." );
          window.location.reload( );
        }

      } ); 

    },

    error: function( xhr, status, error ) {
      console.log( "Corrigiendo..." );
      window.location.reload( );
    }

  } ); 

  var lastQueryTime = new Date( ).getTime( );
  setInterval( function ( ) {
    $.ajax( {
      url: "http://localhost:8080/query/" + lastQueryTime ,
      dataType: "json",
      method: "POST",
      data: JSON.stringify( { } ),
      success: function ( thisanswer ) {
        lastQueryTime = thisanswer['lastQueryTime'];
        
        for ( var i=0; i<thisanswer.commandOutputList.length; ++i ) {
          var cc = commandConfig( thisanswer.commandOutputList[i].command, cfg );
          var dd = processAnswer( thisanswer.commandOutputList[i].commandOutput );
          dd['TIME'] = currentTime( );
          console.log( thisanswer.commandOutputList[i].QUERY_TIME );
          dd['QUERY_TIME'] = thisanswer.commandOutputList[i].QUERY_TIME
          var cont = nunjucks.renderString( cc.appendTemplate, dd ) ;
          $( "#" + thisanswer.commandOutputList[i].command + " tbody.append" ).append( cont );
          limitData( thisanswer.commandOutputList[i].command );
           if ( cc.display == "graph" ) {
            doGraph( thisanswer.commandOutputList[i].command );
          } 
          
          
        }
        
        
      },

      error: function( xhr, status, error ) {
        console.log( "Servidor ocupado o en modo depuracion..." );
      }

    } ); 
  }, 3000 );
  
  $( '#historyModal' ).on( 'hidden.bs.modal', function ( ) {
    $( "#historyModal .modal-body" ).html( "" );
  } );
  $( ".row" ).sortable( );
  
  $( "#cmdDownload" ).click( function ( ) { 
    makeDownload( filedata );
    // filedata = "";
  } );
} );
