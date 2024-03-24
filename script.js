const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

//Initialize an array to store fetched photos
let photosArray = [];
let isReady = false;
let totalImage = 0;
let imageLoaded = 0;
let isInitialLoad = true;

//Unsplash API configuration
// const count = 30;
let initialCount = 5 //added this to speed up the performance
const accessKey = "6eh6xIwoPf7Zi0-Fg-fhCPMlhcWauDaf6vh7CdU9RA4"
const unplashAPIUrl = `https://api.unsplash.com/photos/random/?client_id=${accessKey}&count=${initialCount}`;

//load the rest images after initial loading(initialCount) is done
function updateAPIURLWithNewCount (newCount) {
    unplashAPIUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${newCount}`;
  }

//check if all images are loaded
function loadedImages() {
    imageLoaded++;
    if (imageLoaded === totalImage) {
        isReady = true;
        loader.hidden = true;
    }
}

//create Helper function to follow DRY and setAttributes on DOM elemets
function setAttributes(elem, attr) {
    for (const key in attr) {
        elem.setAttribute(key, attr[key])
    }
}

//Create elements for Links, Photos and Add to DOM
function displayPhotos() {
    imageLoaded = 0;
    totalImage = photosArray.length;
    photosArray.forEach((photo) => {
        //create <a> to link to Unplash
        const item = document.createElement('a');
        // item.setAttribute('href', photo.links.html);
        // item.setAttribute('target', '_blank');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        })
        //create image<img> for photo
        const img = document.createElement('img');
        // img.setAttribute('src', photo.urls.regular);
        // img.setAttribute('alt', photo.alt_description);
        // img.setAttribute('title', photo.alt_description)
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        })
        //add event listner
        img.addEventListener('load', loadedImages);
        // put <img> inside <a>, and then both inside imageContainer
        item.appendChild(img);
        imageContainer.appendChild(item);
    })
}

// Function to fetch photos from the Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(unplashAPIUrl);
        photosArray = await response.json(); // Parse JSON response
        displayPhotos(); // Display fetched photos
        if (initialCount) {
            updateAPIURLWithNewCount(30);
            isInitialLoad = false;
        }
    } catch (error) {
        //catch error here.
        console.error('Error fetching photos:', error);
    }
}

//get infinite scroll functionality, check to see if scrolling near bottom, load more photos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && isReady) {
        isReady = false;
      getPhotos();
    }
  });

//on Load: Fetch photos when the page loads
getPhotos();