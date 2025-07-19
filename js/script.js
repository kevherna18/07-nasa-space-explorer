// NASA APOD API endpoint (using DEMO_KEY for learning purposes)
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = 'djydyKCexBcDksMWa8QYK241LsfrFhBjm2Nzhnu9'; // For learning - get your own key at api.nasa.gov

// Find our date picker inputs and button on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Add click event listener to the button
getImagesBtn.addEventListener('click', function() {
  // Get the selected dates from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates!');
    return;
  }
  
  // Fetch images from NASA API
  fetchNASAImages(startDate, endDate);
});

// Function to fetch images from NASA APOD API
async function fetchNASAImages(startDate, endDate) {
  try {
    // Show loading message
    gallery.innerHTML = '<div class="placeholder"><p>Loading space images...</p></div>';
    
    // Build the API URL with our parameters
    const apiUrl = `${NASA_API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    
    // Make the API request
    const response = await fetch(apiUrl);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    // Convert response to JSON
    const data = await response.json();
    
    // Display the images in the gallery
    displayImages(data);
    
  } catch (error) {
    // Handle any errors that occurred
    console.error('Error fetching NASA images:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <p>Sorry, there was an error loading the images. Please try again.</p>
      </div>
    `;
  }
}

// Function to display images in the gallery
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  
  // Check if we got any images
  if (!images || images.length === 0) {
    gallery.innerHTML = '<div class="placeholder"><p>No images found for this date range.</p></div>';
    return;
  }
  
  // Create HTML for each image
  images.forEach(function(item) {
    // Only show items that have images (not videos)
    if (item.media_type === 'image') {
      // Create a new gallery item element
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      
      // Set the HTML content for this item
      galleryItem.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong> (${item.date})</p>
        <p>${item.explanation}</p>
      `;
      
      // Add the item to the gallery
      gallery.appendChild(galleryItem);
    }
  });
  
  // If no images were found (only videos), show a message
  if (gallery.children.length === 0) {
    gallery.innerHTML = '<div class="placeholder"><p>No images found for this date range (only videos available).</p></div>';
  }
}
