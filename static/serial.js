
//"      <tr>
//    <th>#</th>
//    <td>Firstname</td>
//  </tr>"



var freqs = [];
var CANT_MAX = 10;

function processAnswer( ans ) {
  var c = ans.length;
  var x = {};
  for ( var i=0; i<c; ++i ) {
    x[ ans[i].id ] = ans[i].val;
  }

  return x;
}  


function renderValues( x ) {

  var c = x.length;
  for ( var i=0; i<c; ++i ) {
    // esto no va aca, devolver a donde estaba
    // $( "#listaComandos" ).append( "<tr class=\"comm\"><td class=\"commname\">" + 
    // x.name + 
    // "</td><td>" + 
    // x.description + 
    // "</td><td><input type=\"number\" class=\"numFr\" value=\"0\"></td><td><input type=\"checkbox\" class=\"selComm\"></td></tr>" );
  } 
  
  var dd = processAnswer( x.answer );
  dd['TIME'] = currentTime( );
  var cont = nunjucks.renderString( x.renderTemplate, dd ) ;
  console.log( x );
  $( "#paneles" ).append( '<div class="col-sm-4">' +
                                ' <div id="' + x.name + '" class="panel panel-primary">' +
                                '   <div class="panel-heading">' +
                                '     <h3 class="panel-title">' +
                                        x.description +
                                '     </h3>' +
                                '   </div> ' +
                                '   <div class="panel-body">' +
                                cont +
                                '   </div>' +
                                ' </div>' +
                                '</div>' );
}


var config = {};
function getCommSpec( comm ) {
  var c = config.selectedCommands.length;
  for( var x=0; x<c; ++x ) {
    if ( config.selectedCommands[x].name == comm ) {
      return config.selectedCommands[x];
    }
  }
  return {}; 
}

