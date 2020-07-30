## Changelog

All notable changes to this project will be documented in this file.

### Debugging [ 30th July 2020 ]:
As far as I understand, the problem seems to be in the assumption that bitfield messages are correct. Hence I state from [BitTorrent specifications](https://wiki.theory.org/index.php/BitTorrentSpecification#bitfield:_.3Clen.3D0001.2BX.3E.3Cid.3D5.3E.3Cbitfield.3E) that:

*A bitfield of the wrong length is considered an error. Clients should drop the connection if they receive bitfields that are not of the correct size, or if the bitfield has any of the spare bits set.*

We believe that this is the problem because one can look at the output generated and clearly observe that many bitfield messages received had *spare bits set*. 
Our next step would be to hence make required changes and test.