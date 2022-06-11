#!/bin/python

import json
import re
'''
cs = getCommandSpec( json.loads( open( 'prueba_driver.json', 'r' ).read( ) ), "ver" )

ts = json.loads( open( 'prueba_tarea2.json', 'r' ).read( ) )

print makeCommand( cs, ts )

'''
 
def parseOutput( cmdSpec, cmdOutput ):
  m = re.match( cmdSpec['outputRE'], cmdOutput.replace( '\n','').replace( '\r', '') )
  ml = list( m.groups( ) )
  mm = []
  for i, v in enumerate( cmdSpec['outputVars'] ):
    try:
      vv = v.copy( )
      vv['value'] = ml[i]
      mm.append( vv )
    except:
      vv['value'] = ''
  
  return mm
  
def getCommandSpec( deviceDrv, commandName ):
  for cmd in deviceDrv[ 'commandList' ]:
    if ( cmd[ 'commandDesc' ] == commandName ):
      return cmd
 
  print "not found"
  exit( )   
  #return { }

def getParamSpec( cmdSpec, paramName ):
  for param in cmdSpec[ 'parameters' ]:
    if ( param[ 'paramName' ] == paramName ):
      return param    
  return { }
  
  
def makeParameter( paramSpec, paramVal, oneParamSeparator=' ' ):
  if ( isinstance( paramVal,  list ) ):
    oneparam = ''
    for p in paramVal:
      oneparam = "%s%s%s%s%s" % ( paramSpec['onePrefix'], p, paramSpec['oneSuffix'], paramSpec['oneParamSeparator'], oneparam )
  else:
    # one value only
    oneparam = "%s%s%s" % ( paramSpec['onePrefix'], paramVal, paramSpec['oneSuffix'] )
    
  param = "%s%s%s" % ( paramSpec['paramPrefix'], oneparam, paramSpec['paramSuffix'] )
  return param

# cambiar esta funcion para implementar "setterScript", sera necesario
# para el modulo de gestion
def makeCommand( cmdSpec, taskSpec ):
  syntaxParams = [ s[1::] for s in cmdSpec['commandSyntax'].split( cmdSpec['paramSeparator'] ) if s[0] == "*" ]
  cmd = cmdSpec['commandSyntax']
  
  for p in taskSpec['params']:
    if p['paramName'] in syntaxParams:
      paramSpec = getParamSpec( cmdSpec, p['paramName'] ) 
      cmd = cmd.replace( "*%s" % p['paramName'], makeParameter( paramSpec, p['paramValue'] ) ) 
  
  for p in taskSpec['params']:
    if p['paramName'] in syntaxParams:
      paramSpec = getParamSpec( cmdSpec, p['paramName'] ) 
      cmd = cmd.replace( "*%s" % p['paramName'], makeParameter( paramSpec, p['paramValue'] ) ) 
      
  for remainder in syntaxParams:
    cmd = cmd.replace( "*%s" % remainder, "" )
    
  return cmd


  