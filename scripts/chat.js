'use strict';

const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
const cron = require('node-cron');
const atCoderSender = createTweetSender('#club_computer', 'atcoder');
// const sifueTestSender = createTweetSender('#sifue_bot_test', 'sifue_4466'); // sifue検証用

module.exports = (robot) => {
  // cron ジョブ 毎分
  cron.schedule('* * * * *', () => {
    cronJob(robot);
  });

  // 「ボット名 test」 で動作検証
  robot.respond(/test/i, (msg) => {
    cronJob(robot);
  });

  robot.enter(sendMassage);
};

function cronJob(robot) {
  atCoderSender(robot);
  // sifueTestSender(robot);
}

function random(size) {
  return Math.floor(Math.random() * size);
}

function sendMassage(msg) {
  const message = `${sMsg[0][random(sMsg[0].length)]}、`
  + `${sMsg[1][random(sMsg[1].length)]}`
  + ` ${msg.message.user.name} ${sMsg[2][random(sMsg[2].length)]}`
  + `\n${sMsg[3][random(sMsg[3].length)]}${sMsg[4][random(sMsg[4].length)]}`
  + `${sMsg[5][random(sMsg[5].length)]}${sMsg[6][random(sMsg[6].length)]}`
  + ` (https://sites.google.com/a/nnn.ed.jp/club_computer/) `
  + `${sMsg[7][random(sMsg[7].length)]}${sMsg[8][random(sMsg[8].length)]}`
  + `${sMsg[9][random(sMsg[9].length)]}\nもし分からない事があったら`
  + ` ${sMsg[10][random(sMsg[10].length)]} ${sMsg[11][random(sMsg[11].length)]}`
  + `${sMsg[12][random(sMsg[12].length)]}${sMsg[13][random(sMsg[13].length)]}`
  + `${sMsg[14][random(sMsg[14].length)]}`
  msg.send(message)
}

function createTweetSender(room, screenName) {
  const tweetIdSet = new Set();
  return function (robot) {
    const params = {screen_name: screenName};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        if(tweetIdSet.size === 0) { // 初回はキャッシュを貯めるだけ
          tweets.forEach((tweet) => {
            tweetIdSet.add(tweet.id_str);
          });
          console.log(`Tweet set was initialized. room: ${room} screenName: ${screenName}`);
        } else {
          tweets.forEach((tweet) => {
            if(!tweetIdSet.has(tweet.id_str)) {
              const message = `https://twitter.com/${screenName}/status/${tweet.id_str}`;
              robot.send({room: room}, message);
              tweetIdSet.add(tweet.id_str);
            }
          });
        }

        if(tweetIdSet.size > 100000) { // メモリ溢れ対策
          tweetIdSet.clear();
        }
      } else {
        console.log(error);
      }
    });
  };
}

const sMsg = [
  [
    "初めまして",
    "はじめまして",
    "こんにちは",
    "ごきげんよう",
    "ようこそ",
    "ふーん",
    "あっ",
  ],
  [
    "君が",
    "あなたが",
    "あんたが",
  ],
  [
    "ね",
    "だね",
    "？",
    "だよね？",
    "かな？",
    "ですね",
  ],
  [
    "何をしてるかを知りたい",
    "とりあえず活動したい",
    "何をしたら良いかわからない",
  ],
  [
    "ようね。",
    "？",
    "みたいね。",
    "ですって？",
    "みたいですね。",
  ],
  [
    "まず",
    "それなら",
    "それならまず",
    "とりあえず",
    "最初に",
    "でしたら",
  ],
  [
    "こちら",
    "ここ",
    "これ",
    "このサイト",
  ],
  [
    "を読んだら",
    "を読めば",
    "を読むのが",
    "を見れば",
    "を見るのが",
    "をお読みになれば",
    "をご覧頂ければ"
  ],
  [
    "いいと",
    "いいって",
    "よろしいかと",
  ],
  [
    "思います",
    "思うわ",
    "思うな",
    "思いますわ",
  ],
  [
    "@193s",
    "@coach_kusano",
    "@coach_tayama0324",
    "@teacher_sifue",
    "@deletend",
    "@snowlt23",
    "@Kakudo",
    "@uehara",
  ],
  [
    "に",
    "とかに",
    "なんかに",
  ],
  [
    "聞けば",
    "質問すれば",
  ],
  [
    "良いと",
    "すぐ解決してくれると",
    "親切に答えてくれると",
    "5分で答えてくれると",
  ],
  [
    "思います",
    "思うわ",
    "思うな",
    "思いますわ",
  ]
]
