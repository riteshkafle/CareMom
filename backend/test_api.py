import urllib.request, urllib.error, json
data = json.dumps({'user_id': 'demo-user-1', 'message': 'hello'}).encode()
req = urllib.request.Request('https://f4bc-138-238-254-103.ngrok-free.app/chat', data=data, headers={
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
})
try:
    with open('error.txt', 'w') as f:
        f.write(urllib.request.urlopen(req).read().decode())
except urllib.error.HTTPError as e:
    with open('error.txt', 'w') as f:
        f.write(e.read().decode())
