# Slowly Stamps :mailbox_with_mail:

Check out the site [here](https://dvaruas.github.io/slowlystamps/) (hosted with
:octocat:)

A gallery of all the stamps currently published by Slowly (arranged by latest
first).

The main source of information is this API endpoint -
`https://api.getslowly.com/slowly`. Information is fetched from here and then
parsed and displayed in a human understandable format.

## The story of an unfortunate event

The website was initially built so that everything is fetched on the fly from
the Slowly CDNs and then displayed. However, this did not work as the requests
got blocked due to CORS policy.

Now we have the sucky approach of a :snake: [script](./src/pyservice/main.py)
fetching all info and assets and storing them inside
[static/assets](./static/assets/). 

## TODO Improvements

* [ ] Pagination needs to be improved with hiding page numbers, otherwise with
  the amount of stamps increasing the design will fail. (Still got some time for
  this, will hold some 300-400 stamps)
