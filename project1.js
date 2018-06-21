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

  client.setPersona(SteamUser.Steam.EPersonaState.Online, steamName);
  client.gamesPlayed(440);
});
