# TermiTorrent
Yes, you read that right. This time it will be a torrent client. 

So, here's the plan.
I have most of my projects done with creating a back end, doing something and again creating a back end doing something different. However, a few days ago I wanted to know the difference between (mu)torrent and BitTorent, and I came to know that BitTorent is just a protocol to transfer content while the former is a client which uses this protocol to send and receive the content.

With this new repo started, your friendly neighborhood NodeFan would be first going through how BitTorrent works in a very Layman's way then for a few days I will be putting details about the main aspects of the protocol.

It will take (I don't know how long) until I find a good way to get the actual implementations done.

# Part 1 - Introduction

BitTorrent is a **peer-to-peer** file-sharing protocol designed by Bram Cohen. 

What this means is that the network consists of several peers. Peers are nothing but the machines participating in the sharing process which upload and download files.

This doesn't mean that there is an absence of a moderator. This moderator is called **tracker** in the terminology of the protocol. However, the role of the tracker is minimal.


Let's have a look at how your file gets downloaded when you use a Bittorent client :
1. Your client reads the .torrent file
2. It then contacts a server (tracker)
3. Tracker responds with a list of peers which have the file(s) you want
4. Your client then connects to some peers and asks for chunks of the file(s)

So this is all that happens behind the scenes. It is worth to note that unlike other servers, the tracker is not as useful. This is because your request is fulfilled by peers and not the tracker.

BitTorrent is designed to facilitate file transfers among multiple peers across unreliable networks. 


## License
[MIT](https://choosealicense.com/licenses/mit/)