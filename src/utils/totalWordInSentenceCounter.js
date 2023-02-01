export const totalWordInSentenceCounter = (sentence) => {
  const arraySentence = sentence.replace(/\s\s+/g, ' ').replace(/\n/, ' ').split(' ');
  return arraySentence.length;
};
