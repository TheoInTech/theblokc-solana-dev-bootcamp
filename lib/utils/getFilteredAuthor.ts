export const getFilteredAuthor = (authorBase58PublicKey: string) => ({
  memcmp: {
    offset: 8, // Discriminator.
    bytes: authorBase58PublicKey,
  },
});
