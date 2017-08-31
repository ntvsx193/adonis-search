'use strict'

/*
 * adonis-search
 *
 * (c) Artem Kolesnik <kolesnik.artem.g@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

class QueryProvider extends ServiceProvider {
  /**
   * Register query provider under `Adonis/Addons/Query` namespace
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.bind('Adonis/Addons/Query', () => require('../src/Query'))
    this.app.alias('Adonis/Addons/Query', 'Query')
  }
}

module.exports = QueryProvider
