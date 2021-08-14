/* eslint-disable */

Parse.Cloud.define('createUser', req => {
  const { params } = req;
  return { message: 'test', body: params };
});
