#!/bin/bash
# Use !restart to restart the bot.

cd ~/DecoderBot/DecoderBotDiscord/ &&
git pull origin master &&
npm i &&
pm2 restart decoderBot;
