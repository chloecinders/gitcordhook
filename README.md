# GitCordHook
An attempt to make GitHub Webhooks not boring.
***

## What is GitCordHook?
GitCordHook is a webhook proxy that you add infront of your Discord webhook url inside the GitHub webhook settings, automatically transforming boring embeds with lacking information into rich messages using components V2.

## How does it work?
GitCordHook under the hood is just your average worker (Officially its specifically a Cloudflare worker). You put it between GitHub and Discord, it takes in the data from GitHub, transforms it, then sends it to Discord. Simple!

## Which events are currently supported?
This project is in it's earliest stages! Currently only issue opening is supported. Everything unsupported is automatically sent to Discords own GitHub webhook handler. But everyone is welcome to contribute!

## Okay well I like how this looks, how do I use it?
1. Go into your GitHub repository settings
2. Under the Code and automation category, select the Webhooks tab
3. Add a new webhook at the top right if you haven't already
   - (If you already have one, click on edit!)
4. Look over to your Discord server: Go into the server settings
5. Under the Integrations tab go to Webhooks add a new one, or open an existing one and copy the webhook URL
6. Now back in the GitHub webhook settings, at Payload URL add "https://discord-webhook.surgedevs.com/" then paste in your Discord webhook URL
7. The payload URL should now look something like `https://discord-webhook.surgedevs.com/https://discord.com/(webhookhash)/(webhookid)`
8. Now change the content type to application/json
9. Select which events you want to trigger the webhook (either all or select ones)
10. Click add (or save) and you are done!
