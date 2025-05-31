export const specialCharacteres = (text, character) => {
  if (character === 'br') {
    return '<br />';
  }
  if (character === 'b') {
    return `<b>${text}</b>`;
  }
  // Adicione outros casos conforme necessário
  return `<${character}>${text}</${character}>`;
};

export const spanSpecialCharacteres = (text, character) => { 
  return <span dangerouslySetInnerHTML={{ __html: specialCharacteres('Texto em negrito', 'b') }} />
}