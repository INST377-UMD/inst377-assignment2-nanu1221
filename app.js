const RANDOM_DOG_API_URL = "https://dog.ceo/api/breeds/image/random/10";
const DOG_BREED_INFO_API_URL = "https://api.thedogapi.com/v1/breeds";

fetch(RANDOM_DOG_API_URL)
    .then(response => response.json())
    .then(data => {
        const images = data.message;
        const carouselContainer = document.getElementById('dog-carousel');
        images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.alt = "Dog Image";
            img.style.width = '100%';
            img.style.height = 'auto';
            carouselContainer.appendChild(img);
        });

        new SimpleSlider('.carousel-container', {
            auto: true,
            loop: true,
            interval: 3000,
        });
    });

fetch(DOG_BREED_INFO_API_URL)
    .then(response => response.json())
    .then(data => {
        const breeds = data;
        const breedButtonsContainer = document.getElementById('dog-breed-buttons');
        breeds.forEach(breed => {
            const button = document.createElement('button');
            button.textContent = breed.name;
            button.setAttribute('data-breed', breed.name);
            button.addEventListener('click', () => showBreedInfo(breed));
            breedButtonsContainer.appendChild(button);
        });
    });

function showBreedInfo(breed) {
    const dogInfoContainer = document.getElementById('dog-info-container');
    const breedName = document.getElementById('dog-breed-name');
    const breedDescription = document.getElementById('dog-breed-description');
    const minLife = document.getElementById('dog-min-life');
    const maxLife = document.getElementById('dog-max-life');

    breedName.textContent = breed.name;
    breedDescription.textContent = breed.description || 'No description available.';
    minLife.textContent = breed.life_span ? breed.life_span.split(' - ')[0] : 'N/A';
    maxLife.textContent = breed.life_span ? breed.life_span.split(' - ')[1] : 'N/A';

    dogInfoContainer.style.display = 'block';
}

if (annyang) {
    const commands = {
        'Load Dog Breed *breed': function(breed) {
            fetch(DOG_BREED_INFO_API_URL)
                .then(response => response.json())
                .then(data => {
                    const foundBreed = data.find(b => b.name.toLowerCase() === breed.toLowerCase());
                    if (foundBreed) {
                        showBreedInfo(foundBreed);
                    } else {
                        alert('Dog breed not found.');
                    }
                });
        }
    };

    annyang.addCommands(commands);
    annyang.start();
}
