import { LicenseType } from '@app/core/models/enums/license-type.enum';
import { CreateContentMetadataRequest } from '@app/core/models/requests/create-content-metadata-request';

export const uploadMovies: CreateContentMetadataRequest[] = [
  {
    title: 'Django',
    description:
      "„Django” to brutalny western Quentina Tarantino z 2012 roku. Django (Jamie Foxx), wyzwolony niewolnik, łączy siły z niemieckim łowcą nagród Dr. Kingiem Schultzem (Christoph Waltz), aby uratować swoją żonę Broomhildę (Kerry Washington) z rąk sadystycznego plantatora Calvina Candie'ego (Leonardo DiCaprio).",
    licenseRules: [
      {
        price: 19,
        type: LicenseType.Buy,
      },
    ],
    imageFileId: '1',
    videoFileId: '1',
  },
  {
    title: 'Ojciec Chrzestny',
    description:
      '„Ojciec Chrzestny” Francisa Forda Coppoli z 1972 roku to epicka saga mafijna, śledząca losy rodziny Corleone. Marlon Brando gra Vito Corleone, patriarchę rodziny, a Al Pacino wciela się w jego syna Michaela, który niechętnie przejmuje rodzinny interes i staje się bezwzględnym przywódcą mafii.',
    licenseRules: [
      {
        price: 19,
        type: LicenseType.Buy,
      },
    ],
    imageFileId: '1',
    videoFileId: '1',
  },
  {
    title: 'Mroczny Rycerz',
    description:
      '„Mroczny Rycerz” Christophera Nolana z 2008 roku to mroczna opowieść o Batmanie (Christian Bale), który stawia czoła anarchistycznemu geniuszowi zbrodni - Jokerowi (Heath Ledger). Film zgłębia moralne dylematy i chaos w Gotham City, podkreślając walkę między dobrem a złem.',
    licenseRules: [
      {
        price: 19,
        type: LicenseType.Buy,
      },
    ],
    imageFileId: '1',
    videoFileId: '1',
  },
  {
    title: 'Fight Club',
    description:
      '„Fight Club” Davida Finchera z 1999 roku to opowieść o znudzonym życiem pracowniku korporacji (Edward Norton), który tworzy podziemny klub walk z charyzmatycznym anarchistą Tylerem Durdenem (Brad Pitt). Film eksploruje tematy męskości, konsumpcjonizmu i autodestrukcji.',
    licenseRules: [
      {
        price: 19,
        type: LicenseType.Buy,
      },
    ],
    imageFileId: '1',
    videoFileId: '1',
  },
  {
    title: 'Matrix',
    description:
      '„Matrix” z 1999 roku to przełomowy film science fiction, w którym haker Neo (Keanu Reeves) odkrywa, że rzeczywistość jest symulacją stworzoną przez maszyny. Wraz z Morfeuszem (Laurence Fishburne) i Trinity (Carrie-Anne Moss) walczy o wolność ludzkości.',
    licenseRules: [
      {
        price: 19,
        type: LicenseType.Buy,
      },
    ],
    imageFileId: '1',
    videoFileId: '1',
  },
  {
    title: 'Władca Pierścieni: Powrót Króla',
    description:
      'Film Petera Jacksona z 2003 roku to epickie zakończenie trylogii. Frodo (Elijah Wood) i Sam (Sean Astin) kontynuują misję zniszczenia Jedynego Pierścienia, podczas gdy Aragorn (Viggo Mortensen) walczy o tron Gondoru. Film zdobył 11 Oscarów.',
    licenseRules: [
      {
        price: 19,
        type: LicenseType.Buy,
      },
    ],
    imageFileId: '1',
    videoFileId: '1',
  },
  {
    title: 'Skazani na Shawshank',
    description:
      "Skazani na Shawshank to poruszający dramat z 1994 roku, oparty na opowiadaniu Stephena Kinga, w reżyserii Franka Darabonta. Film opowiada historię Andy'ego Dufresne'a (Tim Robbins), bankiera niesłusznie skazanego na dożywocie za morderstwo swojej żony i jej kochanka. W więzieniu Shawshank nawiązuje przyjaźń z innym więźniem, Redem (Morgan Freeman), który pomaga mu przetrwać trudne warunki i brutalność więziennej rzeczywistości. Andy, mimo niesprawiedliwości, nie traci nadziei i używa swojego intelektu oraz umiejętności finansowych, by zmienić życie swoje i innych więźniów. Film jest głęboką refleksją na temat nadziei, przyjaźni i siły ducha, a jego zaskakujące zakończenie pozostawia widza z poczuciem triumfu i wzruszenia.",
    licenseRules: [
      {
        price: 19,
        type: LicenseType.Buy,
      },
    ],
    imageFileId: '1',
    videoFileId: '1',
  },
];
