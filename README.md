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
the SLowly CDNs and then displayed. However, this did not work as the requests
got blocked due to CORS policy.

Now we have the sucky approach. A Python [script](./src/pyservice/main.py) can
be run to fetch all the information and it stores these in assets.

## TODO Improvements

* [ ] Automated running of the python script everyday to fetch new results

* [ ] Pagination needs to be improved with hiding page numbers, otherwise with
  the amount of stamps increasing the design will fail.
