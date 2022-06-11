#!/bin/python

# Estas son funciones auxliares. 
# Vendrian a ser un helper, pero como se trata de un desarrollo
# estructurado, no tendria sentido llamarle asi 
import json 
import os 
from caltecmonitor_mailer import sendAlertMessage

def jsonFile2Dict( jsonFile ):
  return json.loads( open( jsonFile, 'r' ).read( ) ) 

def getDeviceDriver( modelNumber, drivers ):
  for d in drivers:
    if d['modelNumber'] == modelNumber :
      return d
  print "DRIVER NOT FOUND!"
  exit( 0 )
 
def getTaskDevice( taskName ):
  for t in [ jsonFile2Dict( "./tasks/" + f ) for f in os.listdir( "./tasks" ) if f.endswith( "_tarea.json" ) ]:
    if t['taskName'] == taskName:
      return t['modelNumber']
    
  print "no se encontro la tarea %s" % taskName
  exit( )

def getDeviceTasks( modelNumber ):
  allTasks = [ jsonFile2Dict( "./tasks/" + f ) for f in os.listdir( "./tasks" ) if f.endswith( "_tarea.json" ) ]
  devTasks = []
  for t in allTasks:
    if ( modelNumber == t['modelNumber'] ):
      devTasks.append( t )
  return devTasks

def getTaskViews( taskName ):
  tv = []
  for v in [ jsonFile2Dict( "./tasks/" + f ) for f in os.listdir( "views/" ) if f.endswith( "_vista.json" ) ]:
    for vv in v['outputList']:
      print vv 
      if vv['taskName']==taskName:
        tv.append( v )
        break
  return tv
  
def getViewSpec( viewName ):
  for v in [ jsonFile2Dict( "views/" + f ) for f in os.listdir( "views/" ) if f.endswith( "_vista.json" ) ]:
    if v['viewName'] == viewName:
      return v
  
  print "vista no encontrada"
  
def getOutputSpec( commandSpec, outputName ):
  for ov in commandSpec['outputVars']:
    if ov['outputName'] == outputName:
      return ov
  #return { }
  print "salida no encontrada %s" % outputName
  exit( )

def getCommandSpec( driver, commandName ):
  for c in driver['commandList']:
    if commandName==c['commandDesc']:
      return c
  print "command not found"
  exit( )

def getManagerSpec( managerName ):
  return jsonFile2Dict( "managers/%s_manager.json" % managerName )
  
def getLoadedDrivers( ): 
  current_connections = jsonFile2Dict( 'conexiones.json' )
  return [ jsonFile2Dict( "drivers/" + d['driverFile'] ) for d in current_connections['deviceList'] ]
  
def getTasksResponseSpecs( ):
  taskList = [ jsonFile2Dict( "./tasks/" + f ) for f in os.listdir( "./tasks" ) if f.endswith( "_tarea.json" ) ]
  tasks = {}
  for task in taskList:
    loaded_drvs = getLoadedDrivers( )
    for drv in loaded_drvs:
      if ( task['modelNumber'] == drv['modelNumber'] ):
        responseList = [] 
        for comm in drv['commandList']:
          if ( task['commandName'] == comm['commandDesc'] ):
            #responseList.append( { "responseSpecs": comm['outputVars'] })
            responseList = comm['outputVars']
        tasks[ task['taskName'] ] = responseList
  
  return tasks

def addViewToGroup( viewName, groupName ):
  a = open( 'grupos.json', 'r' )
  grupos = json.loads( a.read( ) )
  a.close( )
  for g in grupos['groupList']:
    if( groupName == g['groupName'] ):
      g['viewsList'].append( viewName )
  
  a = open( "grupos.json", "w" ).write( json.dumps( grupos ) )
  
  return { }
  
# esto mueve la logica de lo que antes se manejaba en un bucle infinito
# al gestor de tareas (cron) integrado en SO's Unix-like
def task2Cron( taskFileName ):
  from crontab import CronTab
  taskSpec = jsonFile2Dict( "./tasks/" + taskFileName )
  taskSubStr = taskFileName.replace( "_tarea.json", "" )
  thiscron = CronTab( user=True )
  cmdstr = "cd /home/caltec/caltecmonitor/ && python caltecmonitor_runtask.py %s 1>/dev/null 2>&1" % taskFileName
  print cmdstr
  cron_job = thiscron.new( command=cmdstr, user="caltec" )
  # La tarea se ejecuta cada 'taskSpec["freq"]' minutos.
  cron_job.minute.every( taskSpec["freq"] )
  print taskSpec["freq"]
  cron_job.enable( )
  thiscron.write( )
  
def getAlertsForTask( taskName ):
  allAlerts = [ jsonFile2Dict( "./alerts/" + f ) for f in os.listdir( "./alerts" ) if f.endswith( "_alert.json" ) ]
  #  "fromTask": "drm1",
  # "compareOutput": "snmpgetout",
  l = []
  for a in allAlerts:
    if ( a['fromTask'] == taskName ):
	  print a['fromTask']
	  print taskName
	  l.append( a )
  return l

def isAlarmed( alert, outputs ):
  ss = alert['usingEval']
  for oo in outputs:
    ss = ss.replace( oo['outputName'], oo['value'] )
  return eval( ss )
  
def checkAlerts( t, outs ):
  print "CHECKING ALERTS"
  alerts = getAlertsForTask( t['taskName'] )
  for al in alerts:
    if isAlarmed( al, outs ):
	  print "ALARMA ACTIVA"
	  sendAlertMessage( t, outs, al )

  
  #if ( isAlarm( aspec, queryLastResponse( t, outputName ).output ) and isAlarm( aspec, rec ) ): 
  #  sendAlertMessage( t, rec, aspec )
 

