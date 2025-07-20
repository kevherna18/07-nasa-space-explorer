// NASA APOD API endpoint (using DEMO_KEY for learning purposes)
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = 'djydyKCexBcDksMWa8QYK241LsfrFhBjm2Nzhnu9'; // For learning - get your own key at api.nasa.gov

// Find our date picker inputs and button on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

// Get modal elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');
const closeButton = document.querySelector('.close-button');

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

// Add click event to close button
closeButton.addEventListener('click', function() {
  closeModal();
});

// Close modal when clicking outside of it
modal.addEventListener('click', function(event) {
  // Only close if clicking on the modal background (not the content)
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// Function to fetch images from NASA APOD API
async function fetchNASAImages(startDate, endDate) {
  try {
    // Show loading message while we fetch the images
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🚀</div>
        <p>Loading amazing space images...</p>
      </div>
    `;
    
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

// Function to open the modal with image details
function openModal(imageData) {
  // Set the modal content
  modalImage.src = imageData.hdurl || imageData.url; // Use HD version if available
  modalImage.alt = imageData.title;
  modalTitle.textContent = imageData.title;
  modalDate.textContent = imageData.date;
  modalExplanation.textContent = imageData.explanation;
  
  // Show the modal
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
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
      
      // Set the HTML content for this item - title and date on separate lines
      galleryItem.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong></p>
        <p>${item.date}</p>
      `;
      
      // Add click event to open modal
      galleryItem.addEventListener('click', function() {
        openModal(item);
      });
      
      // Add the item to the gallery
      gallery.appendChild(galleryItem);
    }
  });
  
  // If no images were found (only videos), show a message
  if (gallery.children.length === 0) {
    gallery.innerHTML = '<div class="placeholder"><p>No images found for this date range (only videos available).</p></div>';
  }
}
