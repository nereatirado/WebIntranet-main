const checkboxValues = JSON.parse(localStorage.getItem("checkboxValues")) || {};
const buttons = Array.from(document.querySelectorAll(".checklist-item__expand"));
const labels = Array.from(document.querySelectorAll(".checklist-item__title"));
const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const checkboxesLength = checkboxes.length;
const progress = document.querySelector(".progress__bar");
const counter = document.querySelector(".progress__count");
const reset = document.querySelector(".progress__reset");
const returnButton = document.getElementById('returnButton');
const printButton = document.getElementById("imprimirButton");

function loadIds() {
	for (let a = 0; a < checkboxesLength; a += 1) {
		const b = a => a.replace(/[ ,.!?;:'-]/g, "");
		checkboxes[a].id = `${b(
			checkboxes[a].nextSibling.nextSibling.innerText
		).toLowerCase()}`;
		checkboxes[a].nextSibling.setAttribute(
			"for",
			`${b(checkboxes[a].nextSibling.nextSibling.innerText).toLowerCase()}`
		);
	}
}


function updateStorage(a) {
	checkboxValues[a.id] = a.checked;
	localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
}

function countChecked() {
	if (this.type === "checkbox") {
		const a = this.parentNode.parentNode.parentNode;
		const b = a.querySelectorAll("input:checked").length / a.querySelectorAll(".checklist-item").length;
		a.querySelector(".checklist__percentage-border").style.transform = `scaleX(${b})`;
	} else {
		Array.from(document.querySelectorAll(".checklist")).forEach(a => {
			const b = a.querySelectorAll("input:checked").length / a.querySelectorAll(".checklist-item").length;
			a.querySelector(".checklist__percentage-border").style.transform = `scaleX(${b})`;
		});
	}

	let a = 0;
	Array.from(document.querySelectorAll("input:checked")).forEach(() => {
		a += 1;
	});
	counter.innerText = `${a}/${checkboxesLength}`;
	progress.style.transform = `scaleX(${a / checkboxesLength})`;
	checkboxValues.globalCounter = a;
	updateStorage(this);
}

function loadValues() {
	const a = checkboxValues.globalCounter || 0;
	counter.innerText = `${a}/${checkboxesLength}`;
	Object.keys(checkboxValues).forEach(a => {
		if (a !== "globalCounter") {
			const element = document.getElementById(a);
			if (element) {
				element.checked = checkboxValues[a];
			}
		}
	});
	countChecked();
}

function toggleExpand() {
	const a = this.parentNode;
	a.querySelector(".line").classList.toggle("closed");
	a.classList.toggle("open");
}

function resetCheckboxes() {
	this.classList.add("progress__reset--pressed");
	checkboxes.forEach(a => (a.checked = false));
	for (const key in checkboxValues) {
		if (checkboxValues.hasOwnProperty(key)) {
			delete checkboxValues[key];
		}
	}
	countChecked();
}

window.onload = function () {
	// Evento de clic para el botón de impresión
	printButton.addEventListener("click", function () {
		// Oculta los botones dentro de las descripciones
		document.querySelectorAll(".modal-button, .close").forEach(function (element) {
			element.style.display = "none";
		});

		// Toma el nombre del HTML que solicita el documento PDF
		var url = window.location.pathname;
		var filename = url.substring(url.lastIndexOf('/') + 1);
		filename = filename.split('.')[0];

		// Saca la fecha actual
		var d = new Date();

		// Copia el contenido del documento actual
		var originalContent = document.body.innerHTML;

		// Oculta las descripciones de las secciones marcadas antes de la impresión
		var checklistItems = document.querySelectorAll('.checklist-item');
		for (var i = 0; i < checklistItems.length; i++) {
			var checkbox = checklistItems[i].querySelector('input[type="checkbox"]');
			var infoContainer = checklistItems[i].querySelector('.info-container');
			if (checkbox && checkbox.checked) {
				infoContainer.style.display = "none";
			}
		}

		// Sacar el porcentage del contador de progreso
		const arrayCount = counter.innerText.split("/");
		const percentProgress = Math.round((arrayCount[0] / arrayCount[1]) * 100);

		// Crea una nueva ventana de impresión
		var printWindow = window.open("", "", "width=800,height=1000");

		// Personaliza el style del PDF
		var style = printWindow.document.createElement("style");
		style.innerHTML = `
            body {
                margin: 0 auto;
                padding: 0 20px 20px 20px;
                font-family: 'Rubik', sans-serif;
                font-size: 15px;
                background-color: #DADFE1;
            }

			p{
				margin: 10px auto;
			}

            table, th, td, tr{
                border-collapse: collapse;
                border: 1px solid black;
                margin: 10px auto;
                vertical-align: middle;
                text-align: center;
                font-size: 12px;
            }

            h1{
                text-align: center;
                color: #578fe2;
                font-size: 40px;
                -webkit-text-stroke: 2px black;
                margin-top: 40px;
            }

            button {
                font-family: inherit;
                line-height: 37px;
                display: inline-block;
                height: 37px;
                margin: 10px auto;
                padding: 0 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                letter-spacing: 0.025em;
                color: inherit;
                border: 1px solid #3f4350;
                border-radius: 3px;
                outline: 0;
                background: #4dabec;
                box-shadow: 0 4px 6px rgba(33, 16, 118, 0.11), 0 1px 3px rgba(33, 16, 118, 0.1);
                color: white;
            }
			
			li::marker{
				color: #344abf;
			}

            button:hover, button:focus {
                background: #344abf;
                box-shadow: 0 7px 14px rgba(33, 16, 118, 0.16), 0 3px 6px rgba(33, 16, 118, 0.2);
            }
        `;
		printWindow.document.body.appendChild(style);

		// Crear nombre de fichero para el PDF
		printWindow.document.title = `política${filename[0].toUpperCase() + filename.slice(1)}_${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}.pdf`;

		// Saca la fecha actual
		var d = new Date();

		// Obtiene la hora en formato de 12 horas
		var hour = d.getHours();
		var amOrPm = hour >= 12 ? 'PM' : 'AM'; // Determina si es AM o PM

		// Ajusta la hora para que esté en formato 12 horas
		if (hour > 12) {
			hour -= 12;
		} else if (hour === 0) {
			hour = 12;
		}

		// Modifica el texto de políticas cumplidas y la fecha en una sola línea
		var progressCountElement = document.createElement('p');
		progressCountElement.style.cssText = "font-size: 13px; font-weight: bold";
		progressCountElement.textContent = `Políticas cumplidas: ${percentProgress}% (${counter.innerText})        ${d.getDate()}/${d.getMonth() + 1} ${hour}:${d.getMinutes()} ${amOrPm}`;
		printWindow.document.body.appendChild(progressCountElement);


		// Añade el titulo de la política
		var h1Element = document.getElementsByClassName("title")[0];
		var h1Text = h1Element.innerHTML

		var titleFileHTML = document.createElement("h1");
		titleFileHTML.style.cssText = "font-weight: bold";
		titleFileHTML.textContent = `${h1Text}`;
		printWindow.document.body.appendChild(titleFileHTML);

		// Agrega solo las descripciones de las secciones no marcadas al nuevo documento de impresión
		var unmarkedDescriptions = document.querySelectorAll('.checklist-item:not(.marked) .info-container');
		for (var i = 0; i < unmarkedDescriptions.length; i++) {
			var sectionTitle = unmarkedDescriptions[i].parentNode.querySelector('.checklist-item__title').textContent;
			var checkbox = unmarkedDescriptions[i].parentNode.querySelector('input[type="checkbox"]');
			// Si el checkbox está marcado (seleccionado), omite la impresión de la sección
			if (checkbox && checkbox.checked) {
				continue;
			}

			// Si el título de la sección es diferente al título actual, imprime el título de la sección
			var sectionTitleElement = document.createElement('h2');
			sectionTitleElement.textContent = sectionTitle;
			sectionTitleElement.style.cssText = "font-weight: bold; font-size: 30px"; // Ajusta el tamaño aquí
			printWindow.document.body.appendChild(sectionTitleElement);

			// Crea un elemento <h4> para el título
			var recomendacionTitleElement = document.createElement('h4');
			recomendacionTitleElement.textContent = 'RECOMENDACION PARA CUMPLIR';

			// Aplica estilos al elemento
			recomendacionTitleElement.style.cssText = "font-weight: bold; margin-left: 15px;"; // Establece el tamaño de fuente y margen aquí

			// Agrega el elemento al cuerpo del documento
			printWindow.document.body.appendChild(recomendacionTitleElement);


			// Agrega la descripción de la sección no seleccionada
			var descriptionClone = unmarkedDescriptions[i].cloneNode(true);

			// Encuentra todos los puntos dentro del texto
			var textNodes = descriptionClone.childNodes;

			// Itera sobre los nodos de texto para buscar y reemplazar los puntos con un punto de color rojo
			textNodes.forEach(node => {
				if (node.nodeType === Node.TEXT_NODE) {
					var text = node.textContent;
					var newText = text.replace(/·/g, '<span style="color: red;">·</span>');
					var temp = document.createElement('span');
					temp.innerHTML = newText;
					node.parentNode.replaceChild(temp, node);
				}
			});

			printWindow.document.body.appendChild(descriptionClone);

		}

		// Crea el elemento de la imagen del logo
		var imgLogo = new Image();
		imgLogo.src = 'https://lh3.googleusercontent.com/pw/AP1GczN23tR5foa0DT5C7NU2xrwqCpZP9qQRH3BE2Po3ocZ9YNzystpMDxrcPLaod4rzm_j9pynymSqGSvyVOfogVv4A62jujc0qsMG_tC7A3qK23KdCUuHXqGdNqR0WPVxU3iftF_csMmyS8pbVsXGh903hhUIXPEyLvByONKT7DXkLg4mjqyvorIkGhIMhsMLj0CuLqTOvEDvHd29IvZfqdb5El_3V1iogfTIgnUFlCX2PewwcQPKS-4q471U12fTgKeqkR7_sgBqFhayb68WJaK1K1W3A8R42TkS2LJWEdX4sBOffFABf5y1hoU8zrV4mcr3KyH6VwvIclKciAM1ZJkZT8E6YHRZINyqAwvHoNVQ3fdQckurh8aRpJQyBO6u6JTt5lp_XCRmkP1WvqvlNdtqCjAMNHc2TBJmVgVKAzrf_vPiUdfJIDZ8mtL9dbdIIggg8lXsQCJTs2T66WxOEE0UgokmM10fo6ZtF643WhIl-7MCg4fLM7xBsZWcpR_-wZipe-IkX9Y5eZKI6-HmnlFibXaNzMhuBYQS148K0qOyUmkhqINUBq7HxVGeWfKX6J69i1zAL_xUyWTAKX2KP5Ev_6jSWeQpeGirlhAKdxpYfDqjaw6QE_Fw8apdVgOmd12XX8aX53D9Fb_l0f6Twuc-qM5LAKtCTuBqdhgsSVcTxN4pfVluyPSeQ0_RApkPKAaT2fZYmb_TFlqzwWQTDW3kQCgtgwSpbG4GF6oI6uGaRNNgaRWYnNGFkedAbBrbU_rK55Ra6Y-24I5k8jWMzFD6Ci-Eo2LVjEJ1HjGmGETaRbJLs_KbMty_dqKSZnreiOW1HEK_AX_Gfa5RSqXJ1Uj9zqHCmH4ON6maeSmX4Q3SrovgPArX7y3aQcfRzxSn5llC6AADhhLGyY7klThFED3Pw=w1920-h360-s-no-gm?authuser=0'; // Ruta de la imagen del logotipo
		imgLogo.style.width = "350px"; // Ajusta el ancho según sea necesario
		imgLogo.style.height = "70px"; // Ajusta la altura según sea necesario
		imgLogo.style.bottom = "20px"; // Ajusta la distancia desde la parte inferior según sea necesario
		imgLogo.style.marginLeft = "320px";
		imgLogo.style.transform = "translateX(-50%)";

		// Agrega el logo al cuerpo del documento
		printWindow.document.body.appendChild(imgLogo);

		// Agregar el elemento de imagen como fondo al cuerpo del documento
		// printWindow.document.body.style.backgroundImage = `url(${imgLogo.src})`;
		// printWindow.document.body.style.backgroundRepeat = "no-repeat";
		// printWindow.document.body.style.backgroundPosition = "right top";
		// printWindow.document.body.style.backgroundSize = "230px 62px";

		// Agrega un botón de impresión para que el usuario inicie manualmente la impresión
		var printPDF = document.createElement('button');
		printPDF.textContent = 'Descargar PDF / Imprimir';
		printPDF.style.position = "absolute";
		printPDF.style.fontSize = "larger";
		printPDF.style.top = "0px"; // Ajusta la posición vertical según tus necesidades
		printPDF.style.left = "65%"; // Ajusta la posición horizontal según tus necesidades
		printPDF.style.textAlign = "center";
		printPDF.style.visibility = "visible";

		printPDF.addEventListener('click', function () {
			// Ocultar el botón antes de imprimir
			printPDF.style.visibility = 'hidden';

			// Iniciar la impresión
			printWindow.print();

			printWindow.close(); // Cierra el PDF generado
		});

		printWindow.document.body.appendChild(printPDF);

		// Restablece el contenido del documento actual
		document.body.innerHTML = originalContent;

		// Cierra el PDF generado al intentar cerrar la ventana de impresión
		printWindow.onbeforeunload = function () {
			location.reload(); // Recargar la página
		};
	}, false);

	loadIds();
	loadValues();
	checkboxes.forEach(a => a.addEventListener("click", countChecked));
	buttons.forEach(a => a.addEventListener("click", toggleExpand));
	labels.forEach(a => a.addEventListener("click", toggleExpand));
	reset.addEventListener("click", resetCheckboxes);
	reset.addEventListener("animationend", function () {
		this.classList.remove("progress__reset--pressed");
	}, false);

	returnButton.addEventListener('click', function () {
		window.location.href = 'politicas.html';
	});
};
