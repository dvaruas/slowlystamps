# Slowly Stamps Gallery

Check out the site [here](https://dvaruas.github.io/slowlystamps/) :point_left:

A gallery of all the stamps currently published by Slowly (arranged by latest
first).

The main source of information is this API endpoint -
`https://api.getslowly.com/slowly`. Information is fetched from here and then
parsed and displayed in a human understandable format.

Check out (**Slowly**)[https://slowly.app/en/] :mailbox:

## The story of an unfortunate event

The website was initially built so that everything is fetched on the fly from
the Slowly CDNs and then displayed. However, this did not work as the requests
got blocked due to CORS policy.

Now we have the sucky approach of a :snake: [script](./src/pyservice/main.py)
fetching all info and assets and storing them in
[static/assets](./static/assets/).

## Disclaimer

All stamps are obviously property of **Slowly Communications Ltd.** and this project
is solely for fun. I save the stamps for the reason mentioned above and
am hopefully not breaking any :copyright: agreements.. :grinning:

## TODOs

- [ ] Make the user interface a bit more interactive
- [ ] Stop the dynamic adjustment and shifting of components in navbar

Built with **TypeScript**, :wrench:  
bundled with **Webpack**, :space_invader:  
and,  
hosted with **Github**.. :octocat:
