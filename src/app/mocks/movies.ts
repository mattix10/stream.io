// import { Movie } from '../core/models/movie';

// export const movies: Movie[] = [
//   {
//     id: '1',
//     title: 'The Shawshank Redemption',
//     imgUrl: './../../../../assets/images/obraz.jpg',
//     movieUrl: './../../../../assets/movies/shawshank.mp4',
//     userId: '1',
//     description:
//       'Opowieść o nadziei i przyjaźni w więzieniu, gdzie dwaj osadzeni nawiązują niezwykłą więź, rozpoczynając podróż ku odkupieniu.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Potężna historia przyjaźni i wytrwałości.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Tim Robbins i Morgan Freeman tworzą idealny duet.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Emocjonalna jazda kolejką górską z ciepłym zakończeniem.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Jeden z najlepszych dramatów więziennych w historii.',
//       },
//     ],
//   },
//   {
//     id: '1',
//     title: 'Django Unchained',
//     imgUrl: './../../../../assets/images/django.jpg',
//     movieUrl: './../../../../assets/movies/django.mp4',
//     userId: '1',
//     description:
//       'Wyzwolony niewolnik współpracuje z łowcą nagród, by uratować swoją żonę z rąk brutalnego właściciela plantacji, wymierzając sprawiedliwość z zemstą.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Dialogi Tarantino błyszczą.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Jamie Foxx daje mocny występ.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Fascynujące połączenie humoru i przemocy.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Rola złoczyńcy Leonarda DiCaprio jest niezapomniana.',
//       },
//     ],
//   },
//   {
//     id: '2',
//     title: 'The Godfather',
//     imgUrl: './../../../../assets/images/ojciec-chrzestny.jpg',
//     movieUrl: './../../../../assets/movies/godfather.mp4',
//     userId: '1',
//     description:
//       'Ikoniczna saga o rodzinie, władzy i lojalności, śledząca losy rodziny Corleone w świecie zorganizowanej przestępczości.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Ponadczasowe arcydzieło kina.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Interpretacja Marlona Brando jest legendarna.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Wciągająca opowieść o rodzinie i zdradzie.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Reżyseria Francisa Forda Coppoli jest znakomita.',
//       },
//     ],
//   },
//   {
//     id: '3',
//     title: 'The Dark Knight',
//     imgUrl: './../../../../assets/images/mroczny-rycerz.jpg',
//     movieUrl: './../../../../assets/movies/dark_knight.mp4',
//     userId: '1',
//     description:
//       'Batman staje w obliczu anarchii i chaosu, gdy Joker zagraża Gotham, zmuszając Mrocznego Rycerza do przekroczenia granic swojego moralnego kodeksu.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Niezapomniana rola Heatha Ledgera.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Christopher Nolan tworzy genialny thriller.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Mroczny i fascynujący film o bohaterach.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Wyjątkowe efekty specjalne i scenografia.',
//       },
//     ],
//   },
//   {
//     id: '4',
//     title: 'Pulp Fiction',
//     imgUrl: './../../../../assets/images/pulp-fiction.jpg',
//     movieUrl: './../../../../assets/movies/pulp_fiction.mp4',
//     userId: '1',
//     description:
//       'Zaskakujący kolaż historii kryminalnych, ukazujący przestępczy światek Los Angeles w unikalny, niechronologiczny sposób.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Dialogi Tarantino są niesamowite.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Wyjątkowy styl narracji.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Kultowy film, który trzeba obejrzeć.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Samuel L. Jackson i John Travolta błyszczą.',
//       },
//     ],
//   },
//   {
//     id: '5',
//     title: 'Fight Club',
//     imgUrl: './../../../../assets/images/fight-club.jpg',
//     movieUrl: './../../../../assets/movies/fight_club.mp4',
//     userId: '1',
//     description:
//       'Mężczyzna w kryzysie tworzy podziemny klub walki, odkrywając ciemne strony ludzkiej natury w szaleńczym poszukiwaniu sensu życia.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Film prowokujący do myślenia.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Edward Norton i Brad Pitt są fenomenalni.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Ostre spojrzenie na konsumpcjonizm.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Fabuła pełna zwrotów akcji.',
//       },
//     ],
//   },
//   {
//     id: '6',
//     title: 'Forrest Gump',
//     imgUrl: './../../../../assets/images/forrest-gump.jpg',
//     movieUrl: './../../../../assets/movies/forrest_gump.mp4',
//     userId: '1',
//     description:
//       'Niezwykłe życie prostolinijnego człowieka, który nieświadomie wpływa na kluczowe wydarzenia XX wieku.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Tom Hanks w roli życia.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Wzruszająca opowieść o życiu i miłości.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Wyjątkowa podróż przez historię USA.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Wzrusza i inspiruje jednocześnie.',
//       },
//     ],
//   },
//   {
//     id: '7',
//     title: 'Inception',
//     imgUrl: './../../../../assets/images/incepcja.jpg',
//     movieUrl: './../../../../assets/movies/inception.mp4',
//     userId: '1',
//     description:
//       'Mistrz złodziejstwa próbuje zaszczepić pomysł w umyśle miliardera poprzez sny, balansując na granicy rzeczywistości i iluzji.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Christopher Nolan tworzy arcydzieło.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Fascynująca podróż przez świat snów.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Leonardo DiCaprio w najlepszej formie.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Nieprzewidywalny i wciągający.',
//       },
//     ],
//   },
//   {
//     id: '8',
//     title: 'The Matrix',
//     imgUrl: './../../../../assets/images/matrix.jpg',
//     movieUrl: './../../../../assets/movies/matrix.mp4',
//     userId: '1',
//     description:
//       'Neo odkrywa mroczną prawdę o świecie, w którym żyje, i dołącza do walki przeciwko maszynom rządzącym ludzkością.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Innowacyjny film science fiction.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Keanu Reeves jako idealny Neo.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Pełen zaskakujących zwrotów akcji.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Pionierskie efekty specjalne.',
//       },
//     ],
//   },
//   {
//     id: '9',
//     title: 'Goodfellas',
//     imgUrl: './../../../../assets/images/goodfellas.jpg',
//     movieUrl: './../../../../assets/movies/goodfellas.mp4',
//     userId: '1',
//     description:
//       'Wciągająca opowieść o wzlotach i upadkach życia w świecie przestępczym, ukazana z perspektywy jednego z jego członków.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Martin Scorsese w szczytowej formie.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Realistyczny i brutalny.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Fantastyczny Robert De Niro.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Kultowy film gangsterski.',
//       },
//     ],
//   },
//   {
//     id: '10',
//     title: 'The Lord of the Rings: The Return of the King',
//     imgUrl: './../../../../assets/images/obraz.jpg',
//     movieUrl: './../../../../assets/movies/lord_of_the_rings.mp4',
//     userId: '1',
//     description:
//       'Ostateczna bitwa o Śródziemie toczy się, gdy Frodo zbliża się do wulkanu, by zniszczyć pierścień władzy.',
//     comments: [
//       {
//         userName: 'User1',
//         comment: 'Epokowe zakończenie trylogii.',
//       },
//       {
//         userName: 'User2',
//         comment: 'Fantastyczne efekty specjalne.',
//       },
//       {
//         userName: 'User3',
//         comment: 'Peter Jackson tworzy niesamowity świat.',
//       },
//       {
//         userName: 'User4',
//         comment: 'Wspaniałe połączenie akcji i fabuły.',
//       },
//     ],
//   },
// ];
