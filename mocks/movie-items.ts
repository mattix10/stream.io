import { MovieMetadata } from 'src/app/core/models/movie-metadata';
import { maliciousComments } from './malicious-comments';

export const movieItems: MovieMetadata[] = [
  {
    uuid: '1',
    title: 'The Shawshank Redemption',
    imageUrl: './../../../../assets/images/obraz.jpg',
    description:
      'Opowieść o nadziei i przyjaźni w więzieniu, gdzie dwaj osadzeni nawiązują niezwykłą więź, rozpoczynając podróż ku odkupieniu.',
    licenseRules: [],
    contentComments: maliciousComments,
    duration: 192,
  },

  // {
  //   uuid: '1',
  //   title: 'Django Unchained',
  //   imageUrl: './../../../../assets/images/django.jpg',
  //   description:
  //     'Wyzwolony niewolnik współpracuje z łowcą nagród, by uratować swoją żonę z rąk brutalnego właściciela plantacji, wymierzając sprawiedliwość z zemstą.',
  // },
  // {
  //   uuid: '2',
  //   title: 'The Godfather',
  //   imageUrl: './../../../../assets/images/ojciec-chrzestny.jpg',
  //   description:
  //     'Ikoniczna saga o rodzinie, władzy i lojalności, śledząca losy rodziny Corleone w świecie zorganizowanej przestępczości.',
  // },
  // {
  //   uuid: '3',
  //   title: 'The Dark Knight',
  //   imageUrl: './../../../../assets/images/mroczny-rycerz.jpg',
  //   description:
  //     'Batman staje w obliczu anarchii i chaosu, gdy Joker zagraża Gotham, zmuszając Mrocznego Rycerza do przekroczenia granic swojego moralnego kodeksu.',
  // },
  // {
  //   uuid: '4',
  //   title: 'Pulp Fiction',
  //   imageUrl: './../../../../assets/images/pulp-fiction.jpg',
  //   description:
  //     'Zaskakujący kolaż historii kryminalnych, ukazujący przestępczy światek Los Angeles w unikalny, niechronologiczny sposób.',
  // },
  // {
  //   uuid: '5',
  //   title: 'Fight Club',
  //   imageUrl: './../../../../assets/images/fight-club.jpg',
  //   description:
  //     'Mężczyzna w kryzysie tworzy podziemny klub walki, odkrywając ciemne strony ludzkiej natury w szaleńczym poszukiwaniu sensu życia.',
  // },
  // {
  //   uuid: '6',
  //   title: 'Forrest Gump',
  //   imageUrl: './../../../../assets/images/forrest-gump.jpg',
  //   description:
  //     'Niezwykłe życie prostolinijnego człowieka, który nieświadomie wpływa na kluczowe wydarzenia XX wieku.',
  // },
  // {
  //   uuid: '7',
  //   title: 'Inception',
  //   imageUrl: './../../../../assets/images/incepcja.jpg',
  //   description:
  //     'Mistrz złodziejstwa próbuje zaszczepić pomysł w umyśle miliardera poprzez sny, balansując na granicy rzeczywistości i iluzji.',
  // },
  // {
  //   uuid: '8',
  //   title: 'The Matrix',
  //   imageUrl: './../../../../assets/images/matrix.jpg',
  //   description:
  //     'Neo odkrywa mroczną prawdę o świecie, w którym żyje, i dołącza do walki przeciwko maszynom rządzącym ludzkością.',
  // },
  // {
  //   uuid: '9',
  //   title: 'Goodfellas',
  //   imageUrl: './../../../../assets/images/goodfellas.jpg',
  //   description:
  //     'Wciągająca opowieść o wzlotach i upadkach życia w świecie przestępczym, ukazana z perspektywy jednego z jego członków.',
  // },
  // {
  //   uuid: '10',
  //   title: 'The Lord of the Rings: The Return of the King',
  //   imageUrl: './../../../../assets/images/obraz.jpg',
  //   description:
  //     'Ostateczna bitwa o Śródziemie toczy się, gdy Frodo zbliża się do wulkanu, by zniszc',
  // },
];
