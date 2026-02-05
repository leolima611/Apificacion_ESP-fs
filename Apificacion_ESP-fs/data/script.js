function enviarValorP(url, valor, destinoId){
	fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: 'value=' + valor
	})
	.then(response => response.text())
	.then(data => {
		document.getElementById(destinoId).textContent = data;
	})
	.catch(err => e.textContent('Error al enviar:', err));
}

function obtenerValorG(url, destinoId){
	fetch(url, {method: 'GET'})
	.then(response => response.json())
	.then(data => {
		document.getElementById(destinoId).textContent = data.bateria+'%';
	})
	.catch(err => {
		document.getElementById(destinoId).textContent = 'Error al obtener: ' + err;
	});
}


function ajustarIntensidad(valor){
	enviarValorP('/luz', valor, 'estado');
}

function ajustarGrado(valor){
	enviarValorP('/servo', valor, 'gradeEst');
}

function porcentajeBateria(){
	obtenerValorG('/bateria', 'porcentaje');
}

function inicializarSlider(slider, estadoElem, valorInicial, texto){
	slider.value = valorInicial;
	estadoElem.textContent = texto + valorInicial;
}

//alinecion centro de slider mouse
const s = document.getElementById('slider'), es = document.getElementById('estado');
inicializarSlider(s, es, 0, 'Intensidad: ');
let draggingE = false;

s.addEventListener('pointerdown', () => draggingE = true);
s.addEventListener('input', () => {
	es.textContent = 'Intensidad: ' + s.value;
	if (typeof ajustarIntensidad === 'function') ajustarIntensidad(s.value);
});

//alinecion centro de grade mouse
const g = document.getElementById('grade'), e = document.getElementById('gradeEst');
inicializarSlider(g, e, 90, 'Posicion: ');
let dragging = false;

g.addEventListener('pointerdown', () => dragging = true);
g.addEventListener('input', () => {
  e.textContent = 'Posicion: ' + g.value;
  if (typeof ajustarGrado === 'function') ajustarGrado(g.value);
});

s.addEventListener('touchstart', () => draggingE = true);
s.addEventListener('touchend', () => {
  draggingE = false;
  s.value = 0;
  es.textContent = 'Intensidad: 0';
  if (typeof ajustarIntensidad === 'function') ajustarIntensidad(s.value);
});

g.addEventListener('touchstart', () => dragging = true);
g.addEventListener('touchend', () => {
  dragging = false;
  g.value = 90;
  e.textContent = 'Posicion: 90';
  if (typeof ajustarGrado === 'function') ajustarGrado(g.value);
});


window.addEventListener('pointerup', () => {
	if (dragging){
		dragging = false;
		g.value = 90;
		e.textContent = 'Posicion: 90';
		if (typeof ajustarGrado === 'function') ajustarGrado(g.value);
	}
	if (draggingE){
		draggingE = false;
		s.value = 0;
		es.textContent = 'Intensidad: 0';
		if (typeof ajustarIntensidad === 'function') ajustarIntensidad(s.value);
	}
});