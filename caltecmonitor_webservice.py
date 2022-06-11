from bottle import *
from caltecmonitor_service import *
from caltecmonitor_aux import *
import time 
import json 
import os 
from crontab import CronTab

loaded_drivers = getLoadedDrivers( )
current_connections = jsonFile2Dict( 'conexiones.json' )

# este decorador permite que se llame desde otro dominio
def enable_cors( fn ):
  def _enable_cors( *args, **kwargs ):
    # cabecera CORS
    #bottle.response.content_type = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

    if request.method != 'OPTIONS':
      return fn( *args, **kwargs )

  return _enable_cors
  
@route( '/saveConfig', method=['OPTIONS', 'POST'] )
@enable_cors
def saveConfig( ):
  settings = json.loads( request.body.read( ) )
  #print settings
  
  return { } 

@route( '/getSettings', method=['OPTIONS', 'POST'] )
@enable_cors
def getSettings( ):
  import monitor
  return monitor.getSettings( )

@route( '/getDrivers', method=['OPTIONS', 'POST'] )
@enable_cors
def getDrivers( ):
  loadedDrvs = queryDrivers( )
  #print loadedDrvs
  detectedNotLoaded = [ ]
  driverFiles = [ jsonFile2Dict( "drivers/" + f ) for f in os.listdir( "drivers/" ) if f.endswith( "_driver.json" ) ]

  loadedNames = [ l['modelNumber'] for l in loadedDrvs ]
  
  for d in driverFiles:
    if not( d['modelNumber'] in loadedNames ):
      detectedNotLoaded.append( { "modelNumber": d['modelNumber'], 
      "image":d['image']} )
     
  ld = [ { "modelNumber": i, "image": getDeviceDriver( i, driverFiles )['image'] } for i in loadedNames ]
  
  return { "loadedDrivers": ld, "detectedNotLoaded": detectedNotLoaded }
  
@route( '/prepareTask', method=['OPTIONS', 'POST'] )
@enable_cors
def prepareTask( ):
	data = json.loads( request.body.read( ) )
	tarea = jsonFile2Dict( "./tasks/" + data['taskFilename'] )
	print "preparing " + data['taskFilename']
	c = queryCommand( tarea['commandName'], tarea['modelNumber'] )
	print c.commandName
	insertTask( tarea['taskName'], c.idCommand )
	return { }
	
@route( '/unprepareTask', method=['OPTIONS', 'POST'] )
@enable_cors
def unprepareTask( ):
	data = json.loads( request.body.read( ) )
	tarea = jsonFile2Dict( "./tasks/" + data['taskFilename'] )
	print "deleting " + data['taskFilename']	
	removeTask( tarea['taskName'] )
	# os.remove( "tasks/%s" % data['taskFilename'] )
	return { }

@route( '/taskMakerData', method=['OPTIONS', 'POST'] )
@enable_cors
def taskMakerData( ):
  return { "drivers": loaded_drivers, "connections": current_connections['deviceList'] }
  
@route( '/registros', method=['OPTIONS', 'POST'] )
@enable_cors
def registros( ):
   from gramatica import superacomodo,registros
   from lienzo import marco
   informe = 10
   todo =[] 
   w = 0
   for w in range(informe):
        huevo = '0'+'0'+'0'+str(w)
	print " ESTE ES EL HUEVO "
        print huevo
        cartita = registros('31',huevo)
        
	respuesta = marco(cartita)
        #print " ESTA ES LA RESPUESTA  A LA FOTO "
        #print respuesta
        time.sleep(0.05)
        boletita=superacomodo(respuesta)
        todo.append(boletita)
   print " ESTO SON TODOS LOS REGISTROS"
   print todo
   return {"bitacora":[ todo]} 
  
@route( '/startTask', method=['OPTIONS', 'POST'] )
@enable_cors
def startTask( ):
  data = json.loads( request.body.read( ) )
  tarea = jsonFile2Dict( "./tasks/" + data['taskFilename'] )
  thiscron = CronTab( user=True )
  cmdstr = "cd /home/caltec/caltecmonitor/ && python caltecmonitor_runtask.py %s 1>/dev/null 2>&1" % data['taskFilename'].replace( "_tarea.json" , "" )
  job = thiscron.new( command=cmdstr, user="caltec", comment='Tarea para "%s" generado por Monitor' % tarea['taskName'] )
  job.minute.every( tarea['freq'] )
  job.enable( )
  thiscron.write( )
 
@route( '/stopTask', method=['OPTIONS', 'POST'] )
@enable_cors
def stopTask( ):
  data = json.loads( request.body.read( ) )
  tarea = jsonFile2Dict( "./tasks/" + data['taskFilename'] )
  thiscron = CronTab( user=True )
  for c in thiscron:
    if re.match( ".*\.py\ (.*)\ .*\ .*", c.command ).groups(0)[0] == data['taskFilename'].replace( "_tarea.json", "" ):
	  thiscron.remove( c )
	  thiscron.write( )
	  break
	  
@route( '/getConnections', method=['OPTIONS', 'POST'] )
@enable_cors
def getConnections( ):
  return jsonFile2Dict( 'conexiones.json' )
  
  
