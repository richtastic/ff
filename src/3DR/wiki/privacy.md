## Privacy


- want to encrypt user's data (eg images & renderings)

- logic on server:
	- algorithm can be updated (fixed) if needed (+)
	- more processing load on server (-)
	- key has to be stored somewhere (-)
	- the other algorithms on the server need the clear-text data (+)
- logic on client:
	- algorithm may have a flaw and need updating remotely (eg by upgrading version) (-)
	- processing is done by individual clients (+)
	- key is stored only on user's device (+/-)
		- only the client could ever 
		- if user changes phones - is the password gone
		- should not be a user-made password : could be forgotten

- client can have additional encryption locally - separate from server







REMOTE:
- user has an entry in db
- randomized key is stored with user data
	- mongo = ?
- files are stored encrypted
- files are en/de-crypted thru filesystem interface
- cleartext is only ever in memory, and open/closed immediately when not needed & memory zeroed out

CLIENT:
- user has minimal data stored locally (user preferences, ...)
	- iOS = ?
	- And = ?
- files are saved as encrypted, just decrypted thru a filesystem interface that does the to/from conversion
- client should only keep the files needed for immidate use, where possible: upload to server (cache)



COMMUNICATION
- server default encrypted
- server in-memory cleartext
- ssl cleartext
- client in-memory cleartext
- client default encrypted











---


...







