// Description:
//  出欠登録可能なボットです
// Commands:
//   ボット名 出席     - 出席 を登録
//   ボット名 欠席     - 欠席 を登録
//   ボット名 不明     - 不明 を登録

'use strict';
const api_url = process.env.ATTENDANCE_UPDATE_URL || require('../secret_info/api_url').ATTENDANCE_UPDATE_URL;
module.exports = robot => {
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
};

function date2dateString(date) {
  const dates = date.split('/');
  let month = parseInt(dates[0]) >= 1 && parseInt(dates[0]) <= 9 ? '0' + dates[0] : dates[0];
  let day = parseInt(dates[1]) >= 1 && parseInt(dates[1]) <= 9 ? '0' + dates[1] : dates[1];
  let dateString = new Date().getFullYear() + '-' + month + '-' + day;

  return dateString;
}

function updateAvailability(msg, roomId, slackId, dateString, availability){
  const update_url = api_url + '/' + roomId + '/users/' + slackId + '/dates/' + dateString;
  const param = JSON.stringify({
    availability: availability
  });
    
  msg.http(update_url)
  .header('Content-Type', 'application/json')
  .post(param) ((err, res, body) => {
    if(err) {
      msg.send("Error :( " + err);
      return;
    }

    const data = JSON.parse(body);
    const availabilityStatus = ['欠席', '不明', '出席'];
    if(data.status === 'OK'){
      msg.send('出欠更新完了：' + '<@' + data.data.slackId + '> さんの' 
        + data.data.date + 'の予定は　' + availabilityStatus[data.data.availability] + '　です');
    } 
    else {
      msg.send('出欠更新失敗：' + '\n' + data.error.messages.join('\n'));
    }
  });
}