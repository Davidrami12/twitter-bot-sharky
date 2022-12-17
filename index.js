require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient, twitterBearer } = require("./twitterClient.js")

const fs = require('fs')
const path = require('path')
const Twit = require('twit')
const config = require(path.join(__dirname, 'config.js'));

const T = new Twit(config);



const randomFromArray = (arr) => {
    /* Helper function for picking a random item from an array. */

    return arr[Math.floor(Math.random() * arr.length)];
}



const tweetRandomImage = () => {
    /* First, read the content of the images folder. */

    fs.readdir(__dirname + '/images', (err, files) => {
        if (err) {
            console.log('error:', err);
            return;
        } else {
            let images = [];

            files.forEach((f) => {
                images.push(f);
            });

            /* Then pick a random image. */

            console.log('opening an image...');

            const imagePath = path.join(__dirname, '/images/' + randomFromArray(images)),
                imageData = fs.readFileSync(imagePath, {
                    encoding: 'base64'
                });

            /* Upload the image to Twitter. */

            console.log('uploading an image...', imagePath);

            T.post('media/upload', {
                media_data: imageData
            }, (err, data, response) => {
                if (err) {
                    console.log('error:', err);
                } else {
                    /* Add image description. */

                    const image = data;
                    console.log('image uploaded, adding description...');

                    T.post('media/metadata/create', {
                        media_id: image.media_id_string,
                        alt_text: {
                            text: 'Auto-generated shark image using Node.js and Twitter API v2! :)'
                        }
                    }, (err, data, response) => {

                        /* And finally, post a tweet with the image. */

                        T.post('statuses/update', {
                                // status: 'Optional tweet text.',
                                media_ids: [image.media_id_string]
                            },
                            (err, data, response) => {
                                if (err) {
                                    console.log('error:', err);
                                } else {
                                    console.log('posted an image!');

                                    /*
                                        After successfully tweeting, we can delete the image.
                                        Keep this part commented out if you want to keep the image and reuse it later.
                                    */

                                    // fs.unlink(imagePath, (err) => {
                                    //   if (err){
                                    //     console.log('error: unable to delete image ' + imagePath);
                                    //   } else {
                                    //     console.log('image ' + imagePath + ' was deleted');
                                    //   }
                                    // });
                                }
                            });
                    });
                }
            });
        }
    });
}

tweetRandomImage();



/*const tweet = async () => { // TWEET "HELLO WORLD"
  try {
    await twitterClient.v2.tweet("Hello world!");
  } catch (e) {
    console.log(e)
  }
}

tweet();*/


/*const search = async () => { // SEARCH FOR A TWEET
    
    const findTweet = await twitterBearer.v2.search('#shark');

    for await (const tweet of findTweet) {
        console.log(tweet.id);
    }
}

search()*/

const like = async () => {
    const findTweet = await twitterBearer.v2.search('#shark');

    for await (const tweet of findTweet) {
        await twitterClient.v2.like(process.env.APP_ID, tweet.id);
        console.log("new tweet liked: " + tweet.id)
    }
}

like()