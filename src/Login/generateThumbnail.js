export const generateThumbnail = (video) => {
        return new Promise((resolve, reject) => {
          const videoElement = document.createElement('video');
          videoElement.src = URL.createObjectURL(video);
          videoElement.currentTime = 2;
    
          videoElement.addEventListener('loadeddata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
            const thumbnailUrl = canvas.toDataURL('image/jpeg');
            resolve(thumbnailUrl);
          });
    
          videoElement.addEventListener('error', (error) => {
            reject(error);
          });
        });
      };