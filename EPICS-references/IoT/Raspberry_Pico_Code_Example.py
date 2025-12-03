## This is the code I used in the experiential learning in VIT Chennai

from machine import Pin
import utime
from hcsr04 import HCSR04 # we have to add this library file in the same folder or else it may not work sometimes
from time import sleep
import time
from machine import Pin
buzzer = Pin(2,Pin.OUT)
sensor = HCSR04(trigger_pin=15,echo_pin=14,echo_timeout_us=10000)# 9 8
from machine import Pin
from gpio_lcd import GpioLcd
import time
count=0
lcd = GpioLcd(rs_pin = Pin(8),
          enable_pin = Pin(9),
          d4_pin = Pin(10),
          d5_pin = Pin(11),
          d6_pin = Pin(12),
          d7_pin = Pin(13))

# while (1):
#    count=count+1
#    lcd.move_to(13,1) 
#    lcd.putstr(str(count))
#    time.sleep(1)

lcd_display = 0
while(1):
    distance = sensor.distance_cm()
    print('Distance:', distance, 'cm')
    time.sleep(1)
    if round(distance, 1) == 6.9:
        print("69 lets go!!")
        lcd_display = 1
        break

if lcd_display == 1:
    lcd.move_to(0,0) 
    lcd.putstr("DISPLAY Pro Max")
    lcd.move_to(0,1) 
    lcd.putstr("SEND DATA:")
