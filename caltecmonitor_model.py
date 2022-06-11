#!/bin/python
from sqlalchemy import *
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import *
import datetime

Base = automap_base()

class CDevice( Base ):
  __tablename__ = "DEVICES"
  idDevice = Column( Integer, primary_key=True )
  modelNumber = Column( String )
  
class CCommand( Base ):
  __tablename__ = "COMMANDS"
  idCommand = Column( Integer, primary_key=True )
  commandName = Column( String )
  commandDescription = Column( String )
  idDevice = Column( ForeignKey( 'DEVICES.idDevice' ) )  
  
class CTask( Base ):
  __tablename__ = "TASKS"
  idTask = Column( Integer, primary_key=True )
  taskName = Column( String )
  idCommand = Column( ForeignKey( 'COMMANDS.idCommand' ) )
  
  #task = relationship( "CCommand", back_populates="TASKS" )
  

class CResponse( Base ):
  __tablename__ = "RESPONSES"
  idResponse = Column( Integer, primary_key=True )
  output = Column( String )
  outputType = Column( String )
  outputName = Column( String )
  outputDesc = Column( String )
  queryTime = Column( DateTime, default=datetime.datetime.now )
  idTask = Column( ForeignKey( 'TASKS.idTask' ) )   

class CAlert( Base ):
  __tablename__ = "ALERTS"
  idAlert = Column( Integer, primary_key=True )
  alertName = Column( String )
  isActive = Column( Integer )
  isAlarmed = Column( Integer )
  
Base.prepare( )