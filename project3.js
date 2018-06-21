const SteamUser = require('steam-user');
const client = new SteamUser();

const accountName = process.argv[2];
const password = process.argv[3];
const steamName = process.argv[4];

console.log('accountName: ', accountName);
console.log('password: ', password);
console.log('steamName: ', steamName);

const logOnOptions = {
  accountName: accountName,
  password: password,
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  console.log('Logged into Steam');
  console.log(client.steamID);
  console.log(client.options);
  // console.log(client.myFriends);

  client.setPersona(SteamUser.Steam.EPersonaState.Online, steamName);
  client.gamesPlayed(440);
});

client.on('friendRelationship', (steamid, relationship) => {
  if (relationship === 2) {
    client.addFriend(steamid);
    console.log('User with steamid', steamid, 'was added!');
    setInterval(() => {
      const randomNumber = Math.floor((Math.random() * 100) + 1);
      const message = 'Hello there! Thanks for adding me! ' + randomNumber;
      client.chatMessage(steamid, message);
      console.log('Message sent to user with steamid', steamid);
      console.log(message)
    }, 60000)

  }
});
