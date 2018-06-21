const SteamUser = require('steam-user');
const client = new SteamUser();

const badwordsArray = require('badwords/array');
const signale = require('signale');
const translate = require('translate');

const credentials = require('./credentials');

signale.config({
  displayTimestamp: true,
});

translate.engine = 'google';
translate.key = credentials.translateKey;

const listOfTheRelationships = [
  'None',
  'Blocked',
  'RequestRecipient (alias of PendingInvitee)',
  'Friend',
  'PendingInviter (alias of RequestInitiator)',
  'Ignored',
  'IgnoredFriend',
  'SuggestedFriend',
];

const accountName = credentials.accountName;
const password = credentials.password;
const steamName = credentials.steamName;

signale.pending('Logging on to', accountName, 'account');

const logOnOptions = {
  accountName: accountName,
  password: password,
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  signale.success('Logged into Steam');
  signale.success(client.steamID.getSteam3RenderedID());

  client.setPersona(SteamUser.Steam.EPersonaState.Online, steamName);
  client.gamesPlayed(440);
  signale.success('steamName set to', steamName);
});

client.on('friendMessage', async (steamid, message) => {
  signale.watch('friendMessage');
  signale.success(steamid.getSteam3RenderedID(), 'sent you a message:', message)
  const myMessage = await translate(message, {from: 'cs', to: 'de'});
  sendChatMessage(steamid, myMessage);
});

client.on('friendRelationship', (steamid, relationship) => {
  signale.watch('friendRelationship', relationship, listOfTheRelationships[relationship], 'relationship');
  if (relationship === 0) {
    signale.success('User', steamid.getSteam3RenderedID(), 'removed you from friend list.');
  }
  if (relationship === 1) {
    signale.success('User', steamid.getSteam3RenderedID(), 'has blocked you.');
  }
  if (relationship === 2) {
    signale.success('User', steamid.getSteam3RenderedID(), 'wants to add you to friend list.');
    signale.pending('Adding user', steamid.getSteam3RenderedID());
    client.addFriend(steamid);
  }
  if (relationship === 3) {
    signale.success('You are now friend with user', steamid.getSteam3RenderedID());
    const message = 'Thanks for adding me :) Talk to me in czech please :)';
    sendChatMessage(steamid, message);
  }
});

sendChatMessage = (steamid, message) => {
  signale.pending('Sending message to', steamid.getSteam3RenderedID())
  client.chatMessage(steamid, message);
  signale.success('Message:', message);
}

addRandomBadwords = (message) => {
  for (let i = 0; i < 10; i++) {
    message += ' ' + badwordsArray[Math.floor((Math.random() * badwordsArray.length) + 1)];
  }
  return message;
}
