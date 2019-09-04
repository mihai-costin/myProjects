import socket

HOST = '127.0.0.1'  # remote host
PORT = 50000

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((HOST, PORT))
sock.sendall(b'Hello world!')
data = sock.recv(1024)
sock.close()

print("Received ", repr(data))
