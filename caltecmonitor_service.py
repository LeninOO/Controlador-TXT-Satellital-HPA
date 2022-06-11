#!/bin/python

## para la base de datos
from sqlalchemy import *
from sqlalchemy.orm import *
import datetime
import time

engine = create_engine( 'sqlite:///caltecmon.sqlite', echo=False )
engine.connect( ).connection.connection.text_factory = str

Session = sessionmaker(bind=engine)
session = Session( )  

## /para la base de datos 

from caltecmonitor_model import *
from caltecmonitor_aux import *

def removeTask( taskName, s=session ):
  t = s.query( CTask ).filter( CTask.taskName==taskName ).first( ).idTask
  
  s.query( CTask ).filter( CTask.taskName==taskName ).delete( )
  # print t.taskName
  
  r = s.query( CResponse ).filter( CResponse.idTask==t ).delete( )
  # print r[0].output

  # s.delete( r )
  # s.commit( )
 
	

  # s.delete( t )
  s.commit( )

def insertAlert( alertName, isActive, s=session ):
  t = CAlert( alertName=alertName, isActive=isActive, isAlarmed=0 )
  s.add( t )
  s.commit( )
  
  
def insertTask( taskName, idCommand, s=session ):
  t = CTask( taskName=taskName, idCommand=idCommand )
  s.add( t )
  s.commit( )

def queryCommand( commandName, deviceName, s=session ):
  d = s.query( CDevice ).filter( CDevice.modelNumber==deviceName ).first( )
  return s.query( CCommand ).filter( CCommand.commandName==commandName, CCommand.idDevice==d.idDevice ).first( )
  
def insertResponse( t, rr, fecha=datetime.datetime.now( ), s=session ):
  import caltecmonitor_aux 
  import string
  printable = set(string.printable)
  print rr
  # fecha = datetime.datetime.now( ) 
  # thisdevice = s.query( CDevice ).filter( CDevice.modelNumber == r['modelNumber'] ).first( )
  # thiscommand = s.query( CCommand ).filter( CCommand.commandName == r["commandName"] ).first( )
  thistask = s.query( CTask ).filter( CTask.taskName == t ).first( )


  for r in rr:
    x=filter(lambda x: x in printable, r['value'])
    #print "iterando"
    #print "---- " + r['value']
    #print "---- " + t
    #caltecmonitor_aux.checkAlerts( t, r['value'] )
    thisresponse = CResponse( output=x, idTask=thistask.idTask, outputType=r['type'], outputName=r['outputName'], outputDesc=r['outputDesc'], queryTime=fecha )
    session.add( thisresponse )
    
  session.commit( )
'''
drvs = session.query( CDevice ).all( )
print objectList2DictList( drvs )
'''

def queryTask( taskName, s=session ):
  thistask = s.query( CTask ).filter( CTask.taskName == taskName ).first( )
  return thistask
  
def objectList2DictList( objList ):
  dictList = [ ]
  for itemObj in objList:      
    d = dict( )
    for claveDict, valorDict in itemObj.__dict__.iteritems( ):
      # barrabasada para que esto funcione:
      t = str( valorDict  )
      if not( "object" in t ):
        d[ claveDict ] = valorDict
    dictList.append( d )
    
  return dictList
      
def queryDrivers( s=session ):
  drvs = s.query( CDevice ).all( )
  return objectList2DictList( drvs )

def queryLastResponse( taskName, outputName ):
  t = queryTask( taskName )  
  return s.query( CResponse ).filter( CResponse.idTask == t.idTask ).filter( CResponse.outputName==outputName ).order_by( desc( CResponse.queryTime ) ).first( )
  
def queryResponses( responseName, s=session ):
  rs = s.query( CResponse ).filter( CResponse.outputName==responseName ).all( )
  return objectList2DictList( rs )

def queryAlert( alertName, s=session ):
  return s.query( CAlert ).filter( CAlert.alertName == alertName ).first( )  
  
# esto procesa las salidas de varias tareas
def queryViews( taskOutputsList, limitVal=5, s=session ):
  allTasksResults = []
  for t in taskOutputsList:
    thistask = s.query( CTask ).filter( CTask.taskName==t['taskName'] ).first( )
    thiscommand = s.query( CCommand ).filter( CCommand.idCommand == thistask.idCommand ).first( )
  
    thisdevice = s.query( CDevice ).filter( CDevice.idDevice == thiscommand.idDevice ).first( )

    thisdevicedriver = getDeviceDriver( thisdevice.modelNumber, getLoadedDrivers( ) )

    thiscommandspec = getCommandSpec( thisdevicedriver, thiscommand.commandName )
    
    allOutputs = [ ]
    for o in t['chooseOutputs']:
      print t['taskName']
      thisoutputspec = getOutputSpec(  thiscommandspec, o )
      if thisoutputspec == {} : 
        pass
	  
      thisresult = thisoutputspec.copy( )
      # traer los N ultimos
      thisoutput = s.query( CResponse ).filter( CResponse.idTask == thistask.idTask ).filter( CResponse.outputName==o ).order_by( desc( CResponse.queryTime ) ).limit( limitVal )
      thisOutputList = []
      for to in thisoutput:
        thisOutputList.append( { "queryTime": time.mktime( to.queryTime.timetuple( ) ), "value" : to.output } )
        # thisOutputList.append( { "queryTime": to.queryTime, "value" : to.output } )
  
      thisresult['resultsList'] = thisOutputList[::-1]
      
      allOutputs.append( thisresult )
    
    thisTaskResult = { "taskName": thistask.taskName, "taskResults": allOutputs }
    allTasksResults.append( thisTaskResult )
  
  return allTasksResults
  #return { "allTasksResults" : allTasksResults }
