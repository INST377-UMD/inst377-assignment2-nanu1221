const main = document.querySelector("main");

const imageContainer = document.createElement("div");
imageContainer.id = "dog-images";
main.appendChild(imageContainer);

const breeds = ["husky", "pug", "labrador"];
const breedButtons = document.createElement("div");
breedButtons.id = "breed-buttons";

breeds.forEach(breed => {
  const btn = document.createElement("button");
  btn.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
  btn.onclick = () => loadBreedImages(breed);
  breedButtons.appendChild(btn);
});

main.insertBefore(breedButtons, imageContainer);

function loadBreedImages(breed) {
  fetch(`https://dog.ceo/api/breed/${breed}/images/random/5`)
    .then(response => response.json())
    .then(data => {
      imageContainer.innerHTML = "";
      data.message.forEach(imgUrl => {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.style.width = "200px";
        img.style.margin = "10px";
        imageContainer.appendChild(img);
      });
    })
    .catch(error => {
      console.error("Error fetching dog images:", error);
      imageContainer.innerHTML = "Could not load dog images.";
    });
}

function loadRandomDog() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(response => response.json())
    .then(data => {
      imageContainer.innerHTML = "";
      const img = document.createElement("img");
      img.src = data.message;
      img.style.width = "300px";
      imageContainer.appendChild(img);
    });
}

loadRandomDog();

function startAnnyang() {
  if (annyang) {
    const commands = {
      'load dog breed *breed': loadBreedImages,
      'change the color to *color': function(color) {
        document.body.style.backgroundColor = color;
      },
      'navigate to home': () => window.location.href = "index.html",
      'navigate to stocks': () => window.location.href = "stocks.html"
    };

    annyang.addCommands(commands);
    annyang.start();
  }
}

function stopAnnyang() {
  if (annyang) annyang.abort();
}
