import serial
ser = serial.Serial('/dev/ttyUSB0', 9600)
ser.write('3')
while 1 :
    print 'a'
    print ser.readline()