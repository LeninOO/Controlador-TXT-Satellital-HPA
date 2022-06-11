#!/bin/python
import SimpleHTTPServer
import SocketServer
import os
os.chdir( "./static" )
SocketServer.TCPServer( ( "", 8888 ), SimpleHTTPServer.SimpleHTTPRequestHandler ).serve_forever( )