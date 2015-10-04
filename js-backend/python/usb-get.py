import time
import serial

ser = serial.Serial('/dev/ttyUSB0', 9600)
while 1 :
    time.sleep(1)
    sensor = ser.readline()
    print sensor
    file = open('./sensors', 'w+')
    file.write(sensor)
    file.close()
