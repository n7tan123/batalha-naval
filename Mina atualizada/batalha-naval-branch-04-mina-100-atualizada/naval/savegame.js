function salvarJogoEmArquivo(estado) {
  const jogoSalvo = JSON.stringify(estado);

  const blob = new Blob([jogoSalvo], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'jogo_salvo.json';
  link.click();

  console.log("Jogo salvo em arquivo!");
}
