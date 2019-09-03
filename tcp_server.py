import socket

HOST = ''
PORT = 50000  # non-privileged port

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind((HOST, PORT))
sock.listen(1)
conn, adr = sock.accept()
print("Connected by ", adr)

while True:
    data = conn.recv(1024)
    if not data:
        break
    conn.sendall(data)
conn.close()
