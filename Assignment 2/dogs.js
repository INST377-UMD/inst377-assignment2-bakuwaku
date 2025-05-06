const API_KEY = 'zvUxMTSwefWk0JA_iUgmtSiKFtxkEWGp'; 

document.addEventListener('DOMContentLoaded', () => {
  loadRandomDogs();
  loadBreedButtons();
  setupVoiceCommands();
});
class SimpleSlider {
    constructor(container, options = {}) {
      this.container = container;
      this.images = container.querySelectorAll('img');
      this.currentIndex = 0;
      this.options = {
        autoPlay: options.autoPlay || false,
        delay: options.delay || 3000,
        transition: options.transition || 500,
      };
      this.init();
    }
  
    init() {
      if (this.options.autoPlay) {
        setInterval(() => {
          this.showNext();
        }, this.options.delay);
      }
    }
  
    showNext() {
      this.images[this.currentIndex].classList.remove('active');
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.images[this.currentIndex].classList.add('active');
    }
  }
function loadRandomDogs() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(res => res.json())
      .then(data => {
        const carousel = document.getElementById('dog-carousel');
        data.message.forEach((url, index) => {
          const img = document.createElement('img');
          img.src = url;
          img.alt = 'Dog';
          img.classList.add('slider-item');
          if (index === 0) img.classList.add('active');
          carousel.appendChild(img);
        });
  
        new SimpleSlider(carousel, {
          autoPlay: true,
          delay: 3000,
          transition: 500
        });
      })
      .catch(err => console.error('Error loading random dogs:', err));
  }  

function loadBreedButtons() {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then(res => res.json())
      .then(data => {
        const breeds = Object.keys(data.message);  
        const limitedBreeds = breeds.slice(0, 10);  
        console.log(limitedBreeds); 
        const container = document.getElementById('breed-buttons');
  
        container.innerHTML = '';
  
        limitedBreeds.forEach(breed => {
          const button = document.createElement('button');
          button.textContent = breed;
          button.className = 'button-56';
          button.onclick = () => loadBreedInfo(breed);
          container.appendChild(button);
        });
      })
      .catch(err => console.error('Error loading breed list:', err));
}  

function loadBreedInfo(breedName) {
  fetch('https://api.thedogapi.com/v1/breeds', {
    headers: {
      'x-api-key': API_KEY
    }
  })
    .then(res => res.json())
    .then(breeds => {
      const breed = breeds.find(b => b.name.toLowerCase() === breedName.toLowerCase());
      if (breed) {
        document.getElementById('breed-name').textContent = breed.name;
        document.getElementById('breed-desc').textContent = breed.temperament || 'No description available.';
        document.getElementById('breed-life').textContent = breed.life_span || 'Unknown';
        document.getElementById('breed-info').style.display = 'block';
      } else {
        alert('Breed info not found.');
      }
    })
    .catch(err => console.error('Error fetching breed info:', err));
}

function setupVoiceCommands() {
  if (annyang) {
    const commands = {
      'hello': () => alert('Hello World!'),
      'change the color to *color': color => document.body.style.backgroundColor = color,
      'navigate to *page': page => {
        page = page.toLowerCase();
        if (['home', 'stocks', 'dogs'].includes(page)) {
          window.location.href = `${page}.html`;
        }
      },
      'load dog breed *breed': breed => loadBreedInfo(breed)
    };
    annyang.addCommands(commands);
    annyang.start();

    annyang.addCallback('result', (phrases) => {
      console.log('Recognized phrases:', phrases); 
    });
  }
}
