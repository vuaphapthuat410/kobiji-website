import { List, downloadCSV } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const exporter = events => {
    const eventsForExport = events.map(event => {
        const { backlinks, author, ...eventForExport } = post; // omit backlinks and author
        postForExport.author_name = post.author.name; // add a field
        return postForExport;
    });
    jsonExport(postsForExport, {
        headers: ['id', 'title', 'author_name', 'body'] // order fields in the export
    }, (err, csv) => {
        downloadCSV(csv, 'posts'); // download as 'posts.csv` file
    });
};