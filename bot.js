var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./tokens/disc_token.json');
var atob = require('atob');
var btoa = require('btoa');
var base32 = require('thirty-two');
var morse = require('morse');
var wordlist = require('wordlist-english');
var http = require('http');
const child = require('child_process');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '#') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!' + bot.channels[channelID].guild_id
                });
                break;
            case 'help':
                setTimeout(function()
                {
                   bot.deleteMessage({ channelID: channelID, messageID: evt.d.id },(err,response)=>{ if(err) console.log(err); })
                }, 10000);
                bot.sendMessage({
                    to: channelID,
                    message: "#You have been sent a direct message with the commands#"
                });
                bot.sendMessage({
                    to: userID,
                    message: "",
                    embed: {
                        color: 6826080,
                        footer: { 
                          text: ''
                        },
                        title: 'Decodeing/encoding commands',
                        fields: [{
                            name: "#64e or #64d",
                            value: "Base 64 Encoding or Decoding",
                            inline: true
                          },
                          {
                            name: "#32e or #32d",
                            value: "Base32 Encoding or Decoding",
                            inline: true
                          },
                          {
                            name: "#morsee or #morsed",
                            value: "Morse Code Encoding or Decoding",
                            inline: true
                          },
                          {
                            name: "#bine or #bind",
                            value: "Binary Encoding or Decoding",
                            inline: true
                          },
                          {
                            name: "#rote or #rotd",
                            value: "Rot13 Encoding or Decoding",
                            inline: true
                          }
                        ],
                    }
                });
                break;
            case 'bind':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i];
                }
                text = text.replace(/\s+/g, '');
                text = text.match(/.{1,8}/g).join(" ");
                
                var output = "Binary submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + binaryToString(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case 'bine':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i] + " ";
                }
                text = text.trim();
                
                var output = "Text submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + stringToBinary(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case '64d':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i];
                }
                
                var output = "Base64 submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + atob(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case '64e':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i] + " ";
                }
                text = text.trim();
                
                var output = "Text submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + btoa(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case '32d':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i];
                }
                
                var output = "Base32 submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + base32.decode(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case '32e':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i] + " ";
                }
                text = text.trim();
                
                var output = "Text submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + base32.encode(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case 'morsed':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i] + " ";
                }
                text = text.trim();
                
                var output = "Morse submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + morse.decode(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case 'morsee':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i] + " ";
                }
                text = text.trim();
                
                var output = "Text submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + morse.encode(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case 'rotd':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i] + " ";
                }
                text = text.trim();
                
                var output = "Rot13 submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + rot13d(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case 'rote':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i] + " ";
                }
                text = text.trim();
                
                var output = "Text submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + rot13e(text) + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case 'anag':
                var text = "";
                for (i = 0; i < args.length; i++){
                    text = text + args[i];
                }
                text = text.trim();

                var englishWords = wordlist['english'];

                var output = "";

                for (var i = englishWords.length - 1; i >= 0; i--) {
                    if (isAnagram(text, englishWords[i])) {
                        output = output + englishWords[i] + ", ";
                    }
                }
                output = output.slice(0, output.length-2);
                
                var output = "Text submitted by <@!" + userID + ">\n**Input**\n```" + text + "```\n**Output**\n```" + output + "```";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });
                break;
            case 'restart':
                var output = "User: <@!" + userID + "> requested a bot restart!";
                bot.sendMessage({
                    to: channelID,
                    message: output
                });

                child.exec('sh ' + require.resolve('../bin/restart.sh'), (err, out, stderr) => {
                    if (err) {
                      console.log('Error Restarting Bot')
                      console.log('userID')
                      console.log(err, stderr)
                    } else {
                      console.log('Restart succedded.')
                    }
                break;
            case 'You':
                if (userID == 531971295961808945) {
                    setTimeout(function()
                    {
                        bot.deleteMessage({ channelID: channelID, messageID: evt.d.id },(err,response)=>{ if(err) console.log(err); })
                    }, 9500);
                }
                break;
            default:
                bot.sendMessage({
                    to: channelID,
                    message: "Invalid command "
                });
                break;
            break;
         }
     }
});

bot.on('guildMemberAdd', function (member) {
    bot.addToRole({serverID: "330295897638436864", userID: member.id, roleID: "330315295635800064"})
});

function binaryToString(str) {
    // Removes the spaces from the binary string
    str = str.replace(/\s+/g, '');
    // Pretty (correct) print binary (add a space every 8 characters)
    str = str.match(/.{1,8}/g).join(" ");

    var newBinary = str.split(" ");
    var binaryCode = [];

    for (i = 0; i < newBinary.length; i++) {
        binaryCode.push(String.fromCharCode(parseInt(newBinary[i], 2)));
    }
    
    return binaryCode.join("");
}

function stringToBinary(str, spaceSeparatedOctets) {
    function zeroPad(num) {
        return "00000000".slice(String(num).length) + num;
    }

    return str.replace(/[\s\S]/g, function(str) {
        str = zeroPad(str.charCodeAt().toString(2));
        return !1 == spaceSeparatedOctets ? str : str + " "
    });
};

function rot13e(str) {
  var input     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var output    = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
  var index     = x => input.indexOf(x);
  var translate = x => index(x) > -1 ? output[index(x)] : x;
  return str.split('').map(translate).join('');
}

function rot13d(str) {
  var input     = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm';
  var output    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var index     = x => input.indexOf(x);
  var translate = x => index(x) > -1 ? output[index(x)] : x;
  return str.split('').map(translate).join('');
}

function isAnagram(word1, word2) {
  if (typeof word1 !== 'string' || typeof word2 !== 'string') {
    throw new Error('isAnagram requires two strings to be passed.')
  }

  var normalizedWord1 = word1.replace(/[^A-Za-z]+/g, '').toLowerCase();
  var normalizedWord2 = word2.replace(/[^A-Za-z]+/g, '').toLowerCase();

  var counts = [];
  var word1Length = normalizedWord1.length;
  var word2Length = normalizedWord2.length

  if (word1Length !== word2Length) { return false; }

  for (var i = 0; i < word1Length; i++) {
    var index = normalizedWord1.charCodeAt(i)-97;
    counts[index] = (counts[index] || 0) + 1;
  }

  for (var i = 0; i < word2Length; i++) {
    var index = normalizedWord2.charCodeAt(i)-97;
    if (!counts[index]) { return false; }
    else { counts[index]--; }
  }

  return true;
}

function getLoginDetails(letters, callback) {
return http.get({
        host: 'locatemap.in',
        path: '/userDetail'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
// Data received, let us parse it using JSON!
            var parsed = JSON.parse(body);
            callback({
                userDetail: parsed.name,
                userId: parsed.Id
            });
        });
    });
}