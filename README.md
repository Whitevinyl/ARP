# ARP Observatory

On July 27 2016, the ARP radio telescope array in Atacama, North Chile, focused on a new part of the Southern sky and listened.
Against the even background noise of space, it heard a strong narrow-band signal. This was the first of many sustained radio events, occurring a number of times each day and at the same source frequency.

On August 1 the signal was confirmed to be carrying audio, and there is as-yet, no indication that the source is local.

---

ARP is a fictional radio telescope observatory, it's a Twitter & SoundCloud bot which procedurally generates audio, data-visualisations, and the tweets (and occasionally long-exposure photography) of an astronomer/research scientist who works at ARP, who is obsessive over the audio messages, and who runs the observatory's Twitter account.


https://twitter.com/ArpObservatory

https://soundcloud.com/arpobservatory

---

ARP is a project by Luke Twyman / whitevinyl

http://whitevinyldesign.com

@whitevinyluk

---

I've tried to keep the code here as accessible as possible for others to see, however it is also a work in progress - in particular the audio components are still in the process of being separated & structured. All the good stuff is in js/node/, the web folder is very neglected for now.

The audio is generated algorithmically direct into two signal arrays (stereo channels) before being encoded as .wav, so no Web Audio API or pre existing samples, just vanilla js. I'm no signal processing expert so hoping to keep experimenting and learning with it.
Each type of generation (audio/data/imagery/tweets) makes heavy use of my chance library tombola.js - https://github.com/Whitevinyl/tombola.js