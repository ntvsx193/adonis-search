# Adonis Search

This is repo is a AdonisJs provider for simplicity work with search in adonis-lucid

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]

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

That's all! Now you can use the mail provider as follows.

## Sample

Request url is `GET` `/users?search=mark&page=2&order=-email`

```js
const Route = use('Route')
const Query = use('Query')
const User = use('User')

Route.get('/users', async ({ request, response }) => {
  const query = new Query(request)
  const users = await User.query({ order: 'id' })
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
  page: 1,
  limit: 30,
  search: ''
}
```

You can change defaults by send second argument in Query constructor

```js
cosnt query = new Query(request, {
  limit: 50
})
```

### Search

> Search not fire where clause if search variable is empty.

For basic usage you need add columns where you make search

```js
const query = new Query(request)
const users = await User.query({ order: 'id' })
  .where(query.search([
    'first_name',
    'last_name',
    'email'
  ]))
```

If you need search in `INT` columns, you need set first argument as object with columns types:

```js
const query = new Query(request)
const users = await User.query({ order: 'id' })
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
  const users = await User.query({ order: 'id' })
    .paginate(query.page(), query.limit())
    
  response.json(users)
})
```

### Order by

For use order by you need set default value `order` by column for query

```js
const users = await User.query({ order: 'id' })
```

Reverse sort are supported by set first symbol `-` before name column. Sample uri as `/users?order=-email`
It's native support for AngularJS applications. 
