'use strict'

const _ = require('lodash')
const GE = require('@adonisjs/generic-exceptions')
const Database = use('Database')

class Query {
  static get INT () { return 1 }
  static get STRING () { return 2 }
  static get INT_MAX_VALUE () { return 2147483647 }

  /**
   * @param {Object} request
   * @param {Object} options
   */
  constructor (request, options) {
    const defaults = {
      page: 1,
      limit: 30,
      search: ''
    }

    this._query = _.assign(defaults, options, request.get())
  }

  /**
   * @return {Number}
   */
  page () {
    return this._query.page
  }

  /**
   * @return {Number}
   */
  limit () {
    return this._query.limit
  }

  /**
   * @return {Object}
   */
  order () {
    if (!('order' in this._query)) {
      throw GE.InvalidArgumentException.invalidParameter(`Not found 'order' value in query`)
    }

    if (this._query.order[0] === '-') {
      return {
        column: this._query.order.slice(1),
        direction: 'desc'
      }
    }

    return {
      column: this._query.order,
      direction: 'asc'
    }
  }

  /**
   * @param {Array|Object} columns
   * @return {Function}
   */
  search (columns) {
    if (!_.isArray(columns) && !_.isObject(columns)) {
      throw GE.InvalidArgumentException.invalidParameter(`Argument type of 'columns' is not Array and Object`)
    }

    if (!_.size(columns)) {
      throw GE.InvalidArgumentException.invalidParameter(`Argument 'columns' must have size, empty now`)
    }

    /**
     * @param {QueryBuilder} builder
     * @return {void}
     */
    return (builder) => {
      if (!this._query.search) {
        return
      }

      const whereLike = (column) => {
        const search = this._query.search.toLowerCase()
        builder.orWhere(Database.raw(`LOWER(${column})`), 'LIKE', `%${search}%`)
      }

      const whereEqual = (column) => {
        builder.orWhere(column, '=', this._query.search)
      }

      _.forEach(columns, (column, i) => {
        if (Number.isInteger(i)) {
          whereLike(column)
        } else {
          if (column === this.constructor.INT) {
            const valueInt = Number.parseInt(this._query.search)
            if (Number.isInteger(valueInt) && valueInt <= this.constructor.INT_MAX_VALUE) {
              whereEqual(i)
            }
          } else {
            whereLike(i)
          }
        }
      })
    }
  }

  /**
   * @param {String} [column]
   * @param {String} [uri]
   * @return {Function}
   */
  ids (column = 'id', uri = 'ids') {
    /**
     * @param {QueryBuilder} builder
     * @return {void}
     */
    return (builder) => {
      if (!(uri in this._query)) {
        return
      }

      const ids = this._query[uri]
        .split(',')
        .map((value) => parseInt(value))

      builder.whereIn(column, ids)
    }
  }
}

module.exports = Query
