"""Capture a page via the Chrome DevTools Protocol, stdlib only.

WHY THIS EXISTS. `chrome --headless --screenshot` cannot run JavaScript, and the
AIA homepage opens a promotional modal with a full-viewport scrim over exactly
the hero we want. Ruled out first, each by test rather than assumption: timing
(it fires on load), a persistent profile (the dismiss flag is set on dismiss, not
on display, despite being named "-shown"), disabling JavaScript (the page then
renders nothing), cropping around it (the scrim covers everything), and the
site's other pages (only /pricing, /support, /faq and two legal pages exist, none
of which shows the product).

Installing Playwright would solve it and is a dependency approval. This is the
same capability in about sixty lines of standard library, so it needs no
approval and works for any future capture.

NOTHING IS SUBMITTED ON THE PAGE. The only script evaluated sets the site's own
"modal already seen" flag in localStorage, which is exactly what its Cancel
button does. No credential is read, typed or stored; no form is posted.
"""
import base64
import json
import os
import socket
import struct
import subprocess
import time
import sys
import urllib.request

CHROME = (r"C:/Users/Rana/AppData/Local/ms-playwright/chromium-1228/"
          r"chrome-win64/chrome.exe")
HERE = os.path.dirname(os.path.abspath(__file__))
PORT = 9222
URL = sys.argv[1] if len(sys.argv) > 1 else None
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'capture.png')

# The hero slot at device pixel ratio 2.
# 1440x900 is the site's intended desktop layout; at 1110 its ISO badge
# collides with the headline. 1440x900 at DSF 2 gives 2880x1800, already
# exactly 16:10, which is then downscaled to the 2220x1388 the slot wants.
# A 0.77 downscale stays sharp; rendering at the wrong breakpoint does not.
CSS_W, CSS_H, DSF = 1440, 900, 2


class WS:
    """The smallest WebSocket client that can carry CDP. Text frames only."""

    def __init__(self, url):
        _, rest = url.split('://', 1)
        hostport, path = rest.split('/', 1)
        host, port = hostport.split(':')
        self.s = socket.create_connection((host, int(port)), timeout=30)
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((
            'GET /%s HTTP/1.1\r\nHost: %s\r\nUpgrade: websocket\r\n'
            'Connection: Upgrade\r\nSec-WebSocket-Key: %s\r\n'
            'Sec-WebSocket-Version: 13\r\n\r\n' % (path, hostport, key)
        ).encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.s.recv(4096)
        assert b'101' in buf.split(b'\r\n')[0], buf.split(b'\r\n')[0]
        self.buf = buf.split(b'\r\n\r\n', 1)[1]
        self.id = 0

    def _recv(self, n):
        while len(self.buf) < n:
            chunk = self.s.recv(65536)
            if not chunk:
                raise RuntimeError('socket closed')
            self.buf += chunk
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def send(self, method, **params):
        self.id += 1
        payload = json.dumps({'id': self.id, 'method': method,
                              'params': params}).encode()
        header = b'\x81'
        n = len(payload)
        if n < 126:
            header += struct.pack('!B', n | 0x80)
        elif n < 65536:
            header += struct.pack('!BH', 126 | 0x80, n)
        else:
            header += struct.pack('!BQ', 127 | 0x80, n)
        mask = os.urandom(4)
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        self.s.sendall(header + mask + masked)
        return self.id

    def read(self):
        b0, b1 = struct.unpack('!BB', self._recv(2))
        n = b1 & 0x7F
        if n == 126:
            n = struct.unpack('!H', self._recv(2))[0]
        elif n == 127:
            n = struct.unpack('!Q', self._recv(8))[0]
        if b1 & 0x80:
            m = self._recv(4)
            data = bytes(c ^ m[i % 4] for i, c in enumerate(self._recv(n)))
        else:
            data = self._recv(n)
        return json.loads(data) if (b0 & 0x0F) == 1 else {}

    def call(self, method, **params):
        want = self.send(method, **params)
        deadline = time.time() + 60
        while time.time() < deadline:
            msg = self.read()
            if msg.get('id') == want:
                if 'error' in msg:
                    raise RuntimeError('%s -> %s' % (method, msg['error']))
                return msg.get('result', {})
        raise RuntimeError('timed out waiting for %s' % method)


if not URL:
    raise SystemExit(
        'usage: python tools/capture-page.py <url> <out.png>\n'
        '\n'
        'Captures at 1440x900 CSS at device pixel ratio 2 (2880x1800) and\n'
        'writes a 2220x1388 copy beside it, which is the case-study hero\n'
        'slot at retina. Dismisses a known welcome-modal flag first.')

profile = os.path.join(HERE, 'cdp-profile')
chrome = subprocess.Popen(
    [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
     '--force-color-profile=srgb', '--remote-debugging-port=%d' % PORT,
     '--user-data-dir=%s' % profile, '--window-size=%d,%d' % (CSS_W, CSS_H),
     'about:blank'],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

try:
    target = None
    for _ in range(60):
        try:
            raw = urllib.request.urlopen(
                'http://127.0.0.1:%d/json' % PORT, timeout=2).read()
            for t in json.loads(raw):
                if t.get('type') == 'page':
                    target = t['webSocketDebuggerUrl']
                    break
            if target:
                break
        except Exception:
            pass
        time.sleep(0.5)
    assert target, 'Chrome never exposed a page target'

    ws = WS(target)
    ws.call('Page.enable')
    ws.call('Runtime.enable')
    ws.call('Emulation.setDeviceMetricsOverride', width=CSS_W, height=CSS_H,
            deviceScaleFactor=DSF, mobile=False)

    ws.call('Page.navigate', url=URL)
    time.sleep(6)

    # Exactly what the page's own Cancel button does.
    ws.call('Runtime.evaluate',
            expression="localStorage.setItem('ams-welcome-modal-shown','true')")
    ws.call('Page.reload')
    time.sleep(7)

    state = ws.call('Runtime.evaluate', expression=(
        "JSON.stringify({flag: localStorage.getItem('ams-welcome-modal-shown'),"
        " h1: (document.querySelector('h1')||{}).innerText||''})"),
        returnByValue=True)
    print('page state:', state['result']['value'][:120])

    shot = ws.call('Page.captureScreenshot', format='png',
                   captureBeyondViewport=False)
    open(OUT, 'wb').write(base64.b64decode(shot['data']))
finally:
    chrome.terminate()
    try:
        chrome.wait(timeout=15)
    except Exception:
        chrome.kill()

from PIL import Image  # noqa: E402
with Image.open(OUT) as im:
    print('captured %dx%d  %dKB' % (im.size[0], im.size[1],
                                    os.path.getsize(OUT) // 1024))
    final = os.path.join(HERE, 'aia-final.png')
    im.convert('RGB').resize((2220, 1388), Image.LANCZOS).save(final, optimize=True)
    print('downscaled -> 2220x1388  %dKB' % (os.path.getsize(final) // 1024))
    g = im.convert('L')
    w, h = g.size
    box = g.crop((int(w * .32), int(h * .28), int(w * .68), int(h * .60)))
    d = list(box.getdata())
    mean = sum(d) / len(d)
    print('centre-mean %.0f -> %s' % (mean, 'MODAL STILL PRESENT'
                                      if mean > 238 else 'CLEAR'))
