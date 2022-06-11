#!/bin/python

import json
import os
import time 
import datetime
import sys 

from caltecmonitor_parser import *
from caltecmonitor_connector import *
from caltecmonitor_service import *
from caltecmonitor_aux import *

  
if __name__ == "__main__":
  current_connections = jsonFile2Dict( 'conexiones.json' )
  f = "tasks/%s_tarea.json" % sys.argv[1]
  t = jsonFile2Dict( f )
  loaded_drivers = [ jsonFile2Dict( "drivers/" + d['driverFile'] ) for d in current_connections['deviceList'] ]
  t["cmdSpec"] = getCommandSpec( getDeviceDriver( t['modelNumber'], loaded_drivers ), t["commandName"] ) 
  current_connections = { 'deviceList' : [ x for x in current_connections['deviceList'] if x['connectionName'] == t['connectTo'] ] }
  
  current_connections = makeConnections( current_connections )
  
  # running_tasks = [ jsonFile2Dict( f ) for f in os.listdir( "./tasks" ) if f.endswith( "_tarea.json" ) ]
  
  cnxSpec = getConnectionSpec( t['connectTo'], current_connections  )
  x = parseOutput( t["cmdSpec"], sendCommand( makeCommand( t["cmdSpec"], t ).strip( ), cnxSpec ) )
  checkAlerts( t, x )
  insertResponse( t['taskName'], x )

