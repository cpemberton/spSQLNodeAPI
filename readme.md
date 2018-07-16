# Node JS + SQL Server - Generic SQL REST API (Microservice)
<a name="Node JS"><img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-white.png" height="300px" width="300px"/>+<a name="SQL Server"><img src="https://www.01net.it/wp-content/uploads/sites/14/2016/06/SQL_Server_2016.png" heigth="300px" width="300px"/></a></a>
## Version: 1.0.0
#### Author: Christian Pemberton
#### References:
<https://medium.com/voobans-tech-stories/how-to-quickly-create-a-simple-rest-api-for-sql-server-database-7ddb595f751a>

## Description

Through a REST API, this runs generic SQL against a SQL server database such as our structured products database. The resultant recordsets are returned in JSON

## How To Run
### Connection String

Modify the connection string, mssqlConnect in app.js as follows:
```js
const mssqlConnect = mssql://<username>:<password>@<host:port>/<database>?encrypt=true
```
### Docker

Follow these steps to get the app running in a docker container:
1. Clone the repository
2. Build using docker file i.e. type in the app directory
```sh
docker build -t sp_sql_node_api .
```
3. Run docker i.e. in the app directory
```sh
docker run -p 10555:10555 sp_sql_node_api"
```

## Generic Examples
### > For generic SQL:
```sh
curl -d  '{"url":"SELECT * ... "}' -X POST http://localhost:10555/sql
```
### > For tables:
```sh
curl -X GET  http://localhost:10555/tables
```
## Specific Examples
### > For trades:
```sh
curl -X GET  http://localhost:10555/trades
```
### > For quotes:
```sh
curl -X GET  http://localhost:10555/quotes
```