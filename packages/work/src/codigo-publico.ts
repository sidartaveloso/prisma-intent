/**
 * Código público de uma instância.
 *
 * O identificador da instância nomeia a oportunidade —
 * `ana-exemplo-delta-global-lideranca-tecnica-2026`. Isso é útil internamente e
 * impróprio em qualquer lugar que o destinatário do material possa ler.
 *
 * O caso concreto é o código QR do currículo impresso: a folha fica com o
 * recrutador. Se a URL trouxer o nome da empresa e a palavra "campanha", ele
 * descobre que existe uma campanha nomeada por empresa — e que, portanto, há
 * outras. O que era instrumentação vira informação sobre o candidato.
 *
 * O código público resolve isso: opaco, sem semântica e sem relação computável
 * com o id. Quem tem o código não deduz a campanha; quem tem o mapa, sim — e o
 * mapa não sai daqui.
 */

const ALFABETO = "0123456789abcdefghijklmnopqrstuvwxyz";

/** Comprimento do código. 12 caracteres base36 ≈ 4,7 × 10¹⁸ combinações. */
const COMPRIMENTO = 12;

/**
 * Gera um código opaco.
 *
 * Usa `crypto.getRandomValues`, e não UUIDv7, por um motivo medido: o UUIDv7
 * embute o instante de criação e, para manter a ordenação dentro do mesmo
 * milissegundo, as implementações **incrementam** os bits ditos aleatórios em
 * vez de sorteá-los. Descartar o campo de tempo não basta — gerando 5.000
 * códigos, os derivados de UUIDv7 produziram apenas 288 prefixos distintos, e
 * os gerados em sequência ficavam vizinhos.
 *
 * Num código impresso isso é exatamente o que não se quer: dois currículos
 * entregues no mesmo dia teriam códigos parecidos, denunciando que foram
 * emitidos juntos — e quantos existem.
 *
 * Aleatoriedade criptográfica não tem ordem nem estrutura para vazar.
 */
export function gerarCodigoPublico(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(16));
	let numero = bytes.reduce((total, byte) => total * 256n + BigInt(byte), 0n);

	let codigo = "";
	while (codigo.length < COMPRIMENTO) {
		codigo = ALFABETO[Number(numero % 36n)] + codigo;
		numero /= 36n;
	}
	return codigo;
}
