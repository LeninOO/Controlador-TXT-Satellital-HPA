
def telnetConnect( host ):
  import telnetlib
  t = telnetlib.Telnet( host )
  return t 

print "PROBANDO  CONEXION"
y= telnetConnect("192.168.2.101")
#02 31 43 31 30 2E 30 03 6
print(y.write('02314320362E310331'))


