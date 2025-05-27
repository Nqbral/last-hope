import LinkButton, { TypeLinkButton } from '@components/buttons/LinkButton';
import Navbar from '@components/navbar/Navbar';
import BombImg from '@public/bomb.png';
import DoctorImg from '@public/doctor.png';
import DoctorMinImg from '@public/doctor_min.png';
import InfectedImg from '@public/infected.png';
import InfectedMinImg from '@public/infected_min.png';
import NeutralImg from '@public/neutral.png';
import RemedyImg from '@public/remedy.png';
import UserMinImg from '@public/user_min.png';
import LoadingAuth from 'app/layout/LoadingAuth';
import Image from 'next/image';

export default function RulesPage() {
  return (
    <LoadingAuth>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center gap-12 px-4 pt-24 pb-8 text-center">
        <h1 className="text-primary text-4xl">Règles</h1>
        <div className="container flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl underline underline-offset-4">But du jeu</h2>
            <p>
              Le monde est ravagé par un virus incurable. Dans un laboratoire
              isolé, les derniers{' '}
              <span className="text-emerald-400">Docteurs</span> tentent de
              découvrir des Remèdes pour sauver l’humanité. Mais parmi eux se
              cachent des <span className="text-red-400">Infectés</span>, qui
              veulent faire exploser le laboratoire pour répandre définitivement
              la contagion.
            </p>
            <p>
              En début de partie, découvrez secrètement à quelle équipe vous
              appartenez et tentez d’identifier vos alliés : L’équipe des{' '}
              <span className="text-emerald-400">Docteurs</span> gagne si tous
              les <span className="text-blue-400">Remèdes</span> sont
              découverts. L’équipe des{' '}
              <span className="text-red-400">Infectés</span> gagne si la carte{' '}
              <span className="text-amber-600">Explosion</span> est révélée, ou
              si aucun Remède n&apos;est trouvé au bout des 4 manches.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl underline underline-offset-4">Rôles</h2>
            <p>Les cartes de jeu représentent les différentes</p>
            <div className="flex flex-col items-center gap-2 rounded-md border-1 border-neutral-700 p-4 md:flex-row">
              <Image src={DoctorImg} alt="doctor" className="w-32" />
              <p className="md:w-xl">
                Les membres de l’équipe{' '}
                <span className="text-emerald-400">Docteurs</span> sont
                représentés par les cartes Rôle avec un fond vert. L’objectif de
                ces membres est de trouver les différents remèdes avant que les
                Infectés fassent exploser le laboratoire.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-md border-1 border-neutral-700 p-4 md:flex-row">
              <Image src={InfectedImg} alt="infected" className="w-32" />
              <p className="md:w-xl">
                Les membres de l’équipe{' '}
                <span className="text-red-400">Infectés</span> sont représentés
                par les cartes Rôle avec un fond rouge. L’objectif de ces
                membres est de faire exploser la{' '}
                <span className="text-amber-600">Bombe</span> pour détruire le
                laboratoire.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl underline underline-offset-4">
              Cartes Échantillons
            </h2>
            <p>
              Les cartes Échantillons représentent les prélèvements que les
              joueurs analysent dans l’espoir de découvrir un Remède… ou de
              déclencher l’explosion du laboratoire. Elles se divisent en trois
              types distincts.
            </p>
            <div className="flex flex-col items-center gap-2 rounded-md border-1 border-neutral-700 p-4 md:flex-row">
              <Image src={NeutralImg} alt="neutral" className="w-32" />
              <p className="md:w-xl">
                Examiner une{' '}
                <span className="text-neutral-400">Substance Neutre</span> n’a
                aucun effet.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-md border-1 border-neutral-700 p-4 md:flex-row">
              <Image src={RemedyImg} alt="remedy" className="w-32" />
              <p className="md:w-xl">
                Analyser un <span className="text-blue-400">Remède</span> vous
                rapproche de la victoire si vous faites partie de l’équipe des{' '}
                <span className="text-emerald-400">Docteurs</span>. Si tous les
                Remèdes en jeu sont découverts, l’humanité est sauvée.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-md border-1 border-neutral-700 p-4 md:flex-row">
              <Image src={BombImg} alt="bomb" className="w-32" />
              <p className="md:w-xl">
                Déclencher la carte{' '}
                <span className="text-amber-600">Explosion</span> provoquera la
                destruction du laboratoire et offre la victoire à l’équipe des
                <span className="text-red-400"> Infectés</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl underline underline-offset-4">
              Mise en place
            </h2>
            <p>
              Au début de la partie, chaque joueur se voit automatiquement
              attribuer un rôle secret :{' '}
              <span className="text-emerald-400">Docteur</span> ou{' '}
              <span className="text-red-400">Infecté</span>.
            </p>
            <p>
              La répartition des rôles en fonction du nombre de joueurs est la
              suivante :
            </p>
            <table>
              <tbody>
                <tr>
                  <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                    <Image
                      src={UserMinImg}
                      alt="players_min_img"
                      className="w-12"
                    />
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    4
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    5
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    6
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    7
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    8
                  </td>
                </tr>
                <tr>
                  <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                    <Image
                      src={DoctorMinImg}
                      alt="doctors_min_img"
                      className="w-12"
                    />
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    3
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    3
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    4
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    5
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    5
                  </td>
                </tr>
                <tr>
                  <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                    <Image
                      src={InfectedMinImg}
                      alt="infected_min_img"
                      className="w-12"
                    />
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    2
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    2
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    2
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    3
                  </td>
                  <td className="border-2 border-slate-700 px-4 py-2 text-center">
                    3
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="italic">
              *Remarque : Dans les parties à 4 et 7 joueurs, une des cartes Rôle
              ne sera pas distribuée. Elle sera mise de côté après la
              distribution des rôles. De cette façon, vous ne pouvez pas être
              certain du nombre exact de membres de l’équipe{' '}
              <span className="text-red-400">Infectés</span> et{' '}
              <span className="text-emerald-400">Docteurs</span> dans la partie
              en cours.
            </p>
            <br />
            <p>
              Chaque joueur reçoit également un ensemble de cartes contenant un
              mélange de : <span className="text-blue-400">Remèdes</span>,{' '}
              <span className="text-neutral-400">Substances Neutres</span> et{' '}
              <span className="text-amber-600">Explosion</span>.
            </p>
            <p>
              La répartition des cartes en fonction du nombre de joueurs est la
              suivante :
            </p>
            <table>
              <tbody>
                <tr>
                  <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                    <Image
                      src={UserMinImg}
                      alt="players_min_img"
                      className="w-12"
                    />
                  </td>
                  <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                    <Image
                      src={NeutralImg}
                      alt="neutral_img"
                      className="w-12"
                    />
                  </td>
                  <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                    <Image src={RemedyImg} alt="remedy_img" className="w-12" />
                  </td>
                  <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                    <Image src={BombImg} alt="bomb_img" className="w-12" />
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    4
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    15
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    4
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    1
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    5
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    19
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    5
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    1
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    6
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    23
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    6
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    1
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    7
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    27
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    7
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    1
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    8
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    31
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    8
                  </td>
                  <td className="border-2 border-slate-700 py-3 text-center">
                    1
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Les rôles et les cartes sont distribués de manière aléatoire par
              le système. Le joueur désigné pour commencer la partie est aussi
              choisi automatiquement.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl underline underline-offset-4">
              Déroulement d&apos;une manche
            </h2>
            <p>
              La partie se joue en jusqu’à{' '}
              <span className="font-bold">4 manches</span>. À chaque manche :
            </p>
            <ul className="flex max-w-3xl list-decimal flex-col gap-3 px-8 text-left">
              <li>
                Les joueurs consultent leur main et indiquent si ils sont prêts
                à jouer la manche.
              </li>
              <li>
                Les joueurs discutent librement entre eux pour tenter d’orienter
                les choix d’analyse.
              </li>
              <li>
                <p>
                  À tour de rôle, chaque joueur choisit une Carte chez un autre
                  joueur à analyser.
                </p>
                <ul className="mt-2 ml-8 list-disc">
                  <li>Il est interdit d’analyser ses propres cartes.</li>
                  <li>
                    L’analyse révèle immédiatement le contenu de la carte à tous
                    les joueurs.
                  </li>
                </ul>
              </li>
              <li>
                <p>Une fois la carte révélée</p>
                <ul className="mt-2 ml-8 list-disc">
                  <li>
                    Si c&apos;est une{' '}
                    <span className="text-neutral-400">Substance Neutre</span> :
                    rien ne se passe.
                  </li>
                  <li>
                    Si c&apos;est un{' '}
                    <span className="text-blue-400">Remède</span> : il est mis
                    de côté.
                    <br />
                    Si tous les Remèdes sont trouvés, l&apos;équipe des{' '}
                    <span className="text-emerald-400">Docteurs</span> gagne
                    immédiatemment.
                  </li>
                  <li>
                    Si c&apos;est la carte{' '}
                    <span className="text-amber-600">Explosion</span> :
                    l&apos;équipe des{' '}
                    <span className="text-red-400">Infectés</span> gagne
                    immédiatemment.
                  </li>
                </ul>
              </li>
              <li>
                Le joueur dont la carte vient d’être analysée devient le
                prochain à choisir une Carte à analyser.
              </li>
              <li>
                La manche se termine après un nombre d’analyses égal au nombre
                de joueurs.
              </li>
              <li>
                Le système collecte automatiquement les cartes non analysées.
                <br />
                Elle les remélange et les distribue à tous les joueurs.
                <br />
                Une nouvelle manche démarre avec une carte de moins pour chaque
                joueur comparée à la manche précédente.
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl underline underline-offset-4">
              Fin de partie
            </h2>
            <p>
              La partie se termine immédiatement si l’une des trois conditions
              suivantes est remplie :
            </p>
            <ul className="flex list-decimal flex-col gap-3 px-8 text-left">
              <li>
                Tous les <span className="text-blue-400">Remèdes</span> ont été
                découverts.
                <br />
                Les membres de l&apos;équipe des{' '}
                <span className="text-emerald-400">Docteurs</span> gagne
                immédiatemment.
              </li>
              <li>
                La carte <span className="text-amber-600">Explosion</span> a été
                révélée.
                <br />
                Les membres de l&apos;équipe des{' '}
                <span className="text-red-400">Infectés</span> gagne
                immédiatemment.
              </li>
              <li>
                À la fin des quatre manches, aucune des deux conditions
                précédentes n’est atteinte.
                <br />
                Les membres de l&apos;équipe des{' '}
                <span className="text-red-400">Infectés</span> remporte la
                partie.
              </li>
            </ul>
          </div>
        </div>

        <LinkButton
          buttonText="Retour"
          linkTo="/"
          typeButton={TypeLinkButton.secondary}
        />
      </div>
    </LoadingAuth>
  );
}
