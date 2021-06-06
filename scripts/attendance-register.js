// Description:
//  出欠登録可能なボットです
// Commands:
//   ボット名 出席     - 出席 を登録
//   ボット名 欠席     - 欠席 を登録
//   ボット名 不明     - 不明 を登録

'use strict';
module.exports = robot => {
  robot.respond(/出席[ 　]+(([1-9]|1[0-2])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const date = msg.match[1].trim();
    const user_id = msg.message.user.id;
    msg.send('<@' + user_id + '> さんが' + date + 'に出席します');
  });

  robot.respond(/欠席[ 　]+(([1-9]|1[0-2])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const date = msg.match[1].trim();
    const user_id = msg.message.user.id;
    msg.send('<@' + user_id + '> さんが' + date + 'に欠席します');
  });

  robot.respond(/不明[ 　]+(([1-9]|1[0-2])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const date = msg.match[1].trim();
    const user_id = msg.message.user.id;
    msg.send('<@' + user_id + '> さんの' + date + `の予定は不明です`);
  });
};