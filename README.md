# Adonis Lucid Search

This is repo is a AdonisJs provider for simplicity work with search in adonis-lucid

> Work with AdonisJs 4

[![npm version](https://badge.fury.io/js/adonis-search.svg)](https://badge.fury.io/js/adonis-search)
[![Build Status](https://travis-ci.org/ntvsx193/adonis-search.svg?branch=master)](https://travis-ci.org/ntvsx193/adonis-search)
[![Coverage Status](https://coveralls.io/repos/github/ntvsx193/adonis-search/badge.svg?branch=master)](https://coveralls.io/github/ntvsx193/adonis-search?branch=master)

## Install

```
npm i --save adonis-search
```

## Registering provider

The provider is registered inside `start/app.js` file under `providers` array.

```js
const providers = [
  'adonis-query/providers/QueryProvider'
]
```

That's all! Now you can use the query provider as follows.

## Sample

Request url is `GET` `/users?search=mark&page=2&order=-email`

```js
const Route = use('Route')
const Query = use('Query')
const User = use('App/Models/User')

Route.get('/users', async ({ request, response }) => {
  const query = new Query(request, { order: 'id' })
  const order = query.order()
  
  const users = await User.query()
    .where(query.search([
      'first_name',
      'last_name',
      'email'
    ]))
    .orderBy(order.column, order.direction)
    .paginate(query.page(), query.limit())
    
  response.json(users)
})
```

## Usage

### Default values

```json
{
  "page": 1,
  "limit": 30,
  "search": ""
}
```

You can change defaults by send second argument in Query constructor

```js
cosnt query = new Query(request, {
  limit: 50
})
```

### Search

> Note 1. Search not fire where clause if search variable is empty.

> Note 2. All search columns and values will be translated to lowercase.

For basic usage you need add columns where you make search

```js
const query = new Query(request, { order: 'id' })
const users = await User.query()
  .where(query.search([
    'first_name',
    'last_name',
    'email'
  ]))
```

If you need search in `INT` columns, you need set first argument as object with columns types:

```js
const query = new Query(request, { order: 'id' })
const users = await User.query()
  .where(query.search({
    id: Query.INT,
    first_name: Query.STRING,
    last_name: Query.STRING,
    email: Query.STRING
  }))
```

### Paginate

You can get parsed values from uri as `page` and `limit`. Variables are optional.

```js
Route.get('/users', async ({ request, response }) => {
  const query = new Query(request)
  const users = await User.query()
    .paginate(query.page(), query.limit())
    
  response.json(users)
})
```

### Order by

For use order by you need set default value `order` by column for query

```js
const query = new Query(request, { order: 'id' })
const order = query.order()
const users = await User.query()
  .orderBy(order.column, order.direction)
  .fetch()
```

Reverse sort are supported by set first symbol `-` before name column. Sample uri as `/users?order=-email`
It's native support for AngularJS applications. 
