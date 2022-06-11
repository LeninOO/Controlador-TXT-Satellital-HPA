#!/bin/python
import json 

def directCommand( commandString ):
  # esta funcion es para probar el parser
  # no se utilizara sobre la marcha
  import subprocess
  #return subprocess.check_output( commandString.split( ' ' ), shell=True )
  return subprocess.check_output( commandString, shell=True )
  
  
def getConnectionSpec( connName, currentcon=None ):
  if ( currentcon is None ):
    cc = json.loads( open( 'conexiones.json', 'r' ).read( ) )
  else:
    cc=currentcon
  
  for c in cc['deviceList']:
    if c['connectionName'] == connName:
      return c
  print "Connection not found"
  exit( )
  return { }
  
def telnetConnect( host ):
  import telnetlib
  t = telnetlib.Telnet( host )
  return t 
  
def makeConnections( cnxList ):
  deviceConnections = cnxList.copy( )
  
  for d in cnxList["deviceList"]:
    drv = json.loads( open( "drivers/" + d['driverFile'], "r" ).read( ) )
    d['encode'] = drv['encode']
    d['endFlag'] = drv['endFlag']
    if ( d['type'] == "telnet" ):
      d['connection'] = telnetConnect( d['ipAddress'] )
    elif ( d['type'] == "cmdshell" ):
      d['connection'] = None
      d['endFlag'] = ""
    else:
      d['connection'] = None
      d['endFlag'] = ""
      
  return deviceConnections
    
def prepareCommand( comm, ef="", enc="ascii" ):
  if ( enc == "ascii" ):
    return ( comm.encode( 'ascii', 'ignore' ), ef )
  elif ( enc == "hex" ):
    return ( comm.decode( "hex" ), ef.encode( "hex" ) )
    
def sendCommand( comm, connSpec ):
  if ( connSpec['type']=="telnet" ):
    print "SENDING THROUGH TELNET"
    print  connSpec
    ( comm, endFlag ) = prepareCommand( comm, connSpec['endFlag'], connSpec['encode'] )
    connSpec['connection'].write( comm ) 
    return connSpec['connection'].read_until( connSpec['endFlag'], connSpec['timeout'] )
  elif ( connSpec['type']=="cmdshell" ):
    print "SENDING THROUGH SHELL"
    return directCommand( comm )
  else:
    print "Command connection type not found."
    exit( )

def clavo( comm, connSpec ):
  if ( connSpec['type']=="telnet" ):
    #print "SENDING THROUGH TELNET"
    #print  connSpec
    ( comm, endFlag ) = prepareCommand( comm, connSpec['endFlag'], connSpec['encode'] )
    connSpec['connection'].write( comm ) 
    
    return connSpec['connection'].read_until("@",0.3)
    #return connSpec['connection'].read_until("\x03")
  elif ( connSpec['type']=="cmdshell" ):
    print "SENDING THROUGH SHELL"
    return directCommand( comm )
  else:
    print "Command connection type not found."
    exit( )
