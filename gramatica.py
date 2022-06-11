import binascii
import json


def impar(a):
      if(a%2==0):
         return 0
      else:
         return 1

def procesa(parte):
    mejor= int(parte, 16)    
    hola = bin(mejor)
    tamano= len(hola)
    nuevo= hola[2:tamano] 
    nuevo= nuevo.zfill(4)
    return nuevo

def protec(pate):
         
    hola = bin(pate)
    tamano= len(hola)
    nu= hola[2:tamano]
    nu= nu.zfill(4)
    return nu


def comando(orden,direccion):
    corta =[]
    completa=[]
    casi =''
    codigos ={'limpiar':42,'parar':34,'transmitir':35,'rf':11,'version':30,'alc':46}
    orden = str(orden)
    inicio = '02'
    fin = '03'
    t=0
    w=0
    r=0
    try:
       intermedio = codigos[orden]
       precadena =inicio+str(direccion)+str(intermedio)+fin

       while t <8 :
           temporal = precadena[t:t+1]
           madera = protec( int(temporal))
           corta.append(madera)
           t = t+1  
       #print corta  
       for r in range(4):
             completa.append(str(corta[r*2])+str(corta[r*2+1]))
           
       largo=len(completa)
       for i in range(8):
            suma =0
            for j in range(largo):
                 suma = suma+int(completa[j][i])
            
            taza = impar(suma)
            casi = casi +str(taza)
        
       sello1=hex(int(casi[0:4], 2))    
       sello2=hex(int(casi[4:8], 2))
       sello =str(sello1[2:4])+str(sello2[2:4])
        
       cadena= precadena+sello      
       return cadena  
    except KeyError:
       print 'no existe ese comando'
 

def seteo(direccion,parametro,valor):
    copia=str(valor)
    hay = copia.find(".")
    if(hay==-1):
        valor=str(valor)+"."+"0"
    corta1 =[]
    completa1=[]
    casi =''
    caracteristicas ={'atenuacion':43,'potenciaout':44}
    parametro = str(parametro)
    inicio = '02'
    fin = '03'
    t1=0
    w=0
    r1=0
    try:
       intermedio = caracteristicas[parametro]
       cantidad = (str(valor)).split(".")
       
       cantidad1= cantidad[0]
       cantidad2= cantidad[1]
       if(len(cantidad1)>1):
            ca1 = int(cantidad1[0])+30
            ca2 = int(cantidad1[1])+30
            can1= str(ca1)+str(ca2)
              
       else:
            canti1 = int(cantidad1)+30
            can1  = "20"+str(canti1)
     
       canti2 = int(cantidad2)+30
       can2 = str(canti2)
       precadena1 =inicio+str(direccion)+str(intermedio)+can1+"2e"+can2+fin
       crece = len(precadena1)
       while t1 <crece :
           temporal1 = precadena1[t1:t1+1]
           madera1 = procesa( temporal1)
           corta1.append(madera1)
           t1 = t1+1  
       
       tapon=len(corta1)
       for r1 in range(tapon/2):
             bote = str(corta1[r1*2])+str(corta1[r1*2+1])
             completa1.append(bote)
       
      

       largo=len(completa1)
       for i in range(8):
            suma =0
            for j in range(largo):
                 suma = suma+int(completa1[j][i])
            
            taza = impar(suma)
            casi = casi +str(taza)
        
       sello1=hex(int(casi[0:4], 2))    
       sello2=hex(int(casi[4:8], 2))
       sello =str(sello1[2:4])+str(sello2[2:4])
        
       cadena= precadena1+sello      
       return cadena  
    except KeyError:
       print 'no existe ese seteo'


def  pensador(bloque):
         print "EMPEZAMOS BUSCANDO"
         comanditos =['limpiar','parar','transmitir','alc']
         seteitos =['potenciaout','atenuacion']
         pakay ='' 
         for dato in comanditos:
                       if(bloque[0]==dato):
                                 pakay="coma"        
                                 
         for da in seteitos:
                       if(bloque[0]==da):
                                 pakay="se"
                              

         if(pakay=="coma"):
                print "es comando"
                estampilla=comando(bloque[0],31)
                print estampilla
                return estampilla

         if(pakay=="se"):
                print " es un seteo "
                estampa=seteo(31,bloque[0],bloque[1])
                print estampa
                return estampa

