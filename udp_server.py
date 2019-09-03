import socket

IP = '127.0.0.1'
PORT = 5432

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((IP, PORT))

while True:
    data, adr = sock.recvfrom(1024)
    print("Received the following message: ", data)
