# destinyshit

will do shit like rating drip and rolls that people post, and save people's overall drip rating with a leaderboard

requires docker & node 17+

### For Windows 11

~~Use [Docker 4.4.4](https://docs.docker.com/desktop/windows/release-notes/#docker-desktop-444)~~

Ignore Kable, use WSL like a real homie

## Steps to build env


1. clone
2. npm i
3. docker compose up
4. npm run deploy
5. fill out `config.json` and `.env` files (examples given)
6. npm run start


## Things to add

- [ ] Delete your posts with the post command via a button (Needs extensive testing as to not mess with current data)
- [ ] Leaderboards
  - [x] ~~Average grade~~
  - [ ] #'s (such as number of posts, number of comments, number of votes, etc)
  - [x] ~~Leaderboard per post type~~
  - [x] ~~Sentiment~~
  - [ ] Leaderboard of best posts
- [ ] Hook into Bungie Api
  - [ ] Allow people to choose rolls to show off from their inventory
  - [ ] Take a snapshot of someone's fashion from the API directly rather than forcing a screenshot upload
- [x] ~~Don't allow voting on your own post~~ ([cfb5d16](https://github.com/melmsie/destinyshit/commit/cfb5d168cec00792f26a2179bf36637375aa6df0))
- [x] ~~Button to see results straight on the post~~ ([b3895ff](https://github.com/melmsie/destinyshit/commit/8715849b9b0244ca462207617fbbeeee0eb895da))
- [x] ~~Add comments~~ ([b3895ff](https://github.com/melmsie/destinyshit/commit/8715849b9b0244ca462207617fbbeeee0eb895da))
- [x] ~~Settings per user~~ ([b3895ff](https://github.com/melmsie/destinyshit/commit/8715849b9b0244ca462207617fbbeeee0eb895da))
- [x] ~~Overhaul user command to show more data including an overall score~~ ([facf04e](https://github.com/melmsie/destinyshit/commit/dbdcf8aa60af33577343fb008797d891bc910008))
- [x] ~~Validate that an actual image was provided and not another file~~ ([036b2fb](https://github.com/melmsie/destinyshit/commit/036b2fbe9c3e0b2ad20e0730847871cad9106b50))