import Head from 'next/head';

export default function HeadDescription() {
  return (
    <Head>
      <title>Last Hope by Nqbral Games</title>
      <meta
        name="description"
        content="Jeu de stratégie en ligne avec zombies et trahison"
      />
      <meta
        name="keywords"
        content="jeux de société, jeux en ligne, multijoueur, nqbral games, zombies, zombie, bluff, infectés, docteurs, last hope, time bomb"
      />
      <meta
        property="og:title"
        content="Last Hope - Jeu de survie multijoueur"
      />
      <meta
        property="og:description"
        content="Affrontez les infectés et sauvez l'humanité."
      />
      <meta property="og:url" content="https://last-hope.nqbral-games.fr" />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://last-hope.nqbral-games.fr" />
    </Head>
  );
}
