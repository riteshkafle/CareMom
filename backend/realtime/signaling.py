"""
WebRTC Signaling using Supabase Realtime

In Supabase, WebRTC signaling (exchange of SDP offers, answers, and ICE candidates)
is typically handled entirely on the client-side using Supabase Broadcast. 
The backend does not need to heavily proxy these events unless recording the call.

Client-side implementation example (JavaScript/TypeScript for your frontend):

```javascript
const channel = supabase.channel('telehealth-room-123')

channel
  .on('broadcast', { event: 'webrtc-offer' }, payload => {
    // 1. Handle incoming WebRTC offer from Doctor
    // 2. Set Remote Description
    // 3. Create Answer and send it back
    console.log('Received offer:', payload)
  })
  .on('broadcast', { event: 'webrtc-candidate' }, payload => {
    // Handle ICE candidates
  })
  .subscribe()

// To send an offer from Doctor to Patient:
channel.send({
  type: 'broadcast',
  event: 'webrtc-offer',
  payload: { sdp: peerConnection.localDescription },
})
```

By leveraging Supabase's global edge network for realtime WebSockets, you can achieve 
low latency WebRTC signaling without spinning up a dedicated Socket.io server.
"""
