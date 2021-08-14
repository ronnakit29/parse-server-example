/* eslint-disable */

Parse.Cloud.define('sexyResult', async req => {
  const user = req.user;
  const sessionToken = user.getSessionToken();

  const result = await Parse.Cloud.httpRequest({
    url: `${process.env.SEXY_API}`,
    params: {
      room: 2,
    },
    headers: {
      Origin: 'https://xn--b3cw4apb2b3e1a1gxc.com', // Origin bypass web api
    },
  });

  const data = result.data.map(item => ({
    round: item.col,
    result: item.result,
    message: item.result == 'P' ? 'ผู้เล่นชนะ' : item.result == 'B' ? 'เจ้ามือชนะ' : 'เสมอ',
  }));
  return { hasPermission: true, status: data.length > 0 ? 'process' : 'waiting', data: data };
});
