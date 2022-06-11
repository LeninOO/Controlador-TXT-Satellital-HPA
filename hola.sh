#!/bin/sh
for i in `seq 1 10000`; do
    echo $i
    python  /home/caltecmonitor/python foto.py  meter_readings_query  1>/dev/null 2>&1
done
