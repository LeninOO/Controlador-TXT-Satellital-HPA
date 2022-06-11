
cadena ='1< 3.5  0.0 43   0  0.00   0.0  38x/5'  
def analizar( cadena ):
       
       vacios =[]
       cuenta = 0
       for x in cadena :
                   print "-----"+str(cuenta)
                   print cadena[cuenta]        
                   cuenta = cuenta + 1
       largo = len(cadena)
       cuenta = 0
       while ( cuenta < largo) :

                        if( (cadena[cuenta]=='<')and(cuenta < 8)):
                               atenuacion= cadena[cuenta+1:cuenta+5]
                               cuenta = cuenta+5
                                                        
                        if(  (cuenta >9)and(cuenta <(largo-3)) ):
                                  potencia = cadena[cuenta+3]
                                  
                        cuenta = cuenta +1                                                             
                                            
                             
       
       print atenuacion
       print potencia

analizar(cadena)
