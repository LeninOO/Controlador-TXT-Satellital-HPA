import sys
import time
import telnetlib

def flor():
   HOST ="192.168.2.101"
   tn=telnetlib.Telnet(HOST,"23")
   tn.write("023163303030300353")
   l=tn.read_all()
   print l


def prepareCommand( comm, ef="", enc="ascii" ):
  if ( enc == "ascii" ):
    return ( comm.encode( 'ascii', 'ignore' ), ef )
  elif ( enc == "hex" ):
    return ( comm.decode( "hex" ), ef.encode( "hex" ) )
    
def sendCommand( comm, connSpec ):
  if ( connSpec['type']=="telnet" ):
    print "SENDING THROUGH TELNET"
    print connSpec
    ( comm ) = prepareCommand( comm, connSpec['endFlag'], connSpec['encode'] )
    connSpec['connection'].write( comm )
    return connSpec['connection'].read_until( connSpec['endFlag'], connSpec['timeout'] )
  elif ( connSpec['type']=="cmdshell" ):
    print "SENDING THROUGH SHELL"
    return directCommand( comm )
  else:
    print "Command connection type not found."
    exit( )

def flor():
   HOST ="192.168.2.101"
   tn=telnetlib.Telnet(HOST,"23")
   tn= prepareCommand(tn,' ','ascii')
   tn.write("023163303030300353")
   l=tn.read_all()
   print l

flor()
