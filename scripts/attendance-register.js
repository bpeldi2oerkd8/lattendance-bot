// Description:
//  出欠登録可能なボットです(Slack)
// Commands:
//   ボット名 使い方                    - 使い方の確認
//   ボット名 出席 日付（月/日の形式で） - 出席 を登録
//   ボット名 欠席 日付（月/日の形式で） - 欠席 を登録
//   ボット名 不明 日付（月/日の形式で） - 不明 を登録
//   ボット名 確認 日付（月/日の形式で） - 出欠情報を確認

'use strict';
const api_url = process.env.ATTENDANCE_API_URL || require('../secret_info/api_url').ATTENDANCE_API_URL;
module.exports = robot => {
  robot.respond(/使い方/i, msg => {
    msg.send('<形式> @[ボット名][コマンド名][半角または全角のスペース1つ以上][日付(月/日)]' + '\n'
     + '<使えるコマンド名>' + '\n' + '出席：出席と登録' + '\n' + '欠席：欠席と登録' + '\n' 
     + '不明：出欠予定不明と登録' + '\n' + '確認：出欠情報の確認' + '\n'
     + '例）@lattendance-bot 出席 1/12');
  });

  robot.respond(/出席[ 　]+((1[0-2]|[1-9])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const roomId = msg.envelope.room;
    const slackId = msg.message.user.id;

    const date = msg.match[1].trim();
    let dateString = date2dateString(date);

    const availability = 2; //出席
    updateAvailability(msg, roomId, slackId, dateString, availability);
  });

  robot.respond(/欠席[ 　]+((1[0-2]|[1-9])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const roomId = msg.envelope.room;
    const slackId = msg.message.user.id;

    const date = msg.match[1].trim();
    let dateString = date2dateString(date);

    const availability = 0; //欠席
    updateAvailability(msg, roomId, slackId, dateString, availability);
  });

  robot.respond(/不明[ 　]+((1[0-2]|[1-9])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const roomId = msg.envelope.room;
    const slackId = msg.message.user.id;

    const date = msg.match[1].trim();
    let dateString = date2dateString(date);

    const availability = 1; //不明
    updateAvailability(msg, roomId, slackId, dateString, availability);
  });

  robot.respond(/確認[ 　]+((1[0-2]|[1-9])\/([12][0-9]|3[01]|[1-9]))/i, msg => {
    const roomId = msg.envelope.room;
    const slackId = msg.message.user.id;

    const date = msg.match[1].trim();
    let dateString = date2dateString(date);

    confirmAvailability(msg, roomId, slackId, dateString);
  });
};

function date2dateString(date) {
  const dates = date.split('/');
  let month = parseInt(dates[0]) >= 1 && parseInt(dates[0]) <= 9 ? '0' + dates[0] : dates[0];
  let day = parseInt(dates[1]) >= 1 && parseInt(dates[1]) <= 9 ? '0' + dates[1] : dates[1];
  let dateString = new Date().getFullYear() + '-' + month + '-' + day;

  return dateString;
}

function updateAvailability(msg, roomId, slackId, dateString, availability){
  const login_url = api_url + '/login';
  const update_url = api_url + '/schedules/' + roomId + '/users/' + slackId + '/dates/' + dateString;
  const roomToken = process.env.HUBOT_ROOM_TOKEN  || require('../secret_info/room_token').HUBOT_ROOM_TOKEN;
  const param = JSON.stringify({
    roomId: roomId,
    roomToken: roomToken
  });
  const param2 = JSON.stringify({
    availability: availability
  });

  msg.http(login_url)
  .header('Content-Type', 'application/json')
  .post(param) ((err, res, body) => {
    if(err) {
      msg.send(err);
      return;
    }

    const data = JSON.parse(body);
    if(data.status === 'OK'){
      const token = data.data.token;
      msg.http(update_url)
      .header('Content-Type', 'application/json')
      .header('Authorization', `Bearer ${token}`)
      .post(param2) ((err, res, body) => {
        if(err) {
          msg.send(err);
          return;
        }
      
        const data2 = JSON.parse(body);
        const availabilityStatus = ['欠席', '不明', '出席'];
        if(data2.status === 'OK'){
          msg.send('出欠更新完了：' + '<@' + data2.data.slackId + '> さんの' 
            + data2.data.date + 'の予定は　' + availabilityStatus[data2.data.availability] + '　です');
        } 
        else {
          msg.send('出欠更新失敗：' + '\n' + data2.error.messages.join('\n'));
        }
      });
    }
    else {
      msg.send('認証失敗：' + '\n' + data.error.messages.join('\n'));
    }
  });
}

function confirmAvailability(msg, roomId, slackId, dateString){
  const login_url = api_url + '/login';
  const confirm_url = api_url + '/schedules/' + roomId + '/users/' + slackId + '/dates/' + dateString;
  const roomToken = process.env.HUBOT_ROOM_TOKEN  || require('../secret_info/room_token').HUBOT_ROOM_TOKEN;
  const param = JSON.stringify({
    roomId: roomId,
    roomToken: roomToken
  });

  msg.http(login_url)
  .header('Content-Type', 'application/json')
  .post(param) ((err, res, body) => {
    if(err) {
      msg.send(err);
      return;
    }

    const data = JSON.parse(body);
    if(data.status === 'OK'){
      const token = data.data.token;
      msg.http(confirm_url)
      .header('Authorization', `Bearer ${token}`)
      .get() ((err, res, body) => {
        if(err) {
          msg.send(err);
          return;
        }
      
        const data2 = JSON.parse(body);
        const availabilityStatus = ['欠席', '不明', '出席'];
        if(data2.status === 'OK'){
          msg.send('出欠確認成功：' + '<@' + data2.data.slackId + '> さんの' 
            + data2.data.date + 'の予定は　' + availabilityStatus[data2.data.availability] + '　です');
        } 
        else {
          msg.send('出欠確認失敗：' + '\n' + data2.error.messages.join('\n'));
        }
      });
    }
    else {
      msg.send('認証失敗：' + '\n' + data.error.messages.join('\n'));
    }
  });
}