def acomodar( tronco ):
                 botella ={}
                 empezar = tronco[3:7]
                 botella['atenuacion']=empezar
                 botella['cabina']=tronco[10:12] 
                 botella['fanvoltaje']=tronco[13:17]
                 botella['corrientehelix']=tronco[20:22]
                 botella['voltajehelix']=tronco[23:27]
                 botella['reflejada']=tronco[29:31]
                 botella['potenciadbm']=tronco[33:38]
                 botella['potenciawtt']=tronco[41:42]
                 terminar = tronco[44:47]
                 
                 botella['temperaturatubo']=terminar 
                 print " ================================ ESTA  ES LA BOTELLA ================="
                 print botella
                 return  botella 
				 
def superacomodo( tronquito ):
                 print " ESTE ES EL TRONQUITO"
                 hacha =[]                 
                 #print tronquito
        	 escalera = tronquito.split(" ")
		 for z in escalera:
                          if( len(z)!=0):
                                  hacha.append(z)
                 print hacha

		 actividad = {'01':'alarma','02':'falla','03':'inhibe','04':'heater','05':'off','06':'on','07':'standby','08':'transmision','09':'pre','10':'beamon','11':'warnig','12':'beamoff','13':'reset','14':'auto-log'}
                 alarma = {'000':'buc','001':'alto-rf','002':'bajo-rf','003':'temperatura-tubo'}

                 falla = {'000':'invalido','001':'cabina-temperatura','002':'cover-interlock','003':'dc-buss','004':'external-interlock','005':'fan-stalled','006':'over-helixvol','007':'bajo-helixvol','008':'helix-standby','009':'helix-corriente','010':'alto-rf','011':'bajo-rf','012':'alto-reflejada','013':'power-arco','014':'SSIPA','015':'temperatura-tubo','016':'tubo-switch','017':'buc'}
						  
                 inhibe ={'000':'inhibit-interlock','001':'CIF','03':'Switch-WG'}
				 
				 
                 botellita ={}
                 empezare = hacha[0]
                 empezare = empezare[3:8]
				 
                 botellita['hora']=empezare
		 botellita['fecha']=hacha[1]
                 hacen = actividad[str(hacha[2])]
        	 botellita['actividad']= hacen
		 estado = inhibe[str(hacha[3])]
		 botellita['condicion_actividad']= estado
		 botellita['atenuacion']= hacha[4]
	         botellita['cabina']= hacha[5]
		 botellita['fanvoltaje']= hacha[6]
                 botellita['corrientehelix']= hacha[7]
                 botellita['voltajehelix']= hacha[8]
                 botellita['reflejada']= hacha[9]
                 botellita['potenciawtt']= hacha[10]
		 terminare = hacha[11]
                 terminare = terminare[0:2]
                 botellita['temperaturatubo']=terminare 
                 return  botellita				 

def registros(dire,orden):
    casi3 =''
    corta3 = []
    completa3 = []
    orden= int(orden)
    pegada = '30'+'30'+'30'+str(30+orden)
    preca ='02'+str(dire)+'63'+pegada+'03'
    veces = len(preca)
    t21 = 0 
    while t21 <veces :
           tempo = preca[t21:t21+1]
           made = procesa( tempo)
           corta3.append(made)
           t21 = t21+1  
    tapa=len(corta3)
    for r3 in range(tapa/2):
             bote3 = str(corta3[r3*2])+str(corta3[r3*2+1])
             completa3.append(bote3)
       
    repite=len(completa3)
    for i3 in range(8):
            suma3 =0
            for j3 in range(repite):
                 suma3 = suma3+int(completa3[j3][i3])
       
            taza3 = impar(suma3)
            casi3 = casi3 +str(taza3)
       
    sello13=hex(int(casi3[0:4], 2))    
    sello23=hex(int(casi3[4:8], 2))
    sello3 =str(sello13[2:4])+str(sello23[2:4])
    cadena3= preca+sello3      
    return cadena3  
    
    
