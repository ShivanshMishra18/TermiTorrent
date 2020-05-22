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

# Part 2 - Metafile

The first thing that one must do in order to act as a Bittorent client is to be able to understand the **metafile** or the **.torrent**.

As suggested by its name, metafile contains metadata or the data about the data you want. So what should this metafile contain?
- Tracker's url (aka announce url)
- Path details of the files requested

Well, that's true but the story is not that straight. 

As we know, we gather chunks of requested file from various peers. This means, that we need a way to validate that each chunk acquired is indeed correct. This is again done with the help of the metafile. 

The metafile contains hashed [SHA-1] values for each of these chunks. Once the client receives a chunk, it hashes it and compares it to the 20-byte long hash corresponding to it in the metafile. So the list extends as : 
- length(s) of the file(s)
- lengths of the chunks
- SHA-1 hash values corresponding to the chunks

Apart from these it also contains information like date of creation, author, etc. For a detailed list click [here](https://wiki.theory.org/index.php/BitTorrentSpecification#Metainfo_File_Structure).

### Bencoding

The metafile which contains all this is not a normal text file. It is 'bencoded'.
Bencoding is a way to specify and organize data in a terse format. It supports the following types: byte strings, integers, lists, and dictionaries. 

The idea is the same as that of JSON. The difference only lies in the way data is formatted.

Basically there are delimiters which are alphabets denoting information like starting or ending of the supported data types.

- "<string length encoded in base ten ASCII>:<string data>" for byte strings
- "i<integer encoded in base ten ASCII>e" for integers
- "l<bencoded values>e" for lists
- "d<bencoded string><bencoded element>e" for dictionaries

For a more detailed guide on bencoding click [here](https://wiki.theory.org/index.php/BitTorrentSpecification#Bencoding).


## License
[MIT](https://choosealicense.com/licenses/mit/)