@route( '/getTasks', method=['OPTIONS', 'POST'] )
@enable_cors
def getTasks( ):
  t = { "allTasks": [ jsonFile2Dict( "./tasks/" + f ) for f in os.listdir( "./tasks" ) if f.endswith( "_tarea.json" ) ] }
  task_files = [ f for f in os.listdir( "./tasks" ) if f.endswith( "_tarea.json" ) ]
  thiscron = CronTab( user=True )
  croncommands = [ cr.command for cr in thiscron ]
  
  for i, task in enumerate( t["allTasks"] ):
    task["taskFilename"] = task_files[i]
    task['running'] = 0
    for c in croncommands:
     #if task_files[ i ].replace( "_tarea.json", "" ) in c:
      try: 
        if re.match( ".*\.py\ (.*)\ .*\ .*", c ).groups(0)[0] == task_files[i].replace( "_tarea.json", "" ):
          print c
          print task_files[i]
          task['running'] = 1
          break
      except AttributeError:
		  pass
	
    if ( queryTask( task['taskName'] ) != None ):
      task['ready'] = 1
    else:
	  task['ready'] = 0
	
    	
  return t
  

@route( '/getViews', method=['OPTIONS', 'POST'] )
@enable_cors
def getViews( ):
  allViews = []
  for view in [ jsonFile2Dict( "views/" + f ) for f in os.listdir( "views/" ) if f.endswith( "_vista.json" ) ]:
    allViews.append( { 
      "viewName": view['viewName'],
      "viewDescription": view['viewDescription'],
      "viewDetails": queryViews( view['fromTasks'], view['registers'] ),
      "template": view['template'],
      "mainOutputTask": view['mainOutputTask'],
      "mainOutput": view['mainOutput']
      } )
      
  return {"allViews": allViews }
  
@route( '/getGroups', method=['OPTIONS', 'POST'] )
@enable_cors  
def getGroups( ):
  return jsonFile2Dict( 'grupos.json' )


@route( '/getTemplates', method=['OPTIONS', 'POST'] )
@enable_cors
def getTemplates( ):

  return { "allTemplates": [ f.replace( '_tpl.html', '' ) for f in os.listdir( "./templates" ) if f.endswith( "_tpl.html" ) ] }
  
  
@route( '/getTasksResponses', method=['OPTIONS', 'POST'] )
@enable_cors
def getTasksResponse( ):
  d = getTasksResponseSpecs( )
  return d
  

@route( '/saveView', method=['OPTIONS', 'POST'] )
@enable_cors
def saveView( ):
  data = json.loads( request.body.read( ) )
  taskList = [] 

  for ( taskName, listResp ) in data['listaCampos'].iteritems( ):
    taskList.append( { 
      "taskName": taskName, 
      "chooseOutputs": listResp
    } )
    
  newView = { "viewName": data['viewName'],
  "viewDescription": data['viewDesc'],
  "registers": int( data['registers'] ),
  "mainOutputTask": data['mainTaskName'],
  "mainOutput": data['mainOutputName'],
  "fromTasks": taskList,
  "template": data['templateName']
  }
  
  open( "views/%s_vista.json" % data['viewName'], "w" ).write( json.dumps( newView ) )
  return { "status": 0 }

  
@route( '/getManagers', method=['OPTIONS', 'POST'] )  
@enable_cors
def getManagers( ):  
   from gramatica import pensador,acomodar
   from lienzo import foto
   respuesta = foto('02313E030E')
   boleta=acomodar(respuesta)
   print boleta
   return {"album":[ boleta]}
   #return {"allManagers": [ jsonFile2Dict( "./managers/" + f ) for f in os.listdir( "./managers" ) if f.endswith( "_manager.json" ) ]}

@route( '/callSetter', method=['OPTIONS', 'POST'] )  
@enable_cors
def callSetter( ):    
  data = json.loads( request.body.read( ) )
  print data
  from caltecmonitor_parser import makeCommand
  from caltecmonitor_connector import sendCommand, getConnectionSpec
  from caltecmonitor_aux import getManagerSpec
  from gramatica import pensador
  from lienzo import foto   
  man_spec = getManagerSpec( data["managerName"] )
  
  #cmd_spec = getCommandSpec( getDeviceDriver( man_spec['modelNumber'], loaded_drivers ), man_spec["commandName"] ) 
  
  for c, d in data["thisform"].iteritems( ):
    man_spec[ "params" ].append( { "paramName" : c, "paramValue": d } )
  
  print "-----------------------------------------------------------"
  martin = man_spec['params']
  print  data['managerName']
  print "----------------------------------------------------------"
  parametro =  martin[0].get('paramName')
  cambio    =  martin[0].get('paramValue')
  print  parametro 
  print  cambio
  print "-----------------------------------------------------------"

  palabra= pensador([parametro,cambio])
  cana= foto(palabra)
  return { "response": cana }
  print "SALIDA DE ACTUALIZAR : ", cana
  
@route( '/getAlerts', method=['OPTIONS', 'POST'] )  
@enable_cors
def getAlerts( ):  
  la = [ jsonFile2Dict( "./alerts/" + f ) for f in os.listdir( "./alerts" ) if f.endswith( "_alert.json" ) ]
  for aa in la:
    a = queryAlert( aa['alertName'] )
    if a is None:
	  insertAlert( aa['alertName'], 0 )
	  aa['isActive'] = 0
	  aa['isAlarmed'] = 0
    else:
	  aa['isActive'] = a.isActive
	  aa['isAlarmed'] = a.isAlarmed
	  
  return { "listAlerts" : la }
  
  
@route( '/netin', method=['OPTIONS', 'POST'] )  
@enable_cors
def netin( ):
  import pam
  a = pam.pam( )
  data = json.loads( request.body.read( ) )
  if ( a.authenticate( data['username'], data['password'], "login" ) ):
    return { "status" : 0 }
  
  return { "status" : -1 }


run( host='192.168.12.106', port=9090, debug=True )
