from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler, SocketServer

PORT = 8000

Handler = SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()