function currentTime( ) {
  var currentdate = new Date(); 
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

function activateTime( j ) {
  $.ajax( {
    url: "http://localhost:8080/command/" + freqs[j].comm,
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    success: function ( x ) {
      var dd = processAnswer( x.commandOutput );
      
      dd['TIME'] = currentTime( );
      var cont = nunjucks.renderString( getCommSpec( freqs[j].comm ).appendTemplate, dd ) ;

      $( "#" + freqs[j].comm + " .append").append( cont );
      
      limitData( freqs[j].comm );
      doGraph( freqs[j].comm );
    },

    error: function( xhr, status, error ) {
  
    }

  } ); 
  //console.log( freqs[j] );
}
$( document ).ready( function ( ) { 
  
  // first, get the config, if not then save a new one
  $.ajax( {
    url: "http://localhost:8080/getSettings",
    dataType: "json",
    method: "POST",
    data: JSON.stringify( { } ),
    success: function ( x ) {
      
      if ( x == {} ) {
        console.log( "no hay ");
        // get all commands to make a new config
        $.ajax( {
          url: "http://localhost:8080/operationDetails",
          dataType: "json",
          method: "POST",
          data: JSON.stringify( { } ),
          success: function ( x ) {
          // esta parte debe cambiar, ahora hace esto:
          // primero, como no hay configuracion, va a llamar
          // al modal para que se muestre
            $( "#settingsModal" ).modal( "show" );

          },

          error: function( xhr, status, error ) {
            alert( "Error" );
            console.log( xhr );
            console.log( error );
          }
        } ); 
      } else {
        // if there are settings just continue
        config = x;
        
        $("#principal").text(x.modelNumber); 
        var cc = x['selectedCommands'].length;
        for ( var i=0; i<cc; ++i) {
          $.ajax( {
            url: "http://localhost:8080/command/" + x.selectedCommands[i].name,
            dataType: "json",
            method: "POST",
            data: JSON.stringify( { } ),
            success: function ( x ) {
              console.log( x.commandOutput );
            },
            error: function( xhr, status, error ) {
            }
          } ); // fin $.ajax
          renderValues( x['selectedCommands'][i] );
          freqs.push( { "freq" : x['selectedCommands'][i].freq, "comm": x['selectedCommands'][i].name } );
          if ( x['selectedCommands'][i].freq > 0  ) 
            doGraph( x['selectedCommands'][i].name );
        }
        
        // recoleccion continua de todo
        console.log( "AAAAAAAAAAAAAAAA");
        console.log( freqs );
        var j;
        var cc= freqs.length;
        for (j=0; j<cc; j++ ) { 
          console.log( "hola ");
          console.log( parseInt( freqs[j].freq ) );
          console.log( j );
          if ( freqs[j].freq != 0 ) {
            console.log( "holaaaaa ");
            console.log( freqs[j].freq ); 
            freqs[j].intid = setInterval( "activateTime( " + j + " )", freqs[j].freq * 1000 );
          }
        }
        
      }
    },

    error: function( xhr, status, error ) {
      alert( "Error" );
      console.log( xhr );
      console.log( error );
    }

  } ); 
  
  

  
  $( "#cmdOK" ).click( function ( ) { 
    var datos = { "listaComandos" : [] };
    $( ".comm" ).each( function ( ) { 
      if ( $(this).find( ".selComm" )[0].checked ) {
        datos.listaComandos.push( {
          "command": $(this).find( ".commName" ).text( ),
          "freq": $(this).find( ".numFr" )[0].value
        
        } );
      }
    } );
    
    if ( datos != {} ) {
      $.ajax( {
        url: "http://localhost:8080/saveConfig",
        dataType: "json",
        method: "POST",
        data: JSON.stringify( datos ),
        success: function ( x ) {
          
        },

        error: function( xhr, status, error ) {
          alert( "Error" );
          console.log( xhr );
          console.log( error );
        }

      } ); 
    }
  } );
  
  
// /*   $.ajax( {
    // url: "http://localhost:8080/getSettings",
    // dataType: "json",
    // method: "POST",
    // data: JSON.stringify( { } ),
    // success: function ( x ) {
      // console.log( x );
    // },

    // error: function( xhr, status, error ) {
      // alert( "Error" );
      // console.log( xhr );
      // console.log( error );
    // }

  // } );  */
  
// /*   $.ajax( {
    // url: "http://localhost:8080/getDeviceModel",
    // dataType: "json",
    // method: "POST",
    // data: JSON.stringify( { } ),
    // success: function ( x ) {
      // $( "#principal" ).html( x.modelNumber );
   //   console.log( x );
    // },

    // error: function( xhr, status, error ) {
      // alert( "Error" );
      // console.log( xhr );
      // console.log( error );
    // }

  // } ); 
 // */
 
 
 // /*  $.ajax( {
    // url: "http://localhost:8080/operationDetails",
    // dataType: "json",
    // method: "POST",
    // data: JSON.stringify( { } ),
    // success: function ( x ) {
      // var c = x.gettingCommands.length;
      // for ( var i = 0; i < c; ++i ) {
        // var cc = x.gettingCommands[i].answer.length;
        // var cont = '<table>';
        // for ( var j = 0; j < cc; ++j ) {
          // cont = cont + '<tr><th>'+ x.gettingCommands[i].answer[j].desc +'</th><td>'+ x.gettingCommands[i].answer[j].val +'</td></tr>';
        
        // }
        // cont = cont + "</table>";
        
        // console.log( cont );
        // panel = '<div class="col-sm-4">' +
                // ' <div class="panel panel-primary">' +
                // '   <div class="panel-heading">' +
                // '     <h3 class="panel-title">' +
                        // x.gettingCommands[i].description + 
                // '     </h3>' +
                // '   </div> ' +
                // '   <div class="panel-body">' +
                // cont +
                // '   </div>' +
                // ' </div>' +
                // '</div>';
        // $( "#paneles" ).append( panel );
                
      // }
    // },

    // error: function( xhr, status, error ) {
      // alert( "Error" );
      // console.log( xhr );
      // console.log( error );
    // }

  // } ); 
  
  

} );