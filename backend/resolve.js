const { Resolver } = require('dns');
const r = new Resolver();
r.setServers(['8.8.8.8']);

r.resolveSrv('_mongodb._tcp.cluster0.jzxwvwy.mongodb.net', (err, addresses) => {
  if (err) return console.error(err);
  r.resolveTxt('cluster0.jzxwvwy.mongodb.net', (err, txts) => {
    const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    const options = txts ? txts.flat().join('&') : '';
    console.log(`mongodb://onkeshgupta_db_user:onkesh1234@${hosts}/?${options}`);
  });
});