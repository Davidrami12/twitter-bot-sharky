const fs = require('fs'),
  path = require('path'),
  Twit = require('twit'),
  config = require(path.join(__dirname, 'config.js'));

const T = new Twit(config);

/*const stream = T.stream('statuses/filter', { track: "#shark"})

stream.on('tweet', function (tweet) {
  console.log(tweet.text)

  T.post('favorites/create', { id: tweet.id_str }, function (tweet) {
    if(err){
      console.log(err)
    }else{
      console.log(`Liked tweet: ${tweet.id_str}`)
    }
  })
})*/

console.log("prueba 123")

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
              text: 'Auto-generated image using Node.js and Twitter API! :)'
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

/*setInterval(() => {
  
}, 10000); // cambiar tiempo de ejecución, por defecto es cada 10 segundos*/