# lattendance-bot
[lattendance](https://github.com/bpeldi2oerkd8/lattendance)に用いるボットシステム（Slack用）  
Hubotを使用

<div align="center">
  <img src="https://user-images.githubusercontent.com/64352857/125099653-37b26b00-e113-11eb-8e16-d7485bb58674.png" width="400">
</div>

## 概要
[lattendance](https://github.com/bpeldi2oerkd8/lattendance)において、Slack上で出欠の登録・確認ができるようにするためのbotシステムです。  
事前に設定を行うことにより、Slack上でbotにメッセージを送信するだけで出欠の登録・確認が可能です。  

## デモ
https://user-images.githubusercontent.com/64352857/126032642-d9468000-f3bf-41ae-8251-65bba3aeb469.mp4

## 事前準備
1.このリポジトリをダウンロードする  
2.Herokuのアカウントを作成し、Heroku CLIをインストール  
3.Herokuへログインし、Heroku上にアプリを作成  
```bash
heroku login -i  
heroku create
```
4.Slackとの連携設定  
lattendance上の連携したい予定ページを開き、「Slackと連携する」ボタンを押す。  

![予定ページ](https://user-images.githubusercontent.com/64352857/125194165-22604c80-e28b-11eb-8380-d0dd91fc0d4b.jpg)
画面上の指示に従ってチャンネルIDを登録し、「トークンを発行」ボタンを押す。  

![Slackとの連携1](https://user-images.githubusercontent.com/64352857/125194702-618f9d00-e28d-11eb-866d-5f2f8ef0a200.jpg)
発行されたトークンをコピーし、環境変数`HUBOT_ROOM_TOKEN`として使うため、保存する。  

![Slack連携2](https://user-images.githubusercontent.com/64352857/125194707-66545100-e28d-11eb-8079-abc4254b8f19.jpg)

5.Slack上にHubotを追加  
出欠登録に用いるbotを追加したいチャンネル上で、右上のアイコンをクリックし、「インテグレーション」→「アプリを追加する」をクリック  

![hubot追加手順1](https://user-images.githubusercontent.com/64352857/126505167-025d1f71-75d3-4abe-8f37-87190417542d.jpg)

「Appディレクトリを表示」をクリック  

![hubot追加手順2](https://user-images.githubusercontent.com/64352857/126505387-b936d270-bcff-49a0-8a2b-5b9ddcf9d981.jpg)

検索バーに「hubot」と入力し、検索結果で表示された「Hubot」をクリック  

![hubot追加手順3](https://user-images.githubusercontent.com/64352857/126505474-b23d7542-9ce4-40c5-bc2d-4fa555de40be.jpg)

「Slackに追加」をクリック  

![hubot追加手順4](https://user-images.githubusercontent.com/64352857/126505918-4ad14e24-0ec5-47e2-bc07-97c79fc694ea.jpg)

設定したいボット名を入力し(ex. lattendance-bot)、「Hubotインテグレーションの追加」をクリック  

![hubot追加手順5](https://user-images.githubusercontent.com/64352857/126506106-b1f2434c-de8b-467d-a591-5ca356fe430f.jpg)

表示されたトークンを次のステップで使用するために保存する  

![hubot追加手順6](https://user-images.githubusercontent.com/64352857/126506221-c4c9261f-a6d3-44c2-a446-448e2a81df04.jpg)

6.環境変数のセット  
```bash
heroku config:set HUBOT_SLACK_TOKEN='Step5で保存したトークン'
heroku config:set ATTENDANCE_API_URL='lattendanceのAPIのURL(例. https://example.com/api/v1)'  
heroku config:set HUBOT_ROOM_TOKEN='Step4で保存したチャンネルのトークン'  
```
7.Heroku環境へのプッシュ  
```bash
git push heroku main:main
```
## 使い方
以下の形式でボットに対しメッセージを送信します。  
```
@[ボット名][コマンド名][半角または全角のスペース1つ以上][日付(月/日)]
```
使えるコマンド名としては、以下の４つです。  
- ボット名 出席 日付（月/日の形式で） - 出席 を登録
- ボット名 欠席 日付（月/日の形式で） - 欠席 を登録
- ボット名 不明 日付（月/日の形式で） - 不明 を登録
- ボット名 確認 日付（月/日の形式で） - 出欠情報を確認

例えば、ある予定に7/1に出席と登録したい場合、対応するSlackチャンネル上のbotに対して、以下のメッセージを送信します。  
```
@lattendance-bot 出席　7/1
```
正常に完了した場合、以下のように登録が完了したというメッセージがbotから返され、lattendance上の出欠情報も更新されます。  
![bot結果](https://user-images.githubusercontent.com/64352857/125194309-a61a3900-e28b-11eb-8a10-3d5e5d003a9d.jpg)

また、以下の形式でメッセージを送ることで、使い方の確認ができます。  
```
@[ボット名]使い方
```
![bot使い方](https://user-images.githubusercontent.com/64352857/126032663-bf80e597-35c1-43f2-81d2-3441ea2874ca.jpg)


## ボットの再起動
ボットを再起動する際は、 `heroku restart` とコマンドを打ってください。

## デプロイ環境
- Heroku

## 使用した技術
- Hubot 3.3.2
