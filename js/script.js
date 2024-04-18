// typewriter text
const typewriter_text = ["Grail Cyber Tech"];

// responsive navigation
const navSlide = () => {
	const burger = document.querySelector ('.burger');
	const nav = document.querySelector ('.nav-links');
	const navlinks = document.querySelectorAll ('.nav-links li');

	burger.addEventListener ('click', () => {
		// toggle nav
		nav.classList.toggle ('nav-active');
	
		// animate links
		navlinks.forEach ((link, index) => {
			if (link.style.animation) {
				link.style.animation = '';
			} else {
				link.style.animation = `navlinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
			}
		});
		
		// animate burger
		burger.classList.toggle ('toggle');
	});
}

// sleep function
function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
      	let elapsedTime = new Date().getTime() - timeStart;
      	if (elapsedTime > milliseconds) {
        	break;
      	}
    }
}

let textIter = 0;

// scroll indicator
function UpdateScrollProgress () {
	var toppos = document.documentElement.scrollTop;
	var remaining = document.documentElement.scrollHeight - document.documentElement.clientHeight;

	var percentage = (toppos / remaining) * 100;

	document.getElementsByClassName ('progress-bar')[0].style.width = percentage + "%";
}

// scroll event listener
document.addEventListener ("scroll", () => {
	UpdateScrollProgress ();
})

// calling functions
navSlide ();

function normalizeText(text){
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function search_policies() {
    let input = normalizeText(document.getElementById('searchbar').value); // Normalizar el texto ingresado en el buscador
    let cards = document.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        let cardTitle = normalizeText(cards[i].querySelector('.front h3').textContent); // Normalizar el texto de cada carta
        if (!cardTitle.includes(input)) {
            cards[i].style.display = "none";
            cards[i].classList.add('inactive');
            cards[i].classList.remove('found');
        } else if (input == "") {
            cards[i].style.display = "list-item";
            cards[i].classList.remove('inactive');
            cards[i].classList.remove('found');
        } else {
            cards[i].style.filter = "blur(0px)";
            cards[i].classList.add('found');
        }
    }
}