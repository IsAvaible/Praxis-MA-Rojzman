const { SitemapStream, streamToPromise } = require( 'sitemap' )
const { Readable } = require( 'stream' )
const { createWriteStream } = require('fs');

const siteUrl = 'https://praxis-ma-rojzman.vercel.app/';

// An array with your links
const links = [
    { url: '/', priority: 1.0 },
    { url: '/team', priority: 0.8 },
    { url: '/leistungen', priority: 0.8 },
    { url: '/aktuelles', priority: 0.7, changefreq: 'weekly' },
    { url: '/kontakt', priority: 1.0 },
    { url: '/rezeptanforderung', priority: 0.5 },
    { url: '/vertretung', priority: 0.5 },
    { url: '/impressum', priority: 0.5 },
    { url: '/datenschutz', priority: 0.5 },
]

// Create a stream to write to
const stream = new SitemapStream( { hostname: siteUrl } )
const path = `./public/sitemap.xml`;

// Return a promise that resolves with your XML string
streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    createWriteStream(path).write(data.toString())
)