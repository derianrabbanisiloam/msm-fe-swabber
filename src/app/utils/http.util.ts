import { HttpHeaders } from '@angular/common/http';

export const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa('ganexa:Ba5kXUsLqC64zpdMg4zNrB8n'),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, HEAD',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Secret',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '1728000'
  })
};