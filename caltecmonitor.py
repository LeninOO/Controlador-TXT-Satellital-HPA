#!/bin/python

# Este sera el demonio.

import json
import os
import time 
import datetime

from caltecmonitor_parser import *
from caltecmonitor_connector import *
from caltecmonitor_service import *
from caltecmonitor_aux import *

  
if __name__ == "__main__":
  current_connections = jsonFile2Dict( 'conexiones.json' )
  
  loaded_drivers = [ jsonFile2Dict( "drivers/" + d['driverFile'] ) for d in current_connections['deviceList'] ]
      
  current_connections = makeConnections( current_connections )
  
  running_tasks = [ jsonFile2Dict( f ) for f in os.listdir( "./tasks" ) if f.endswith( "_tarea.json" ) ]
  
  # los que necesitan solo una ejecucion
  
  fecha = datetime.datetime.now( )
  for t in running_tasks: 
      
    if ( t['freq'] == 0 ):
      x = parseOutput( t["cmdSpec"], sendCommand( makeCommand( t["cmdSpec"], t ).strip( ), getConnectionSpec( t['connectTo'], current_connections ) ) )
      insertResponse( t['taskName'], x, fecha )
      t['countdown'] = -1
    else:
      t['countdown'] = 0
      t['countdown'] = t['freq']
  
  # los que necesitan mas de una ejecucion en el tiempo  
  while( True ):
    fecha = datetime.datetime.now( )
    for t in running_tasks:
      if ( t['countdown'] != 0 ):
        t['countdown'] -= 1
      else:
        x = parseOutput( t["cmdSpec"], sendCommand( makeCommand( t["cmdSpec"], t ).strip( ), getConnectionSpec( t['connectTo'], current_connections  ) ) )
        t['countdown'] = t['freq']
        insertResponse( t['taskName'], x )
    time.sleep( 1 )

