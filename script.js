let imgFundo, aniBird, imgPipe, telaVasco;
let bird, fundo, xBird, canos;
let gameStart, gameOver;

function preload() {
	let imgBird = [];
	for (let i = 1; i <= 4; i++) {
		imgBird.push("./assets/frame-" + i + ".png");
	}
	aniBird = loadAni(imgBird);
	imgFundo = loadAni("./assets/bg.png");
	imgPipe = loadAni("./assets/pipe.png");
}

function setup() {
	createCanvas(360, 640);

	world.gravity.y = 0;

	gameStart = false;
	gameOver = false;

	xBird = 60;

	fundo = new Group();
	fundo.collider = "n";
	fundo.y = height / 2;
	fundo.addAni(imgFundo);
	while (fundo.length < 3) {
		let f = new fundo.Sprite();
		f.x = width / 2 + (width * (fundo.length - 1));
		f.layer = 0;
	}

	bird = new Sprite(xBird, height / 2);
	bird.addAni("fly", aniBird);
	bird.scale = 0.06;
	bird.ani.scale = 1.5;

	let paredeCima = new Sprite(width / 2, -20, width, 40);
	paredeCima.collider = "s";
	paredeCima.visible = false;

	let paredeBxo = new Sprite(width / 2, height + 20, width, 40);
	paredeBxo.collider = "s";
	paredeBxo.visible = false;

	canos = new Group();
	canos.collider = "k";
	canos.addAni(imgPipe);

	telaVasco = new Sprite();
	
}

function draw() {
	background(0);

	if (!gameStart && !gameOver) { // antes de iniciar o jogo
		// if (!(gameStart || gameOver)) {
		if (kb.presses(" ")) {
			gameStart = true;
			world.gravity.y = 10;
			canos.vel.x = -4;
		}
	}

	if (gameStart && !gameOver) { // jogo rolando
		moveBg();
		if (kb.presses(" ")) {
			bird.vel.y = -6;
		}
		if (bird.vel.y > 0) {
			bird.rotateMinTo(30, 4);
		} else if (bird.vel.y < 0) {
			bird.rotateMinTo(-30, 4);
		}
		bird.x = xBird;
		criaCano();
		removeCano();
		if(bird.collides(canos)) {
			console.log("UI");
			gameOver = true;
			
		}
	}
	
}

function mousePressed() {
	allSprites.debug = true;
}
function mouseReleased() {
	allSprites.debug = false;
}

function moveBg() {
	fundo.vel.x = -2;
	if (fundo[0].x < -width) {
		fundo[0].remove();
	}
	if (fundo[fundo.length - 1].x < width) { // último sprite do grupo
		let x = fundo[fundo.length - 1].x + width;
		let f = new fundo.Sprite();
		f.x = x;
		f.layer = 0;
	}
}

function criaCano() {
	let ultimo = canos[canos.length - 1];
	if (canos.length === 0 || ultimo.x < width / 2) {
		const gapH = 200;
		const gapY = round(random(gapH, height - gapH));

		let canoY;
		canoY = gapY - (gapH / 2) - (imgPipe.h / 2);
		novoCano(canoY, 180);
		canoY = gapY + (gapH / 2) + (imgPipe.h / 2);
		novoCano(canoY);

		// const gap = new Sprite() // vamos apagar isso daqui a pouco
		// gap.h = gapH;
		// gap.y = gapY;
		// gap.collider = "n"
	}
}

function novoCano(y, rotacao = 0) {
	let cano = new canos.Sprite();
	cano.rotation = rotacao;
	cano.y = y;
	cano.x = width + cano.w;
}

function removeCano() {
	const cano0 = canos[0];

	if (cano0.x < -cano0.w / 2) {
		const cano1 = canos[1];
		cano0.remove();
		cano1.remove();
	}
}