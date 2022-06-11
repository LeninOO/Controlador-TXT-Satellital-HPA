import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEBase import MIMEBase
from email import encoders
import jinja2
import datetime
URL = "http://192.168.2.174/#views"
def jsonFile2Dict( jsonFile ):
  import json
  return json.loads( open( jsonFile, 'r' ).read( ) ) 


MAIL_CFG = jsonFile2Dict( "./alerts/mailSettings.json" )

def makeMessageBody( tplFilename, msgVars ):
  return "Lorem ipsum dolor sit amet... "

def sendMailMessage( fromAddr, toAddr, msgSubject, msgBody, mailCfg=MAIL_CFG ):
  msg = MIMEMultipart( )
  msg['From'] = fromAddr
  msg['To'] = toAddr
  msg['Subject'] = msgSubject
 
  body = msgBody
 
  msg.attach( MIMEText( body, 'plain' ) )
 
  #filename = "NAME OF THE FILE WITH ITS EXTENSION"
  #attachment = open("PATH OF THE FILE", "rb")
 
  # part = MIMEBase( 'application', 'octet-stream' )
  # part.set_payload((attachment).read())
  # encoders.encode_base64( part )
  # part.add_header( 'Content-Disposition', "attachment; filename= %s" % filename )
 
  # msg.attach( part )
 
  server = smtplib.SMTP( mailCfg['host'], mailCfg['port'] )
  if ( mailCfg['startTLS'] == 1 ):
    server.starttls( )	
	
  server.login( fromAddr, mailCfg['passphrase'] )
  text = msg.as_string( )
  server.sendmail( fromAddr, toAddr, text )
  server.quit( )
  
  return True
  
def sendAlertMessage( tarea, registros, alerta ):
  t=jinja2.Template( open( "./alerts/mail.tpl.txt" , "r" ).read( ) )
  msgBody = t.render( fechaConsulta=datetime.datetime.now( ).strftime( "%H:%M:%S del %d de %B del %Y" ), nomTarea=tarea['taskName'], valores=registros, url=URL ) 
  sendMailMessage( MAIL_CFG['fromAddress'], ",".join(alerta['sendTo']), 'Alerta de %s' % alerta['alertName'], msgBody )