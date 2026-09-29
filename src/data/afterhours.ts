import parisEiffel from '../assets/europe/paris-eiffel.jpeg';
import parisSeine from '../assets/europe/paris-seine.jpeg';
import santorini from '../assets/europe/santorini.jpeg';
import stockholm from '../assets/europe/stockholm.jpeg';
import brussels from '../assets/europe/brussels.jpeg';
import budapest from '../assets/europe/budapest.jpeg';
import athensParthenon from '../assets/europe/athens-parthenon.jpeg';
import athensAcropolis from '../assets/europe/athens-acropolis.jpeg';

export const letterboxd = 'https://letterboxd.com/parzivallll/';

// Letterboxd profile favourites, from the 2026-09-21 export (profile.csv).
export const topFour = [
  { title: 'Ready Player One', year: 2018, url: 'https://letterboxd.com/film/ready-player-one/' },
  { title: 'Baahubali: The Beginning', year: 2015, url: 'https://letterboxd.com/film/bahubali-the-beginning/' },
  { title: 'Avatar', year: 2009, url: 'https://letterboxd.com/film/avatar/' },
  { title: 'The Dark Knight Rises', year: 2012, url: 'https://letterboxd.com/film/the-dark-knight-rises/' },
];

export const europe = [
  { img: parisEiffel, place: 'Paris', country: 'France', alt: 'Aravind in front of the Eiffel Tower, Olympic rings on it.' },
  { img: santorini, place: 'Santorini', country: 'Greece', alt: 'Aravind looking over the caldera at dusk, harbour lights below.' },
  { img: athensParthenon, place: 'Athens', country: 'Greece', alt: 'Aravind in front of the Parthenon under a clear sky.' },
  { img: brussels, place: 'Brussels', country: 'Belgium', alt: 'The Grand-Place lit up at night.' },
  { img: stockholm, place: 'Stockholm', country: 'Sweden', alt: 'Aravind feeding a horse along a park path at golden hour.' },
  { img: budapest, place: 'Budapest', country: 'Hungary', alt: 'The Hungarian Parliament across the Danube.' },
  { img: parisSeine, place: 'Paris', country: 'France', alt: 'The Seine with the Eiffel Tower in the distance.' },
  { img: athensAcropolis, place: 'Athens', country: 'Greece', alt: 'Sunset over the Acropolis, the Erechtheion in silhouette.' },
];

// Short-form edits: add { src: '/edits/<file>.mp4', poster, title } once the files are in public/edits/.
export const edits: { src: string; poster: string; title: string }[] = [];
