export const dateToString = (plaintext: Date): string => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return plaintext.toLocaleDateString('pt-br', {
    ...options,
    month: 'numeric'
  })
}
