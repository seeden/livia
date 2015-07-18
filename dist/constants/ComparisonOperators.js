'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  $in: 'IN',
  $nin: 'NOT IN',
  $lt: '<',
  $lte: '<=',
  $gt: '>',
  $gte: '>=',
  $ne: '<>',
  $eq: '=',

  //  $contains  : 'CONTAINS',
  $within: 'WITHIN',
  $near: 'NEAR',
  $intersect: 'INTERSECT',

  $lucene: 'LUCENE',
  $containsKey: 'CONTAINSKEY',
  $containsValue: 'CONTAINSVALUE',
  $containsText: 'CONTAINSTEXT',

  $is: 'IS',
  $instanceof: 'INSTANCEOF',
  $like: 'LIKE'
};
module.exports = exports['default'];