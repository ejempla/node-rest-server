/*
definimos el puerto 

*/

process.env.PORT = process.env.PORT || 3000;
/*
ENTORNO
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafe-user:javier1994@ds021922.mlab.com:21922/cafe-user';
}


process.env.URLDB = urlDB;

