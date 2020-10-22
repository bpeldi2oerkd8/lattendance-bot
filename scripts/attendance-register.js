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
    const display_name = msg.message.user.slack.profile.display_name;
    const real_name = msg.message.user.real_name;
    const user_name = display_name ? display_name : real_name;
    msg.send(`${user_name}さんが` + date + `に出席します`);
  });

  robot.respond(/欠席[ 　]+(([1-9]|1[0-2])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const date = msg.match[1].trim();
    const user_id = msg.message.user.id;
    const display_name = msg.message.user.slack.profile.display_name;
    const real_name = msg.message.user.real_name;
    const user_name = display_name ? display_name : real_name;
    msg.send(`${user_name}さんが` + date + `に欠席します`);
  });

  robot.respond(/不明[ 　]+(([1-9]|1[0-2])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const date = msg.match[1].trim();
    const user_id = msg.message.user.id;
    const display_name = msg.message.user.slack.profile.display_name;
    const real_name = msg.message.user.real_name;
    const user_name = display_name ? display_name : real_name;
    msg.send(`${user_name}さんの` + date + `の予定は不明です`);
  });
};